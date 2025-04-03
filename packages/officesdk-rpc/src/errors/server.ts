/**
 * Throws when parent window is not accessible or not found.
 * The parent window which loaded the current window we take as client.
 * The current window which runs the office editor we take as server.
 */
class ClientNotAccessible extends Error {
  static readonly errorName = 'ServerClientNotAccessible';

  constructor(public message: string) {
    super(message);
    this.name = ClientNotAccessible.errorName;
  }
}

export function throwClientNotAccessible(message: string): never {
  throw new ClientNotAccessible(message);
}

/**
 * Check if the error is a ClientNotAccessible error.
 * @param error - The error to check.
 * @returns True if the error is a ClientNotAccessible error, false otherwise.
 */
export function isClientNotAccessible(error: unknown): error is ClientNotAccessible {
  return error instanceof Error && error.name === ClientNotAccessible.errorName;
}
