export { create, serve, Token } from './roles';
export type {
  RPCMethods,
  TokenContext,
  SchemaEntity,
  SchemaValue,
  SchemaValueCallback,
  SchemaValueRef,
  SchemaValueData,
  SchemaStructuredArray,
  SchemaStructuredMap,
  SchemaStructured,
  Client,
  ClientOptions,
  RPCClientInvokeArgs,
  RPCMethod,
  RPCClientProxy,
  RPCClientProxyContext,
  RPCServerProxy,
  RPCClientInvoke,
  RPCReturnMethods,
  RPCReturnMapProxy,
  RPCReturnArrayProxy,
  Server,
  ServerOptions,
  Transportable,
  TransportableLocalOptions,
  TransportableRemoteCallback,
  TokenOptions,
  TokenRulePaths,
  TokenRulePath,
  TokenRule,
  SmartData,
  RPCReturnValueProxy,
  RPCMap,
  PRCArray,
  RPCReturnCallbackProxy
} from './roles';

export type { Cloneable } from './shared/cloneable';

// TODO: 需要重构 RemoteProxy 类型： 1. 不允许嵌套 2. 需要支持将所有 callback 转为异步，并约束 callback 的参数类型为 TransportableData
export type { RemoteProxy } from 'penpal';
