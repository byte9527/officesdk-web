/**
 * Office SDK Cross-Window Connection Protocol
 *
 * This file implements the enhanced connection protocol that handles the communication
 * and method invocation between client and server windows. It extends the basic protocol
 * with support for RPC method calls and callback handling.
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
import type { SchemaEntity, SchemaValueCallback } from '../core';
import type { RPCMethods } from '../transport';

/**
 * Represents a callback function that can be invoked across window boundaries
 *
 * This type is used for executing callback functions in their original environment,
 * with serialized arguments passed between environments.
 *
 * @param callback - The callback schema identifying the function to call
 * @param args - Serialized arguments to pass to the callback
 * @returns The result of the callback execution (type is currently not strictly defined)
 */
export type ConnectionCallback = (callback: SchemaValueCallback, args: SchemaEntity[]) => any; // TODO: Define more specific return type

/**
 * Server protocol interface for cross-window communication
 *
 * These interfaces are for remote invocation by clients, not for server's own use.
 * They provide the core functionality for connection management, method invocation,
 * and callback execution.
 */
export type ConnectionServerProtocol = {
  /**
   * Client registers its identity with the server
   * All subsequent calls must include this clientId as identity token
   * @param clientId Client identity token
   * @returns Whether the connection was established successfully
   */
  open: (clientId: string, settings?: SchemaEntity) => boolean;

  /**
   * Server actively closes the client connection
   * @param clientId Client identity token
   * @returns Whether the connection was closed successfully
   */
  close: (clientId: string) => boolean;

  /**
   * Invoke a method on the server from a client
   *
   * @param clientId - The client's unique identifier
   * @param method - The name of the method to invoke
   * @param args - Serialized arguments to pass to the method
   * @returns A promise that resolves to the serialized return value or void
   */
  invoke: (clientId: string, method: string, args: SchemaEntity[]) => Promise<SchemaEntity | void>;

  /**
   * Execute a callback function in its original environment
   *
   * @param callback - The callback schema identifying the function to call
   * @param args - Serialized arguments to pass to the callback
   * @returns The result of the callback execution
   */
  callback: ConnectionCallback;
};

/**
 * Context required for server protocol initialization
 *
 * Provides methods for client management, method invocation, and callback resolution
 * that the server protocol implementation will use.
 */
interface ConnectionServerContext<TMethods extends RPCMethods, TSettings> {
  /**
   * Client management interface
   */
  clients: {
    /**
     * Register a new client
     * @param clientId - The client's unique identifier
     */
    add: (clientId: string, settings?: TSettings) => void;

    /**
     * Remove a client
     * @param clientId - The client's unique identifier
     */
    delete: (clientId: string) => void;

    /**
     * Check if a client is registered
     * @param clientId - The client's unique identifier
     * @returns True if the client exists, false otherwise
     */
    has: (clientId: string) => boolean;
  };

  /**
   * Handle method invocation from clients
   *
   * @param clientId - The calling client's unique identifier
   * @param method - The name of the method to invoke
   * @param schemas - Serialized arguments to pass to the method
   * @returns A promise that resolves to the serialized return value or void
   */
  onInvoke: <TName extends keyof TMethods>(
    clientId: string,
    method: TName,
    schemas: SchemaEntity[],
  ) => Promise<SchemaEntity | void>;

  /**
   * Resolve a callback schema to an executable function
   *
   * Creates a function that, when called, executes the callback identified
   * by the schema in its original environment.
   *
   * @param callback - The callback schema identifying the function to resolve
   * @returns A function that executes the callback with the given arguments
   */
  resolveSchemaCallback: (callback: SchemaValueCallback) => (...args: any[]) => Promise<SchemaEntity>;

  /**
   * Parse a schema entity into a usable value
   *
   * @param schema - The schema entity to parse
   * @returns The parsed value
   */
  parseSchemaEntity: (schema: SchemaEntity) => any;
}

/**
 * Creates a server protocol implementation based on the provided context
 *
 * @param context - The server context with client management methods
 * @returns An implementation of the ConnectionServerProtocol interface
 */
export function createConnectionServerProtocol<TMethods extends RPCMethods, TSettings>(
  context: ConnectionServerContext<TMethods, TSettings>,
): ConnectionServerProtocol {
  return {
    open: (clientId: string, settings?: SchemaEntity): boolean => {
      // Settings only can be set once

      if (settings) {
        context.clients.add(clientId, context.parseSchemaEntity(settings));
      }

      // TODO: Should throw error on duplicate registration
      context.clients.add(clientId);

      return true;
    },

    close: (clientId: string): boolean => {
      // TODO: Should throw error if clientId doesn't exist
      context.clients.delete(clientId);

      return true;
    },

    invoke: (clientId: string, method: string, args: SchemaEntity[]): Promise<SchemaEntity | void> => {
      if (!context.clients.has(clientId)) {
        throw new Error('Client not found');
      }

      return context.onInvoke(clientId, method, args);
    },

    callback: (callback: SchemaValueCallback, args: SchemaEntity[]) => {
      return context.resolveSchemaCallback(callback)?.(...args);
    },
  };
}

export interface ConnectionClientRecord {
  clientId: string;
  settings?: SchemaEntity;
}

/**
 * Client protocol interface for cross-window communication
 *
 * These interfaces are for remote invocation by the server, not for client's own use.
 * They provide the core functionality for connection management and callback execution.
 */
export type ConnectionClientProtocol = {
  /**
   * Server requests the client's identity information
   * @returns Array of client IDs associated with this client
   */
  open: () => ConnectionClientRecord[];

  /**
   * Server notifies the client that a connection is being closed
   * @param clientId - The client ID being closed
   */
  close: (clientId: string) => void;

  /**
   * Execute a callback function in the client environment
   *
   * @param callback - The callback schema identifying the function to call
   * @param args - Serialized arguments to pass to the callback
   * @returns The result of the callback execution
   */
  callback: ConnectionCallback;
};

/**
 * Context required for client protocol initialization
 *
 * Provides methods for client information and callback resolution
 * that the client protocol implementation will use.
 */
interface ConnectionClientContext<TSettings> {
  /**
   * Get identity information of connected clients
   * @returns A set of client IDs currently registered
   */
  getClients: () => Set<ConnectionClientRecord>;

  /**
   * Resolve a callback schema to an executable function
   *
   * Creates a function that, when called, executes the callback identified
   * by the schema in its original environment.
   *
   * @param callback - The callback schema identifying the function to resolve
   * @returns A function that executes the callback with the given arguments
   */
  resolveCallback: (callback: SchemaValueCallback) => (...args: any[]) => any;
}

/**
 * Creates a client protocol implementation based on the provided context
 *
 * @param context - The client context with client information methods
 * @returns An implementation of the ConnectionClientProtocol interface
 */
export function createConnectionClientProtocol<TSettings>(
  context: ConnectionClientContext<TSettings>,
): ConnectionClientProtocol {
  return {
    open: (): ConnectionClientRecord[] => {
      return Array.from(context.getClients());
    },
    close: (clientId: string): void => {
      // TODO: Record the incoming clientId
    },

    callback: (callback: SchemaValueCallback, args: SchemaEntity[]) => {
      return context.resolveCallback(callback)(...args);
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
