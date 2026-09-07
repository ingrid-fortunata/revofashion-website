import { ApiError, ApiErrorResponse } from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "https://revofashion-shop.onrender.com";

interface FetchOptions extends RequestInit {
  token?: string | null;
  params?: Record<string, string | number | boolean | undefined | null>;
}

/**
 * Retrieve the current JWT token from localStorage if in client environment.
 */
function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const authStorage = localStorage.getItem("revofashion_auth");
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed.state?.token || null;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Core type-safe fetch wrapper with automated JWT injection and unified error handling.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, params, headers = {}, ...restOptions } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  // Attach query params if provided
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `${url.includes("?") ? "&" : "?"}${queryString}`;
    }
  }

  const activeToken = token !== undefined ? token : getStoredToken();

  const reqHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(restOptions.body && !(restOptions.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
    ...(headers as Record<string, string>),
  };

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: reqHeaders,
    });

    // Handle 204 No Content
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
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network error occurred",
      "NETWORK_ERROR",
      0
    );
  }
}
