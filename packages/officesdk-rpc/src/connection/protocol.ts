/**
 * Office SDK Cross-Window Communication Protocol
 *
 * This file defines the connection protocols for establishing and maintaining communications
 * between client and server environments across window boundaries. It provides the fundamental
 * connection mechanism upon which the higher-level RPC functionality is built.
 *
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

/**
 * Server protocol interface
 * These interfaces are for remote invocation by clients, not for server's own use
 */
export type ServerProtocol = {
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
};

/**
 * Context required for server initialization
 *
 * Provides methods for managing client connections that the server protocol implementation will use
 */
interface ServerContext {
  /**
   * Register a new client with the server
   * @param id The unique client identifier
   */
  addClient: (id: string) => void;

  /**
   * Remove a client from the server
   * @param id The unique client identifier to remove
   */
  deleteClient: (id: string) => void;
}

/**
 * Creates a server protocol implementation based on the provided context
 *
 * @param context - The server context with client management methods
 * @returns An implementation of the ServerProtocol interface
 */
export function createServerProtocol(context: ServerContext): ServerProtocol {
  return {
    open: (clientId: string): boolean => {
      // TODO: Should throw error on duplicate registration
      context.addClient(clientId);

      return true;
    },

    close: (clientId: string): boolean => {
      // TODO: Should throw error if clientId doesn't exist
      context.deleteClient(clientId);

      return true;
    },
  };
}

/**
 * Client protocol interface
 * These interfaces are for remote invocation by server, not for client's own use
 */
export type ClientProtocol = {
  /**
   * Server requests the client's identity information
   * @returns Array of client IDs associated with this client
   */
  open: () => string[];

  /**
   * Server notifies the client that a connection is being closed
   * @param clientId The client ID being closed
   */
  close: (clientId: string) => void;
};

/**
 * Context required for client initialization
 *
 * Provides methods for accessing client information that the client protocol implementation will use
 */
interface ClientContext {
  /**
   * Get identity information of connected clients
   * @returns A set of client IDs currently registered
   */
  getClients: () => Set<string>;
}

/**
 * Creates a client protocol implementation based on the provided context
 *
 * @param context - The client context with client information methods
 * @returns An implementation of the ClientProtocol interface
 */
export function createClientProtocol(context: ClientContext): ClientProtocol {
  return {
    open: (): string[] => {
      return Array.from(context.getClients());
    },
    close: (clientId: string): void => {
      // TODO: Record the incoming clientId
    },
  };
}

/**
 * Channel identifier for Office SDK RPC communications
 *
 * This constant is used to identify the communication channel between client and server,
 * ensuring that messages are properly routed to the correct handlers.
 */
export const OfficeSdkRpcChannel = '#office-sdk-rpc';
