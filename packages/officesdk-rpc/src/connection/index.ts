/**
 * Connection management for cross-window communication
 *
 * This module exports components for establishing and maintaining connections
 * between different execution environments, including client and server implementations.
 */

// Export client implementation
export { create } from './client';
export type { Client, ClientOptions } from './client';

// Export server implementation
export { serve } from './server';
export type { Server, ServerOptions } from './server';

// Export connection types and functions
export { createConnectionClientProtocol, createConnectionServerProtocol, OfficeSdkRpcChannel } from './connection';
export type { ConnectionCallback, ConnectionClientProtocol, ConnectionServerProtocol } from './connection';

// Export connection pool
export { ServerConnectionPool } from './pool';

// Export window utilities
export { getParentWindowOrThrow } from './window';
