/**
 * Transport layer for cross-window communication
 *
 * This module exports types and classes for data serialization and RPC method definitions.
 * It handles the transformation of data between different execution environments.
 */

// Export Transportable class and types
export { Transportable } from './transportable';
export type { TransportableRemoteCallback } from './transportable';

// Export RPC types
export type {
  RPCMethod,
  RPCMap,
  PRCArray,
  RPCMethods,
  RPCClientInvokeArgs,
  RPCClientInvoke,
  RPCClientProxyContext,
  RPCReturnMapProxy,
  RPCReturnArrayProxy,
  RPCReturnValueProxy,
  RPCReturnCallbackProxy,
  RPCReturnMethods,
  RPCClientProxy,
  RPCServerProxy,
} from './rpc';
