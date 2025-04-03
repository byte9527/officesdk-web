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
import { getParentWindowOrThrow } from './window';
import { OfficeSdkRpcChannel } from './protocol';
import { isClientNotAccessible } from '../errors';

export interface ServerOptions {
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

export interface ServerConnection {}

export async function serve(options: ServerOptions) {
  let messenger: WindowMessenger;
  try {
    messenger = new WindowMessenger({
      remoteWindow: getParentWindowOrThrow(),
      allowedOrigins: options.allowedOrigins,
    });
  } catch (error) {
    if (isClientNotAccessible(error)) {
      // TODO:
      throw error;
    }

    throw error;
  }

  const connection = connect({
    messenger,
    channel: OfficeSdkRpcChannel,
  });

  try {
    // Wait for connection to be established.
    const server = await connection.promise;

    const clientIds = await server.open();
  } catch (error) {}
}
