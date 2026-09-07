import { ApiError, ApiErrorResponse, FetchOptions, ResponseInterceptor } from "@/types/api";

/**
 * Default Response Interceptor:
 * Validates response status and parses JSON envelopes.
 */
export const defaultResponseInterceptor: ResponseInterceptor = async <T>(
  response: Response,
  _options: FetchOptions
): Promise<T> => {
  if (response.status === 204) {
    return null as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorData = data as ApiErrorResponse | null;
    const message =
      errorData?.message ||
      `Request failed with status ${response.status} ${response.statusText}`;
    const errorCode = errorData?.error_code || "HTTP_ERROR";
    const details = errorData?.details;

    throw new ApiError(message, errorCode, response.status, details);
  }

  return data as T;
};
