'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Eye, EyeOff, AlertCircle, Scale, Gavel, Shield, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { loginWithAppwrite, loginWithGoogleAppwrite, account } from '@/lib/appwrite';
import { API_BASE_URL } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const setAuthCookie = (name: string, value: string) => {
    const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=604800; SameSite=Lax${secure}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginWithAppwrite(formData.email, formData.password);

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
        role: mongoUser?.role || 'user',
        userrole: (mongoUser?.role || 'user').toLowerCase(),
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
        // If JWT creation fails, still proceed with basic login state
      }

      router.push('/chat');
    } catch (err: any) {
      const message = err?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'microsoft') => {
    setError('');

    if (provider === 'google') {
      try {
        await loginWithGoogleAppwrite();
        return;
      } catch (err: any) {
        const message = err?.message || 'Google sign-in failed. Please try again.';
        setError(message);
        return;
      }
    }

    setError('microsoft sign-in will be implemented soon');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">

        {/* Left Side - Branding */}
        <div className="hidden md:flex md:w-5/12 bg-slate-900 p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition group text-sm font-semibold cursor-pointer">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>

            <div className="flex items-center gap-3 mb-8">
              <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl shadow-md">
                <Scale className="w-8 h-8 text-amber-500" />
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">CogniLex AI</h1>
            </div>

            <h2 className="text-3xl font-bold mb-4">Welcome Back to Justice</h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              Access Sri Lanka's most advanced legal AI platform. Get instant answers and connect with verified lawyers.
            </p>

            <div className="space-y-4">
              {[
                { icon: BookOpen, text: 'Access Legal Knowledge Base' },
                { icon: Scale, text: 'AI-Powered Legal Assistance' },
                { icon: Shield, text: 'Connect with Verified Lawyers' },
                { icon: Gavel, text: 'Track Your Legal Journey' },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 group">
                  <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
                    <feature.icon className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-slate-300 font-medium text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-12 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} CogniLex AI. All rights reserved.
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 relative flex flex-col justify-center">
          <Link href="/" className="md:hidden inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition group text-sm font-semibold cursor-pointer">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>

          <div className="md:hidden flex items-center gap-3 mb-8">
            <div className="bg-slate-100 border border-slate-200 p-2 rounded-lg shadow-sm">
              <Scale className="w-6 h-6 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">CogniLex AI</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Secure Login</h2>
            <p className="text-slate-600">Sign in to access your legal dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition text-slate-900 placeholder:text-slate-400 shadow-sm"
                placeholder="example@gmail.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-sm text-amber-600 hover:text-amber-700 font-bold transition cursor-pointer">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition text-slate-900 placeholder:text-slate-400 shadow-sm pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
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
              className="w-full mt-2 bg-slate-900 text-white rounded-xl py-3.5 font-bold shadow-md hover:bg-slate-800 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 font-medium">Or log in with</span>
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
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-slate-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-amber-600 hover:text-amber-700 font-bold transition cursor-pointer">
                Create Account
              </Link>
            </p>
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-amber-600 hover:underline cursor-pointer">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-amber-600 hover:underline cursor-pointer">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}