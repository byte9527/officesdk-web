import { connect, WindowMessenger } from 'penpal';
import type { Connection, RemoteProxy } from 'penpal';

import { OfficeSdkRpcChannel, createClientProtocol } from './protocol';
import type { ServerProtocol } from './protocol';
import { generateUniqueId } from '../shared/random';

export interface ClientOptions {
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
}

/**
 * 服务端记录，用于将服务端 Window 和客户端信息进行关联
 */
interface ServerRecord {
  /**
   * penpal connection
   */
  connection: Connection<ServerProtocol>;
  /**
   * 已生成的客户端 id 记录
   */
  clientIds: Set<string>;
}

let serverMap = new WeakMap<Window, ServerRecord>();

interface RpcClient {
  id: string;
  connection: Connection<ServerProtocol>;
}

/**
 * 创建一个客户端
 */
export async function create(options: ClientOptions): Promise<RpcClient> {
  const { remoteWindow, allowedOrigins, timeout } = options;

  const serverRecordCache = serverMap.get(remoteWindow);

  const clientId = generateUniqueId();

  // 如果服务端已经存在，并且已经连接过了，则直接使用缓存的连接
  // 否则需要重新创建连接
  if (serverRecordCache) {
    await connectServer(serverRecordCache, clientId);

    return {
      id: clientId,
      connection: serverRecordCache.connection,
    };
  }

  const messenger = new WindowMessenger({
    remoteWindow,
    allowedOrigins,
  });

  const clientIds = new Set<string>([]);

  const connection = connect<ServerProtocol>({
    channel: OfficeSdkRpcChannel,
    messenger,
    methods: createClientProtocol({
      getClients: () => clientIds,
    }),
    timeout,
  });

  const serverRecord = {
    connection,
    clientIds,
  };

  serverMap.set(remoteWindow, serverRecord);

  const server = await connectServer(serverRecord, clientId);

  return {
    id: clientId,
    connection,
  };
}

/**
 * 连接服务端
 */
async function connectServer(serverRecord: ServerRecord, clientId: string): Promise<RemoteProxy<ServerProtocol>> {
  const { connection, clientIds } = serverRecord;

  clientIds.add(clientId);

  try {
    const server = await connection.promise;
    await server.open(clientId);

    return server;
  } catch (error) {
    // TODO: 超时处理，发生在同源策略限制时
    debugger;

    throw error;
  }

  // TODO:
}
