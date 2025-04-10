/**
 * Connection protocol for recording client's unique identity on the server side.
 * Since the underlying communication is based on penpal, there's no need for TCP-like
 * three-way handshake to confirm message delivery. The connection is established
 * as soon as the server receives the client's identity information.
 * The uniqueness of client identity is guaranteed by the client itself, while the server
 * is only responsible for recording it. Since the client is essentially a page embedded
 * in the Office SDK iframe, its identity uniqueness is easily guaranteed.
 *
 * The connection process involves three scenarios:
 *
 * 1. Client-initiated connection
 * In this case, the server usually exists but might not be fully initialized.
 * If the server is not ready, the client needs to wait until the server is ready
 * before sending the confirmation request. The client actively provides its identity
 * information, and the server records it and returns a response.
 *
 * 2. Server-initiated connection
 * Here, the server is ready, but the client might not exist (page not loaded in iframe
 * or restricted by same-origin policy). The server requests the client's identity
 * information, and the client responds to complete the connection. The server may
 * receive identity information from 0 to multiple clients.
 *
 * 3. Simultaneous connection attempts
 * Since connection establishment is a bidirectional asynchronous process, both sides
 * might send connection requests simultaneously before the connection is complete.
 * This scenario requires no special handling as the server automatically deduplicates.
 */

import type { RPCInvokeOptions } from './rpc';

/**
 * Server protocol interface
 * These interfaces are for remote invocation by clients, not for server's own use
 */
export type ConnectionServerProtocol = {
  /**
   * Client registers its identity with the server
   * All subsequent calls must include this clientId as identity token
   * @param clientId Client identity token
   * @returns Whether the connection was established successfully
   */
  open: (clientId: string) => boolean;
  /**
   * Server actively closes the client connection
   * @param clientId Client identity token
   * @returns Whether the connection was closed successfully
   */
  close: (clientId: string) => boolean;

  /**
   *
   * @param clientId
   * @param method
   * @param args
   * @returns
   */
  invoke: (clientId: string, method: string, args: any[], options?: RPCInvokeOptions) => any;
};

/**
 * Context required for server initialization
 */
interface ConnectionServerContext {
  clients: Set<string>;
  // TODO: 使用范型约束外部调用类型
  onInvoke: (clientId: string, method: string, args: any[], options?: RPCInvokeOptions) => any;
}

export function createConnectionServerProtocol(context: ConnectionServerContext): ConnectionServerProtocol {
  return {
    open: (clientId: string): boolean => {
      // TODO: Should throw error on duplicate registration
      context.clients.add(clientId);

      return true;
    },

    close: (clientId: string): boolean => {
      // TODO: Should throw error if clientId doesn't exist
      context.clients.delete(clientId);

      return true;
    },

    invoke: (clientId: string, method: string, args: any[], options?: RPCInvokeOptions) => {
      if (!context.clients.has(clientId)) {
        throw new Error('Client not found');
      }

      return context.onInvoke(clientId, method, args, options);
    },
  };
}

export type ConnectionClientCallback = (token: string, args: any[]) => void;

/**
 * Client protocol interface
 * These interfaces are for remote invocation by server, not for client's own use
 */
export type ConnectionClientProtocol = {
  open: () => string[];
  close: (clientId: string) => void;
  callback: ConnectionClientCallback;
};

/**
 * Context required for client initialization
 */
interface ConnectionClientContext {
  /**
   * Get identity information of connected clients
   */
  getClients: () => Set<string>;

  /**
   * Resolve callback from references
   * @returns
   */
  resolveCallback: (token: string) => ((...args: any[]) => void) | undefined;
}

export function createConnectionClientProtocol(context: ConnectionClientContext): ConnectionClientProtocol {
  return {
    open: (): string[] => {
      return Array.from(context.getClients());
    },
    close: (clientId: string): void => {
      // TODO: Record the incoming clientId
    },

    callback: (token: string, args: any[]) => {
      const callback = context.resolveCallback(token);

      if (!callback) {
        // TODO:
        throw new Error(`Callback not found for token: ${token}`);
      }

      callback(...args);
    },
  };
}

export const OfficeSdkRpcChannel = '#office-sdk-rpc';
