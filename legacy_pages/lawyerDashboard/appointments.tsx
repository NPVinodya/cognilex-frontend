'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Calendar as CalendarIcon, MapPin, Clock, Plus, Search, Filter,
    MoreVertical, FileText, CheckCircle2, XCircle, User, Trash2, Edit, X, Info
} from 'lucide-react';

type AppointmentStatus = 'Confirmed' | 'Pending' | 'Canceled' | 'Completed' | 'Available';

interface Appointment {
    id: string;
    clientName: string;
    clientEmail?: string;
    clientImage?: string;
    type: string;
    date: string;
    time: string;
    location: string;
    status: AppointmentStatus;
    isBooked: boolean;
}

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past' | 'Canceled'>('Upcoming');
    const [searchQuery, setSearchQuery] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Modals state
    const [showNewModal, setShowNewModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

    // New Slot Form State
    const [newSlot, setNewSlot] = useState({
        date: '',
        time: '',
        location: '',
        type: 'Consultation'
    });
    const [isCreating, setIsCreating] = useState(false);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) return;
            const user = JSON.parse(storedUser);
            const lawyerId = user.id || user._id;

            let statusFilter = "all";
            if (activeTab === "Upcoming") statusFilter = "upcoming";
            if (activeTab === "Past") statusFilter = "completed";
            if (activeTab === "Canceled") statusFilter = "canceled";

            const res = await fetch(`/api/lawyer/dashboard?lawyerId=${lawyerId}&type=all-appointments&status=${statusFilter}`);
            const data = await res.json();
            if (data.success) {
                setAppointments(data.appointments || []);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [activeTab]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        setOpenMenuId(null);
        try {
            const apiStatus = newStatus.toLowerCase();
            const res = await fetch('/api/lawyer/dashboard', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId: id, status: apiStatus })
            });
            const data = await res.json();
            if (data.success) {
                setAppointments(prev => prev.map(apt => 
                    apt.id === id ? { ...apt, status: newStatus as any } : apt
                ));
                if (selectedApt && selectedApt.id === id) {
                    setSelectedApt({ ...selectedApt, status: newStatus as any });
                }
            }
        } catch (error) {
            alert("Failed to update status.");
        }
    };

    const handleDeleteSlot = async (id: string) => {
        setOpenMenuId(null);
        if (!confirm("Are you sure you want to delete this available slot?")) return;
        
        try {
            const res = await fetch(`/api/lawyer/dashboard?slotId=${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setAppointments(prev => prev.filter(apt => apt.id !== id));
                if (showDetailModal) setShowDetailModal(false);
            } else {
                const data = await res.json();
                alert(data.message || "Failed to delete slot");
            }
        } catch (error) {
            console.error("Error deleting slot:", error);
        }
    };

    const handleCreateSlot = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) return;
            const user = JSON.parse(storedUser);
            const lawyerId = user.id || user._id;

            const res = await fetch('/api/lawyer/dashboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lawyerId,
                    ...newSlot
                })
            });
            
            const data = await res.json();
            if (data.success) {
                setShowNewModal(false);
                setNewSlot({ date: '', time: '', location: '', type: 'Consultation' });
                fetchAppointments(); // Refresh
            } else {
                alert(data.message || "Failed to create slot");
            }
        } catch (error) {
            console.error("Error creating slot:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const filteredAppointments = appointments.filter((apt) => {
        const matchesSearch = (apt.clientName || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (apt.id || "").toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const getStatusColor = (status: AppointmentStatus) => {
        switch (status) {
            case 'Confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Pending': return 'bg-orange-50 text-[#FF9000] border-orange-100';
            case 'Completed': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Canceled': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'Available': return 'bg-slate-50 text-slate-500 border-slate-200';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    const getTypeColor = (type: string) => {
        const t = (type || "").toLowerCase();
        if (t.includes('consultation')) return 'bg-orange-50 text-orange-600';
        if (t.includes('court')) return 'bg-purple-50 text-purple-600';
        if (t.includes('meeting')) return 'bg-emerald-50 text-emerald-600';
        return 'bg-slate-100 text-slate-600';
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-[32px] font-bold text-[#181B25] tracking-tight leading-tight">Appointments</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Manage your upcoming bookings, schedule, and client meetings.</p>
                </div>
                <button 
                    onClick={() => setShowNewModal(true)}
                    className="inline-flex items-center justify-center gap-2 bg-[#FF9000] hover:bg-[#E68200] text-white px-6 py-2.5 rounded-full shadow-md shadow-orange-600/20 text-sm font-bold transition"
                >
                    <Plus className="w-4 h-4" /> New Appointment
                </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
                <div className="p-6 md:px-8 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/50">
                    <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-xl w-fit border border-slate-200/50">
                        {(['Upcoming', 'Past', 'Canceled'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab
                                    ? 'bg-white text-[#181B25] shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative w-full lg:w-72">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search clients or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition font-medium"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <div className="hidden md:grid grid-cols-12 gap-4 p-4 px-8 border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="col-span-4">Client Details</div>
                        <div className="col-span-3">Date & Time</div>
                        <div className="col-span-2">Location</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-slate-100/80">
                        {loading ? (
                             <div className="p-20 text-center text-slate-500 font-medium whitespace-nowrap">Loading appointments...</div>
                        ) : filteredAppointments.length > 0 ? (
                            filteredAppointments.map((apt) => (
                                <div key={apt.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 md:px-8 items-center hover:bg-slate-50/50 transition duration-150 relative">
                                    <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${apt.isBooked ? 'bg-slate-100 border-slate-200' : 'bg-orange-50 border-orange-100'}`}>
                                            <User className={`w-5 h-5 ${apt.isBooked ? 'text-slate-400' : 'text-[#FF9000]'}`} />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className={`text-[15px] font-bold truncate ${apt.isBooked ? 'text-[#181B25]' : 'text-slate-400 font-medium'}`}>
                                                {apt.clientName}
                                            </h4>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5 truncate uppercase tracking-tighter">ID: {apt.id.slice(-8)}</p>
                                        </div>
                                    </div>

                                    <div className="col-span-1 md:col-span-3 flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${getTypeColor(apt.type)}`}>
                                                {apt.type}
                                            </span>
                                        </div>
                                        <p className="text-[13px] font-bold text-[#181B25] flex items-center gap-1.5 mt-0.5">
                                            <CalendarIcon className="w-3.5 h-3.5 text-slate-400" /> {apt.date}
                                        </p>
                                        <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.time}
                                        </p>
                                    </div>

                                    <div className="col-span-1 md:col-span-2 flex items-start gap-2 text-[13px] text-slate-600 font-medium">
                                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                        <span className="leading-tight truncate">{apt.location}</span>
                                    </div>

                                    <div className="col-span-1 md:col-span-1">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] border font-black uppercase tracking-widest ${getStatusColor(apt.status)}`}>
                                            {apt.status === 'Confirmed' && <CheckCircle2 className="w-3 h-3" />}
                                            {apt.status === 'Available' && <Plus className="w-3 h-3" />}
                                            {apt.status === 'Canceled' && <XCircle className="w-3 h-3" />}
                                            <span className="whitespace-nowrap">{apt.status}</span>
                                        </span>
                                    </div>

                                    <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-2 relative">
                                        {apt.isBooked && (
                                            <button 
                                                onClick={() => { setSelectedApt(apt); setShowDetailModal(true); }}
                                                className="px-4 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 transition"
                                            >
                                                View Detail
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => setOpenMenuId(openMenuId === apt.id ? null : apt.id)}
                                            className="p-2 text-slate-400 hover:text-[#181B25] hover:bg-slate-100 rounded-lg transition"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>

                                        {openMenuId === apt.id && (
                                            <div ref={menuRef} className="absolute right-0 top-10 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                                {apt.status === 'Pending' && (
                                                    <button onClick={() => handleUpdateStatus(apt.id, 'Confirmed')} className="w-full text-left px-4 py-2 text-sm font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4" /> Confirm Appointment
                                                    </button>
                                                )}
                                                {apt.status !== 'Completed' && apt.status !== 'Available' && (
                                                    <button onClick={() => handleUpdateStatus(apt.id, 'Completed')} className="w-full text-left px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 flex items-center gap-2">
                                                        <FileText className="w-4 h-4" /> Mark as Completed
                                                    </button>
                                                )}
                                                {apt.status !== 'Canceled' && (
                                                    <button onClick={() => handleUpdateStatus(apt.id, 'Canceled')} className="w-full text-left px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                                                        <XCircle className="w-4 h-4" /> Cancel Appointment
                                                    </button>
                                                )}
                                                {apt.status === 'Available' && (
                                                    <button onClick={() => handleDeleteSlot(apt.id)} className="w-full text-left px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                                                        <Trash2 className="w-4 h-4" /> Delete Slot
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-16 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                    <CalendarIcon className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-[#181B25] font-bold text-lg mb-1 whitespace-nowrap">No appointments found</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* New Appointment Modal */}
            {showNewModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-[#181B25]">New Availability Slot</h2>
                                <p className="text-sm text-slate-500 font-medium">Add a new time slot to your schedule.</p>
                            </div>
                            <button onClick={() => setShowNewModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateSlot} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Date</label>
                                    <input 
                                        type="date" 
                                        required 
                                        value={newSlot.date}
                                        onChange={e => setNewSlot({...newSlot, date: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9000] outline-none transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Time</label>
                                    <input 
                                        type="text" 
                                        placeholder="10:00 AM"
                                        required 
                                        value={newSlot.time}
                                        onChange={e => setNewSlot({...newSlot, time: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9000] outline-none transition"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Type of Session</label>
                                <select 
                                    value={newSlot.type}
                                    onChange={e => setNewSlot({...newSlot, type: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9000] outline-none transition appearance-none"
                                >
                                    <option>Consultation</option>
                                    <option>Court Session</option>
                                    <option>Internal Meeting</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Court Complex, Colombo"
                                        value={newSlot.location}
                                        onChange={e => setNewSlot({...newSlot, location: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9000] outline-none transition"
                                    />
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isCreating}
                                className="w-full py-3.5 bg-[#FF9000] hover:bg-[#E68200] text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {isCreating ? 'Creating...' : 'Create Availability Slot'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedApt && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Info className="w-5 h-5 text-[#FF9000]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Appointment Details</h2>
                                    <p className="text-xs text-slate-400 font-medium tracking-tight uppercase">Reference ID: {selectedApt.id}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-8">
                            {/* Client Header */}
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                                        <User className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-[#181B25] tracking-tight">{selectedApt.clientName}</h3>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mt-1 border ${getStatusColor(selectedApt.status)}`}>
                                            {selectedApt.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 py-6 border-y border-slate-100">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                            <CalendarIcon className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                                            <p className="text-sm font-bold text-[#181B25]">{selectedApt.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</p>
                                            <p className="text-sm font-bold text-[#181B25]">{selectedApt.time}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                                            <p className="text-sm font-bold text-[#181B25]">{selectedApt.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</p>
                                            <p className="text-sm font-bold text-[#181B25]">{selectedApt.type}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                {selectedApt.status === 'Pending' && (
                                    <>
                                        <button onClick={() => handleUpdateStatus(selectedApt.id, 'Confirmed')} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition">Confirm Now</button>
                                        <button onClick={() => handleUpdateStatus(selectedApt.id, 'Canceled')} className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-sm transition border border-rose-100">Decline</button>
                                    </>
                                )}
                                {selectedApt.status === 'Confirmed' && (
                                    <button onClick={() => handleUpdateStatus(selectedApt.id, 'Completed')} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition">Mark Appointment as Completed</button>
                                )}
                                {selectedApt.status === 'Available' && (
                                    <button onClick={() => handleDeleteSlot(selectedApt.id)} className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-sm transition border border-rose-100">Remove from Schedule</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
