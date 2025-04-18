import type { Token } from './token';

/**
 * 可通过 penpal 调用的方法，返回值约束为合法的 JSON 类型
 */
export type RPCMethod = (...args: any[]) => any;

/**
 * 定义的通用返回类型定义
 */
export type RPCMap = Record<string, any>;

export type PRCArray = any[];

export type RPCMethods = {
  [key: string]: RPCMethod;
};

export type RPCClientInvokeArgs<T extends any[]> = {
  [K in keyof T]: T[K] | Token;
};
/**
 * 定义在 rpc 调用时可以作为调用 invoke 的参数，或是作为客户端返回值的类型。
 * 这个类型也可以用在 callback 流程中使用。
 */
export type RPCClientInvoke<TMethods extends RPCMethods> = <TName extends keyof TMethods>(
  method: TName,
  args: RPCClientInvokeArgs<Parameters<TMethods[TName]>>,
) => Promise<RPCReturnValueProxy<ReturnType<TMethods[TName]>>>;

export interface RPCClientProxyContext<TMethods extends RPCMethods> {
  /**
   * 远程调用方法
   */
  invoke: RPCClientInvoke<TMethods>;
}

export type RPCReturnMapProxy<TProperties extends RPCMap> = {
  [K in keyof TProperties]: RPCReturnValueProxy<TProperties[K]>;
};

export type RPCReturnArrayProxy<TArray extends PRCArray> =
  TArray extends Array<infer T> ? RPCReturnValueProxy<T>[] : never;

export type RPCReturnValueProxy<T> = T extends PRCArray
  ? RPCReturnArrayProxy<T>
  : T extends RPCMethod
    ? RPCReturnCallbackProxy<T>
    : T extends RPCMap
      ? RPCReturnMapProxy<T>
      : T;

/**
 * RPC 回调的返回值都应该匹配范型 RPCReturnValueProxy<R>
 */
export type RPCReturnCallbackProxy<T extends RPCMethod> = T extends (...args: infer A) => infer R
  ? Awaited<R> extends any
    ? (...args: A) => Promise<RPCReturnValueProxy<Awaited<R>>>
    : never
  : never;

/**
 * 拦截 RPC 方法列表的所有返回值，使其匹配范型 RPCReturnValueProxy<R>
 */
export type RPCReturnMethods<TMethods extends RPCMethods> = {
  [K in keyof TMethods]: TMethods[K] extends RPCMethod ? RPCReturnCallbackProxy<TMethods[K]> : TMethods[K];
};

/**
 * 客户端协议，用于生成供客户端远程调用服务端的代理方法。
 * 代理方法需要基于提供的 penpal 上下文信息，生成对应的 RemoteProxy 实现
 */
export type RPCClientProxy<TMethods extends RPCMethods> = (
  context: RPCClientProxyContext<TMethods>,
) => RPCReturnMethods<TMethods>;

/**
 * 服务端协议，用于定义可供服务端远程调用的方法。
 * 服务端需要基于这个协议提供 penpal 的 Methods 实现，
 * 并返回一个对象，该对象需要经过 Transportable 转换为 TransportableSchema 后返回客户端。
 */
export type RPCServerProxy<TMethods extends RPCMethods> = () => {
  [K in keyof TMethods]: TMethods[K] extends (...args: infer A) => infer R ? (...args: [...A]) => R | Token : never;
};
