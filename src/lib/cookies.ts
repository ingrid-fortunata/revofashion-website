import Cookies from "js-cookie";

export const TOKEN_COOKIE_KEY = "revofashion_token";

const DEFAULT_COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 1, // 1 day
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

/**
 * Retrieve the JWT token from cookies.
 * Safe to call on both client and server (returns null on server).
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return Cookies.get(TOKEN_COOKIE_KEY) || null;
}

/**
 * Store the JWT token in cookies.
 * Client-only safe guard.
 */
export function setAuthToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }
  Cookies.set(TOKEN_COOKIE_KEY, token, DEFAULT_COOKIE_OPTIONS);
}

/**
 * Remove the JWT token from cookies.
 * Client-only safe guard.
 */
export function removeAuthToken(): void {
  if (typeof window === "undefined") {
    return;
  }
  Cookies.remove(TOKEN_COOKIE_KEY, { path: "/" });
}
