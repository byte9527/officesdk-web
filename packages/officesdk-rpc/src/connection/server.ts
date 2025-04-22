/**
 * Office SDK Cross-Window Communication Server
 *
 * This file implements the server-side of the cross-window or cross-iframe communication system.
 * It enables a window (typically running an editor) to act as a service provider for other
 * client windows, exposing functionality through a well-defined RPC interface.
 *
 * Key features:
 * 1. Multi-client support - A single server can simultaneously serve multiple client windows
 * 2. Connection management - Handles client registration, tracking, and event notifications
 * 3. Method exposure - Exposes server functionality to clients through configurable proxies
 * 4. Serialization - Automatically handles complex data serialization for cross-window transmission
 * 5. Callback invocation - Enables calling client-defined callbacks from server context
 *
 * The server operates independently of clients and should not rely on client functionality
 * for its core operations. Communication between client and server is handled via postMessage.
 *
 * The server works together with the client (client.ts), transportable (transportable.ts), and
 * token (token.ts) components to provide a complete cross-window communication solution that
 * supports complex data structures, functions, and cross-environment references.
 *
 * Usage pattern:
 * 1. Create a server instance with appropriate options and method implementations
 * 2. The server automatically handles incoming client connections and method calls
 * 3. Server methods can call back to client functions when needed
 */

import { connect, WindowMessenger } from 'penpal';
import type { RemoteProxy } from 'penpal';

import { getParentWindowOrThrow } from './window';
import { OfficeSdkRpcChannel, createConnectionServerProtocol } from './connection';
import type { ConnectionClientProtocol } from './connection';
import { isClientNotAccessible } from '../errors';
import { ServerConnectionPool } from './pool';
import { Transportable } from '../transport';
import type { TransportableRemoteCallback, RPCServerProxy, RPCMethods } from '../transport';

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
   * Remote procedure call protocol proxy
   *
   * Generates methods for clients to remotely call server functions.
   * The server must implement methods according to the same RPCMethods protocol.
   */
  proxy: RPCServerProxy<TMethods>;
}

/**
 * Server interface for managing client connections
 */
export interface Server {
  /**
   * Returns an array of connected client IDs
   */
  getClientIds: () => string[];

  /**
   * Adds a listener for client connection events
   *
   * @param listener - Callback function that receives event type ('add' or 'delete') and clientId
   * @returns A function to remove the listener
   */
  addClientListener: (listener: (event: 'add' | 'delete', payload: { clientId: string }) => void) => () => void;
}

/**
 * Creates and starts a server instance to handle communication with clients
 *
 * @param options - Configuration options for the server
 * @returns A Promise resolving to a Server instance for managing client connections
 *
 * TODO: Refactor to properly return Server instance with onOpen and onClose methods
 */
export async function serve<TMethods extends RPCMethods>(options: ServerOptions<TMethods>): Promise<Server> {
  const { allowedOrigins = ['*'], proxy } = options;

  let messenger: WindowMessenger;
  try {
    // Set up communication with the parent window
    messenger = new WindowMessenger({
      remoteWindow: getParentWindowOrThrow(),
      allowedOrigins: allowedOrigins ?? ['*'],
    });
  } catch (error) {
    if (isClientNotAccessible(error)) {
      // TODO: Improve error handling for client accessibility issues
      throw error;
    }

    throw error;
  }

  // Pool to track connected clients
  const clientIdPool = new ServerConnectionPool();

  let client: RemoteProxy<ConnectionClientProtocol> | undefined;

  /**
   * Helper function to ensure client proxy is available before using it
   * Throws an error if client is not yet connected
   */
  const ensureClientProxy = (): RemoteProxy<ConnectionClientProtocol> => {
    if (!client) {
      // TODO: Improve error message
      throw new Error('Unexpected invoke before client connected');
    }

    return client;
  };

  /**
   * Callback handler for server-to-client callbacks
   *
   * This function is invoked when the server needs to execute a callback in the client's context
   * It serializes the arguments, forwards them to the client, and returns the result
   */
  const transportableRemoteCallback: TransportableRemoteCallback = async (callback, args) => {
    const clientProxy = ensureClientProxy();
    // Convert all arguments to serializable schema entities
    const schemas = await Promise.all(args.map((arg) => transportable.createSchemaEntity(arg)));
    // Call the callback on the client side
    return clientProxy.callback(callback, schemas);
  };

  // Create a Transportable instance for serializing/deserializing data
  const transportable = new Transportable({
    name: 'server',
    callback: transportableRemoteCallback,
  });

  // Initialize the connection to the client
  const connection = connect<ConnectionClientProtocol>({
    messenger,
    channel: OfficeSdkRpcChannel,
    methods: createConnectionServerProtocol({
      clients: clientIdPool,
      /**
       * Handles method invocations from clients
       *
       * @param clientId - The ID of the client making the request
       * @param method - The method name to invoke
       * @param schemas - Serialized arguments as schema entities
       * @returns A Promise resolving to the serialized result
       */
      onInvoke: (clientId, method, schemas) => {
        ensureClientProxy();

        if (!clientIdPool.has(clientId)) {
          // TODO: Use custom error type
          throw new Error(`Client ${clientId} not found`);
        }

        // Get the methods implementation
        const methods = proxy();

        // Deserialize the arguments
        const args = schemas.map((schema) => transportable.parseSchemaEntity(schema));
        // Invoke the requested method
        const result = methods[method](...args);

        // Serialize the result for transmission
        return transportable.createSchemaEntity(result);
      },
      /**
       * Resolves a callback schema for remote execution
       *
       * @param schema - The callback schema to resolve
       * @returns A function that can be called to execute the callback remotely
       */
      resolveCallback: (schema) => {
        return transportable.resolveSchemaCallback(schema);
      },
    }),
  });

  // Wait for the connection to be established
  client = await connection.promise;

  // Retrieve existing client IDs from the client
  const pulledIds = await client.open();

  // Register all client IDs in our pool
  pulledIds.forEach((id) => {
    if (clientIdPool.has(id)) {
      return;
    }

    clientIdPool.add(id);
  });

  // Return a Server interface for managing client connections
  return {
    getClientIds: () => clientIdPool.toArray(),
    addClientListener: (listener) => clientIdPool.addListener(listener),
  };
}
