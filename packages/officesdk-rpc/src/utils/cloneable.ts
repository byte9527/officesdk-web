import { isNumber, isString, isBoolean, isUndefined } from './type';
/**
 * Data types that can be transferred via serialization or structureClone,
 * can be understood as a superset of JSON with an additional undefined type.
 * These data types don't require rules for conversion.
 */
export type Cloneable = string | number | boolean | null | undefined | Cloneable[] | { [key: string]: Cloneable };

/**
 * Checks if value is a primitive value that can be safely transferred via postMessage
 *
 * @param {*} value The value to check
 * @returns {boolean} Returns true if value is a primitive value, else false
 */
export function isSimpleValue(value: unknown): value is string | number | boolean | null | undefined {
  return value === null || isNumber(value) || isString(value) || isBoolean(value) || isUndefined(value);
}
