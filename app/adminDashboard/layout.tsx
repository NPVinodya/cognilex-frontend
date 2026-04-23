'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Users, Scale, Shield, Bell, Menu, X, LayoutDashboard, Clock, LogOut, MessageSquare, Settings, Wallet
} from 'lucide-react';
import { clearAdminSession } from '@/lib/adminSession';

const SIDEBAR_ITEMS = [
  { id: 'overview', name: 'Overview', icon: LayoutDashboard, href: '/adminDashboard/overview' },
  { id: 'feedback', name: 'Customer Feedback', icon: MessageSquare, href: '/adminDashboard/feedback' },
  { id: 'users', name: 'User Management', icon: Users, href: '/adminDashboard/users' },
  { id: 'admins', name: 'Admin Management', icon: Shield, href: '/adminDashboard/admins' },
  { id: 'lawyers', name: 'Lawyer Directory', icon: Scale, href: '/adminDashboard/lawyers' },
  { id: 'approvals', name: 'Pending Approvals', icon: Clock, href: '/adminDashboard/approvals' },
  { id: 'finance', name: 'Financial Analytics', icon: Wallet, href: '/adminDashboard/finance' },
  { id: 'settings', name: 'System Settings', icon: Settings, href: '/adminDashboard/settings' },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminProfile, setAdminProfile] = useState({
    name: 'System Admin',
    role: 'Super Administrator',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=181B25&color=FF9000&bold=true'
  });
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    if (typeof clearAdminSession === 'function') {
      clearAdminSession();
    }
    window.location.replace('/admin/login');
  };

  useEffect(() => {
    try {
      // Try to get actual admin info from localStorage if it exists
      const userJson = localStorage.getItem('user') || localStorage.getItem('adminUser');
      if (userJson) {
        const user = JSON.parse(userJson);
        if (user.role === 'admin' || user.email === 'admin@cognilex.com' || user.user_role === 'admin') {
          setAdminProfile({
            name: user.name || 'Admin User',
            role: 'Platform Admin',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Admin')}&background=181B25&color=FF9000&bold=true`
          });
        }
      }
    } catch (e) {
      console.error("Session parsing error:", e);
    }
  }, []);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const adminStr = localStorage.getItem('adminUser');
        if (adminStr) {
          const adminId = JSON.parse(adminStr).id;
          const response = await fetch(`http://localhost:8000/admin/preferences/${adminId}`);
          if (response.ok) {
            const prefs = await response.json();
            setDarkMode(prefs.darkMode);
          }
        } else {
           // Fallback to local storage if not logged in yet or no backend access
           const prefs = JSON.parse(localStorage.getItem('admin_prefs') || '{}');
           setDarkMode(prefs.darkMode || false);
        }
      } catch (err) {
        console.error("Failed to fetch admin preferences", err);
      }
    };
    fetchPrefs();
  }, [pathname]); // Refresh when navigating

  // Helper to check if a link is active
  const isActive = (href: string) => pathname === href;

  return (
    <div className={`flex h-screen font-sans overflow-hidden admin-dashboard-root ${darkMode ? 'dark bg-slate-950' : 'bg-[#F8F9FA]'}`}>

      {/* ---------------- S I D E B A R ---------------- */}
      <aside className="w-64 bg-[#181B25] text-slate-300 hidden lg:flex flex-col flex-shrink-0 shadow-2xl overflow-hidden border-r border-white/5">
        <div className="h-20 flex items-center px-6 bg-[#181B25] border-b border-white/5 shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg flex items-center justify-center shadow-sm">
              <Scale className="h-5 w-5 text-[#FF9000]" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">CogniLex AI</span>
          </Link>
        </div>

        <div className="flex-1 py-10 px-4 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Operations Hub</p>
          <nav className="space-y-1.5">
            {SIDEBAR_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${active
                    ? 'bg-[#FF9000] text-white font-bold shadow-xl shadow-orange-900/20'
                    : 'hover:bg-white/5 hover:text-white text-slate-400 font-semibold'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${active ? 'text-white' : 'text-slate-500'}`} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Section */}
        <div className="mt-auto border-t border-white/5 bg-[#181B25]">
          {/* Exit Admin Button */}
          <div className="px-4 py-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#FF6B6B] hover:bg-rose-500/10 transition-all font-bold w-full active:scale-95 group"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-sm">Exit Admin</span>
            </button>
          </div>

          {/* Admin Profile Section */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition group">
              <img
                src={adminProfile.avatar}
                alt="Admin Avatar"
                className="h-10 w-10 rounded-full object-cover border-2 border-[#2A2E3D] group-hover:border-[#FF9000] transition-colors"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{adminProfile.name}</p>
                <p className="text-[10px] font-bold text-[#FF9000] uppercase tracking-wider truncate">{adminProfile.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ---------------- M O B I L E  D R A W E R ---------------- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#181B25] z-[101] lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 bg-[#181B25]">
          <div className="flex items-center gap-3">
            <div className="bg-[#FF9000] p-1.5 rounded-lg flex items-center justify-center">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">CogniLex AI</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white transition">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-1 py-8 px-4 overflow-y-auto bg-[#181B25]">
          <nav className="space-y-1 mb-8">
            {SIDEBAR_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${active ? 'bg-[#FF9000] text-white font-bold' : 'text-slate-400 font-semibold'}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Exit Admin */}
          <div className="px-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#FF6B6B] hover:bg-rose-500/10 transition-all font-bold w-full active:scale-95 group"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm">Exit Admin</span>
            </button>
          </div>
        </div>
        <div className="p-6 border-t border-white/5 bg-[#181B25]">
          <div className="flex items-center gap-3">
            <img src={adminProfile.avatar} className="h-10 w-10 rounded-full border border-white/10" alt="Admin" />
            <div>
              <p className="text-sm font-bold text-white">{adminProfile.name}</p>
              <p className="text-[10px] text-[#FF9000] font-bold uppercase">{adminProfile.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ---------------- M A I N  C O N T E N T ---------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 lg:hidden text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition">
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden md:flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#FF9000]" />
              <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em]">Platform Administration</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative p-2.5 text-slate-500 hover:text-[#FF9000] hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-xl transition-all duration-300">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#1A1D27]"></span>
            </button>
            <div className="h-10 w-10 rounded-xl bg-[#181B25] dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-[#FF9000] font-black shadow-sm overflow-hidden">
              {adminProfile.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className={`flex-1 overflow-y-auto p-6 md:p-10 ${darkMode ? 'bg-slate-950' : 'bg-[#F8F9FA]'}`}>
          {children}
        </main>
      </div>

    </div>
  );
}
