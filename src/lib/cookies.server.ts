import { cookies } from "next/headers";
import { TOKEN_COOKIE_KEY } from "./cookies";

/**
 * Reads the JWT auth token from the incoming request's cookies.
 *
 * SERVER-ONLY — safe to call from:
 *   - Server Components (async components, page.tsx, layout.tsx)
 *   - Route Handlers (app/api/**)
 *   - Server Actions
 *
 * For client-side token access, use `getAuthToken()` from `@/lib/cookies`.
 */
export async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_KEY)?.value ?? null;
}
