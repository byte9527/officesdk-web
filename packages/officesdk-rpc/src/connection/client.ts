/**
 * Office SDK Cross-Window Communication Client
 *
 * This file implements the client-side of the cross-window or cross-iframe communication system.
 * It allows a window to connect to and communicate with server windows (typically iframes or parent windows)
 * that provide specific functionality.
 *
 * Key features:
 * 1. Connection management - Establishes and maintains connections to server windows
 * 2. Connection reuse - Multiple client instances can share a single connection to the same server
 * 3. Remote method invocation - Provides proxy methods to call functions on the server
 * 4. Serialization - Automatically handles serialization of complex data types and functions
 * 5. Callback support - Enables server code to invoke callback functions defined in the client
 *
 * The client works together with the server (server.ts), transportable (transportable.ts), and
 * token (token.ts) components to provide a complete cross-window communication solution that
 * supports passing complex data structures, functions, and maintaining references across
 * different execution contexts.
 *
 * Usage pattern:
 * 1. Create a client instance with appropriate options
 * 2. Use the returned proxy methods to call server functions
 * 3. Data and callbacks are automatically serialized/deserialized across environments
 */

import { connect, WindowMessenger } from 'penpal';
import type { Connection, RemoteProxy } from 'penpal';

import { OfficeSdkRpcChannel, createConnectionClientProtocol } from './connection';
import type { ConnectionServerProtocol, ConnectionClientRecord } from './connection';
import { generateUniqueId } from '../utils';
import { Transportable } from '../transport';
import type {
  TransportableRemoteCallback,
  RPCClientProxy,
  RPCMethods,
  RPCReturnMethods,
  RPCClientInvokeArgs,
  RPCSettings,
} from '../transport';

/**
 * Configuration options for creating a client instance
 */
export interface ClientOptions<TMethods extends RPCMethods, TSettings extends RPCSettings> {
  /**
   * The remote window to connect to, typically an iframe.contentWindow
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
   * Connection timeout in milliseconds
   */
  timeout?: number;

  /**
   * Remote procedure call protocol proxy
   *
   * Generates methods for the client to call on the server.
   * The server must implement methods according to the same RPCMethods protocol.
   */
  proxy: RPCClientProxy<TMethods>;

  /**
   * Optional settings object to be passed to the server
   * This can be passed when opening the connection
   */
  settings?: TSettings;
}

/**
 * Internal record of a server connection
 * Used to associate server Windows with client information and reuse connections
 */
interface ServerRecord<TMethods extends RPCMethods, TSettings extends RPCSettings> {
  /**
   * The Penpal connection to the server
   */
  connection: Connection<ConnectionServerProtocol<TSettings>>;

  /**
   * Set of client IDs registered with this server
   */
  clients: Set<ConnectionClientRecord<TSettings>>;

  /**
   * Generated proxy methods for calling server functions
   */
  methods: RPCReturnMethods<TMethods>;
}

/**
 * Global cache mapping Window objects to their server records
 * Uses WeakMap to allow garbage collection when windows are destroyed
 */
let serverMap = new WeakMap<Window, ServerRecord<any, any>>();

/**
 * Client interface for interacting with a server
 */
export interface Client<TMethods extends RPCMethods> {
  /**
   * Unique identifier for this client
   */
  id: string;

  /**
   * Proxy methods for calling functions on the server
   */
  methods: RPCReturnMethods<TMethods>;
}

/**
 * Creates a client instance that can communicate with a server
 *
 * If a connection to the specified window already exists, it will be reused.
 * Multiple clients can share a single connection to the same server window.
 *
 * @param options - Configuration options for the client
 * @returns A Promise resolving to a Client instance
 */
export async function create<TMethods extends RPCMethods, TSettings extends RPCSettings>(
  options: ClientOptions<TMethods, TSettings>,
): Promise<Client<TMethods>> {
  const { remoteWindow, allowedOrigins = ['*'], timeout, settings } = options;

  const serverRecordCache = serverMap.get(remoteWindow);

  // Generate a unique ID for this client
  const clientId = generateUniqueId();

  // If we already have a connection to this server, reuse it
  // This allows multiple clients to share a single connection
  if (serverRecordCache) {
    await connectServer(serverRecordCache.connection, clientId, settings);

    return {
      id: clientId,
      methods: serverRecordCache.methods,
    };
  }

  // Create a new messenger for communication with the server
  const messenger = new WindowMessenger({
    remoteWindow,
    allowedOrigins,
  });

  // Track client IDs registered with this server
  const clients = new Set<ConnectionClientRecord<TSettings>>([]);

  /**
   * Helper function to ensure server proxy is available before using it
   * Throws an error if server is not yet connected
   */
  const ensureServerProxy = (): RemoteProxy<ConnectionServerProtocol<TSettings>> => {
    if (!server) {
      throw new Error('Unexpected invoke before server connected');
    }

    return server;
  };

  /**
   * Callback handler for client-to-server callbacks
   *
   * This function is invoked when the client needs to execute a callback in the server's context
   * It serializes the arguments, forwards them to the server, and returns the result
   */
  const transportableRemoteCallback: TransportableRemoteCallback = async (callback, args) => {
    const serverProxy = ensureServerProxy();

    // Convert all arguments to serializable schema entities
    const schemas = await Promise.all(args.map((arg) => transportable.createSchemaEntity(arg)));
    // Call the callback on the server side
    return serverProxy.callback(callback, schemas);
  };

  // Create a Transportable instance for serializing/deserializing data
  const transportable = new Transportable({
    name: clientId,
    callback: transportableRemoteCallback,
  });

  // Initialize the connection to the server
  const connection = connect<ConnectionServerProtocol<RPCSettings>>({
    channel: OfficeSdkRpcChannel,
    messenger,
    methods: createConnectionClientProtocol({
      /**
       * Returns the set of client IDs associated with this connection
       */
      getClients: () => clients,

      /**
       * Resolves a callback schema for remote execution
       *
       * @param schema - The callback schema to resolve
       * @returns A function that can be called to execute the callback remotely
       */
      resolveCallback: (schema) => {
        // Reject callbacks from other clients for security
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

  // Register this client ID with the connection
  clients.add({
    clientId,
    settings,
  });

  // Connect to the server and register this client
  const serverPromise = connectServer(connection, clientId, settings);

  const { proxy } = options;

  // Create the proxy methods for calling server functions
  const methods = proxy({
    /**
     * Central function for invoking methods on the server
     *
     * @param method - The name of the method to call
     * @param args - Arguments to pass to the method
     * @returns A Promise resolving to the result from the server
     */
    invoke: async <TName extends keyof TMethods>(
      method: TName,
      args: RPCClientInvokeArgs<Parameters<TMethods[TName]>>,
    ) => {
      const serverProxy = ensureServerProxy();

      // Serialize the arguments for transmission
      const schemas = await Promise.all(args.map((arg) => transportable.createSchemaEntity(arg)));

      // TODO: Improve type safety for method name
      const response = serverProxy.invoke(clientId, method as string, schemas);

      // Parse the response when it arrives
      return response.then((data) => {
        if (!data) {
          return;
        }

        return transportable.parseSchemaEntity(data);
      });
    },
  });

  // Wait for the connection to be established
  let server = await serverPromise;

  // Create a record of this server connection
  const serverRecord = {
    connection,
    clients,
    methods,
  };

  // Cache the server record for potential reuse
  serverMap.set(remoteWindow, serverRecord);

  return {
    id: clientId,
    methods,
  };
}

/**
 * Establishes a connection to the server and registers a client ID
 *
 * @param connection - The Penpal connection to the server
 * @param clientId - The client ID to register
 * @returns A Promise resolving to the server proxy
 */
async function connectServer<TSettings extends RPCSettings>(
  connection: Connection<ConnectionServerProtocol<TSettings>>,
  clientId: string,
  settings: TSettings,
): Promise<RemoteProxy<ConnectionServerProtocol<TSettings>>> {
  try {
    // Wait for the connection to be established
    const server = await connection.promise;
    // Register this client ID with the server
    await server.open(clientId, settings);

    return server;
  } catch (error) {
    // TODO: Improve timeout handling, especially for same-origin policy issues

    throw error;
  }
}
