import { Account, Client, ID, OAuthProvider } from 'appwrite';

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
  const successUrl = `${window.location.origin}/chat?provider=oauth`;
  const failureUrl = `${window.location.origin}/login`;
  return account.createOAuth2Session(OAuthProvider.Google, successUrl, failureUrl);
}

export async function logoutFromAppwrite() {
  return clearActiveAppwriteSession();
}