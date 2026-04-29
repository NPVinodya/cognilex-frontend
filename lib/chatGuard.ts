import { cookies } from 'next/headers';

/**
 * Verify that the visiting user has a valid auth session.
 *
 * Strategy: trust the `isAuthenticated` / `accessToken` cookies that the
 * login page sets, exactly the same way the proxy layer does.  We avoid
 * making a live Appwrite API call here because the server-side Appwrite
 * client does not have the user's session cookies in scope, which would
 * always return null and cause an infinite redirect loop.
 *
 * Returns the urlUserId (truthy) when auth cookies are present, or null
 * when the user is not authenticated.
 */
export async function verifyUserAccess(urlUserId: string): Promise<string | null> {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get('access_token')?.value ??   // HttpOnly cookie set by some flows
    cookieStore.get('accessToken')?.value ??    // Cookie set by login page
    null;

  const isAuthenticated = cookieStore.get('isAuthenticated')?.value === 'true';

  if (!accessToken && !isAuthenticated) return null;

  // We trust the cookie — return the userId from the URL so the page renders
  return urlUserId;
}
