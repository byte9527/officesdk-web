import type { RemoteProxy } from 'penpal';

export enum RPCArgType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Object = 'object',
  Null = 'null',
  Undefined = 'undefined',
  Array = 'array',
  // 当前上下文中的非 Transferable 或可通过 structuredClone 克隆的变量，
  // 跨上下文只能间接引用，无法直接调用和访问
  Reference = 'reference',
}

/**
 * 可通过 penpal 调用的参数形式我们约束为合法的 JSON 类型
 */
export type RPCParameter =
  | string
  | number
  | boolean
  | RPCMethod
  | null
  | undefined
  | RPCParameter[]
  | { [key: string]: RPCParameter };

/**
 * 可通过 penpal 调用的方法，返回值约束为合法的 JSON 类型
 */
export type RPCMethod = (...args: any[]) => any;

export type RPCMethods = {
  [index: string]: RPCMethod;
};

export type RPCClientInvoke<TMethods extends RPCMethods> = <TMethod extends keyof TMethods>(
  method: TMethod,
  args?: Parameters<TMethods[TMethod]>,
) => Promise<ReturnType<TMethods[TMethod]>>;

export type RPCServerCallback = (clientId: string, method: string, args: any[]) => void;

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
) => RemoteProxy<TMethods>;

export interface RPCServerProxyContext {
  /**
   * 远程调用方法
   */
  callback: RPCServerCallback;
}

export interface RPCServerCallOptions {
  /**
   * 客户端 ID
   */
  clientId: string;
}

/**
 * 服务端协议，用于定义可供服务端远程调用的方法。
 * 服务端需要基于这个协议提供 penpal 的 Methods 实现，
 */
export type RPCServerProxy<TMethods extends RPCMethods> = (context: RPCServerProxyContext) => {
  [K in keyof TMethods]: TMethods[K] extends (...args: infer A) => infer R
    ? (...args: [...A, RPCServerCallOptions]) => R
    : never; //(...args: Parameters<TMethods[K]>) => ReturnType<TMethods[K]>;
};
