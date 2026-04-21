import { Account, Client, ID, OAuthProvider, Models } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export { ID };
export default client;

export async function registerWithAppwrite(name: string, email: string, password: string) {
  return account.create(ID.unique(), email, password, name);
}

export async function sendRegistrationOtp(email: string) {
  await clearActiveAppwriteSession();
  return account.createEmailToken(ID.unique(), email);
}

export async function verifyRegistrationOtp(userId: string, otp: string) {
  await clearActiveAppwriteSession();
  return account.createSession(userId, otp);
}

export async function finalizeOtpRegistration(name: string, password: string) {
  await account.updateName(name);

  try {
    await account.updatePassword(password);
  } catch (error: any) {
    const message = (error?.message || '').toLowerCase();

    // For OTP-created sessions, Appwrite can reject password update with
    // "invalid credentials" depending on prior account state. Do not block
    // registration/session completion in that case.
    if (!message.includes('invalid credentials')) {
      throw error;
    }
  }
}

export async function clearActiveAppwriteSession() {
  try {
    await account.deleteSession('current');
  } catch {
    // Ignore if there is no active session.
  }
}

export async function loginWithAppwrite(email: string, password: string) {
  await clearActiveAppwriteSession();
  return account.createEmailPasswordSession(email, password);
}

export async function loginWithGoogleAppwrite() {
  try {
    await clearActiveAppwriteSession();
    const successUrl = `${window.location.origin}/auth/oauth-callback`;
    const failureUrl = `${window.location.origin}/login?error=google_auth_failed`;
    return account.createOAuth2Session(OAuthProvider.Google, successUrl, failureUrl);
  } catch (error) {
    console.error('Google OAuth error:', error);
    throw new Error('Failed to initiate Google authentication. Please try again.');
  }
}

export async function loginWithMicrosoftAppwrite() {
  try {
    await clearActiveAppwriteSession();
    const successUrl = `${window.location.origin}/auth/oauth-callback`;
    const failureUrl = `${window.location.origin}/login?error=microsoft_auth_failed`;
    return account.createOAuth2Session(OAuthProvider.Microsoft, successUrl, failureUrl);
  } catch (error) {
    console.error('Microsoft OAuth error:', error);
    throw new Error('Failed to initiate Microsoft authentication. Please try again.');
  }
}

export async function handleOAuthCallback() {
  try {
    const user = await account.get();

    // Appwrite typings may include a string union in some contexts.
    // Ensure downstream code always receives a full user object.
    if (typeof user === 'string') {
      throw new Error('Invalid OAuth user payload returned from Appwrite.');
    }

    return user as Models.User<Models.Preferences>;
  } catch (error) {
    console.error('OAuth callback error:', error);
    throw new Error('Authentication failed. Please try logging in again.');
  }
}

export async function logoutFromAppwrite() {
  return clearActiveAppwriteSession();
}