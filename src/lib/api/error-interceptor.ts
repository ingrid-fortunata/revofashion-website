import { ApiError, ErrorInterceptor } from "@/types/api";
import { removeAuthToken } from "@/lib/cookies";
import { showToast } from "@/lib/toast";

/**
 * Normalizes any error object into strongly-typed ApiError.
 */
export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  return new ApiError(
    error instanceof Error ? error.message : "Network error occurred",
    "NETWORK_ERROR",
    0
  );
}

/**
 * Determines whether the given error represents an expired or invalid authentication session.
 */
export function isAuthSessionError(apiError: ApiError): boolean {
  return (
    apiError.status === 401 ||
    apiError.errorCode === "TOKEN_EXPIRED" ||
    apiError.errorCode === "TOKEN_INVALID" ||
    apiError.errorCode === "TOKEN_MISSING"
  );
}

/**
 * Default Error Interceptor:
 * Handles token cleanup on 401, triggers translated toast notifications, and rethrows.
 */
export const defaultErrorInterceptor: ErrorInterceptor = (error, options) => {
  const apiError = normalizeApiError(error);

  // Clear cookie token if session is expired or invalid
  if (isAuthSessionError(apiError)) {
    removeAuthToken();
  }

  // Automatically show toast in interceptor (unless explicitly skipped)
  if (!options.skipToast) {
    showToast.error(apiError);
  }

  throw apiError;
};
