import type { RemoteProxy } from 'penpal';

import type { TransportableRules } from './transportable';

/**
 * 可通过 penpal 调用的参数形式我们约束为合法的 JSON 类型
 */
export type RPCPrimitiveParameter =
  | string
  | number
  | boolean
  | null
  | undefined
  | RPCPrimitiveParameter[]
  | { [key: string]: RPCPrimitiveParameter };
/**
 * 可通过 penpal 调用的方法，返回值约束为合法的 JSON 类型
 */
export type RPCMethod = (...args: any[]) => any;

export type RPCMethods = {
  [key: string]: RPCMethod;
};

export interface RPCClientInvokeOptions<T extends (...args: any[]) => any> {
  /**
   * 遍历参数列表，将参数里无法传输的类型提取出来，
   * 生成引用类型对照表，给服务端调用时使用。
   */
  transformArgs?: (args: Parameters<T>) => {
    rules: TransportableRules[];
  };
}

export type RPCClientInvoke<TMethods extends RPCMethods> = <TName extends keyof TMethods>(
  method: TName,
  args: Parameters<TMethods[TName]>,
  options?: RPCClientInvokeOptions<TMethods[TName]>,
) => Promise<ReturnType<TMethods[TName]>>;

export interface RPCClientProxyContext<TMethods extends RPCMethods> {
  /**
   * 远程调用方法
   */
  invoke: RPCClientInvoke<TMethods>;
}

/**
 * 客户端协议，用于生成供客户端远程调用服务端的代理方法。
 * 代理方法需要基于提供的 penpal 上下文信息，生成对应的 RemoteProxy 实现
 */
export type RPCClientProxy<TMethods extends RPCMethods> = (
  context: RPCClientProxyContext<TMethods>,
) => RemoteProxy<TMethods>; // TODO: 这里的返回类型 RemoteProxy 需要优化： 1. 不允许嵌套 2. 需要支持将所有 callback 转为异步，并约束 callback 的参数类型为 TransportableData

export interface RPCServerProxyReturn<T> {
  /**
   * 返回值
   */
  value: T;
  /**
   *
   */
  rules?: TransportableRules;
}

/**
 * 服务端协议，用于定义可供服务端远程调用的方法。
 * 服务端需要基于这个协议提供 penpal 的 Methods 实现，
 * 并返回一个对象，该对象需要经过 Transportable 转换为 TransportableSchema 后返回客户端。
 */
export type RPCServerProxy<TMethods extends RPCMethods> = () => {
  [K in keyof TMethods]: TMethods[K] extends (...args: infer A) => infer R
    ? (...args: [...A]) => RPCServerProxyReturn<R> | void
    : never;
};
