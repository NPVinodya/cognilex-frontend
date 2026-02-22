"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Scale, ArrowLeft, UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/register", {
                name: username,
                email,
                password,
            });

            setSuccess(response.data.message || "Registration successful!");

            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full relative pt-12">
                <Link href="/" className="absolute top-0 left-0 inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition group text-sm font-semibold">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
                </Link>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-sm mb-4">
                            <Scale className="w-8 h-8 text-amber-500" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 text-center">
                            Create Account
                        </h2>
                        <p className="text-center text-slate-500 font-medium mt-1">Join CogniLex AI Platform</p>
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

                    <form className="space-y-5" onSubmit={handleSignUp}>
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
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 placeholder:text-slate-400 shadow-sm transition"
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
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 placeholder:text-slate-400 shadow-sm transition"
                                placeholder="Create a strong password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 mt-4"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            ) : (
                                <UserPlus className="w-5 h-5" />
                            )}
                            <span>{loading ? "Creating Account…" : "Register Now"}</span>
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <p className="text-slate-600">
                            Already have an account?{" "}
                            <button onClick={() => router.push("/login")} className="text-amber-600 hover:text-amber-700 font-bold transition">
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}