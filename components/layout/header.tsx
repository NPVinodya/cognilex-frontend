'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Scale, LogIn, UserPlus, LogOut, Home, Info, Briefcase, Users, Mail, Menu, X, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { logoutFromAppwrite } from '@/lib/appwrite';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name?: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncFromStorage = () => {
      const rawUser = localStorage.getItem("user");
      const authed = localStorage.getItem("isAuthenticated") === "true";

      setIsAuthenticated(authed);
      setUser(rawUser ? (JSON.parse(rawUser) as { name?: string }) : null);
    };

    syncFromStorage();
    window.addEventListener("storage", syncFromStorage);
    return () => window.removeEventListener("storage", syncFromStorage);
  }, []);

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);

    if (typeof window !== "undefined") {
      try {
        await logoutFromAppwrite();
      } catch {
        // Ignore; client-side session might already be cleared.
      }

      try {
        await fetch("/api/logout", { method: "POST" });
      } catch {
        // Ignore; we still clear client storage below.
      }

      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("tokenType");

      // Clear non-HttpOnly cookies (HttpOnly cookies are cleared via /api/logout)
      document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    router.push("/login");
  };

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'About', icon: Info, path: '/about' },
    {
      name: 'Services',
      icon: Briefcase,
      dropdown: [
        { name: 'Find Lawyers', path: '/lawyer' },
        { name: 'AI Legal Chat', path: '/chat' },
        { name: 'My Appointments', path: '/my-appointments' },
      ]
    },
    { name: 'Lawyers', icon: Users, path: '/lawyer' },
    { name: 'Contact', icon: Mail, path: '/contact' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-3 group transition-transform hover:scale-105 duration-300 cursor-pointer"
          >
            <div className="bg-white p-2.5 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:rotate-6">
              <Scale className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">CogniLex AI</h1>
              <p className="text-xs text-slate-300 font-medium">Sri Lankan Law Assistant</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              item.dropdown ? (
                <div key={item.name} className="relative">
                  <button
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2.5 text-white hover:bg-white/20 rounded-lg transition-all duration-300 font-medium group cursor-pointer"
                  >
                    <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{item.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {servicesOpen && (
                    <div
                      onMouseEnter={() => setServicesOpen(true)}
                      onMouseLeave={() => setServicesOpen(false)}
                      className="absolute top-full left-0 pt-2 w-48 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      <div className="bg-white rounded-xl shadow-2xl py-2 border border-slate-100">
                        {item.dropdown.map((dropItem) => (
                          <button
                            key={dropItem.name}
                            onClick={() => {
                              router.push(dropItem.path);
                              setServicesOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 transition-colors duration-200 font-medium cursor-pointer ${pathname === dropItem.path ? 'bg-amber-50 text-amber-700' : 'text-slate-700 hover:bg-amber-50 hover:text-amber-700'}`}
                          >
                            {dropItem.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.name}
                  onClick={() => router.push(item.path)}
                  className="flex items-center space-x-2 px-4 py-2.5 text-white hover:bg-white/20 rounded-lg transition-all duration-300 font-medium group cursor-pointer"
                >
                  <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{item.name}</span>
                </button>
              )
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-amber-600 font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-white font-medium">Hello, {user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="cursor-pointer flex items-center space-x-2 px-5 py-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 font-medium backdrop-blur-sm hover:scale-105"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="cursor-pointer flex items-center space-x-2 px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg hover:scale-105"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col space-y-2 bg-white/10 backdrop-blur-md rounded-xl p-4">
              {navItems.map((item) => (
                item.dropdown ? (
                  <div key={item.name} className="space-y-2">
                    <button
                      onClick={() => setServicesOpen(!servicesOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all duration-300 font-medium cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {servicesOpen && (
                      <div className="pl-6 space-y-2">
                        {item.dropdown.map((dropItem) => (
                          <button
                            key={dropItem.name}
                            onClick={() => {
                              router.push(dropItem.path);
                              setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2.5 text-white/90 hover:bg-white/20 rounded-lg transition-all duration-200 cursor-pointer"
                          >
                            {dropItem.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => {
                      router.push(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all duration-300 font-medium cursor-pointer"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                )
              ))}

              <div className="pt-4 border-t border-white/20 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 px-4 py-3 bg-white/10 rounded-lg">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span className="text-amber-600 font-bold text-sm">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-white font-medium">Hello, {user?.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 font-medium cursor-pointer"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        router.push('/login');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 font-medium cursor-pointer"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Login</span>
                    </button>
                    <button
                      onClick={() => {
                        router.push('/register');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-300 font-medium cursor-pointer"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>Register</span>
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
