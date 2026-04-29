'use client';

import React, { useState, useEffect } from 'react';
import { 
    Activity, TrendingUp, Users, DollarSign, Calendar, ChevronDown, Download, Filter, 
    ArrowUpRight, ArrowDownRight, Clock, Plus, Star, Briefcase, ChevronRight, CheckCircle2,
    PieChart
} from 'lucide-react';
import { DashboardContext } from '@/app/lawyerDashboard/layout';

interface MonthlyData {
    month: string;
    gross: number;
    net: number;
    fees: number;
    bookings: number;
}

interface ServiceData {
    name: string;
    value: number;
    revenue: number;
}

import DashboardLoading from '@/components/lawyerDashboard/DashboardLoading';

export default function AnalyticsPage() {
    const { setIsPageLoading, setLoadingProgress } = React.useContext(DashboardContext);
    const [loading, setLoading] = useState(false);
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
    const [services, setServices] = useState<ServiceData[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [timePeriod, setTimePeriod] = useState("this-month");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) return;
                const user = JSON.parse(storedUser);
                const lawyerId = user.id || user._id;

                const [analyticsRes, statsRes] = await Promise.all([
                    fetch(`/api/lawyer/dashboard?lawyerId=${lawyerId}&type=analytics&period=${timePeriod}`),
                    fetch(`/api/lawyer/dashboard?lawyerId=${lawyerId}&type=stats`)
                ]);

                const analyticsData = await analyticsRes.json();
                const statsData = await statsRes.json();

                if (analyticsData.success) {
                    setMonthlyData(analyticsData.monthly || []);
                    setServices(analyticsData.services || []);
                }
                
                if (statsData.success) {
                    setStats(statsData.stats || statsData);
                }
                setLoadingProgress(100);
                setTimeout(() => setIsPageLoading(false), 200);
            } catch (error) {
                console.error("Error fetching analytics:", error);
                setIsPageLoading(false);
            }
        };
        fetchAnalytics();
    }, [timePeriod]);

    const handleExport = () => {
        if (monthlyData.length === 0) return;
        
        let csvContent = "Time Period,Bookings,Gross Revenue (LKR),Platform Fees (LKR),Net Revenue (LKR)\n";
        
        monthlyData.forEach(d => {
            csvContent += `${d.month} 2026,${d.bookings},${d.gross},${d.fees},${d.net}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Practice_Analytics_${timePeriod}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    const maxNet = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d.net)) : 1000;

    return (
        <div className="pb-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                    <h1 className="text-[32px] font-bold text-[#181B25] tracking-tight leading-tight">Practice Analytics</h1>
                    <p className="text-slate-500 font-medium mt-1.5 text-sm">In-depth performance insights and financial transparency.</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleExport}
                        disabled={monthlyData.length === 0}
                        className="h-12 px-6 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-4 h-4 text-[#FF9000]" /> Export Data
                    </button>
                    <div className="relative">
                        <select 
                            value={timePeriod}
                            onChange={(e) => setTimePeriod(e.target.value)}
                            className="appearance-none h-12 pl-6 pr-12 bg-[#FF9000] text-white rounded-full text-sm font-bold hover:bg-[#E68200] transition shadow-lg shadow-orange-600/20 cursor-pointer focus:outline-none min-w-[160px]"
                        >
                            <option value="this-month" className="text-slate-900">This Month</option>
                            <option value="last-month" className="text-slate-900">Last Month</option>
                            <option value="year" className="text-slate-900">This Year (2026)</option>
                        </select>
                        <Calendar className="w-4 h-4 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white" />
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Gross Revenue Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-500 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5 border border-emerald-100">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Gross Revenue</p>
                        <h3 className="text-[26px] font-black text-[#181B25] tracking-tighter leading-none mb-4">
                            LKR {(stats?.totalEarnings || 0).toLocaleString()}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-lg">
                            <TrendingUp className="w-3.5 h-3.5" /> +12% growth
                        </div>
                    </div>
                </div>

                {/* Net Earnings Card (Now White) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-500 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-orange-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-orange-50 text-[#FF9000] rounded-xl flex items-center justify-center mb-5 border border-orange-100 shadow-sm">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Net Earnings</p>
                        <h3 className="text-[26px] font-black text-[#181B25] tracking-tighter leading-none mb-4">
                            LKR {(stats?.netEarnings || 0).toLocaleString()}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#FF9000] bg-orange-50 w-fit px-3 py-1 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Calculated Net
                        </div>
                    </div>
                </div>

                {/* Platform Fee Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-500 relative overflow-hidden group">
                     <div className="absolute -right-6 -top-6 w-32 h-32 bg-rose-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                     <div className="relative z-10">
                        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-5 border border-rose-100">
                            <Activity className="w-6 h-6" />
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Platform Fees</p>
                        <h3 className="text-[26px] font-black text-[#181B25] tracking-tighter leading-none mb-4">
                            LKR {(stats?.platformFees || 0).toLocaleString()}
                        </h3>
                        <p className="text-[12px] text-slate-500 font-medium">LKR 200 per booking</p>
                    </div>
                </div>

                {/* Active Clients Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-500 relative overflow-hidden group">
                     <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                     <div className="relative z-10">
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-5 border border-blue-100">
                            <Users className="w-6 h-6" />
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Active Clients</p>
                        <h3 className="text-[26px] font-black text-[#181B25] tracking-tighter leading-none mb-4">
                            {(stats?.activeClients || 0).toLocaleString()}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-lg">
                            Unique reach
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                {/* Visual Chart Area */}
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-8 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] flex flex-col">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Revenue Trends</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                {timePeriod === "this-month" ? "Daily performance this month" : 
                                 timePeriod === "last-month" ? "Performance summary for last month" : 
                                 "Monthly net performance breakdown"}
                            </p>
                        </div>
                        <div className="flex bg-slate-50 p-1.5 rounded-full border border-slate-100">
                             <div className="px-4 py-1.5 rounded-full text-xs font-bold bg-white shadow-sm text-[#FF9000]">
                                {timePeriod === "this-month" ? "Current Month" : 
                                 timePeriod === "last-month" ? "Previous Month" : "Yearly View"}
                             </div>
                        </div>
                    </div>

                    <div className="flex-1 flex items-end justify-between px-6 pb-2 min-h-[280px]">
                        {monthlyData.length > 0 ? monthlyData.map((d, i) => {
                            const barHeight = Math.max(20, (d.net / maxNet) * 180);
                            return (
                                <div key={i} className="flex flex-col items-center gap-5 group relative">
                                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                                        <div className="bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-xl shadow-2xl font-bold whitespace-nowrap">
                                            LKR {d.net.toLocaleString()}
                                        </div>
                                    </div>
                                    <div 
                                        className="w-14 rounded-2xl bg-slate-50 border border-slate-100 transition-all duration-500 hover:border-[#FF9000]/30 hover:bg-orange-50/30 flex items-end justify-center p-1"
                                        style={{ height: '220px' }}
                                    >
                                        <div 
                                            className="w-full bg-[#FF9000] rounded-xl transition-all duration-700 shadow-lg shadow-orange-500/20"
                                            style={{ height: `${barHeight}px` }}
                                        ></div>
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">{d.month}</span>
                                </div>
                            );
                        }) : (
                            <div className="w-full flex flex-col items-center justify-center py-20 text-slate-300">
                                <Activity className="w-12 h-12 mb-3 opacity-20" />
                                <p className="font-bold text-sm">Insufficient data for chart visualization</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Side Panels */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                     <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] flex-1">
                        <h3 className="font-bold text-slate-900 mb-8 flex items-center gap-2">
                             <PieChart className="w-5 h-5 text-orange-500" /> Service Distribution
                        </h3>
                        <div className="space-y-8">
                            {services.length > 0 ? services.map((s, i) => {
                                const percentage = Math.round((s.revenue / (stats?.totalEarnings || 1)) * 100);
                                return (
                                    <div key={i} className="group">
                                        <div className="flex justify-between items-center mb-2.5">
                                            <span className="text-sm font-bold text-slate-700">{s.name}</span>
                                            <span className="text-sm font-black text-slate-900">{percentage}%</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? 'bg-[#FF9000]' : i === 1 ? 'bg-blue-500' : 'bg-purple-500'}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            <span>{s.value} Bookings</span>
                                            <span>LKR {s.revenue.toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <p className="text-center py-10 text-slate-400 text-sm font-medium">No booking history available.</p>
                            )}
                        </div>
                    </div>


                </div>
            </div>
            
            {/* Table Area */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] mt-8 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                     <h3 className="text-xl font-bold text-slate-900">
                        {timePeriod === "this-month" ? "This Month's Performance" : 
                         timePeriod === "last-month" ? "Last Month's Performance" : 
                         "Yearly Performance Detail"}
                     </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Billing Period</th>
                                <th className="px-10 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Bookings</th>
                                <th className="px-10 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Gross Revenue</th>
                                <th className="px-10 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Platform Fees</th>
                                <th className="px-10 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Net Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                             {monthlyData.length > 0 ? monthlyData.slice().reverse().map((d, i) => (
                                <tr key={i} className="hover:bg-slate-50/30 transition group">
                                    <td className="px-10 py-6 text-sm font-bold text-slate-900">{d.month} 2026</td>
                                    <td className="px-10 py-6 text-sm font-medium text-slate-600">{d.bookings}</td>
                                    <td className="px-10 py-6 text-sm font-medium text-slate-600">LKR {d.gross.toLocaleString()}</td>
                                    <td className="px-10 py-6 text-sm font-bold text-rose-500">- LKR {d.fees.toLocaleString()}</td>
                                    <td className="px-10 py-6 text-sm font-bold text-emerald-600 whitespace-nowrap">LKR {d.net.toLocaleString()}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center text-slate-400 font-bold">No historical data found for this period.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
