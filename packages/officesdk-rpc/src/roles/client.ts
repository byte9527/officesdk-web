import { connect, WindowMessenger } from 'penpal';
import type { Connection, RemoteProxy } from 'penpal';

import { OfficeSdkRpcChannel, createConnectionClientProtocol } from './connection';
import type { ConnectionServerProtocol } from './connection';
import { generateUniqueId } from '../shared/random';
import type { RPCClientProxy, RPCMethods } from './rpc';

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

  methods: RemoteProxy<TMethods>;
}

let serverMap = new WeakMap<Window, ServerRecord<any>>();

interface RpcClient<TMethods extends RPCMethods> {
  /**
   * 客户端 id
   */
  id: string;

  /**
   * 客户端代理方法
   */
  methods: RemoteProxy<TMethods>;
}

/**
 * 传入通信协议，创建一个客户端
 */
export async function create<TMethods extends RPCMethods>(
  options: ClientOptions<TMethods>,
): Promise<RpcClient<TMethods>> {
  const { remoteWindow, allowedOrigins, timeout } = options;

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

  const connection = connect<ConnectionServerProtocol>({
    channel: OfficeSdkRpcChannel,
    messenger,
    methods: createConnectionClientProtocol({
      getClients: () => clientIds,
    }),
    timeout,
  });

  clientIds.add(clientId);

  const serverPromise = connectServer(connection, clientId);

  const { proxy } = options;

  const methods = proxy({
    invoke: async (method: string, args: any[] = []) => {
      const server = await serverPromise;
      return server.invoke(clientId, method, args);
    },
  });

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
    debugger;

    throw error;
  }
}
