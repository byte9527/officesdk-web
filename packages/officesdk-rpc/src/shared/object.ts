/**
 * 将对象的 path 上的属性值替换为指定值，
 * 并返回原来的值。
 * @param obj - 要替换的对象
 * @param path - 属性路径，使用点分隔符表示
 * @param value - 要替换的值
 * @returns - 原来的值
 */
export function swap(obj: any, path: string, value: any): any {
  let current = obj;

  const keys = path.split('.');

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current = current[key];
  }

  const lastKey = keys[keys.length - 1];
  const originalValue = current[lastKey];
  current[lastKey] = value;

  return originalValue;
}

/**
 * 遍历对象的 path 路径，
 * 并对路径上的每个节点调用 callback 函数。
 * @param obj - 要遍历的对象
 * @param path - 属性路径，使用点分隔符表示
 * @param callback - 回调函数，会对路径上的每个节点调用
 */
export function iteratePath(
  obj: any,
  path: string,
  callback: (value: any, object: any, key: string, isLast: boolean) => void,
): void {
  let current = obj;

  if (!path) {
    return;
  }

  const keys = path.split('.');

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = current[key];
    callback(value, current, key, i === keys.length - 1);
    current = value;
  }
}

/**
 * chrome 69以下不支持object.fromEntries
 * @param entries
 * @returns
 */
export const fromEntries =
  Object.fromEntries ??
  (<T>(entries: IterableIterator<[string, T]>): Record<string, T> => {
    const object: Record<string, T> = {};
    for (const [key, val] of Array.from(entries)) {
      object[key] = val;
    }
    return object;
  });

export const entries =
  Object.entries ??
  ((obj: {}): [string, any][] => {
    const result: [string, any][] = [];
    for (const [key, val] of Object.entries(obj)) {
      result.push([key, val]);
    }
    return result;
  });
