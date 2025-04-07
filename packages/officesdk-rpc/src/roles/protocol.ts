import type { Methods } from 'penpal';

/**
 * 建连协议，用于将客户端唯一身份记录到服务端。
 * 因为底层通信有 penpal 作为基础，所以不需要类似 TCP 的三次握手反复确认消息已送达，只要服务端收到客户端的身份信息即可。
 * 客户端的身份唯一性由客户端自身保证，服务端需要做的只是记录客户端的身份信息。
 * 因为所谓的客户端就是上层嵌入 Office SDK iframe 的页面，所以客户端的身份唯一性很好保证。
 *
 * 建连过程分为三种场景：
 *
 * 1. 客户端向服务端发送建连请求
 * 这种情况下，服务端一般都已存在，只是有可能还没有完成初始化，
 * 如果服务端还没有准备好，客户端需要等待服务端准备好后，再发送确认请求。
 * 建连请求由客户端发起，客户端主动提供自己的身份信息发送给服务端，
 * 服务端收到建连请求和身份信息后，会记录客户端的身份信息，并返回建连响应。
 *
 * 2. 服务端向客户端发送建连响应。
 * 这种情况下，意味着服务端已经准备好，但客户端不一定会存在（页面不是在 iframe 中加载的或受到同源策略限制）。
 * 服务端主动发起建连请求并索要客户端的身份信息，客户端收到请求后，会将自身的身份信息发送给服务端，完成建连。
 * 服务端主动收到的客户端身份信息数量为 0 ~ n 个。
 *
 * 3. 客户端和服务端同时发送建连请求。
 * 因为完成建连是一个双向且异步的过程，所以可能存在在完成建连之前，客户端和服务端同时发送建连请求的情况。
 * 这个情况下不需要特殊处理，服务器会自动去重。
 */

/**
 * 服务端协议接口，
 * 这里定义的接口是提供给客户端远程调用的接口，不是给服务端自身调用的
 */
export type ServerProtocol = {
  /**
   * 服务端记录客户端身份信息，由客户端发起将自身身份信息发送给服务端，
   * 调用建立连接，后续调用都需要携带此 clientId 作为身份标识。
   * @param clientId 客户端身份信息
   * @returns 是否建立连接成功
   */
  open: (clientId: string) => boolean;
  /**
   * 服务端关闭客户端连接，由服务端发起关闭客户端连接。
   * @param clientId 客户端身份信息
   * @returns 是否关闭连接成功
   */
  close: (clientId: string) => boolean;
};

/**
 * 初始化服务端需要的上下文
 */
interface ServerContext {
  addClient: (id: string) => void;
  deleteClient: (id: string) => void;
}

export function createServerProtocol(context: ServerContext): ServerProtocol {
  return {
    open: (clientId: string): boolean => {
      // TODO: 如果重复应该抛出错误
      context.addClient(clientId);

      return true;
    },

    close: (clientId: string): boolean => {
      // TODO: 如果 clientId 不存在，应该抛出错误
      context.deleteClient(clientId);

      return true;
    },
  };
}

/**
 * 客户端协议接口，
 * 这里定义的接口是提供给服务端远程调用的接口，不是给客户端自身调用的
 */
export type ClientProtocol = {
  open: () => string[];
  close: (clientId: string) => void;
};

/**
 * 初始化客户端需要的上下文
 */
interface ClientContext {
  /**
   * 用于获取已连接的客户端身份信息
   * @returns
   */
  getClients: () => Set<string>;
}

export function createClientProtocol(context: ClientContext): ClientProtocol {
  return {
    open: (): string[] => {
      return Array.from(context.getClients());
    },
    close: (clientId: string): void => {
      // TODO: 记录传入的
    },
  };
}

export const callbackProtocol: Methods = {
  callback: (clientId: string) => {
    return {
      type: 'callback',
      clientId,
    };
  },
};

export const OfficeSdkRpcChannel = '#office-sdk-rpc';
