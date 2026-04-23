'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LogIn, Eye, EyeOff, AlertCircle, ShieldCheck, ArrowLeft, Scale } from 'lucide-react';
import Link from 'next/link';
import { saveAdminSession, type AdminLoginResponse } from '@/lib/adminSession';

export default function AdminLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Replace with your actual admin login endpoint
            const response = await axios.post<AdminLoginResponse>('http://127.0.0.1:8000/admin/login', {
                email: formData.email,
                password: formData.password,
            });

            saveAdminSession(response.data);

            router.push('/adminDashboard');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Admin authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[550px]">

                {/* Left Side - Branding */}
                <div className="hidden md:flex md:w-5/12 bg-slate-900 p-12 flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                    <div className="relative z-10">
                        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition group text-sm font-semibold">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Site
                        </Link>

                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-white p-3 rounded-2xl shadow-xl">
                                <Scale className="w-8 h-8 text-[#FF9000]" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin</h1>
                        </div>

                        <h2 className="text-3xl font-bold mb-4">Secure Portal</h2>
                        <p className="text-slate-400 leading-relaxed max-w-sm text-sm">
                            Authorized access only. Log in to manage platform settings, users, and oversee system operations securely.
                        </p>
                    </div>

                    <div className="relative z-10 mt-12 text-xs text-slate-500">
                        &copy; {new Date().getFullYear()} CogniLex AI. All rights reserved.
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-7/12 p-8 md:p-12 relative flex flex-col justify-center">
                    <Link href="/" className="md:hidden inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition group text-sm font-semibold">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
                    </Link>

                    <div className="md:hidden flex items-center gap-3 mb-8">
                        <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-lg">
                            <Scale className="w-8 h-8 text-[#FF9000]" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Portal</h1>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Admin Panel</h2>
                        <p className="text-slate-600 font-medium">Please verify your identity to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Administrator Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-slate-900 placeholder:text-slate-400 shadow-sm"
                                placeholder="admin@cognilex.ai"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Security Key / Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-slate-900 placeholder:text-slate-400 shadow-sm pr-12"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-red-700 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 bg-slate-900 text-white rounded-xl py-4 font-bold shadow-md hover:bg-slate-800 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            ) : (
                                <LogIn className="w-5 h-5" />
                            )}
                            <span>{loading ? 'Verifying Identity...' : 'Access Admin Portal'}</span>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-400 font-medium tracking-wide">
                            UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
