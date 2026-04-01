import { cookies } from 'next/headers';
import type { User } from './types';

export interface Session {
  user: User;
  token: string;
  expiresAt: number;
}

/**
 * Get the current server session from cookies
 * Returns null if no valid session exists
 */
export async function getServerSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    return null;
  }

  try {
    // Parse the session data from the cookie
    const session: Session = JSON.parse(sessionCookie.value);

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      return null;
    }

    return session;
  } catch (error) {
    console.error('Failed to parse session:', error);
    return null;
  }
}

/**
 * Create a new session and set the session cookie
 */
export async function createSession(user: User, token: string): Promise<void> {
  const cookieStore = await cookies();
  
  // Session expires in 7 days
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  
  const session: Session = {
    user,
    token,
    expiresAt,
  };

  cookieStore.set('session', JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(expiresAt),
    path: '/',
  });
}

/**
 * Clear the current session
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

/**
 * Get the current user from the session
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getServerSession();
  return session?.user || null;
}
