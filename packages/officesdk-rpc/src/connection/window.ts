import { throwClientNotAccessible } from '../errors/server';

/**
 * Get parent window,
 * when current window is loaded in iframe,
 * this function will return parent window,
 * otherwise throw a ServerClientNotAccessible error.
 * @returns
 */
export function getParentWindowOrThrow(): Window {
  try {
    if (window.parent === window) {
      throwClientNotAccessible('Parent window not found.');
    }
    return window.parent;
  } catch (error) {
    throwClientNotAccessible('Parent window is not accessible.');
  }
}
