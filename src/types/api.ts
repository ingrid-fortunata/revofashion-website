/**
 * Standard API error response format returned by RevoFashion Flask backend
 */
export interface ApiErrorResponse {
  error_code: string;
  message: string;
  details?: {
    json?: Record<string, string[]>;
    query?: Record<string, string[]>;
    path?: Record<string, string[]>;
  };
}

/**
 * Standard API successful data envelope
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  page?: number;
  per_page?: number;
  total?: number;
  pages?: number;
}

/**
 * Custom Error class that holds parsed API error details
 */
export class ApiError extends Error {
  errorCode: string;
  status: number;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    errorCode: string,
    status: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
    this.errorCode = errorCode;
    this.status = status;
    this.details = details;
  }
}

/**
 * Query parameters dictionary for API requests
 */
export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

/**
 * Configuration options for apiFetch requests
 */
export interface FetchOptions extends RequestInit {
  token?: string | null;
  params?: QueryParams;
  skipToast?: boolean;
}

/**
 * Interceptor types for the HTTP client pipeline
 */
export type RequestInterceptor = (
  url: string,
  options: FetchOptions
) => Promise<[string, FetchOptions]> | [string, FetchOptions];

export type ResponseInterceptor = <T>(
  response: Response,
  options: FetchOptions
) => Promise<T> | T;

export type ErrorInterceptor = (
  error: unknown,
  options: FetchOptions
) => Promise<never> | never;
