"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Scale, ArrowLeft, UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import Link from 'next/link';
import { account, clearActiveAppwriteSession, finalizeOtpRegistration, sendRegistrationOtp, verifyRegistrationOtp, loginWithGoogleAppwrite, loginWithMicrosoftAppwrite } from "@/lib/appwrite";
import { API_BASE_URL } from "@/lib/constants";

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpUserId, setOtpUserId] = useState("");
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const scriptId = 'dotlottie-player-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs';
            script.type = 'module';
            document.body.appendChild(script);
        }
    }, []);

    const setAuthCookie = (name: string, value: string) => {
        const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=604800; SameSite=Lax${secure}`;
    };

    const handleResendOtp = async () => {
        if (loading) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const normalizedEmail = email.trim().toLowerCase();

            await clearActiveAppwriteSession();
            const token = await sendRegistrationOtp(normalizedEmail);
            setOtpUserId(token.userId);
            setSuccess("A new OTP has been sent to your email.");
        } catch (err: any) {
            const message = err?.message || "Failed to resend OTP";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const normalizedName = username.trim();
            const normalizedEmail = email.trim().toLowerCase();

            if (!normalizedName) {
                throw new Error("Full name is required");
            }

            if (password.length < 6) {
                throw new Error("Password must be at least 6 characters");
            }

            const token = await sendRegistrationOtp(normalizedEmail);
            setOtpUserId(token.userId);
            setIsOtpStep(true);
            setSuccess("OTP sent to your email. Enter the code to verify and complete registration.");
        } catch (err: any) {
            const message = err?.message || "Failed to send OTP";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'microsoft') => {
        setError("");

        try {
            if (provider === 'google') {
                await loginWithGoogleAppwrite();
                return;
            } else if (provider === 'microsoft') {
                await loginWithMicrosoftAppwrite();
                return;
            } else {
                throw new Error('Unknown provider');
            }
        } catch (err: any) {
            const message = err?.message || `${provider === 'google' ? 'Google' : 'Microsoft'} sign-up failed. Please try again.`;
            setError(message);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        let shouldClearSession = false;

        try {
            const normalizedName = username.trim();
            const normalizedEmail = email.trim().toLowerCase();

            if (!otpUserId) {
                throw new Error("OTP session expired. Please request a new OTP.");
            }

            if (!otp.trim()) {
                throw new Error("Enter the OTP sent to your email");
            }

            await verifyRegistrationOtp(otpUserId, otp.trim());
            shouldClearSession = true;
            await finalizeOtpRegistration(normalizedName, password);


            const backendResponse = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: normalizedName,
                    email: normalizedEmail,
                    password,
                    role: "user",
                }),
            });

            if (!backendResponse.ok) {
                const errorData = await backendResponse.json().catch(() => ({}));
                throw new Error(errorData?.detail || "Failed to save user in MongoDB");
            }

            const appwriteUser = await account.get();

            let mongoUser: any = null;
            try {
                const response = await fetch(`${API_BASE_URL}/user/${encodeURIComponent(appwriteUser.email)}`);
                if (response.ok) {
                    mongoUser = await response.json();
                }
            } catch {
                // Continue with Appwrite user data if MongoDB user fetch fails.
            }

            const mergedUser = {
                ...appwriteUser,
                ...mongoUser,
                role: mongoUser?.role || "user",
                userrole: (mongoUser?.role || "user").toLowerCase(),
            };

            localStorage.setItem('user', JSON.stringify(mergedUser));
            localStorage.setItem('isAuthenticated', 'true');

            try {
                const jwt = await account.createJWT();
                localStorage.setItem('accessToken', jwt.jwt);
                localStorage.setItem('tokenType', 'Bearer');
                setAuthCookie('isAuthenticated', 'true');
                setAuthCookie('accessToken', jwt.jwt);
            } catch {
                // Appwrite session cookie still exists even if JWT cannot be created.
            }

            shouldClearSession = false;

            setSuccess("Registration successful! Redirecting to chat...");

            setTimeout(() => {
                router.push("/chat");
            }, 800);
        } catch (err: any) {
            const rawMessage = err?.message || "Registration failed";
            const message = rawMessage.toLowerCase().includes('invalid credentials')
                ? 'OTP was accepted, but this email already has credential history. Please sign in from the login page or use Google login.'
                : rawMessage;
            setError(message);
        } finally {
            if (shouldClearSession) {
                await clearActiveAppwriteSession();
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                
                {/* Left Side - Lottie Animation & Branding */}
                <div className="hidden md:flex md:w-5/12 bg-slate-900 p-12 flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition group text-sm font-semibold cursor-pointer">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-white p-2.5 rounded-[14px] shadow-md flex items-center justify-center">
                                <Scale className="w-8 h-8 text-[#FF9000]" strokeWidth={2.5} />
                            </div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">CogniLex AI</h1>
                        </div>

                        <h2 className="text-3xl font-bold mb-4">Join Justice</h2>
                        <p className="text-slate-400 leading-relaxed mb-8">
                            Create your account to access Sri Lanka's most advanced legal AI platform.
                        </p>

                        <div 
                            className="flex-1 flex items-center justify-center w-full my-auto"
                            dangerouslySetInnerHTML={{
                                __html: `
                                    <dotlottie-player
                                        src="https://assets-v2.lottiefiles.com/a/e39b4e4e-116f-11ee-ba48-375d0bd6b7d1/Lscnfmi3OM.lottie"
                                        background="transparent"
                                        speed="1"
                                        style="width: 100%; max-width: 350px; aspect-ratio: 1/1;"
                                        loop
                                        autoplay
                                    ></dotlottie-player>
                                `
                            }}
                        />
                    </div>

                    <div className="relative z-10 mt-12 text-xs text-slate-500">
                        &copy; {new Date().getFullYear()} CogniLex AI. All rights reserved.
                    </div>
                </div>

                {/* Right Side - Register Form */}
                <div className="w-full md:w-7/12 p-8 md:p-12 relative flex flex-col justify-center">
                    <Link href="/" className="md:hidden inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition group text-sm font-semibold cursor-pointer">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
                    </Link>

                    <div className="md:hidden flex items-center gap-3 mb-8">
                        <div className="bg-white border border-slate-200 p-2 rounded-[12px] shadow-sm flex items-center justify-center">
                            <Scale className="w-6 h-6 text-[#FF9000]" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">CogniLex AI</h1>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
                        <p className="text-slate-600">Join CogniLex AI Platform</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p className="font-medium">{success}</p>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={isOtpStep ? handleVerifyOtp : handleSendOtp}>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 placeholder:text-slate-400 shadow-sm transition"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isOtpStep}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 placeholder:text-slate-400 shadow-sm transition disabled:opacity-70"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                disabled={isOtpStep}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 placeholder:text-slate-400 shadow-sm transition disabled:opacity-70"
                                placeholder="Create a strong password"
                            />
                        </div>

                        {isOtpStep && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email OTP</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 placeholder:text-slate-400 shadow-sm transition"
                                    placeholder="Enter OTP code"
                                />
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                    className="mt-2 text-sm font-bold text-amber-600 hover:text-amber-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Resend OTP
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4 cursor-pointer"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            ) : (
                                <UserPlus className="w-5 h-5" />
                            )}
                            <span>{loading ? (isOtpStep ? "Verifying OTP..." : "Sending OTP...") : (isOtpStep ? "Verify & Register" : "Send OTP")}</span>
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-slate-500 font-medium">Or register with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-300 shadow-sm rounded-xl hover:bg-slate-50 transition cursor-pointer"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="font-bold text-slate-700 text-sm">Google</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('microsoft')}
                            className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-300 shadow-sm rounded-xl hover:bg-slate-50 transition cursor-pointer"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 23 23">
                                <path fill="#f35325" d="M1 1h10v10H1z" />
                                <path fill="#81bc06" d="M12 1h10v10H12z" />
                                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                                <path fill="#ffba08" d="M12 12h10v10H12z" />
                            </svg>
                            <span className="font-bold text-slate-700 text-sm">Microsoft</span>
                        </button>
                    </div>

                    <div className="mt-8 text-center text-sm">
                        <p className="text-slate-600">
                            Already have an account?{" "}
                            <button onClick={() => router.push("/login")} className="text-[#FF9000] hover:text-amber-700 font-bold transition cursor-pointer">
                                Sign In
                            </button>
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">
                            By continuing, you agree to CogniLex{' '}
                            <Link href="/terms" className="text-[#FF9000] hover:underline cursor-pointer">
                                Terms of Service
                            </Link>{' '}
                            &{' '}
                            <Link href="/privacy" className="text-[#FF9000] hover:underline cursor-pointer">
                                Privacy Policy
                            </Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}