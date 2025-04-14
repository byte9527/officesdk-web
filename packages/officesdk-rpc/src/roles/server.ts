/**
 * Office SDK 跨窗口通信服务端。
 * 跨窗口通信基础设计为：运行编辑器的窗口视作服务端，提供编辑器基础服务。基于编辑器窗口，上层窗口可作为客户端请求编辑器的服务接口和状态，编辑器服务端可以同时对接若干个客户端，同时服务端所有功能都不应需要依赖客户端。
 * 客户端与服务端通过 postMessage 通信。
 *
 * 服务端需要提供：
 * 1. 服务端连接器，用于连接客户端。
 */
// spawn

import { connect, WindowMessenger } from 'penpal';
import type { RemoteProxy } from 'penpal';

import { getParentWindowOrThrow } from './window';
import { OfficeSdkRpcChannel, createConnectionServerProtocol } from './connection';
import type { ConnectionClientProtocol } from './connection';
import { isClientNotAccessible } from '../errors';
import { ServerConnectionPool } from './pool';
import type { RPCServerProxy, RPCMethods } from './rpc';
import { Transportable } from './transportable';
import type { TransportableData } from './transportable';

export interface ServerOptions<TMethods extends RPCMethods> {
  /**
   * Subset of the allowedOrigins option in WindowMessenger.
   * ----
   * An array of strings defining to which origins
   * communication will be allowed. If not provided, communication will be
   * restricted to the origin of the current page. You may specify an allowed
   * origin of `*` to not restrict communication, but beware the risks of
   * doing so.
   */
  allowedOrigins?: string[];

  /**
   * 远程调用协议代理，用于生成客户端远程调用服务端的方法，
   * 需要保证服务端按照同样的 RPCMethods 协议提供方法实现
   */
  proxy: RPCServerProxy<TMethods>;
}

export interface Server {
  getClientIds: () => string[];
  addClientListener: (listener: (event: 'add' | 'delete', payload: { clientId: string }) => void) => () => void;
}

// TODO: 需要返回 Server 实例， onOpen 和 onClose 需要迁移到 Server 实例的方法上去
export async function serve<TMethods extends RPCMethods>(options: ServerOptions<TMethods>): Promise<Server> {
  const { allowedOrigins, proxy } = options;

  let messenger: WindowMessenger;
  try {
    messenger = new WindowMessenger({
      remoteWindow: getParentWindowOrThrow(),
      allowedOrigins: allowedOrigins,
    });
  } catch (error) {
    if (isClientNotAccessible(error)) {
      // TODO:
      throw error;
    }

    throw error;
  }

  const clientIdPool = new ServerConnectionPool();

  let client: RemoteProxy<ConnectionClientProtocol> | undefined;
  const ensureClientProxy = (): RemoteProxy<ConnectionClientProtocol> => {
    if (!client) {
      // TODO
      throw new Error('Unexpected invoke before client connected');
    }

    return client;
  };

  const transportable = new Transportable({
    name: 'server',
    callback: async (schema, args): Promise<TransportableData | void> => {
      const clientProxy = ensureClientProxy();

      return clientProxy.callback(schema, args);
    },
  });

  const connection = connect<ConnectionClientProtocol>({
    messenger,
    channel: OfficeSdkRpcChannel,
    methods: createConnectionServerProtocol({
      clients: clientIdPool,
      onInvoke: (clientId, method, schemas) => {
        ensureClientProxy();

        if (!clientIdPool.has(clientId)) {
          return;
        }

        const methods = proxy();

        const args = schemas.map((schema) => transportable.parseSchema(schema));
        const result = methods[method](...args);

        if (result) {
          return transportable.createSchema(result.value, result.rules);
        }
      },
      resolveCallback: (schema) => {
        return transportable.parseSchema(schema);
      },
    }),
  });

  client = await connection.promise;

  const pulledIds = await client.open();

  pulledIds.forEach((id) => {
    if (clientIdPool.has(id)) {
      return;
    }

    clientIdPool.add(id);
  });

  return {
    getClientIds: () => clientIdPool.toArray(),
    addClientListener: (listener) => clientIdPool.addListener(listener),
  };
}
