'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LogIn, Eye, EyeOff, AlertCircle, Scale, Gavel, Shield, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
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
    const response = await axios.post('http://127.0.0.1:8000/login', {
      email: formData.email,
      password: formData.password,
    });

    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('isAuthenticated', 'true');

    // Redirect to chat (no more userType checking)
    router.push('/chat');
    
  } catch (err: any) {
    setError(err.response?.data?.detail || 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handleSocialLogin = (provider: 'google' | 'microsoft') => {
    setError(`${provider} sign-in will be implemented soon`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 relative overflow-hidden">
      {/* Animated Law-themed Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-20 left-10 animate-float" style={{ animationDelay: '0s' }}>
          <Scale className="w-32 h-32 text-blue-300" />
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s' }}>
          <Gavel className="w-28 h-28 text-indigo-300" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-float" style={{ animationDelay: '4s' }}>
          <BookOpen className="w-36 h-36 text-purple-300" />
        </div>
        <div className="absolute bottom-20 right-1/3 animate-float" style={{ animationDelay: '1s' }}>
          <Shield className="w-24 h-24 text-blue-300" />
        </div>
        <div className="absolute top-1/2 left-1/2 animate-float" style={{ animationDelay: '3s' }}>
          <Scale className="w-40 h-40 text-indigo-300" />
        </div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding */}
          <div className="hidden md:block text-white space-y-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back to Home</span>
            </Link>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-5 rounded-2xl">
                    <Scale className="w-12 h-12" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                    CogniLex AI
                  </h1>
                  <p className="text-blue-200 font-semibold">Your Legal Companion</p>
                </div>
              </div>

              <div className="space-y-4 mt-12">
                <h2 className="text-3xl font-bold">
                  Welcome Back to Justice
                </h2>
                <p className="text-blue-200 text-lg leading-relaxed">
                  Access Sri Lanka's most advanced legal AI platform. Get instant answers, connect with verified lawyers, and navigate the legal landscape with confidence.
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-4 mt-8">
                {[
                  { icon: BookOpen, text: 'Access Legal Knowledge Base', color: 'from-blue-500 to-cyan-500' },
                  { icon: Scale, text: 'AI-Powered Legal Assistance', color: 'from-indigo-500 to-purple-500' },
                  { icon: Shield, text: 'Connect with Verified Lawyers', color: 'from-purple-500 to-pink-500' },
                  { icon: Gavel, text: 'Track Your Legal Journey', color: 'from-blue-500 to-indigo-500' },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className={`bg-gradient-to-br ${feature.color} p-3 rounded-lg shadow-lg group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="relative">
            {/* Mobile Back Button */}
            <Link
              href="/"
              className="md:hidden inline-flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back to Home</span>
            </Link>

            {/* Form Card */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-30 animate-pulse"></div>
              
              <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl">
                {/* Mobile Logo */}
                <div className="md:hidden text-center mb-6">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
                      <Scale className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white">LegalLK</h1>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-white mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-blue-200">Sign in to access your legal dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">
                      Email Address
                    </label>
                    <div className="relative group">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white/15 transition text-white placeholder:text-gray-400"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-bold text-white">
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-blue-300 hover:text-blue-200 font-semibold"
                      >
                        Forgot?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white/15 transition text-white placeholder:text-gray-400 pr-12"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                      <p className="text-red-200 text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-500 group-hover:to-indigo-500 rounded-xl transition-all"></div>
                    <div className="relative flex items-center justify-center gap-2 py-4 text-white font-bold">
                      <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                    </div>
                  </button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-transparent text-gray-300 font-semibold">Or continue with</span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('google')}
                      className="flex items-center justify-center gap-2 py-3 bg-white/10 border-2 border-white/20 rounded-xl hover:bg-white/15 hover:border-white/30 transition"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="font-semibold text-white text-sm">Google</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('microsoft')}
                      className="flex items-center justify-center gap-2 py-3 bg-white/10 border-2 border-white/20 rounded-xl hover:bg-white/15 hover:border-white/30 transition"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 23 23">
                        <path fill="#f35325" d="M1 1h10v10H1z"/>
                        <path fill="#81bc06" d="M12 1h10v10H12z"/>
                        <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                        <path fill="#ffba08" d="M12 12h10v10H12z"/>
                      </svg>
                      <span className="font-semibold text-white text-sm">Microsoft</span>
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-300 text-sm">
                    Don't have an account?{' '}
                    <Link
                      href="/register"
                      className="text-blue-300 hover:text-blue-200 font-bold"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>

                {/* Terms */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-400">
                    By signing in, you agree to our{' '}
                    <Link href="/terms" className="text-blue-300 hover:underline">
                      Terms
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-blue-300 hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}