/**
 * Utility functions for cross-window communication
 *
 * This module exports common utility functions used throughout the library.
 */

// Export object utilities
export { swap, fromEntries, entries } from './object';

// Export type checking utilities
export { isNumber, isString, isBoolean, isNull, isUndefined, isArray, isObjectLike, isPlainObject } from './type';

// Export cloneable utilities
export { isSimpleValue } from './cloneable';
export type { Cloneable } from './cloneable';

// Export random utilities
export { generateUniqueId } from './random';
