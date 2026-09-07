import { FetchOptions } from "@/types/api";
import {
  interceptors,
  runRequestInterceptors,
  runResponseInterceptors,
  runErrorInterceptors,
} from "./interceptors";

/**
 * Core type-safe HTTP client with Request and Response/Error Interceptors.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  let activeOptions = options;
  try {
    const [finalUrl, finalOptions] = await runRequestInterceptors(endpoint, options);
    activeOptions = finalOptions;
    const response = await fetch(finalUrl, finalOptions);
    return await runResponseInterceptors<T>(response, finalOptions);
  } catch (error) {
    return await runErrorInterceptors(error, activeOptions);
  }
}

/**
 * Helper to serialize payload body into JSON if not FormData.
 */
function serializeBody(body: unknown): BodyInit | undefined {
  if (body === undefined) return undefined;
  if (body instanceof FormData) return body;
  return JSON.stringify(body);
}

/**
 * Convenient HTTP verb helper wrapper over apiFetch.
 */
export const client = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: serializeBody(body),
    }),

  put: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: serializeBody(body),
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: serializeBody(body),
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};

// Re-export interceptors registry & types
export { interceptors };
export type {
  FetchOptions,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from "@/types/api";
