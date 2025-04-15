/**
 * 可通过序列化或 structureClone 进行传输的数据类型，
 * 可以理解为 JSON 的超集，多了一个 undefined 类型，
 * 这类数据也不依赖 rule 进行转换。
 */
export type Cloneable = string | number | boolean | null | undefined | Cloneable[] | { [key: string]: Cloneable };
