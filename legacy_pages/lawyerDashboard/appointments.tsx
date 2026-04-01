'use client';

import React, { useState } from 'react';
import {
    Calendar as CalendarIcon, MapPin, Clock, Plus, Search, Filter,
    MoreVertical, FileText, CheckCircle2, XCircle, User
} from 'lucide-react';

type AppointmentStatus = 'Confirmed' | 'Pending' | 'Canceled' | 'Completed';

interface Appointment {
    id: string;
    clientName: string;
    clientImage?: string;
    type: 'Consultation' | 'Court' | 'Meeting';
    date: string;
    time: string;
    location: string;
    status: AppointmentStatus;
}

const INITIAL_APPOINTMENTS: Appointment[] = [
    {
        id: 'APT-1042',
        clientName: 'Sarah Jenkins',
        type: 'Consultation',
        date: 'March 12, 2026',
        time: '09:00 AM - 10:00 AM',
        location: 'Colombo Inner Office',
        status: 'Confirmed',
    },
    {
        id: 'APT-1043',
        clientName: 'Corporate Tech Inc.',
        type: 'Court',
        date: 'March 12, 2026',
        time: '11:00 AM - 12:30 PM',
        location: 'Supreme Court - Hall B',
        status: 'Confirmed',
    },
    {
        id: 'APT-1044',
        clientName: 'Malinga Perera',
        type: 'Consultation',
        date: 'March 14, 2026',
        time: '02:00 PM - 03:00 PM',
        location: 'Colombo CBD Office',
        status: 'Pending',
    },
    {
        id: 'APT-1045',
        clientName: 'Priyanka Silva',
        type: 'Meeting',
        date: 'March 15, 2026',
        time: '10:00 AM - 11:30 AM',
        location: 'Colombo CBD Office',
        status: 'Pending',
    },
    {
        id: 'APT-1046',
        clientName: 'David Fernando',
        type: 'Consultation',
        date: 'March 05, 2026',
        time: '01:00 PM - 02:00 PM',
        location: 'Colombo Inner Office',
        status: 'Completed',
    },
    {
        id: 'APT-1047',
        clientName: 'Nuwan Jayakody',
        type: 'Meeting',
        date: 'March 02, 2026',
        time: '09:30 AM - 10:30 AM',
        location: 'Colombo CBD Office',
        status: 'Canceled',
    },
];

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
    const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past' | 'Canceled'>('Upcoming');
    const [searchQuery, setSearchQuery] = useState('');

    // Status Action Handler
    const handleUpdateStatus = (id: string, newStatus: AppointmentStatus) => {
        setAppointments(prev => prev.map(apt =>
            apt.id === id ? { ...apt, status: newStatus } : apt
        ));
    };

    // Filter logic based on tabs and search
    const filteredAppointments = appointments.filter((apt) => {
        const matchesSearch = apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || apt.id.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        if (activeTab === 'Upcoming') {
            return apt.status === 'Confirmed' || apt.status === 'Pending';
        } else if (activeTab === 'Past') {
            return apt.status === 'Completed';
        } else {
            return apt.status === 'Canceled';
        }
    });

    const getStatusColor = (status: AppointmentStatus) => {
        switch (status) {
            case 'Confirmed': return 'bg-emerald-50 text-emerald-600';
            case 'Pending': return 'bg-orange-50 text-[#FF9000]';
            case 'Completed': return 'bg-blue-50 text-blue-600';
            case 'Canceled': return 'bg-rose-50 text-rose-600';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Consultation': return 'bg-orange-50 text-orange-600';
            case 'Court': return 'bg-purple-50 text-purple-600';
            case 'Meeting': return 'bg-emerald-50 text-emerald-600';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-[32px] font-bold text-[#181B25] tracking-tight leading-tight">Appointments</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Manage your upcoming bookings, schedule, and client meetings.</p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 bg-[#FF9000] hover:bg-[#E68200] text-white px-6 py-2.5 rounded-full shadow-md shadow-orange-600/20 text-sm font-bold transition">
                    <Plus className="w-4 h-4" /> New Appointment
                </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">

                {/* Toolbar (Tabs & Search) */}
                <div className="p-6 md:px-8 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/50">

                    {/* Tabs */}
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

                    {/* Search & Filter */}
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
                        <button className="shrink-0 p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-[#FF9000] hover:border-[#FF9000] rounded-xl transition shadow-sm">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Appointments List View */}
                <div className="p-0">

                    {/* Table Header (Hidden on Mobile) */}
                    <div className="hidden md:grid grid-cols-12 gap-4 p-4 px-8 border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="col-span-4">Client Details</div>
                        <div className="col-span-3">Date & Time</div>
                        <div className="col-span-2">Location</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-slate-100/80">
                        {filteredAppointments.length > 0 ? (
                            filteredAppointments.map((apt) => (
                                <div key={apt.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 md:px-8 items-center hover:bg-slate-50/50 transition duration-150">

                                    {/* Client Info */}
                                    <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                            <User className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-[15px] font-bold text-[#181B25]">{apt.clientName}</h4>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">{apt.id}</p>
                                        </div>
                                    </div>

                                    {/* Date, Time, and Type */}
                                    <div className="col-span-1 md:col-span-3 flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getTypeColor(apt.type)}`}>
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

                                    {/* Location */}
                                    <div className="col-span-1 md:col-span-2 flex items-start gap-2 text-[13px] text-slate-600 font-medium">
                                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                        <span className="leading-tight">{apt.location}</span>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-1 md:col-span-1">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusColor(apt.status)}`}>
                                            {apt.status === 'Confirmed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                            {apt.status === 'Canceled' && <XCircle className="w-3.5 h-3.5" />}
                                            {apt.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                                            {apt.status === 'Completed' && <FileText className="w-3.5 h-3.5" />}
                                            <span className="hidden xl:block">{apt.status}</span>
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-2 mt-4 md:mt-0">
                                        {apt.status === 'Pending' ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(apt.id, 'Confirmed')}
                                                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100/50 text-[11px] font-bold rounded-lg transition"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(apt.id, 'Canceled')}
                                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100/50 text-[11px] font-bold rounded-lg transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <button className="text-[13px] font-bold text-[#181B25] hover:text-[#FF9000] transition md:hidden">
                                                    View
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-[#181B25] hover:bg-slate-100 rounded-lg transition hidden md:flex cursor-pointer transition">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                    </div>

                                </div>
                            ))
                        ) : (
                            <div className="p-16 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                    <CalendarIcon className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-[#181B25] font-bold text-lg mb-1">No appointments found</h3>
                                <p className="text-slate-500 text-sm max-w-sm">There are no {activeTab.toLowerCase()} appointments matching your current filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
