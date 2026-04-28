import { cookies } from 'next/headers';
import { Client, Account } from 'appwrite';

/**
 * Verify that the currently authenticated Appwrite user matches the
 * userId in the URL. Returns the Appwrite user ID on success, or null
 * if the session is missing / belongs to a different user.
 */
export async function verifyUserAccess(urlUserId: string): Promise<string | null> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('accessToken')?.value;

  if (!jwt) return null;

  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(jwt);

    const account = new Account(client);
    const user = await account.get();

    // Only allow access when the URL userId exactly matches the Appwrite $id
    if (user.$id !== urlUserId) return null;

    return user.$id;
  } catch {
    return null;
  }
}
