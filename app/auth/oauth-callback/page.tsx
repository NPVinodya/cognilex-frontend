'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleOAuthCallback, account } from '@/lib/appwrite';
import { API_BASE_URL } from '@/lib/constants';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const processOAuth = async () => {
      try {
        // Get the authenticated session
        const appwriteUser = await handleOAuthCallback();

        if (!appwriteUser) {
          throw new Error('Failed to authenticate user');
        }

        // Try to fetch additional user data from MongoDB
        let mongoUser: any = null;
        try {
          const response = await fetch(`${API_BASE_URL}/user/${encodeURIComponent(appwriteUser.email)}`);
          if (response.ok) {
            mongoUser = await response.json();
          }
        } catch (mongoError) {
          console.warn('Failed to fetch MongoDB user data, using Appwrite data only', mongoError);
        }

        // If user doesn't exist in MongoDB, create them
        if (!mongoUser) {
          try {
            const createResponse = await fetch(`${API_BASE_URL}/register-oauth`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                appwrite_id: appwriteUser.$id,
                email: appwriteUser.email,
                name: appwriteUser.name || appwriteUser.email,
              }),
            });

            if (createResponse.ok) {
              const newUserData = await createResponse.json();
              mongoUser = newUserData?.user;
            }
          } catch (createError) {
            console.warn('Failed to create user in MongoDB', createError);
          }
        }

        // Merge user data
        const mergedUser = {
          $id: appwriteUser.$id,
          email: appwriteUser.email,
          name: appwriteUser.name || appwriteUser.email,
          ...mongoUser,
          role: mongoUser?.role || 'user',
          userrole: (mongoUser?.role || 'user').toLowerCase(),
          avatar_url: mongoUser?.avatar_url,
          preferences: mongoUser?.preferences || { appearance: 'Dark Mode', language: 'English (US)' },
        };

        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(mergedUser));
        localStorage.setItem('isAuthenticated', 'true');

        // Try to create and store JWT
        try {
          const jwt = await account.createJWT();
          localStorage.setItem('accessToken', jwt.jwt);
          localStorage.setItem('tokenType', 'Bearer');

          // Set cookies
          const secure = window.location.protocol === 'https:' ? '; Secure' : '';
          document.cookie = `isAuthenticated=true; Path=/; Max-Age=604800; SameSite=Lax${secure}`;
          document.cookie = `accessToken=${encodeURIComponent(jwt.jwt)}; Path=/; Max-Age=604800; SameSite=Lax${secure}`;
        } catch (jwtError) {
          console.warn('JWT creation failed, proceeding with session', jwtError);
        }

        // Redirect to dashboard
        router.push('/chat');
      } catch (err: any) {
        const message = err?.message || 'OAuth authentication failed. Redirecting to login...';
        console.error('OAuth callback error:', err);
        setError(message);

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login?error=oauth_failed');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    processOAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-slate-900 font-bold mb-2">Authentication Error</p>
          <p className="text-slate-600 text-sm mb-6">{error}</p>
          <p className="text-slate-500 text-xs">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return null;
}

