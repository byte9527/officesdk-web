import { isNumber, isString, isBoolean, isUndefined } from './type';
/**
 * 可通过序列化或 structureClone 进行传输的数据类型，
 * 可以理解为 JSON 的超集，多了一个 undefined 类型，
 * 这类数据也不依赖 rule 进行转换。
 */
export type Cloneable = string | number | boolean | null | undefined | Cloneable[] | { [key: string]: Cloneable };

/**
 * 检查 value 是否是原始值，这类数据应该可以安全的经过 postMessage 传输
 *
 * @param {*} value 要检查的值
 * @returns {boolean} 如果 value 是原始值，那么返回 true，否则返回 false
 */
export function isSimpleValue(value: unknown): value is string | number | boolean | null | undefined {
  return value === null || isNumber(value) || isString(value) || isBoolean(value) || isUndefined(value);
}
