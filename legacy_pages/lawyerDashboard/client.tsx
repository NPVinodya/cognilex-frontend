'use client';

import React, { useState } from 'react';
import { Users, Search, Filter, Plus, Phone, Mail, MoreVertical, Briefcase } from 'lucide-react';

const MOCK_CLIENTS = [
    { id: 'C-001', name: 'Sarah Jenkins', type: 'Individual', phone: '+94 77 123 4567', email: 'sarah.j@email.com', activeCases: 1, status: 'Active' },
    { id: 'C-002', name: 'Corporate Tech Inc.', type: 'Corporate', phone: '+94 11 234 5678', email: 'legal@corptech.com', activeCases: 3, status: 'Active' },
    { id: 'C-003', name: 'Malinga Perera', type: 'Individual', phone: '+94 71 345 6789', email: 'malinga.p@email.com', activeCases: 1, status: 'Active' },
    { id: 'C-004', name: 'Priyanka Silva', type: 'Individual', phone: '+94 76 456 7890', email: 'priyanka.s@email.com', activeCases: 0, status: 'Inactive' },
    { id: 'C-005', name: 'Global Logistics', type: 'Corporate', phone: '+94 11 567 8901', email: 'contact@globallog.com', activeCases: 2, status: 'Active' },
    { id: 'C-006', name: 'David Fernando', type: 'Individual', phone: '+94 77 678 9012', email: 'david.f@email.com', activeCases: 0, status: 'Archived' },
];

export default function ClientsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredClients = MOCK_CLIENTS.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-[32px] font-bold text-[#181B25] tracking-tight leading-tight">Clients</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Manage your client contacts, details, and active directory.</p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 bg-[#FF9000] hover:bg-[#E68200] text-white px-6 py-2.5 rounded-full shadow-md shadow-orange-600/20 text-sm font-bold transition">
                    <Plus className="w-4 h-4" /> Add New Client
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] shadow-sm transition font-medium"
                    />
                </div>
                <button className="shrink-0 p-2.5 px-4 bg-white border border-slate-200 text-slate-700 hover:text-[#FF9000] hover:border-[#FF9000] rounded-xl transition shadow-sm font-bold text-sm flex items-center justify-center gap-2">
                    <Filter className="w-4 h-4" /> Filters
                </button>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map(client => (
                    <div key={client.id} className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] p-6 hover:shadow-lg transition group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">
                                {client.name.charAt(0)}
                            </div>
                            <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition opacity-0 group-hover:opacity-100">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>

                        <h3 className="text-lg font-bold text-[#181B25] mb-1">{client.name}</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-lg ${client.type === 'Corporate' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                                {client.type}
                            </span>
                            <span className="text-[11px] text-slate-400 font-bold">ID: {client.id}</span>
                        </div>

                        <div className="space-y-2 mb-6">
                            <p className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                                <Phone className="w-4 h-4 text-slate-400" /> {client.phone}
                            </p>
                            <p className="flex items-center gap-2 text-[13px] text-slate-600 font-medium truncate">
                                <Mail className="w-4 h-4 text-slate-400" /> {client.email}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-1.5">
                                <Briefcase className="w-4 h-4 text-[#FF9000]" />
                                <span className="text-sm font-bold text-[#181B25]">{client.activeCases} <span className="text-slate-500 font-medium">Active</span></span>
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${client.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                {client.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
