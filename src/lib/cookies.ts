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
 */
export function getAuthToken(): string | null {
  return Cookies.get(TOKEN_COOKIE_KEY) || null;
}

/**
 * Store the JWT token in cookies.
 */
export function setAuthToken(token: string): void {
  Cookies.set(TOKEN_COOKIE_KEY, token, DEFAULT_COOKIE_OPTIONS);
}

/**
 * Remove the JWT token from cookies.
 */
export function removeAuthToken(): void {
  Cookies.remove(TOKEN_COOKIE_KEY, { path: "/" });
}
