import {
  ApiError,
  ApiErrorResponse,
  FetchOptions,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from "@/types/api";
import { getAuthToken, removeAuthToken } from "@/lib/cookies";
import { showToast } from "@/lib/toast";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "https://revofashion-shop.onrender.com";

// --- 1. Built-in Request Interceptor ---
// Injects Cookie token and standard headers
const defaultRequestInterceptor: RequestInterceptor = (url, options) => {
  const { token, params, headers = {}, ...restOptions } = options;

  let finalUrl = `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;

  // Attach query params
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      finalUrl += `${finalUrl.includes("?") ? "&" : "?"}${queryString}`;
    }
  }

  // Retrieve token from Cookies if not explicitly passed
  const activeToken = token !== undefined ? token : getAuthToken();

  const reqHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(restOptions.body && !(restOptions.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
    ...(headers as Record<string, string>),
  };

  return [
    finalUrl,
    { ...restOptions, headers: reqHeaders, skipToast: options.skipToast },
  ];
};

// --- 2. Built-in Response Interceptor ---
// Validates response status and parses JSON
const defaultResponseInterceptor: ResponseInterceptor = async <T>(
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

// --- 3. Built-in Error Interceptor ---
// Handles token cleanup, automatic toast notification, and error rethrowing
const defaultErrorInterceptor: ErrorInterceptor = (error, options) => {
  let apiError: ApiError;

  if (error instanceof ApiError) {
    apiError = error;
  } else {
    apiError = new ApiError(
      error instanceof Error ? error.message : "Network error occurred",
      "NETWORK_ERROR",
      0
    );
  }

  // Clear cookie token if session is expired or invalid
  if (
    apiError.status === 401 ||
    apiError.errorCode === "TOKEN_EXPIRED" ||
    apiError.errorCode === "TOKEN_INVALID" ||
    apiError.errorCode === "TOKEN_MISSING"
  ) {
    removeAuthToken();
  }

  // Automatically catch and show toast in interceptor (unless explicitly skipped)
  if (!options.skipToast) {
    showToast.error(apiError);
  }

  throw apiError;
};

// Registered interceptor pipelines
const requestInterceptors: RequestInterceptor[] = [defaultRequestInterceptor];
const responseInterceptors: ResponseInterceptor[] = [defaultResponseInterceptor];
const errorInterceptors: ErrorInterceptor[] = [defaultErrorInterceptor];

/**
 * Interceptors registry for extending request/response/error handling.
 */
export const interceptors = {
  request: {
    use: (fn: RequestInterceptor) => {
      requestInterceptors.push(fn);
    },
  },
  response: {
    use: (onSuccess?: ResponseInterceptor, onError?: ErrorInterceptor) => {
      if (onSuccess) responseInterceptors.push(onSuccess);
      if (onError) errorInterceptors.push(onError);
    },
  },
};

/**
 * Core type-safe HTTP client with Request and Response/Error Interceptors.
 * - Injects token from Cookies automatically into headers
 * - Catches all endpoint errors in interceptor and displays translated toast
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  let currentUrl = endpoint;
  let currentOptions = options;

  try {
    // Execute Request Interceptors
    for (const interceptor of requestInterceptors) {
      [currentUrl, currentOptions] = await interceptor(currentUrl, currentOptions);
    }

    const response = await fetch(currentUrl, currentOptions);

    // Execute Response Interceptors
    let result: unknown = response;
    for (const interceptor of responseInterceptors) {
      result = await interceptor(response, currentOptions);
    }

    return result as T;
  } catch (error) {
    // Execute Error Interceptors
    let finalError = error;
    for (const interceptor of errorInterceptors) {
      try {
        await interceptor(finalError, currentOptions);
      } catch (interceptedErr) {
        finalError = interceptedErr;
      }
    }
    throw finalError;
  }
}

// Re-export types for consumer convenience
export type {
  FetchOptions,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
};
