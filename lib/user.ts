export type StoredUser = {
  $id?: string;
  id?: string;
  _id?: string;
  userId?: string;
  email?: string;
};

export function getStoredUserId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawUser = localStorage.getItem('user');
    if (!rawUser || rawUser === 'undefined' || rawUser === 'null') {
      return null;
    }

    const user = JSON.parse(rawUser) as StoredUser;
    return user.$id || user.id || user._id || user.userId || user.email || null;
  } catch {
    return null;
  }
}

export function getChatHref(): string {
  const userId = getStoredUserId();
  return userId ? `/${userId}/chat` : '/login';
}