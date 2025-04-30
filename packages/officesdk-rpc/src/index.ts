/**
 * Office SDK RPC Library
 *
 * A library for cross-window communication with RPC capabilities.
 * Provides tools for establishing connections between windows/iframes,
 * serializing complex data, and executing remote method calls.
 */

// Export core client and server functionality
export { create, serve } from './connection';
export type { Client, Server, ClientOptions, ServerOptions } from './connection';

// Export Token for data serialization
export { Token } from './core';
export type {
  TokenOptions,
  TokenRule,
  TokenRulePaths,
  SmartData,
  TokenContext,
  SchemaEntity,
  SchemaValueCallback,
  SchemaValue,
  SchemaStructured,
  TokenRulePath,
  SchemaValueRef,
  SchemaValueData,
  SchemaStructuredArray,
  SchemaStructuredMap,
} from './core';

// Export RPC types for API definition
export type {
  RPCMethods,
  RPCClientInvokeArgs,
  RPCMethod,
  RPCClientProxy,
  RPCClientProxyContext,
  RPCServerProxy,
  RPCClientInvoke,
  RPCReturnMethods,
  RPCReturnMapProxy,
  RPCReturnArrayProxy,
} from './transport';

// Export serialization types
export { Transportable } from './transport';
export type {
  TransportableRemoteCallback,
  RPCReturnValueProxy,
  RPCMap,
  PRCArray,
  RPCReturnCallbackProxy,
  TransportableLocalOptions,
} from './transport';

// Export error types and utilities
export * from './errors';

export type { Cloneable } from './utils';
