/**
 * Transportable: Cross-environment Communication Serialization
 *
 * Not all data types can be directly transmitted across different environments (like iframes or windows).
 * During transmission, complex data is represented as simple structures.
 * When the remote end receives this data, it converts it back according to protocols into values that can be called remotely.
 * When the local end receives data through callbacks, it uses protocol information to restore the original values.
 */

import type { SchemaValueCallback, SchemaValueRef, SchemaEntity } from '../core';
import { fromEntries, entries } from '../utils';
import { isToken, Token } from '../core/token';

interface TransportableLocalOptions {
  /**
   * Name to identify the source of the data
   */
  name: string;

  /**
   * Remote callback function for processing callback invocations
   */
  callback: TransportableRemoteCallback;
}

/**
 * Function type that handles remote callbacks
 * Receives a callback schema and arguments, then processes them and returns a schema or void
 */
export type TransportableRemoteCallback = (callback: SchemaValueCallback, args: any[]) => Promise<SchemaEntity | void>;

/**
 * Transportable provides serialization and deserialization of complex objects for cross-environment communication.
 *
 * It handles:
 * 1. Converting complex objects into structured schemas that can be transmitted
 * 2. Tracking references to maintain object identity
 * 3. Creating proxies for remote callbacks and references
 * 4. Parsing received schemas back into usable local objects
 */
export class Transportable {
  /** Map of reference IDs to their actual values */
  private refsMap: Map<string, any> = new Map();

  /** WeakMap to avoid generating duplicate refs for the same object */
  private valuesMap: WeakMap<any, string> = new WeakMap();

  /** Counter to generate unique reference IDs */
  private counter = 0;

  /** Function to execute remote callbacks */
  private callback: TransportableRemoteCallback;

  /** Identifier for this transportable instance */
  private name: string;

  /**
   * Creates a new Transportable instance
   *
   * @param options - Configuration for the transportable instance
   */
  constructor(options: TransportableLocalOptions) {
    this.name = options.name;
    this.callback = options.callback;
  }

  /**
   * Converts any value into a structured schema that can be transmitted
   *
   * @param schema - The value to convert (can be a Token or any value)
   * @returns A Promise resolving to a SchemaEntity representation
   */
  public createSchemaEntity(schema: unknown): Promise<SchemaEntity> {
    let token: Token;
    if (isToken(schema)) {
      token = schema;
    } else {
      token = new Token(schema);
    }

    return token.getSchemaEntity({
      name: this.name,
      createRefId: this.createRefId,
    });
  }

  /**
   * Converts a received schema entity back into a usable local value
   *
   * @param schema - The schema entity to parse
   * @returns The reconstructed value
   */
  public parseSchemaEntity(schema: SchemaEntity): any {
    switch (schema.type) {
      case 'data': {
        // Direct data can be returned as-is
        return schema.value;
      }

      case 'callback': {
        // Convert callback schemas to callable functions
        return this.parseSchemaCallback(schema);
      }

      case 'ref': {
        // Convert reference schemas to local references or proxies
        return this.parseSchemaRef(schema);
      }

      case 'array': {
        // Recursively parse each item in the array
        return schema.value.map((item) => this.parseSchemaEntity(item));
      }

      case 'map': {
        // Recursively parse each property in the object
        return fromEntries(entries(schema.value).map(([key, value]) => [key, this.parseSchemaEntity(value)]));
      }

      default: {
        // Handle unknown schema types
        // TODO: Throw custom error
        throw new Error(`Unknown schema type: ${(schema as any).type}`);
      }
    }
  }

  /**
   * Creates a function that can resolve a callback schema with arguments
   * This is used for handling callbacks from remote environments
   *
   * @param schema - The callback schema to resolve
   * @returns A function that accepts schemas and returns a promise of a schema
   */
  public resolveSchemaCallback(schema: SchemaValueCallback): (...args: any[]) => Promise<SchemaEntity> {
    const callback = this.parseSchemaCallback(schema);

    return (...schemas: SchemaEntity[]) => {
      // Parse the schema arguments
      const args = schemas.map((schema) => this.parseSchemaEntity(schema));
      // Execute the callback with the parsed arguments
      const result = callback(...args);
      // Convert the result back to a schema for transmission
      return this.createSchemaEntity(result);
    };
  }

  /**
   * Converts a callback schema into a callable function
   *
   * @param schema - The callback schema to parse
   * @returns A function that can be called locally
   */
  private parseSchemaCallback(schema: SchemaValueCallback): (...args: any[]) => Promise<SchemaEntity> {
    // If callback is from a remote source, create a proxy function
    if (schema.source !== this.name) {
      return async (...args: any[]) => {
        // Forward the call to the remote environment
        const result = await this.callback(schema, args);

        if (result) {
          // Parse the result if returned
          return this.parseSchemaEntity(result);
        }

        return result;
      };
    } else {
      // If callback is from this source, retrieve the original function
      const ref = this.refsMap.get(schema.ref);
      if (!ref) {
        // Handle invalid reference
        // TODO: Throw custom error
        throw new Error(`Invalid reference: ${schema.ref}`);
      }
      return ref.value;
    }
  }

  /**
   * Converts a reference schema into a local reference or proxy
   *
   * @param schema - The reference schema to parse
   * @returns The referenced object or a proxy
   */
  private parseSchemaRef(schema: SchemaValueRef): Record<string, never> {
    if (schema.source !== this.name) {
      // For remote references, create a restricted proxy
      // This prevents accidental direct access to remote objects
      const proxy = new Proxy(
        {},
        {
          get(target, prop) {
            throw new Error('Unexpected remote property access');
          },
          set() {
            throw new Error('Unexpected remote property assignment');
          },
        },
      );

      return proxy;
    }

    // For local references, retrieve the original object
    const ref = this.refsMap.get(schema.ref);
    if (!ref) {
      // Handle invalid reference
      // TODO: Throw custom error
      throw new Error(`Invalid reference: ${schema.ref}`);
    }
    return ref.value;
  }

  /**
   * Creates or retrieves a reference ID for a value
   * This ensures that the same object always gets the same reference ID
   *
   * @param value - The value to create a reference for
   * @returns A unique reference ID string
   */
  private createRefId = (value: any): string => {
    // Check if we already have a reference for this value
    const cachedRef = this.valuesMap.get(value);

    if (cachedRef) {
      return cachedRef;
    }

    // Generate a new reference ID
    const ref = this.generateRefId();

    // Store the reference
    this.refsMap.set(ref, value);

    // Cache the mapping between value and reference
    this.valuesMap.set(value, ref);

    return ref;
  };

  /**
   * Generates a unique reference ID
   *
   * @returns A unique reference ID string
   */
  private generateRefId() {
    return `#office-sdk-rpc@${this.counter++}`;
  }

  // TODO: Memory management
  // public revoke(ref: string) {
  //   this.refs.delete(ref);
  // }
}
