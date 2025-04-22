/**
 * Core types and functionality for cross-window communication
 *
 * This module exports the fundamental types and classes that form the foundation
 * of the RPC system, including schema definitions and token handling.
 */

// Export schema types
export type {
  SchemaEntity,
  SchemaStructured,
  SchemaValue,
  SchemaValueCallback,
  SchemaValueRef,
  SchemaValueData,
  SchemaStructuredArray,
  SchemaStructuredMap,
} from './schema';

// Export token types and class
export { Token, isToken } from './token';
export type { TokenOptions, TokenRule, TokenRulePath, TokenRulePaths, SmartData, TokenContext } from './token';
