'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wallet, TrendingUp, DollarSign, ArrowUpRight, 
  ArrowDownRight, Calendar, Filter, Download,
  PieChart, BarChart3, Receipt, Users, CreditCard,
  ChevronRight, ArrowRight, Clock
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar,
  Cell, Legend
} from 'recharts';

export default function AdminFinancePage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    platformFees: 0,
    lawyerPayouts: 0,
    totalBookings: 0,
    growth: 0,
    feeValue: 200
  });
  const [dailyTrend, setDailyTrend] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewPeriod, setViewPeriod] = useState<'daily' | 'monthly'>('daily');

  const fetchData = async (period: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/admin/finance/stats?period=${period}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.summary);
        setDailyTrend(data.trend); // Backend returns "trend" now
        setRecentTransactions(data.recentTransactions || []);
      }
    } catch (err) {
      console.error("Failed to fetch financial stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(viewPeriod);
  }, [viewPeriod]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getTimeAgo = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      
      return date.toLocaleDateString('default', { month: 'short', day: 'numeric' }).toUpperCase();
    } catch {
      return dateStr;
    }
  };

  const handleExport = () => {
    if (recentTransactions.length === 0) {
      alert("No transaction data available to export.");
      return;
    }
    
    const headers = ["ID", "Client", "Lawyer ID", "Amount", "Date"];
    const rows = recentTransactions.map(tx => [
      tx.id,
      tx.clientName,
      tx.lawyerId || "N/A",
      tx.amount,
      tx.date
    ]);
    
    // Proper CSV encoding with quotes and escaping
    const csvContent = "\uFEFF" + [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    const fileName = `CogniLex_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
          <p className="text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF9000]"></span>
            Revenue: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 admin-dashboard-root pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div className="flex flex-col gap-1 text-left">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Financial Insights</h1>
          <p className="text-base text-slate-500 font-medium">Real-time revenue monitoring and platform performance analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-slate-100 rounded-xl font-bold text-xs text-slate-500 uppercase tracking-widest border border-slate-200">
             <Clock className="w-4 h-4" /> Live System
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition shadow-xl active:scale-95"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {[
          { label: 'Platform Revenue', value: stats.totalRevenue, icon: DollarSign, color: 'emerald', isCurrency: true },
          { label: 'Commission (Fixed)', value: stats.platformFees, icon: TrendingUp, color: 'orange', isCurrency: true },
          { label: 'Lawyer Payouts', value: stats.lawyerPayouts, icon: Wallet, color: 'blue', isCurrency: true },
          { label: 'Active Sessions', value: stats.totalBookings, icon: Receipt, color: 'purple', isCurrency: false }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-slate-50 -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700`}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-slate-50 text-${item.color === 'orange' ? '[#FF9000]' : item.color + '-600'} flex items-center justify-center shadow-inner border border-slate-100`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <div className={`flex items-center gap-1 font-black text-[10px] px-3 py-1.5 rounded-xl uppercase tracking-tighter ${stats.growth >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                  {stats.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} 
                  {Math.abs(stats.growth)}%
                </div>
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-2">{item.label}</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {item.isCurrency ? formatCurrency(item.value) : item.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 px-4">
        {/* Advanced Chart Card */}
        <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9000]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6 relative z-10">
            <div className="text-left">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Revenue Dynamics</h3>
              <p className="text-slate-400 text-sm font-bold mt-1">Platform earnings {viewPeriod === 'daily' ? 'over the last 7 sessions' : 'over the last 6 months'}</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              <button 
                onClick={() => setViewPeriod('daily')}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition active:scale-95 ${viewPeriod === 'daily' ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-400'}`}
              >
                Daily
              </button>
              <button 
                onClick={() => setViewPeriod('monthly')}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition active:scale-95 ${viewPeriod === 'monthly' ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-400'}`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="h-[350px] w-full relative z-10">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF9000" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#FF9000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="_id" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                    dy={15}
                    tickFormatter={(val) => viewPeriod === 'daily' ? val.split('-').slice(1).join('/') : val}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                    dx={-10}
                    tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#FF9000" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          
          <div className="mt-12 flex items-center gap-6 pt-8 border-t border-slate-50 text-left">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#FF9000] animate-pulse"></div>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Commission</p>
                   <p className="text-sm font-bold text-slate-900">LKR {stats.feeValue} / session</p>
                </div>
             </div>
             <div className="w-px h-10 bg-slate-100"></div>
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                   <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Growth</p>
                   <p className="text-sm font-bold text-emerald-600">+{stats.growth}%</p>
                </div>
             </div>
          </div>
        </div>

        {/* Dynamic Activity Feed - WHITE BACKGROUND */}
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-amber-500/10 transition-colors duration-1000"></div>
          
          <div className="relative z-10 flex flex-col h-full text-left">
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Recent Activity</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10">Real-time payment logs</p>
            
            <div className="space-y-8 flex-1 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
              {recentTransactions.length > 0 ? recentTransactions.map((tx, i) => (
                <div key={tx.id || i} className="flex items-center gap-5 group/item transition-transform hover:translate-x-2">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover/item:bg-amber-500/10 group-hover/item:text-amber-500 group-hover/item:border-amber-500/20 transition-all duration-300">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-bold text-slate-900 mb-0.5 truncate uppercase tracking-tight">Payment Received</p>
                    <p className="text-[9px] font-black text-slate-400 truncate uppercase tracking-widest">
                       Client: {tx.clientName || 'Anonymous'}
                    </p>
                    <p className="text-[9px] font-black text-[#FF9000] truncate uppercase tracking-widest">
                       Lawyer ID: {tx.lawyerId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[15px] font-black text-[#FF9000] leading-tight">+{formatCurrency(tx.amount)}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{getTimeAgo(tx.date)}</p>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 text-center py-20">
                  <Receipt className="w-16 h-16 mb-4 opacity-10" />
                  <p className="text-xs font-black uppercase tracking-[0.2em]">Queue is clear</p>
                </div>
              )}
            </div>
            
            <button className="w-full mt-10 py-5 bg-slate-900 text-white hover:bg-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl active:scale-95">
              Comprehensive Audit Log <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
