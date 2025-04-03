import { connect, WindowMessenger } from 'penpal';
import type { Connection } from 'penpal';

import { OfficeSdkRpcChannel, createServerProtocol, ServerProtocol } from './protocol';
import { generateUniqueId } from '../shared/random';

export interface ClientOptions {
  /**
   * 需要创建连接的 iframe.contentWindow
   */
  target: Window;
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

/**
 * 创建一个客户端
 */
export async function createClient(options: ClientOptions) {
  const serverRecordCache = serverMap.get(options.target);

  const clientId = generateUniqueId();

  if (serverRecordCache) {
    await connectServer(serverRecordCache, clientId);

    return serverRecordCache.connection;
  }

  const messenger = new WindowMessenger({
    remoteWindow: options.target,
    allowedOrigins: options.allowedOrigins,
  });

  const connection = connect({
    channel: OfficeSdkRpcChannel,
    messenger,
    methods: createServerProtocol(),
  });

  const serverRecord = {
    connection,
    clientIds: new Set<string>([]),
  };

  serverMap.set(options.target, serverRecord);

  await connectServer(serverRecord, clientId);

  return connection;
}

/**
 * 连接服务端
 */
async function connectServer(serverRecord: ServerRecord, clientId: string) {
  const { connection, clientIds } = serverRecord;

  clientIds.add(clientId);

  const server = await connection.promise;

  await server.open(clientId);

  // TODO:
}
