/**
 * Office SDK Cross-Window Communication Schema
 *
 * This file defines the schema types used for serializing data between different execution environments
 * (windows or iframes). These schemas provide a structured representation of various data types
 * that can be safely transmitted across window boundaries using postMessage.
 *
 * The schema system supports:
 * 1. Primitive values - Direct transmission of simple data (via SchemaValueData)
 * 2. Functions - Conversion to callback references that can be invoked remotely (via SchemaValueCallback)
 * 3. Complex objects - Conversion to references that maintain identity across environments (via SchemaValueRef)
 * 4. Composite structures - Support for arrays and object maps with nested schemas (via SchemaStructured)
 *
 * This schema system works with the token, transportable, client, and server components to enable
 * seamless cross-window communication with support for complex data structures and function references.
 */

/**
 * Represents a function that can be called across window boundaries
 *
 * When a function is passed between environments, it's converted to this schema.
 * The receiving environment can invoke the original function in its source environment
 * by using the reference information.
 */
export type SchemaValueCallback = {
  /** Identifies this schema as a callback */
  type: 'callback';
  /** The environment where the callback function is defined (e.g., 'client' or 'server') */
  source: string;
  /** A unique reference ID to identify the specific function in the source environment */
  ref: string;
};

/**
 * Represents an object reference that maintains identity across window boundaries
 *
 * When a complex object that can't be directly serialized is passed between environments,
 * it's converted to this schema. The receiving environment can use this reference when
 * needed, but cannot directly access the object's properties.
 */
export type SchemaValueRef = {
  /** Identifies this schema as a reference */
  type: 'ref';
  /** The environment where the referenced object exists (e.g., 'client' or 'server') */
  source: string;
  /** A unique reference ID to identify the specific object in the source environment */
  ref: string;
};

/**
 * Represents data that can be directly transmitted across window boundaries
 *
 * This includes primitives (number, string, boolean, null, undefined) and
 * objects/arrays that can be safely serialized/deserialized using structuredClone.
 */
export type SchemaValueData = {
  /** Identifies this schema as direct data */
  type: 'data';
  /** The actual data value to be transmitted */
  value: any;
};

/**
 * Union type of all possible schema value types
 *
 * This represents any individual value that can be transmitted, whether it's
 * direct data, a function reference, or an object reference.
 */
export type SchemaValue = SchemaValueCallback | SchemaValueRef | SchemaValueData;

/**
 * Represents an array of schema entities
 *
 * Used when an array contains elements that need special handling,
 * such as functions or complex objects that can't be directly serialized.
 */
export type SchemaStructuredArray = {
  /** Identifies this schema as an array structure */
  type: 'array';
  /** Array of nested schema entities representing each element */
  value: Array<SchemaEntity>;
};

/**
 * Represents an object map of schema entities
 *
 * Used when an object contains properties that need special handling,
 * such as functions or complex objects that can't be directly serialized.
 */
export type SchemaStructuredMap = {
  /** Identifies this schema as a map/object structure */
  type: 'map';
  /** Object with property names mapped to their schema entity representations */
  value: {
    [key: string]: SchemaEntity;
  };
};

/**
 * Union type of structured schema types (arrays and maps)
 *
 * This represents composite data structures that can contain multiple
 * schema entities as elements or properties.
 */
export type SchemaStructured = SchemaStructuredArray | SchemaStructuredMap;

/**
 * The root schema type that represents any transmissible entity
 *
 * This union type encompasses all possible schema types, whether they are
 * individual values or composite structures. Any data being transmitted
 * across window boundaries is ultimately converted to this type.
 */
export type SchemaEntity = SchemaValue | SchemaStructured;
