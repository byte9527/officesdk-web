/**
 * Office SDK Cross-Window Connection Pool
 *
 * This file implements the connection pool that manages client connections for the server.
 * It provides functionality for tracking connected clients, notifying listeners of connection
 * events, and querying connection status.
 *
 * The ServerConnectionPool is a key component in maintaining the server's awareness of
 * connected clients and facilitating communication across multiple client windows.
 * It supports:
 * 1. Client tracking - Adding and removing client connections
 * 2. Event notification - Alerting listeners to client connection/disconnection events
 * 3. Connection querying - Checking connection status and listing connected clients
 */

interface ServerConnectionRecord<TSettings> {
  clientId: string;
  settings?: TSettings;
}

/**
 * Manages the pool of client connections on the server side
 *
 * This class tracks connected clients, notifies listeners when clients connect or disconnect,
 * and provides methods to query the current connection state.
 */
export class ServerConnectionPool<TSettings> {
  /**
   * Set of connected client IDs
   */
  private pool: Map<string, ServerConnectionRecord<TSettings>> = new Map();

  /**
   * Set of event listeners for connection events
   */
  private listeners: Set<
    <TType extends 'add' | 'delete'>(
      type: TType,
      payload: TType extends 'add' ? ServerConnectionRecord<TSettings> : { clientId: string },
    ) => void
  > = new Set();

  /**
   * Adds a client to the connection pool
   *
   * Registers a new client connection and notifies all listeners of the addition.
   *
   * @param clientId - The unique identifier of the client to add
   */
  public add(clientId: string, settings?: TSettings): void {
    if (this.pool.has(clientId)) {
      return;
    }

    this.pool.set(clientId, {
      clientId,
      settings,
    });

    this.listeners.forEach((listener) => {
      listener('add', { clientId, settings });
    });
  }

  /**
   * Removes a client from the connection pool
   *
   * Unregisters a client connection and notifies all listeners of the deletion.
   *
   * @param clientId - The unique identifier of the client to remove
   */
  public delete(clientId: string): void {
    this.pool.delete(clientId);

    this.listeners.forEach((listener) => {
      listener('delete', { clientId });
    });
  }

  /**
   * Checks if a client is currently connected
   *
   * @param clientId - The unique identifier of the client to check
   * @returns True if the client is connected, false otherwise
   */
  public has(clientId: string): boolean {
    return this.pool.has(clientId);
  }

  /**
   * Adds a listener for connection events
   *
   * The listener will be called whenever a client connects or disconnects.
   *
   * @param listener - Callback function that receives event type ('add' or 'delete') and clientId
   * @returns A function to remove the listener
   */
  public addListener(listener: (type: 'add' | 'delete', payload: { clientId: string }) => void): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Retrieves the settings for a specific client
   *
   * @param clientId - The unique identifier of the client
   * @returns The settings object for the client, or null if not found
   */
  public getSettings(clientId: string): TSettings | null {
    const record = this.pool.get(clientId);
    if (record) {
      return record.settings ?? null;
    }
    return null;
  }

  /**
   * Converts the connection pool to an array of client IDs
   *
   * @returns An array containing all connected client IDs
   */
  public toArray(): string[] {
    return Array.from(this.pool.keys());
  }
}
