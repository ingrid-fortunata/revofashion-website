import Cookies from "js-cookie";

/**
 * CLIENT-SIDE cookie utilities.
 *
 * For reading auth token inside Server Components, Route Handlers, or Server Actions,
 * use `getServerToken()` from `@/lib/cookies.server` instead.
 */

export const TOKEN_COOKIE_KEY = "revofashion_token";
export const USER_ROLE_COOKIE_KEY = "revofashion_role";

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

/**
 * Retrieve the user role from cookies.
 * Safe to call on both client and server (returns null on server).
 */
export function getUserRole(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return Cookies.get(USER_ROLE_COOKIE_KEY) || null;
}

/**
 * Store the user role in cookies.
 * Client-only safe guard.
 */
export function setUserRole(role: string): void {
  if (typeof window === "undefined") {
    return;
  }
  Cookies.set(USER_ROLE_COOKIE_KEY, role, DEFAULT_COOKIE_OPTIONS);
}

/**
 * Remove the user role from cookies.
 * Client-only safe guard.
 */
export function removeUserRole(): void {
  if (typeof window === "undefined") {
    return;
  }
  Cookies.remove(USER_ROLE_COOKIE_KEY, { path: "/" });
}
