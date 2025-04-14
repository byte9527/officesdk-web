import type { TransportableData } from '@officesdk/rpc';

/**
 * 定义的通用返回类型定义
 */
export type RpcReturnProperties = {
  [index: string]: unknown;
};

/**
 * 将定义的通用返回类型转为远程 RPC 调用后拿到的类型：
 * - 如果属性值为函数，则返回函数，但需要将函数的返回值转为 Promise
 * - 如果属性值为其他类型，则直接返回该类型
 */
export type RpcReturnProxy<TProperties extends RpcReturnProperties = RpcReturnProperties> = {
  [K in keyof TProperties]: TProperties[K] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<Awaited<R>>
    : TProperties[K] extends TransportableData
      ? TProperties[K]
      : never;
};
