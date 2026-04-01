'use client';

import React from 'react';
import { TrendingUp, DollarSign, Users, Briefcase, Calendar, Download } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-[32px] font-bold text-[#181B25] tracking-tight leading-tight">Analytics & Reports</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Monitor your practice's financial performance and client engagement metrics.</p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-[#FF9000] hover:text-[#FF9000] text-slate-700 px-6 py-2.5 rounded-full shadow-sm text-sm font-bold transition">
                    <Download className="w-4 h-4" /> Export Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><DollarSign className="w-6 h-6" /></div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Gross Earnings</p>
                            <h3 className="text-2xl font-black text-[#181B25]">LKR 450,000</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
                        <TrendingUp className="w-3 h-3" /> +15.2% this month
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-orange-50 text-[#FF9000] rounded-xl flex items-center justify-center"><Briefcase className="w-6 h-6" /></div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Case Conversion</p>
                            <h3 className="text-2xl font-black text-[#181B25]">42%</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
                        <TrendingUp className="w-3 h-3" /> +4.1% this month
                    </div>
                </div>

                <div className="bg-[#FF9000] text-white p-6 rounded-2xl border border-[#FF9000] shadow-[0_8px_20px_-8px_rgba(255,144,0,0.4)] relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-white/20 text-white rounded-xl flex items-center justify-center backdrop-blur-sm"><Users className="w-6 h-6" /></div>
                            <div>
                                <p className="text-[11px] font-bold text-orange-100 uppercase tracking-widest">Client Retention</p>
                                <h3 className="text-2xl font-black">88%</h3>
                            </div>
                        </div>
                        <div className="text-xs font-bold text-white bg-white/20 backdrop-blur-sm w-fit px-2 py-1 rounded-lg">
                            Exceptional standing metrics
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] p-6">
                    <h3 className="font-bold text-[#181B25] mb-6">Revenue Overview (6 Months)</h3>
                    <div className="h-64 w-full bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3">
                        <TrendingUp className="w-8 h-8 text-slate-300" />
                        <p className="text-slate-400 text-sm font-bold">Chart Integration Pending...</p>
                        <p className="text-[11px] text-slate-400">Connect Recharts or Chart.js for data viz</p>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] p-6">
                    <h3 className="font-bold text-[#181B25] mb-6">Case Type Distribution</h3>
                    <div className="h-64 w-full bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3">
                        <Briefcase className="w-8 h-8 text-slate-300" />
                        <p className="text-slate-400 text-sm font-bold">Pie Chart Integration Pending...</p>
                    </div>
                </div>
            </div>
        </>
    );
}
