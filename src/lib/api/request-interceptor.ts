import { RequestInterceptor } from "@/types/api";
import { getAuthToken } from "@/lib/cookies";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "https://revofashion-shop.onrender.com";

/**
 * Builds full URL with serialized query parameters.
 */
export function buildRequestUrl(url: string, params?: Record<string, unknown>): string {
  let finalUrl = `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;

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

  return finalUrl;
}

/**
 * Prepares HTTP request headers with JSON content-type and Cookie auth token.
 */
export function buildRequestHeaders(
  body: unknown,
  explicitToken?: string | null,
  customHeaders: HeadersInit = {}
): Record<string, string> {
  const activeToken = explicitToken !== undefined ? explicitToken : getAuthToken();

  return {
    Accept: "application/json",
    ...(body && !(body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
    ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
    ...(customHeaders as Record<string, string>),
  };
}

/**
 * Default Request Interceptor:
 * Injects Cookie token and standard headers, and formats endpoint URL.
 */
export const defaultRequestInterceptor: RequestInterceptor = (url, options) => {
  const { token, params, headers = {}, ...restOptions } = options;

  const finalUrl = buildRequestUrl(url, params);
  const reqHeaders = buildRequestHeaders(restOptions.body, token, headers);

  return [
    finalUrl,
    { ...restOptions, headers: reqHeaders, skipToast: options.skipToast },
  ];
};
