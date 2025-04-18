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

/**
 * Manages the pool of client connections on the server side
 *
 * This class tracks connected clients, notifies listeners when clients connect or disconnect,
 * and provides methods to query the current connection state.
 */
export class ServerConnectionPool {
  /**
   * Set of connected client IDs
   */
  private pool: Set<string> = new Set();

  /**
   * Set of event listeners for connection events
   */
  private listeners: Set<(type: 'add' | 'delete', payload: { clientId: string }) => void> = new Set();

  /**
   * Adds a client to the connection pool
   *
   * Registers a new client connection and notifies all listeners of the addition.
   *
   * @param clientId - The unique identifier of the client to add
   */
  public add(clientId: string): void {
    this.pool.add(clientId);

    this.listeners.forEach((listener) => {
      listener('add', { clientId });
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
   * Converts the connection pool to an array of client IDs
   *
   * @returns An array containing all connected client IDs
   */
  public toArray(): string[] {
    return Array.from(this.pool);
  }
}
