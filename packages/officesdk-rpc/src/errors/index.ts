/**
 * Error handling for the Office SDK RPC Library
 *
 * Provides error types and utilities for handling errors in cross-window communication.
 */

// Export Penpal related errors
export {
  isPenpalError,
  isPenpalConnectionDestroyedError,
  isPenpalConnectionTimeoutError,
  isPenpalInvalidArgumentError,
  isPenpalMethodCallTimeoutError,
  isPenpalMethodNotFoundError,
  isPenpalTransmissionFailedError,
} from './penpal';
export type {
  PenpalError,
  PenpalConnectionDestroyedError,
  PenpalConnectionTimeoutError,
  PenpalInvalidArgumentError,
  PenpalMethodCallTimeoutError,
  PenpalMethodNotFoundError,
  PenpalTransmissionFailedError,
} from './penpal';

// Export server related errors
export { throwClientNotAccessible, isClientNotAccessible, ClientNotAccessible } from './server';
