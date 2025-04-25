import type { Cloneable } from '../utils';
import type { SchemaEntity, SchemaStructured, SchemaValueCallback, SchemaValueRef, SchemaValueData } from './schema';
import { isSimpleValue, isPlainObject, isArray, entries, fromEntries } from '../utils';

/**
 * Defines rules for transforming input data into schemas through Tokens.
 *
 * This library facilitates cross-environment communication (like between iframes or windows)
 * by serializing data that normally cannot be transferred using structuredClone.
 *
 * Most data requiring special transformation is typically objects or functions.
 * The rules specify paths within the value where data needs transformation.
 *
 * The '&' symbol represents the root of the value being processed.
 *
 * Common rule relationship examples:
 * value: window ==> [{ type: 'ref', path: '&' }]
 *   - Converts the entire window object to a reference
 *
 * value: { foo: document } ==> [{ type: 'ref', path: '&.foo' }]
 *   - Converts only the document property to a reference
 *
 * value: () => {} ==> [{ type: 'callback', path: '&' }]
 *   - Converts the function to a callback reference
 *
 * value: { foo: () => {} } ==> [{ type: 'callback', path: '&.foo' }]
 *   - Converts only the function at foo property to a callback reference
 *
 * value: [window] ==> [{ type: 'ref', path: '&[0]' }]
 *   - Converts the first array element to a reference
 *
 * value: { foo: [window] } ==> [{ type: 'ref', path: '&.foo[0]' }]
 *   - Converts the first element of the array in foo property to a reference
 */

/**
 * Represents a path in a value that needs transformation.
 * Always starts with '&' to denote the root of the value being processed.
 * Can include property access notation (.prop) and array indexing ([index]).
 */
export type TokenRulePath = `&${string}`;

/**
 * A non-empty array of TokenRulePaths to ensure at least one path is specified.
 */
export type TokenRulePaths = [TokenRulePath, ...TokenRulePath[]];

/**
 * Defines a transformation rule with a type and associated paths.
 *
 * Types include:
 * - 'callback': Transforms functions into callable remote references
 * - 'ref': Transforms objects into remote references
 * - 'array': Forces value to be processed as an array
 * - 'map': Forces value to be processed as an object map
 */
export type TokenRule = {
  type: 'callback' | 'ref' | 'array' | 'map';
  paths: TokenRulePaths;
};

/**
 * Removes the leading '&' from a TokenRulePath to get the actual property path.
 *
 * @param path - The TokenRulePath starting with '&'
 * @returns The path string without the leading '&'
 */
function getDescendantPath(path: TokenRulePath): string {
  return path.slice(1);
}

/**
 * Configuration options for Token initialization.
 * These define how different types of data should be transformed.
 *
 * Each property is an array of paths specifying where to apply the transformation:
 * - arrays: Paths to values that should be treated as arrays
 * - maps: Paths to values that should be treated as object maps
 * - callbacks: Paths to functions that should be transformed into remote callable references
 * - refs: Paths to objects that should be transformed into remote references
 */
export interface TokenOptions {
  arrays?: TokenRulePaths;
  maps?: TokenRulePaths;
  callbacks?: TokenRulePaths;
  refs?: TokenRulePaths;
}

/**
 * Data types that can be automatically identified and transformed without explicit rules.
 * This includes:
 * - Cloneable: Data that can be transferred via structuredClone
 * - Function: Automatically converted to callbacks
 * - Promise: Awaited and then processed based on the resolved value type
 */
export type SmartData = Cloneable | Function | Promise<SmartData>;

/**
 * Context provided to the Token for creating references and identifying the source.
 * This is used to maintain reference identity across different environments.
 */
export interface TokenContext {
  /**
   * Creates a unique reference ID for a callback or reference value.
   * This ID is used to identify the value across different environments.
   *
   * @param value - Object containing the type and actual value to reference
   * @returns A unique reference ID string
   */
  createRefId(value: { type: 'callback' | 'ref'; value: any }): string;

  /**
   * The name of the source environment.
   * Used to identify where referenced values or callbacks originated from.
   */
  name: string;
}

/**
 * Symbol used to mark objects as TokenStructured.
 * This allows for type checking and prevents double-processing.
 */
const TokenStructuredSymbol = Symbol('TokenStructured');

/**
 * Represents a structured token type (array or map) that has been processed.
 * The symbol property ensures we can identify it as already processed.
 */
type TokenStructured = {
  [TokenStructuredSymbol]: true;
} & SchemaStructured;

/**
 * Creates a TokenStructured object by adding the TokenStructuredSymbol.
 *
 * @param value - The SchemaStructured object to mark
 * @returns The same object marked as a TokenStructured
 */
function createTokenStructured(value: SchemaStructured): TokenStructured {
  return {
    [TokenStructuredSymbol]: true,
    ...value,
  };
}

/**
 * Checks if a value is a TokenStructured object.
 *
 * @param value - The value to check
 * @returns True if the value is a TokenStructured object
 */
function isTokenStructured(value: unknown): value is TokenStructured {
  return typeof value === 'object' && Object.getOwnPropertyDescriptor(value, TokenStructuredSymbol)?.value == true;
}

/**
 * Symbol used to mark objects as TokenValue.
 * This allows for type checking and prevents double-processing.
 */
const TokenValueSymbol = Symbol('TokenData');

/**
 * Represents a value token type (primitive data) that has been processed.
 * The symbol property ensures we can identify it as already processed.
 */
type TokenValue = {
  [TokenValueSymbol]: true;
} & SchemaValueData;

/**
 * Creates a TokenValue object by adding the TokenValueSymbol.
 *
 * @param value - The SchemaValueData object to mark
 * @returns The same object marked as a TokenValue
 */
function createTokenValue(value: SchemaValueData): TokenValue {
  return {
    [TokenValueSymbol]: true,
    ...value,
  };
}

/**
 * Checks if a value is a TokenValue object.
 *
 * @param value - The value to check
 * @returns True if the value is a TokenValue object
 */
function isTokenValue(value: unknown): value is TokenValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.getOwnPropertyDescriptor(value, TokenValueSymbol)?.value == true
  );
}

/**
 * The Token class is responsible for transforming data that cannot be directly transmitted
 * across different environments (like window or iframe boundaries) into transmittable formats.
 *
 * It handles:
 * 1. Converting functions to callback references
 * 2. Converting complex objects to remote references
 * 3. Preserving primitives and serializable objects as direct data
 * 4. Structuring nested data types (arrays and objects)
 *
 * Any data can theoretically be packaged as a Token, but data packaged as a reference type
 * can only be used as a reference parameter across environments and cannot be directly
 * accessed in other environments.
 */
export class Token {
  /** Configuration options for token transformation */
  private options: TokenOptions = {};

  /**
   * Creates a new Token instance.
   *
   * @param value - The value to be tokenized for cross-environment transmission
   * @param options - Optional configuration to specify how different parts of the value should be tokenized
   */
  constructor(
    private value: unknown,
    options?: TokenOptions,
  ) {
    if (options) {
      this.options = options;
    }
  }

  /**
   * Transforms the token's value into a schema entity that can be transmitted
   * across environments.
   *
   * @param context - The context for creating references and identifying the source
   * @returns A promise resolving to a SchemaEntity representation of the value
   */
  public async getSchemaEntity(context: TokenContext): Promise<SchemaEntity> {
    const value = this.value;
    const rules = this.sortRules();

    return this.toSchemaEntity(value, rules, context);
  }

  /**
   * Organizes transformation rules in a specific order for processing.
   * Order: callbacks, refs, maps, arrays
   *
   * @returns An array of TokenRule objects in the correct processing order
   */
  private sortRules(): TokenRule[] {
    const { callbacks, refs, arrays, maps } = this.options;

    const rules: TokenRule[] = [];
    if (callbacks?.length) {
      rules.push({
        type: 'callback',
        paths: callbacks,
      });
    }

    if (refs?.length) {
      rules.push({
        type: 'ref',
        paths: refs,
      });
    }

    if (maps?.length) {
      rules.push({
        type: 'map',
        paths: maps,
      });
    }

    if (arrays?.length) {
      rules.push({
        type: 'array',
        paths: arrays,
      });
    }

    return rules;
  }

  /**
   * Core method that transforms any value into a SchemaEntity.
   * It uses a combination of rules and type detection to determine
   * the appropriate transformation.
   *
   * @param value - The value to transform
   * @param rules - Optional rules to guide the transformation
   * @param context - The context for creating references
   * @returns A promise resolving to a SchemaEntity representation of the value
   */
  private async toSchemaEntity(
    value: unknown,
    rules: TokenRule[] | null,
    context: TokenContext,
  ): Promise<SchemaEntity> {
    // If rules are defined, prioritize using rules for transformation
    // This allows explicit control over how specific parts of the data are transformed
    if (rules?.length) {
      return this.iterateRules(value, rules, context);
    }

    // If value is a function, directly convert to callback
    // Functions cannot be cloned, so they must be converted to references
    if (typeof value === 'function') {
      return this.toSchemaCallback(value, context);
    }

    // If value is a Promise, wait for it to resolve and then recursively process
    // This allows async values to be transformed properly
    if (value instanceof Promise) {
      return value.then((value) => {
        return this.toSchemaEntity(value, rules, context);
      });
    }

    // If value is a simple type that can be safely transmitted, return directly
    // These include primitives like numbers, strings, booleans, null, undefined
    if (isSimpleValue(value)) {
      return this.toSchemaData(value);
    }

    // If value is a plain object or array, deeply traverse the object
    // This handles composite types recursively
    if (isPlainObject(value) || isArray(value)) {
      return this.iterateValue(value, context);
    }

    // All other unknown types are converted to references
    // This includes DOM elements, built-in objects like Map, Set, etc.
    return this.toSchemaRef(value, context);
  }

  /**
   * Automatically performs smart type conversion of objects and arrays.
   * This is the core traversal logic for composite data types.
   *
   * Process:
   * 1. Checks if the entire value (including all properties) is structuredClone-compatible
   * 2. If yes, converts the entire value as data (optimization)
   * 3. If no, recursively processes each property individually
   *
   * @param value - The composite value (object or array) to process
   * @param context - The context for creating references
   * @returns A promise resolving to a SchemaEntity representation of the value
   */
  private async iterateValue(value: Record<string, unknown> | unknown[], context: TokenContext): Promise<SchemaEntity> {
    // Check if all properties can be transmitted via structuredClone
    // This is an optimization to avoid unnecessary deep transformation
    if (this.isStructuredCloneable(value)) {
      // If all properties can be transmitted via structuredClone, directly convert to SchemaData
      return this.toSchemaData(value);
    }

    // Otherwise recursively process each property
    if (Array.isArray(value)) {
      const result: SchemaStructured = {
        type: 'array',
        value: [],
      };

      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        // Recursively process each element in the array
        result.value.push(await this.toSchemaEntity(item, null, context));
      }

      return createTokenStructured(result);
    } else {
      const result: SchemaStructured = {
        type: 'map',
        value: {},
      };

      for (const [key, item] of entries(value)) {
        // Recursively process each property in the object
        result.value[key] = await this.toSchemaEntity(item, null, context);
      }

      return createTokenStructured(result);
    }
  }

  /**
   * Recursively checks if a value and all its properties can be transmitted via structuredClone.
   * This is used to determine if a complex object can be sent directly or needs transformation.
   *
   * @param value - The value to check
   * @returns true if the value and all its properties can be transmitted via structuredClone
   */
  private isStructuredCloneable(value: unknown): boolean {
    // Primitive values can be directly transmitted
    if (isSimpleValue(value)) {
      return true;
    }

    // Functions, Promises, etc. cannot be transmitted via structuredClone
    if (typeof value === 'function' || value instanceof Promise) {
      return false;
    }

    // Non-plain objects cannot be transmitted via structuredClone
    // This includes DOM elements, custom class instances, etc.
    if (!isPlainObject(value) && !isArray(value)) {
      return false;
    }

    // Recursively check each element in the array
    if (isArray(value)) {
      return value.every((item) => this.isStructuredCloneable(item));
    }

    // Recursively check each property in the object
    if (isPlainObject(value)) {
      return Object.values(value).every((item) => this.isStructuredCloneable(item));
    }

    return false;
  }

  /**
   * Applies transformation rules to specific paths within a value.
   * This is used when explicit rules are provided in the options.
   *
   * @param value - The value to transform according to rules
   * @param rules - An array of rules to apply
   * @param context - The context for creating references
   * @returns A SchemaEntity representation of the transformed value
   */
  private iterateRules(value: any, rules: TokenRule[], context: TokenContext): SchemaEntity {
    // First convert the entire value to a structured format
    let schema: SchemaEntity = this.toStructured(value);
    schema;
    let index = 0;
    let rule = rules[index];

    // Process each rule sequentially
    while (rule) {
      const { type, paths } = rule;

      // Apply the current rule to each specified path
      for (const path of paths) {
        const descendantPath = getDescendantPath(path);
        iteratePath(schema, descendantPath, (object, key, isLast) => {
          if (isLast) {
            const current = object.value;
            const value = current[key];

            // If this is the last key in the path, apply the rule transformation
            // The value obtained here is a SchemaValueData because this value should have been structured by toStructured at the upper level
            const data = isTokenValue(value) ? value.value : value;
            current[key] = this.parseRule(data, type, context);
          } else {
            // If this is an intermediate key in the path, ensure it's structured properly
            // This prepares the object structure for the final transformation
            if (isTokenStructured(object)) {
              // @ts-expect-error
              const structured = this.toStructured(object.value[key]);
              // @ts-expect-error
              object.value[key] = structured;
              return structured;
            } else {
              const structured = this.toStructured(object[key]);
              object[key] = structured;

              return structured;
            }
          }
        });
      }

      // Move to the next rule
      rule = rules[++index];
    }
    return schema;
  }

  /**
   * Applies a specific transformation rule to a value.
   *
   * @param value - The value to transform
   * @param type - The type of transformation to apply
   * @param context - The context for creating references
   * @returns A SchemaEntity representation of the transformed value
   */
  private parseRule(value: any, type: TokenRule['type'], context: TokenContext): SchemaEntity {
    switch (type) {
      case 'callback': {
        // Convert value to a callable remote reference
        return this.toSchemaCallback(value, context);
      }

      case 'ref': {
        // Convert value to a remote reference
        return this.toSchemaRef(value, context);
      }

      /**
       * If rule.type is 'array' or 'map', convert value to structured data.
       * This forces the interpretation of the value as the specified type.
       */
      case 'map': {
        // Force interpret as a map/object
        return this.toStructured(value, 'map');
      }
      case 'array': {
        // Force interpret as an array
        return this.toStructured(value, 'array');
      }
    }

    // If type doesn't match any known rule, fall back to treating as data
    return this.toSchemaData(value);
  }

  /**
   * Converts a value to a structured format (array or map).
   * This is used to prepare composite values for further processing.
   *
   * @param value - The value to structure
   * @param type - Optional type to force (array or map)
   * @returns A TokenStructured representation of the value
   */
  private toStructured(value: any, type?: 'map' | 'array'): TokenStructured {
    // If already structured, return as is
    if (isTokenStructured(value)) {
      return value;
    }

    // If it's a token value, unwrap and structure the inner value
    if (isTokenValue(value)) {
      return this.toStructured(value.value);
    }

    // Force array type or handle array values
    if (Array.isArray(value) || type === 'array') {
      return createTokenStructured({
        type: 'array',
        value: value.map((item: any) => this.toSchemaData(item)),
      });
    }

    // Default to map/object type
    return createTokenStructured({
      type: 'map',
      value: fromEntries(entries(value).map(([k, v]) => [k, this.toSchemaData(v)])),
    });
  }

  /**
   * Converts a function to a callback schema.
   * This allows functions to be called remotely across environments.
   *
   * @param value - The function to convert
   * @param context - The context for creating references
   * @returns A SchemaValueCallback representation of the function
   */
  private toSchemaCallback(value: Function, context: TokenContext): SchemaValueCallback {
    return {
      type: 'callback',
      source: context.name,
      ref: context.createRefId({
        type: 'callback',
        value,
      }),
    };
  }

  /**
   * Converts a value to a reference schema.
   * This allows complex objects to be referenced remotely across environments.
   *
   * @param value - The value to convert to a reference
   * @param context - The context for creating references
   * @returns A SchemaValueRef representation of the value
   */
  private toSchemaRef(value: unknown, context: TokenContext): SchemaValueRef {
    return {
      type: 'ref',
      source: context.name,
      ref: context.createRefId({
        type: 'ref',
        value,
      }),
    };
  }

  /**
   * Converts a value to a data schema.
   * This is used for values that can be directly transmitted.
   *
   * @param value - The value to convert
   * @returns A SchemaValueData representation of the value
   */
  private toSchemaData(value: any): SchemaValueData {
    // If already a token value, return as is
    if (isTokenValue(value)) {
      return value;
    }

    // Create a new token value
    return createTokenValue({
      type: 'data',
      value,
    });
  }
}

/**
 * Checks if a value is a Token instance.
 *
 * @param value - The value to check
 * @returns True if the value is a Token instance
 */
export function isToken(value: unknown): value is Token {
  return value instanceof Token;
}

/**
 * Traverses a path within an object and applies a callback to each segment.
 * Used to navigate nested objects when applying transformation rules.
 *
 * @param obj - The object to traverse
 * @param path - The path string using dot notation
 * @param callback - Function to call for each path segment
 */
function iteratePath(obj: any, path: string, callback: (object: any, key: string, isLast: boolean) => any): void {
  let current = obj;

  if (!path) {
    return;
  }

  const keys = path.split('.');

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    current = callback(current, key, i === keys.length - 1);
  }
}
