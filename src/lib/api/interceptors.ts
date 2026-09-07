import {
  FetchOptions,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from "@/types/api";
import { defaultRequestInterceptor } from "./request-interceptor";
import { defaultResponseInterceptor } from "./response-interceptor";
import { defaultErrorInterceptor } from "./error-interceptor";

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
 * Runs all registered request interceptors in sequence.
 */
export async function runRequestInterceptors(
  endpoint: string,
  options: FetchOptions
): Promise<[string, FetchOptions]> {
  let currentUrl = endpoint;
  let currentOptions = options;

  for (const interceptor of requestInterceptors) {
    [currentUrl, currentOptions] = await interceptor(currentUrl, currentOptions);
  }

  return [currentUrl, currentOptions];
}

/**
 * Runs all registered response interceptors in sequence.
 */
export async function runResponseInterceptors<T>(
  response: Response,
  options: FetchOptions
): Promise<T> {
  let result: unknown = response;

  for (const interceptor of responseInterceptors) {
    result = await interceptor(response, options);
  }

  return result as T;
}

/**
 * Runs all registered error interceptors in sequence.
 */
export async function runErrorInterceptors(
  error: unknown,
  options: FetchOptions
): Promise<never> {
  let finalError = error;

  for (const interceptor of errorInterceptors) {
    try {
      await interceptor(finalError, options);
    } catch (interceptedErr) {
      finalError = interceptedErr;
    }
  }

  throw finalError;
}
