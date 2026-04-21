'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
    Users, Search, Filter, Plus, Phone, Mail, MoreVertical, 
    Briefcase, Calendar, Clock, MapPin, X, CreditCard, CheckCircle2 
} from 'lucide-react';

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    notes: string;
    status: string;
}

interface BookingRecord {
    id: string;
    service: string;
    appointmentDate: string;
    appointmentTime: string;
    location: string;
    amount: number;
    currency: string;
    paidDate: string;
    status: string;
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Dropdown & Modal State
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [clientHistory, setClientHistory] = useState<BookingRecord[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    
    const menuRef = useRef<HTMLDivElement>(null);

    const fetchClients = async () => {
        try {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) return;
            const user = JSON.parse(storedUser);
            const lawyerId = user.id || user._id;

            const res = await fetch(`/api/lawyer/dashboard?lawyerId=${lawyerId}&type=clients`);
            const data = await res.json();
            if (data.success) {
                setClients(data.clients || []);
            }
        } catch (error) {
            console.error("Error fetching clients:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchClientHistory = async (client: Client) => {
        setLoadingHistory(true);
        setSelectedClient(client);
        setShowHistoryModal(true);
        setOpenMenuId(null);
        
        try {
            const storedUser = localStorage.getItem("user");
            const user = JSON.parse(storedUser!);
            const lawyerId = user.id || user._id;
            
            const res = await fetch(`/api/lawyer/dashboard?lawyerId=${lawyerId}&type=bookings&clientEmail=${encodeURIComponent(client.email)}`);
            const data = await res.json();
            if (data.success) {
                setClientHistory(data.bookings || []);
            }
        } catch (error) {
            console.error("Error fetching client history:", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const filteredClients = clients.filter(client =>
        (client.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.id || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-[32px] font-bold text-[#181B25] tracking-tight leading-tight">Clients</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Manage your client contacts, details, and active directory.</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-slate-500 font-bold">Loading Clients...</div>
                ) : filteredClients.length > 0 ? (
                    filteredClients.map(client => (
                        <div key={client.id} className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] p-6 hover:shadow-lg transition group relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF9000] font-black text-lg">
                                    {client.name.charAt(0)}
                                </div>
                                <div className="relative">
                                    <button 
                                        onClick={() => setOpenMenuId(openMenuId === client.id ? null : client.id)}
                                        className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg transition"
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                    
                                    {openMenuId === client.id && (
                                        <div ref={menuRef} className="absolute right-0 top-10 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <button 
                                                onClick={() => fetchClientHistory(client)}
                                                className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-orange-50 hover:text-[#FF9000] flex items-center gap-2 transition"
                                            >
                                                <Calendar className="w-4 h-4" /> View Booking History
                                            </button>
                                            <button className="w-full text-left px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition">
                                                <X className="w-4 h-4" /> Archive (Beta)
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-[#181B25] mb-1">{client.name}</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-[12px] text-slate-500 font-medium truncate">{client.email}</span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-[13px] text-slate-700 font-bold">
                                    <Phone className="w-4 h-4 text-slate-400" /> {client.phone || 'N/A'}
                                </div>
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Notes</p>
                                    <p className="text-[12px] text-slate-600 font-medium leading-relaxed italic">
                                        "{client.notes || 'Professional client from bookings'}"
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Status</span>
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${client.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {client.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-slate-500 font-bold">No clients found</h3>
                    </div>
                )}
            </div>

            {/* History Modal */}
            {showHistoryModal && selectedClient && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                                    <Briefcase className="w-5 h-5 text-[#FF9000]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">{selectedClient.name}'s History</h2>
                                    <p className="text-xs text-slate-500 font-medium tracking-tight">Viewing all consultation records</p>
                                </div>
                            </div>
                            <button onClick={() => setShowHistoryModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-0 max-h-[500px] overflow-y-auto">
                            {loadingHistory ? (
                                <div className="p-20 text-center text-slate-400 font-bold">Fetching records...</div>
                            ) : clientHistory.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {clientHistory.map(record => (
                                        <div key={record.id} className="p-6 hover:bg-slate-50 transition flex items-center justify-between gap-4">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-[#181B25]">{record.service}</span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold uppercase">{record.status}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                                                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {record.appointmentDate}</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {record.appointmentTime}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-black text-[#181B25]">{record.currency} {record.amount.toLocaleString()}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Paid: {record.paidDate}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-20 text-center">
                                    <CreditCard className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 font-bold">No booking records for this client.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
