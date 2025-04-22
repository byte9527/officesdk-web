/**
 * Replaces the property value at the specified path in the object
 * and returns the original value.
 * @param obj - The object to modify
 * @param path - The property path, represented using dot notation
 * @param value - The value to set
 * @returns - The original value
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
 * Chrome below version 69 doesn't support Object.fromEntries
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
