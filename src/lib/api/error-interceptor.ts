import { ApiError, ErrorInterceptor } from "@/types/api";
import { removeAuthToken } from "@/lib/cookies";
import { showToast } from "@/lib/toast";
import { translateApiError } from "@/lib/api/error-codes";

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
 * - Translates backend error codes into human-friendly messages on both Server and Client.
 * - Handles token cleanup on 401.
 * - Triggers translated toast notifications in browser.
 * - Rethrows the enriched ApiError.
 */
export const defaultErrorInterceptor: ErrorInterceptor = (error, options) => {
  const apiError = normalizeApiError(error);

  // Interpret and translate backend error code centrally for both SSR and CSR
  const { title, description } = translateApiError(apiError);
  apiError.message = `${title}: ${description}`;

  // Clear cookie token if session is expired or invalid (safe on client)
  if (isAuthSessionError(apiError)) {
    removeAuthToken();
  }

  // Automatically show toast in interceptor when running in browser
  if (!options.skipToast && typeof window !== "undefined") {
    showToast.error(apiError);
  }

  throw apiError;
};
