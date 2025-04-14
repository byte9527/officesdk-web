export { create, serve } from './roles';
export type {
  RPCMethods,
  RPCClientProxy,
  RPCServerProxy,
  RPCClientInvoke,
  Client,
  Transportable,
  TransportableRules,
  TransportableData,
  TransportableRule,
  TransportableRuleItem,
} from './roles';

// TODO: 需要重构 RemoteProxy 类型： 1. 不允许嵌套 2. 需要支持将所有 callback 转为异步，并约束 callback 的参数类型为 TransportableData
export type { RemoteProxy } from 'penpal';
