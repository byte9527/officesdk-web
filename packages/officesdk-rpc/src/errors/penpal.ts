/**
 * Export all errors from the penpal package,
 * penpal errors should only use inside this package.
 */

import { PenpalError, ErrorCode } from 'penpal';

export type { PenpalError };

export function isPenpalError(error: unknown): error is PenpalError {
  return error instanceof PenpalError;
}

/**
 * Type for PenpalError with code ConnectionDestroyed.
 * @see isPenpalConnectionDestroyedError
 */
export type PenpalConnectionDestroyedError = PenpalError & {
  code: typeof ErrorCode.ConnectionDestroyed;
};

/**
 * Check if the error is a PenpalError with code ConnectionDestroyed.
 * @param error unknown error object
 * @returns boolean
 */
export function isPenpalConnectionDestroyedError(error: unknown): error is PenpalConnectionDestroyedError {
  return isPenpalError(error) && error.code === ErrorCode.ConnectionDestroyed;
}

/**
 * Type for PenpalError with code ConnectionTimeout.
 * @see isPenpalConnectionTimeoutError
 */
export type PenpalConnectionTimeoutError = PenpalError & {
  code: typeof ErrorCode.ConnectionTimeout;
};

/**
 * Check if the error is a PenpalError with code ConnectionTimeout.
 * @param error unknown error object
 * @returns boolean
 */
export function isPenpalConnectionTimeoutError(error: unknown): error is PenpalConnectionTimeoutError {
  return isPenpalError(error) && error.code === ErrorCode.ConnectionTimeout;
}

/**
 * Type for PenpalError with code InvalidArgument.
 * @see isPenpalInvalidArgumentError
 */
export type PenpalInvalidArgumentError = PenpalError & {
  code: typeof ErrorCode.InvalidArgument;
};

/**
 * Check if the error is a PenpalError with code InvalidArgument.
 * @param error unknown error object
 * @returns boolean
 */
export function isPenpalInvalidArgumentError(error: unknown): error is PenpalInvalidArgumentError {
  return isPenpalError(error) && error.code === ErrorCode.InvalidArgument;
}

/**
 * Type for PenpalError with code MethodCallTimeout.
 * @see isPenpalMethodCallTimeoutError
 */
export type PenpalMethodCallTimeoutError = PenpalError & {
  code: typeof ErrorCode.MethodCallTimeout;
};

/**
 * Check if the error is a PenpalError with code MethodCallTimeout.
 * @param error unknown error object
 * @returns boolean
 */
export function isPenpalMethodCallTimeoutError(error: unknown): error is PenpalMethodCallTimeoutError {
  return isPenpalError(error) && error.code === ErrorCode.MethodCallTimeout;
}

/**
 * Type for PenpalError with code MethodNotFound.
 * @see isPenpalMethodNotFoundError
 */
export type PenpalMethodNotFoundError = PenpalError & {
  code: typeof ErrorCode.MethodNotFound;
};

/**
 * Check if the error is a PenpalError with code MethodNotFound.
 * @param error unknown error object
 * @returns boolean
 */
export function isPenpalMethodNotFoundError(error: unknown): error is PenpalMethodNotFoundError {
  return isPenpalError(error) && error.code === ErrorCode.MethodNotFound;
}

/**
 * Type for PenpalError with code TransmissionFailed.
 * @see isPenpalTransmissionFailedError
 */
export type PenpalTransmissionFailedError = PenpalError & {
  code: typeof ErrorCode.TransmissionFailed;
};

/**
 * Check if the error is a PenpalError with code TransmissionFailed.
 * @param error unknown error object
 * @returns boolean
 */
export function isPenpalTransmissionFailedError(error: unknown): error is PenpalTransmissionFailedError {
  return isPenpalError(error) && error.code === ErrorCode.TransmissionFailed;
}
