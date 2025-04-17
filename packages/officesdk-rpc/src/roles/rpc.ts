import type { Token, SmartData } from './token';

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

/**
 * 定义在 rpc 调用时可以作为调用 invoke 的参数，或是作为客户端返回值的类型。
 * 这个类型也可以用在 callback 流程中使用。
 */
export type RPCSchema = Token | SmartData;

export type RPCClientInvoke<TMethods extends RPCMethods> = <TName extends keyof TMethods>(
  method: TName,
  args: RPCSchema[],
) => Promise<RPCReturnValueProxy<ReturnType<TMethods[TName]>>>;

export interface RPCClientProxyContext<TMethods extends RPCMethods> {
  /**
   * 远程调用方法
   */
  invoke: RPCClientInvoke<TMethods>;
}

/**
 * 定义的通用返回类型定义
 */
export type RPCReturnMap<> = Record<string, any>;

export type PRCReturnArray = any[];

export type RPCReturnCallback = (...args: any[]) => any;

export type RPCReturnMapProxy<TProperties extends RPCReturnMap> = {
  [K in keyof TProperties]: TProperties[K] extends (...args: infer A) => infer R
    ? Awaited<R> extends any
      ? (...args: A) => Promise<RPCReturnValueProxy<Awaited<R>>>
      : never
    : TProperties[K];
};

export type RPCReturnArrayProxy<TArray extends PRCReturnArray> =
  TArray extends Array<infer T> ? RPCReturnValueProxy<T>[] : never;

export type RPCReturnPrimitive = string | number | boolean | null | undefined;

export type RPCReturnValueProxy<T> = T extends PRCReturnArray
  ? RPCReturnArrayProxy<T>
  : T extends RPCReturnCallback
    ? RPCReturnCallbackProxy<T>
    : T extends RPCReturnMap
      ? RPCReturnMapProxy<T>
      : T;

export type RPCReturnCallbackProxy<T extends RPCReturnCallback> = T extends (...args: infer A) => infer R
  ? (...args: A) => Promise<R extends any ? RPCReturnValueProxy<R> : never>
  : never;

export type RPCReturnMethods<TMethods extends RPCMethods> = {
  [K in keyof TMethods]: TMethods[K] extends (...args: infer A) => infer R
    ? RPCReturnCallbackProxy<TMethods[K]>
    : TMethods[K];
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
  [K in keyof TMethods]: TMethods[K] extends (...args: infer A) => infer R ? (...args: [...A]) => R : never;
};
