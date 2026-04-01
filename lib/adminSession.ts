export type AdminUser = {
    id: string;
    email: string;
    name?: string | null;
    role: string;
};

export type AdminLoginResponse = {
    message: string;
    user: AdminUser;
    access_token: string;
    token_type: string; // usually "bearer"
};

const STORAGE_KEYS = {
    user: "adminUser",
    isAuth: "isAdminAuthenticated",
    accessToken: "adminAccessToken",
    tokenType: "adminTokenType",
} as const;

function setCookie(name: string, value: string, maxAgeSeconds = 60 * 60 * 24 * 7) {
    const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
    const secure = isHttps ? "; Secure" : "";
    // JS cannot set HttpOnly cookies; only server can.
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

export function saveAdminSession(data: AdminLoginResponse) {
    if (typeof window === "undefined") return;

    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
    localStorage.setItem(STORAGE_KEYS.isAuth, "true");
    localStorage.setItem(STORAGE_KEYS.accessToken, data.access_token);
    localStorage.setItem(STORAGE_KEYS.tokenType, data.token_type);

    // For middleware/proxy checks
    setCookie(STORAGE_KEYS.isAuth, "true");
    setCookie(STORAGE_KEYS.accessToken, data.access_token);
}

export function getAdminAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.accessToken);
}

export function clearAdminSession() {
    if (typeof window === "undefined") return;

    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.isAuth);
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.tokenType);

    // Expire cookies
    document.cookie = `${STORAGE_KEYS.isAuth}=; Path=/; Max-Age=0; SameSite=Lax`;
    document.cookie = `${STORAGE_KEYS.accessToken}=; Path=/; Max-Age=0; SameSite=Lax`;
}
