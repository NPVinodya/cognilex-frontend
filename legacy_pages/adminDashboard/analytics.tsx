'use client';

import React, { useState, useEffect } from 'react';
import {
    MessageSquare, Users, Zap, BarChart3, PieChart as PieChartIcon,
    TrendingUp, Clock, Filter, ArrowUpRight, ArrowDownRight,
    Search, Calendar, RefreshCw, Activity, MousePointer2
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar,
    Cell, Legend, PieChart, Pie, LineChart, Line
} from 'recharts';

export default function AdminAnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [viewPeriod, setViewPeriod] = useState<'daily' | 'monthly'>('daily');
    const [stats, setStats] = useState({
        totalMessages: 0,
        totalSessions: 0,
        activeUsers7d: 0,
        avgMessagesPerSession: 0,
        messageGrowth: 0,
        userGrowth: 0
    });
    const [messageTrend, setMessageTrend] = useState<any[]>([]);
    const [modeDistribution, setModeDistribution] = useState<any[]>([]);
    const [userTypes, setUserTypes] = useState<any[]>([]);
    const [latencyTrend, setLatencyTrend] = useState<any[]>([]);
    const [tokenTrend, setTokenTrend] = useState<any[]>([]);
    const [hourlyActivity, setHourlyActivity] = useState<any[]>([]);
    const [topUsers, setTopUsers] = useState<any[]>([]);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const fetchData = async (period: string) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/admin/analytics?period=${period}`);
            
            if (response.ok) {
                const data = await response.json();
                setStats(data.summary || {
                    totalMessages: 0,
                    totalSessions: 0,
                    activeUsers7d: 0,
                    avgMessagesPerSession: 0,
                    messageGrowth: 0,
                    userGrowth: 0
                });
                setMessageTrend(data.trend || []);
                setModeDistribution(data.modes || []);
                setUserTypes(data.userTypes || []);
                setLatencyTrend(data.latencyTrend || []);
                setTokenTrend(data.tokenTrend || []);
                setHourlyActivity(data.hourlyActivity || []);
                setTopUsers(data.topUsers || []);
            } else {
                // Try fallback to general stats if analytics endpoint is missing
                console.warn("Dedicated analytics endpoint not found, attempting fallback to stats...");
                const statsRes = await fetch(`${API_URL}/admin/stats`);
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(prev => ({
                        ...prev,
                        totalMessages: statsData.total_messages || 0,
                        totalSessions: statsData.chat_sessions || 0,
                        activeUsers7d: statsData.active_users_7d || 0,
                        avgMessagesPerSession: statsData.avg_messages_per_session || 0
                    }));
                }
            }
        } catch (err) {
            console.error("Failed to fetch analytics data from database", err);
        } finally {
            setLoading(false);
        }
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
            if (diffInMinutes < 43200) return `${Math.floor(diffInMinutes / 1440)}d ago`;

            return date.toLocaleDateString('default', { month: 'short', day: 'numeric' }).toUpperCase();
        } catch {
            return dateStr;
        }
    };

    useEffect(() => {
        fetchData(viewPeriod);
    }, [viewPeriod]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#181B25] text-white p-4 rounded-2xl shadow-2xl border border-white/5 text-left backdrop-blur-md">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
                    {payload.map((p: any, i: number) => (
                        <p key={i} className="text-sm font-bold flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                            {p.name}: {Math.floor(p.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 admin-dashboard-root pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div className="flex flex-col gap-1 text-left">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">User Analytics</h1>
                    <p className="text-base text-slate-500 font-medium">Deep dive into platform engagement and interaction metrics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-slate-100 rounded-xl font-bold text-xs text-slate-500 uppercase tracking-widest border border-slate-200">
                        <Activity className="w-4 h-4 text-[#FF9000]" /> Real-time Sync
                    </div>
                    <button
                        onClick={() => fetchData(viewPeriod)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition shadow-xl active:scale-95 disabled:opacity-70"
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh All Data
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {[
                    { label: 'Total Messages', value: stats.totalMessages.toLocaleString(), icon: MessageSquare, color: 'amber', growth: stats.messageGrowth },
                    { label: 'Chat Sessions', value: stats.totalSessions.toLocaleString(), icon: Zap, color: 'blue', growth: 12.4 },
                    { label: 'Active Users (7d)', value: stats.activeUsers7d.toLocaleString(), icon: Users, color: 'emerald', growth: stats.userGrowth },
                    { label: 'Avg Msg / Session', value: stats.avgMessagesPerSession, icon: MousePointer2, color: 'purple', growth: 5.2 }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-14 h-14 rounded-2xl bg-slate-50 text-${item.color === 'amber' ? '[#FF9000]' : item.color + '-600'} flex items-center justify-center shadow-inner border border-slate-100`}>
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <div className={`flex items-center gap-1 font-black text-[10px] px-3 py-1.5 rounded-xl uppercase tracking-tighter ${item.growth >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                                    {item.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {Math.abs(item.growth)}%
                                </div>
                            </div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-2">{item.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{item.value}</h3>
                        </div>
                        <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
                            <item.icon className="w-24 h-24" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-8 px-4">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    {/* Main Activity Chart */}
                    <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6 relative z-10">
                            <div className="text-left">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Activity Trend</h3>
                                <p className="text-slate-400 text-sm font-bold mt-1">Comparing message volume and active users</p>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                <button
                                    onClick={() => setViewPeriod('daily')}
                                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition active:scale-95 ${viewPeriod === 'daily' ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-400'}`}
                                >
                                    Last 7 Days
                                </button>
                                <button
                                    onClick={() => setViewPeriod('monthly')}
                                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition active:scale-95 ${viewPeriod === 'monthly' ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-400'}`}
                                >
                                    Last 6 Months
                                </button>
                            </div>
                        </div>

                        <div className="h-[300px] w-full relative z-10">
                            {messageTrend.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={messageTrend} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                                        <defs>
                                            <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#FF9000" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#FF9000" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#181B25" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#181B25" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                            dx={-10}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="messages"
                                            stroke="#FF9000"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorMsg)"
                                            name="Total Messages"
                                            dot={{ r: 4, fill: '#FF9000', strokeWidth: 2, stroke: '#fff' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="users"
                                            stroke="#181B25"
                                            strokeWidth={3}
                                            strokeDasharray="5 5"
                                            fillOpacity={1}
                                            fill="url(#colorUsers)"
                                            name="Active Users"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                    <Activity className="w-12 h-12 mb-4 opacity-10" />
                                    <p className="text-xs font-black uppercase tracking-widest">No activity data found in database</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Token Consumption */}
                    <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm text-left">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" /> Token Consumption
                        </h3>
                        <div className="h-[250px] w-full">
                            {tokenTrend.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={tokenTrend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" hide />
                                        <YAxis tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                        <Area type="monotone" dataKey="tokens" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} name="Tokens" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-200">
                                    <BarChart3 className="w-8 h-8 opacity-20" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Latency Trend */}
                    <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm text-left">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" /> Service Latency
                        </h3>
                        <div className="h-[250px] w-full">
                            {latencyTrend.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={latencyTrend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" hide />
                                        <YAxis tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                        <Line type="monotone" dataKey="latency" stroke="#FF9000" strokeWidth={3} dot={{ r: 4, fill: '#FF9000', stroke: '#fff' }} name="Latency (s)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-200">
                                    <Clock className="w-8 h-8 opacity-20" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Distribution & Top Users */}
                <div className="flex flex-col gap-8">

                    {/* Mode Distribution Chart */}
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-left">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6">Chat Mode Distribution</h3>
                        <div className="h-[250px] w-full flex items-center justify-center">
                            {modeDistribution.some(m => m.value > 0) ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={modeDistribution}
                                            cx="50%"
                                            cy="45%"
                                            innerRadius={50}
                                            outerRadius={70}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {modeDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                        />
                                        <Legend 
                                            verticalAlign="bottom" 
                                            align="center" 
                                            iconType="circle"
                                            wrapperStyle={{ fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: '20px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-center">
                                    <PieChartIcon className="w-8 h-8 text-slate-100 mx-auto mb-2" />
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No usage data</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Type Distribution */}
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-left">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6">User Type Distribution</h3>
                        <div className="h-[250px] w-full flex items-center justify-center">
                            {userTypes.some(m => m.value > 0) ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={userTypes}
                                            cx="50%"
                                            cy="45%"
                                            innerRadius={50}
                                            outerRadius={70}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {userTypes.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                        />
                                        <Legend 
                                            verticalAlign="bottom" 
                                            align="center" 
                                            iconType="circle"
                                            wrapperStyle={{ fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: '20px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-center py-10">
                                    <Users className="w-8 h-8 text-slate-100 mx-auto mb-2" />
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No user data available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Users Mini Table */}
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex-1 text-left">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">High Engagement Users</h3>
                            <button className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:underline">View All</button>
                        </div>
                        <div className="space-y-5">
                            {topUsers.length > 0 ? topUsers.map((user, i) => (
                                <div key={user.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-500 group-hover:border-amber-200 transition-all">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 truncate max-w-[120px]">{user.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Active {getTimeAgo(user.lastActive)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-[#FF9000]">{user.messages}</p>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Prompts</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-10 text-center">
                                    <Users className="w-8 h-8 text-slate-100 mx-auto mb-2" />
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No active users recorded</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
