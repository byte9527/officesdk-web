import { connect, WindowMessenger } from 'penpal';
import type { Connection, RemoteProxy } from 'penpal';

import { OfficeSdkRpcChannel, createConnectionClientProtocol } from './connection';
import type { ConnectionServerProtocol } from './connection';
import { generateUniqueId } from '../shared/random';
import type { RPCClientProxy, RPCMethods, RPCReturnMethods, RPCClientInvokeArgs } from './rpc';
import { Transportable } from './transportable';
import type { TransportableRemoteCallback } from './transportable';

export interface ClientOptions<TMethods extends RPCMethods> {
  /**
   * 需要创建连接的 iframe.contentWindow
   */
  remoteWindow: Window;
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
   * 连接超时时间
   */
  timeout?: number;

  /**
   * 远程调用协议代理，用于生成客户端远程调用服务端的方法，
   * 需要保证服务端按照同样的 RPCMethods 协议提供方法实现
   */
  proxy: RPCClientProxy<TMethods>;
}

/**
 * 服务端记录，用于将服务端 Window 和客户端信息进行关联
 */
interface ServerRecord<TMethods extends RPCMethods> {
  /**
   * penpal connection
   */
  connection: Connection<ConnectionServerProtocol>;
  /**
   * 已生成的客户端 id 记录
   */
  clientIds: Set<string>;

  methods: RPCReturnMethods<TMethods>;
}

let serverMap = new WeakMap<Window, ServerRecord<any>>();

export interface Client<TMethods extends RPCMethods> {
  /**
   * 客户端 id
   */
  id: string;

  /**
   * 客户端代理方法
   */
  methods: RPCReturnMethods<TMethods>;
}

/**
 * 传入通信协议，创建一个客户端
 */
export async function create<TMethods extends RPCMethods>(options: ClientOptions<TMethods>): Promise<Client<TMethods>> {
  const { remoteWindow, allowedOrigins = ['*'], timeout } = options;

  const serverRecordCache = serverMap.get(remoteWindow);

  const clientId = generateUniqueId();

  // 如果服务端已经存在，并且已经连接过了，则直接使用缓存的连接
  // 否则需要重新创建连接
  if (serverRecordCache) {
    await connectServer(serverRecordCache.connection, clientId);

    return {
      id: clientId,
      methods: serverRecordCache.methods,
    };
  }

  const messenger = new WindowMessenger({
    remoteWindow,
    allowedOrigins,
  });

  const clientIds = new Set<string>([]);

  const ensureServerProxy = (): RemoteProxy<ConnectionServerProtocol> => {
    if (!server) {
      throw new Error('Unexpected invoke before server connected');
    }

    return server;
  };

  // 这里是客户端调用服务端 callback 的地方
  const transportableRemoteCallback: TransportableRemoteCallback = async (callback, args) => {
    const serverProxy = ensureServerProxy();

    const schemas = await Promise.all(args.map((arg) => transportable.createSchemaEntity(arg)));
    return serverProxy.callback(callback, schemas);
  };

  const transportable = new Transportable({
    name: clientId,
    callback: transportableRemoteCallback,
  });

  const connection = connect<ConnectionServerProtocol>({
    channel: OfficeSdkRpcChannel,
    messenger,
    methods: createConnectionClientProtocol({
      getClients: () => clientIds,
      resolveCallback: (schema) => {
        // 过滤掉非本客户端的回调
        if (schema.source !== clientId) {
          return (): never => {
            throw new Error(`Invalid callback source: ${schema.source}, can not resolve callback from other client.`);
          };
        }

        return transportable.resolveSchemaCallback(schema);
      },
    }),
    timeout,
  });

  clientIds.add(clientId);

  const serverPromise = connectServer(connection, clientId);

  const { proxy } = options;

  const methods = proxy({
    /**
     * 这里的客户端调用服务端的统一入口
     * @param method
     * @param args
     * @param options
     * @returns
     */
    invoke: async <TName extends keyof TMethods>(
      method: TName,
      args: RPCClientInvokeArgs<Parameters<TMethods[TName]>>,
    ) => {
      const serverProxy = ensureServerProxy();

      const schemas = await Promise.all(args.map((arg) => transportable.createSchemaEntity(arg)));

      // TODO: 这个 method 类型不严谨
      const response = serverProxy.invoke(clientId, method as string, schemas);

      return response.then((data) => {
        if (!data) {
          return;
        }

        return transportable.parseSchemaEntity(data);
      });
    },
  });

  let server = await serverPromise;

  const serverRecord = {
    connection,
    clientIds,
    methods,
  };

  serverMap.set(remoteWindow, serverRecord);

  return {
    id: clientId,
    methods,
  };
}

/**
 * 连接服务端
 */
async function connectServer(
  connection: Connection<ConnectionServerProtocol>,
  clientId: string,
): Promise<RemoteProxy<ConnectionServerProtocol>> {
  try {
    const server = await connection.promise;
    await server.open(clientId);

    return server;
  } catch (error) {
    // TODO: 超时处理，发生在同源策略限制时

    throw error;
  }
}
