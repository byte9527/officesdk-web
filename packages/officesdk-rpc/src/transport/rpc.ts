/**
 * Office SDK Cross-Window Communication RPC Types
 *
 * This file defines the type system for Remote Procedure Calls (RPC) between different execution environments
 * (windows or iframes). It provides TypeScript type definitions that enable strongly-typed cross-window
 * method calls while handling the complexities of serialization and proxying.
 *
 * The RPC type system facilitates:
 * 1. Method definition - Typed interfaces for defining callable methods
 * 2. Argument handling - Support for complex argument types including Tokens
 * 3. Return value proxying - Typed transformations of return values across environments
 * 4. Protocol definition - Types for both client and server proxy implementations
 *
 * This type system works with the schema, token, transportable, client, and server components
 * to provide a complete, type-safe remote procedure call framework for cross-window communication.
 */

import type { Token } from '../core/token';

/**
 * Represents a method that can be called via RPC
 *
 * RPC methods can accept any arguments and return any JSON-compatible values.
 * Complex types that are not directly serializable will be handled by the token system.
 */
export type RPCMethod = (...args: any[]) => any;

/**
 * Represents a generic object map with string keys and any values
 *
 * Used for structuring return values and method parameters in RPC calls.
 */
export type RPCMap = Record<string, any>;

/**
 * Represents any array type that can be used in RPC calls
 *
 * Used for handling array return values and parameters in RPC methods.
 */
export type PRCArray = any[];

/**
 * Defines a map of named RPC methods
 *
 * This is the core interface for defining a set of callable methods
 * to be exposed across window boundaries.
 */
export type RPCMethods = {
  [key: string]: RPCMethod;
};

/**
 * Defines argument types that can be passed to RPC methods
 *
 * Each argument can either be the original type or a Token wrapper,
 * allowing for complex objects to be properly serialized for transmission.
 */
export type RPCClientInvokeArgs<T extends any[]> = {
  [K in keyof T]: T[K] | Token;
};

/**
 * Defines the core invoke function type used in RPC calls
 *
 * This function is used to call remote methods by name with appropriate arguments.
 * It handles serialization, invocation, and deserialization of return values.
 * The return value is wrapped in a proxy to maintain proper type transformations.
 * This type can also be used in callback flows.
 */
export type RPCClientInvoke<TMethods extends RPCMethods> = <TName extends Extract<keyof TMethods, string>>(
  method: TName,
  args: RPCClientInvokeArgs<Parameters<TMethods[TName]>>,
) => Promise<RPCReturnValueProxy<ReturnType<TMethods[TName]>>>;

/**
 * Context provided to client proxy implementations
 *
 * Contains the core invoke function that allows calling remote methods
 * across window boundaries.
 */
export interface RPCClientProxyContext<TMethods extends RPCMethods> {
  /**
   * Function to invoke remote methods on the server
   */
  invoke: RPCClientInvoke<TMethods>;
}

/**
 * Transforms object map return types to ensure all properties are properly proxied
 *
 * This type recursively applies RPCReturnValueProxy to each property of an object,
 * ensuring that complex nested structures maintain proper typing across environments.
 */
export type RPCReturnMapProxy<TProperties extends RPCMap> = {
  [K in keyof TProperties]: RPCReturnValueProxy<TProperties[K]>;
};

/**
 * Transforms array return types to ensure all elements are properly proxied
 *
 * This type recursively applies RPCReturnValueProxy to each element of an array,
 * ensuring that arrays of complex values maintain proper typing across environments.
 */
export type RPCReturnArrayProxy<TArray extends PRCArray> =
  TArray extends Array<infer T> ? RPCReturnValueProxy<T>[] : never;

/**
 * Core type transformer for RPC return values
 *
 * This conditional type handles the appropriate transformation based on the return value type:
 * - Arrays are transformed to RPCReturnArrayProxy
 * - Functions are transformed to RPCReturnCallbackProxy
 * - Objects are transformed to RPCReturnMapProxy
 * - Primitive values remain unchanged
 *
 * This ensures that all return values, regardless of complexity, maintain proper
 * type information and behavior when used across window boundaries.
 */
export type RPCReturnValueProxy<T> = T extends PRCArray
  ? RPCReturnArrayProxy<T>
  : T extends RPCMethod
    ? RPCReturnCallbackProxy<T>
    : T extends RPCMap
      ? RPCReturnMapProxy<T>
      : T;

/**
 * Transforms function return types for RPC callbacks
 *
 * When a method returns a function, this type ensures that the returned function
 * is properly wrapped as a Promise returning the appropriate proxied type.
 * This allows callbacks to be passed back and forth between environments
 * while maintaining proper typing.
 */
export type RPCReturnCallbackProxy<T extends RPCMethod> = T extends (...args: infer A) => infer R
  ? Awaited<R> extends any
    ? (...args: A) => Promise<RPCReturnValueProxy<Awaited<R>>>
    : never
  : never;

/**
 * Transforms a set of RPC methods to ensure their return values are properly proxied
 *
 * This type applies RPCReturnCallbackProxy to each method in a set of RPC methods,
 * ensuring that all methods have properly typed return values when used across environments.
 */
export type RPCReturnMethods<TMethods extends RPCMethods> = {
  [K in keyof TMethods]: TMethods[K] extends RPCMethod ? RPCReturnCallbackProxy<TMethods[K]> : TMethods[K];
};

/**
 * Defines a client proxy factory for RPC methods
 *
 * This function type takes a client context and returns proxied methods that can
 * be called from the client to invoke functionality on the server. The returned
 * methods are wrapped to ensure proper type transformations for arguments and return values.
 */
export type RPCClientProxy<TMethods extends RPCMethods> = (
  context: RPCClientProxyContext<TMethods>,
) => RPCReturnMethods<TMethods>;

/**
 * Defines a server proxy factory for RPC methods
 *
 * This function type returns an object with method implementations that will be
 * exposed to clients. The methods can return either direct values or Token-wrapped
 * values, allowing complex types to be properly serialized for transmission back to clients.
 *
 * The server is responsible for implementing these methods according to the TMethods protocol.
 */
export type RPCServerProxy<TMethods extends RPCMethods, TSettings = undefined> = (
  settings: TSettings | null,
) => Promise<{
  [K in keyof TMethods]: TMethods[K] extends (...args: infer A) => infer R ? (...args: [...A]) => R | Token : never;
}>;
