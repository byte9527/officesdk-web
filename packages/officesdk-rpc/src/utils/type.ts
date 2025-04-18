/**
 * 获取 value 的 `toString` 标签
 *
 * @param {*} value 要查询的值
 * @returns {string} 返回 `toString` 标签
 */
function getTag(value: unknown): string {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  return Object.prototype.toString.call(value);
}

/**
 * 检查 value 是否是数字
 *
 * @param {*} value 要检查的值
 * @returns {boolean} 如果 value 是数字，那么返回 true，否则返回 false
 */
export function isNumber(value: unknown): value is number {
  return getTag(value) === '[object Number]';
}

/**
 * 检查 value 是否是字符串
 *
 * @param {*} value 要检查的值
 * @returns {boolean} 如果 value 是字符串，那么返回 true，否则返回 false
 */
export function isString(value: unknown): value is string {
  return getTag(value) === '[object String]';
}

/**
 * 检查 value 是否是布尔值
 *
 * @param {*} value 要检查的值
 * @returns {boolean} 如果 value 是布尔值，那么返回 true，否则返回 false
 */
export function isBoolean(value: unknown): value is boolean {
  return getTag(value) === '[object Boolean]';
}

/**
 * 检查 value 是否是 null
 *
 * @param {*} value 要检查的值
 * @returns {boolean} 如果 value 是 null，那么返回 true，否则返回 false
 */
export function isNull(value: unknown): value is null {
  return getTag(value) === '[object Null]';
}

/**
 * 检查 value 是否是 undefined
 *
 * @param {*} value 要检查的值
 * @returns {boolean} 如果 value 是 undefined，那么返回 true，否则返回 false
 */
export function isUndefined(value: unknown): value is undefined {
  return getTag(value) === '[object Undefined]';
}

/**
 * 检查 value 是否是数组
 *
 * @param {*} value 要检查的值
 * @returns {boolean} 如果 value 是数组，那么返回 true，否则返回 false
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * 检查 value 是否是类对象
 * @param {*} value 要检查的值
 * @returns {boolean} 如果 value 是类对象，那么返回 true，否则返回 false
 */
export function isObjectLike(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

/**
 * 检查 value 是否是纯对象
 *
 * @param {*} value 要检查的值
 * @returns {boolean} 如果 value 是纯对象，那么返回 true，否则返回 false
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  // 首先检查是否是对象
  if (!isObjectLike(value) || getTag(value) != '[object Object]') {
    return false;
  }

  // 检查是否有原型（处理 Object.create(null) 的情况）
  const proto = Object.getPrototypeOf(value);
  if (proto === null) {
    return true;
  }

  // 检查构造函数
  const Ctor = Object.hasOwnProperty.call(proto, 'constructor') && proto.constructor;

  // 检查构造函数是否是 Object 构造函数
  return (
    typeof Ctor === 'function' &&
    Ctor instanceof Ctor &&
    Function.prototype.toString.call(Ctor) === Function.prototype.toString.call(Object)
  );
}
