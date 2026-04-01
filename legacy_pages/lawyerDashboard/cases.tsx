'use client';

import React, { useState } from 'react';
import { Briefcase, Search, Filter, Plus, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const MOCK_CASES = [
    { id: 'CS-8492', title: 'Jenkins vs. City Transport', client: 'Sarah Jenkins', type: 'Civil Law', status: 'In Progress', progress: 65, nextDate: 'Mar 24, 2026' },
    { id: 'CS-8493', title: 'Corporate Merger Agreement', client: 'Corporate Tech Inc.', type: 'Corporate', status: 'Pending Review', progress: 40, nextDate: 'Mar 15, 2026' },
    { id: 'CS-8494', title: 'Perera Property Dispute', client: 'Malinga Perera', type: 'Property', status: 'Court phase', progress: 80, nextDate: 'Mar 20, 2026' },
    { id: 'CS-8495', title: 'Logistics Contract Renewal', client: 'Global Logistics', type: 'Contracts', status: 'Completed', progress: 100, nextDate: 'N/A' },
];

export default function CasesPage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-[32px] font-bold text-[#181B25] tracking-tight leading-tight">Cases</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Track your case files, legal proceedings, and dispute statuses.</p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 bg-[#FF9000] hover:bg-[#E68200] text-white px-6 py-2.5 rounded-full shadow-md shadow-orange-600/20 text-sm font-bold transition">
                    <Plus className="w-4 h-4" /> Open New Case
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by case title or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] shadow-sm transition font-medium"
                    />
                </div>
                <button className="shrink-0 p-2.5 px-4 bg-white border border-slate-200 text-slate-700 hover:text-[#FF9000] hover:border-[#FF9000] rounded-xl transition shadow-sm font-bold text-sm flex items-center justify-center gap-2">
                    <Filter className="w-4 h-4" /> Filters
                </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 px-6 border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="col-span-4">Case Details</div>
                    <div className="col-span-2">Client</div>
                    <div className="col-span-3">Progress / Status</div>
                    <div className="col-span-2">Next Hearing</div>
                    <div className="col-span-1 text-right">Action</div>
                </div>

                <div className="divide-y divide-slate-100/80">
                    {MOCK_CASES.map((box) => (
                        <div key={box.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 hover:bg-slate-50/50 transition items-center">

                            <div className="col-span-1 md:col-span-4 flex items-start gap-4">
                                <div className="mt-1 w-9 h-9 rounded-lg bg-orange-50 text-[#FF9000] flex items-center justify-center shrink-0">
                                    <Briefcase className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-bold text-[#181B25]">{box.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[11px] font-bold text-slate-400">ID: {box.id}</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold uppercase">{box.type}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 text-[13px] font-bold text-slate-700">
                                {box.client}
                            </div>

                            <div className="col-span-1 md:col-span-3">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{box.status}</span>
                                    <span className="text-[11px] font-bold text-[#181B25]">{box.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className={`h-2 rounded-full ${box.progress === 100 ? 'bg-emerald-500' : 'bg-[#FF9000]'}`} style={{ width: `${box.progress}%` }}></div>
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 flex items-center gap-2 text-[13px] font-bold text-slate-600">
                                <Calendar className="w-4 h-4 text-slate-400" /> {box.nextDate}
                            </div>

                            <div className="col-span-1 md:col-span-1 flex justify-end">
                                <button className="px-4 py-1.5 bg-white border border-slate-200 hover:border-[#FF9000] hover:text-[#FF9000] text-slate-700 text-xs font-bold rounded-lg transition shadow-sm">
                                    Manage
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
