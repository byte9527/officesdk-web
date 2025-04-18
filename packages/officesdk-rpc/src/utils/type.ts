/**
 * Gets the `toString` tag of value
 *
 * @param {*} value The value to query
 * @returns {string} Returns the `toString` tag
 */
function getTag(value: unknown): string {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  return Object.prototype.toString.call(value);
}

/**
 * Checks if value is a number
 *
 * @param {*} value The value to check
 * @returns {boolean} Returns true if value is a number, else false
 */
export function isNumber(value: unknown): value is number {
  return getTag(value) === '[object Number]';
}

/**
 * Checks if value is a string
 *
 * @param {*} value The value to check
 * @returns {boolean} Returns true if value is a string, else false
 */
export function isString(value: unknown): value is string {
  return getTag(value) === '[object String]';
}

/**
 * Checks if value is a boolean
 *
 * @param {*} value The value to check
 * @returns {boolean} Returns true if value is a boolean, else false
 */
export function isBoolean(value: unknown): value is boolean {
  return getTag(value) === '[object Boolean]';
}

/**
 * Checks if value is null
 *
 * @param {*} value The value to check
 * @returns {boolean} Returns true if value is null, else false
 */
export function isNull(value: unknown): value is null {
  return getTag(value) === '[object Null]';
}

/**
 * Checks if value is undefined
 *
 * @param {*} value The value to check
 * @returns {boolean} Returns true if value is undefined, else false
 */
export function isUndefined(value: unknown): value is undefined {
  return getTag(value) === '[object Undefined]';
}

/**
 * Checks if value is an array
 *
 * @param {*} value The value to check
 * @returns {boolean} Returns true if value is an array, else false
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Checks if value is object-like
 * @param {*} value The value to check
 * @returns {boolean} Returns true if value is object-like, else false
 */
export function isObjectLike(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

/**
 * Checks if value is a plain object
 *
 * @param {*} value The value to check
 * @returns {boolean} Returns true if value is a plain object, else false
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  // First check if it's an object
  if (!isObjectLike(value) || getTag(value) != '[object Object]') {
    return false;
  }

  // Check if it has a prototype (handling Object.create(null) case)
  const proto = Object.getPrototypeOf(value);
  if (proto === null) {
    return true;
  }

  // Check the constructor
  const Ctor = Object.hasOwnProperty.call(proto, 'constructor') && proto.constructor;

  // Check if the constructor is the Object constructor
  return (
    typeof Ctor === 'function' &&
    Ctor instanceof Ctor &&
    Function.prototype.toString.call(Ctor) === Function.prototype.toString.call(Object)
  );
}
