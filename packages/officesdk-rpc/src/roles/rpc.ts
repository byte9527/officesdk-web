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
) => Promise<RPCReturnMapProxy<ReturnType<TMethods[TName]>>>;

export interface RPCClientProxyContext<TMethods extends RPCMethods> {
  /**
   * 远程调用方法
   */
  invoke: RPCClientInvoke<TMethods>;
}

/**
 * 定义的通用返回类型定义
 */
export type RPCReturnMap = {
  [index: string]: any;
};

export type PRCReturnArray = any[];

export type RPCReturnCallback = (...args: any[]) => any;

export type RPCReturnMapProxy<TProperties extends RPCReturnMap> = {
  [K in keyof TProperties]: TProperties[K] extends (...args: infer A) => infer R
    ? // 如果函数返回值
      // R extends RPCReturnMap
      // ? (...args: A) => Promise<RPCReturnMapProxy<R>>
      // : R extends PRCReturnArray
      //   ? (...args: A) => Promise<RPCReturnArrayProxy<R>>
      //   :
      (
        ...args: A
      ) => Promise<
        R extends PRCReturnArray
          ? RPCReturnArrayProxy<R>
          : R extends RPCReturnMap
            ? RPCReturnMapProxy<Awaited<R>>
            : Awaited<R>
      >
    : TProperties[K];
};

// TODO: 这里貌似不完善，缺少类型套娃支持
export type RPCReturnArrayProxy<TArray extends PRCReturnArray> =
  TArray extends Array<infer T>
    ? T extends PRCReturnArray
      ? RPCReturnArrayProxy<T>[]
      : T extends RPCReturnMap
        ? RPCReturnMapProxy<T>[]
        : T
    : // TODO: 如果是 Callback[] ，需要继续递归
      never;

export type RPCReturnMethods<TMethods extends RPCMethods> = {
  [K in keyof TMethods]: TMethods[K] extends (...args: infer A) => infer R
    ? (
        ...args: A
      ) => Promise<
        R extends PRCReturnArray ? RPCReturnArrayProxy<R> : R extends RPCReturnMap ? RPCReturnMapProxy<R> : Awaited<R>
      >
    : TMethods[K];
};

/**
 * 客户端协议，用于生成供客户端远程调用服务端的代理方法。
 * 代理方法需要基于提供的 penpal 上下文信息，生成对应的 RemoteProxy 实现
 */
export type RPCClientProxy<TMethods extends RPCMethods> = (
  context: RPCClientProxyContext<TMethods>,
) => RPCReturnMethods<TMethods>; // TODO: 这里的返回类型 RemoteProxy 需要优化： 1. 不允许嵌套 2. 需要支持将所有 callback 转为异步，并约束 callback 的参数类型为 TransportableData

/**
 * 服务端协议，用于定义可供服务端远程调用的方法。
 * 服务端需要基于这个协议提供 penpal 的 Methods 实现，
 * 并返回一个对象，该对象需要经过 Transportable 转换为 TransportableSchema 后返回客户端。
 */
export type RPCServerProxy<TMethods extends RPCMethods> = () => {
  [K in keyof TMethods]: TMethods[K] extends (...args: infer A) => infer R ? (...args: [...A]) => R : never;
};
