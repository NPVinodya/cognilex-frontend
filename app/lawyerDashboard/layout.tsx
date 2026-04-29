'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Scale, Calendar as CalendarIcon, Users, Briefcase, FileText,
  MessageSquare, TrendingUp, Settings, LayoutDashboard, Search, Bell, LogOut, Sparkles, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLoading from '@/components/lawyerDashboard/DashboardLoading';

const SIDEBAR_NAV = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/lawyerDashboard/dashboard', badge: null },
  { name: 'Appointments', icon: CalendarIcon, path: '/lawyerDashboard/appointments', badge: null },
  { name: 'Bookings', icon: Briefcase, path: '/lawyerDashboard/bookings', badge: null },
  { name: 'Clients', icon: Users, path: '/lawyerDashboard/clients', badge: null },
  { name: 'Documents', icon: FileText, path: '/lawyerDashboard/documents', badge: null },
  { name: 'Messages', icon: MessageSquare, path: '/lawyerDashboard/messages', badge: null },
  { name: 'Analytics', icon: TrendingUp, path: '/lawyerDashboard/analytics', badge: null },
  { name: 'Settings', icon: Settings, path: '/lawyerDashboard/settings', badge: null },
];

interface DashboardContextType {
  setIsPageLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
}

export const DashboardContext = React.createContext<DashboardContextType>({
  setIsPageLoading: () => {},
  setLoadingProgress: () => {},
});

export default function LawyerDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [lawyerProfile, setLawyerProfile] = React.useState({
    name: 'Loading...',
    title: 'Lawyer',
    avatar: ''
  });

  const [isPageLoading, setIsPageLoading] = React.useState(true);
  const [loadingProgress, setLoadingProgress] = React.useState(0);

  // Initial navigation loading start
  React.useEffect(() => {
    setIsPageLoading(true);
    setLoadingProgress(10);
    
    // Slow progress simulation while waiting for actual data
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(timer);
          return 90;
        }
        return prev + 5;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [pathname]);

  React.useEffect(() => {
    const fetchLawyerInfo = async () => {
      try {
        const userJson = localStorage.getItem('user');
        if (!userJson) {
          setLawyerProfile(prev => ({ ...prev, name: 'Guest Lawyer' }));
          return;
        }

        const user = JSON.parse(userJson);
        setLawyerProfile(prev => ({ ...prev, name: user.name || 'Lawyer' }));

        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        // Fetch additional profile info if available
        const response = await fetch(`${API_URL}/lawyer-dashboard/${user.id}/profile`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.profile) {
            setLawyerProfile({
              name: data.profile.fullName || user.name || 'Lawyer',
              title: data.profile.yearsOfExperience > 10 ? 'Senior Lawyer' : 'Lawyer',
              avatar: data.profile.profilePhotoUrl || 'https://i.pravatar.cc/150?u=lawyer'
            });
          }
        }
      } catch (err) {
        console.error('Failed to load lawyer profile', err);
      }
    };

    fetchLawyerInfo();
  }, []);

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">

      {/* ---------------- S I D E B A R ---------------- */}
      <aside className="w-64 bg-[#181B25] text-slate-300 hidden lg:flex flex-col flex-shrink-0 shadow-xl overflow-hidden">
        <div className="h-20 flex items-center px-6 bg-[#181B25] z-10 shrink-0 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg flex items-center justify-center shadow-sm">
              <Scale className="h-5 w-5 text-[#FF9000]" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">CogniLex AI</span>
          </Link>
        </div>

        <div className="flex-1 py-6 px-4 overflow-y-auto">
          <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">Main Menu</p>
          <nav className="space-y-1">
            {SIDEBAR_NAV.map((item) => {
              const isActive = pathname?.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive
                    ? 'bg-[#FF9000] text-white shadow-md shadow-orange-900/20'
                    : 'hover:bg-white/5 hover:text-white text-slate-400'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span className="font-semibold text-sm">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#FF9000] text-white'
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-4 mt-auto border-t border-white/5 space-y-2">
          {/* AI Chat Button */}
          <Link
            href="/chat"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/5 text-[#FF9000] border border-orange-500/10 hover:border-orange-500/30 transition-all font-bold w-full active:scale-95 group mb-1 shadow-sm"
          >
            <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="text-sm tracking-tight text-[#FF9000]">CogniLex AI Chat</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={() => {
              if (confirm('Are you sure you want to log out?')) {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/login'; // Lawyer login is usually at /login
              }
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all font-bold w-full active:scale-95 group mb-2"
          >
            <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm">Logout</span>
          </button>

          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition">
            {lawyerProfile.avatar ? (
              <img src={lawyerProfile.avatar} alt="Avatar" className="h-10 w-10 rounded-full object-cover border-2 border-[#2A2E3D]" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border-2 border-[#2A2E3D]">
                <User className="h-5 w-5 text-slate-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{lawyerProfile.name}</p>
              <p className="text-xs text-slate-500 truncate">{lawyerProfile.title}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ---------------- M A I N  C O N T E N T ---------------- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4 max-w-lg w-full">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search appointments, clients, or cases..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] focus:bg-white transition placeholder-slate-400 font-medium"
              />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button className="relative text-slate-500 hover:text-slate-800 transition">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-10">
          <DashboardContext.Provider value={{ setIsPageLoading, setLoadingProgress }}>
            {isPageLoading && <DashboardLoading progress={loadingProgress} />}
            <div className={isPageLoading ? 'hidden' : 'block'}>
              {children}
            </div>
          </DashboardContext.Provider>
        </div>
      </main>
    </div>
  );
}
