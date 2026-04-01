'use client';

import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon, MapPin, Clock, Plus, Edit, Trash2,
    Users, TrendingUp, Star, Settings, ChevronRight, ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AvailabilitySlot {
    id: string;
    date: string;
    time: string;
    location: string;
    isBooked: boolean;
    clientName?: string;
    type?: 'Consultation' | 'Court' | 'Meeting';
}

const WEEK_DATES = [
    { day: 'Mon', date: 9, active: false },
    { day: 'Tue', date: 10, active: false },
    { day: 'Wed', date: 11, active: false },
    { day: 'Thu', date: 12, active: true },
    { day: 'Fri', date: 13, active: false },
    { day: 'Sat', date: 14, active: false },
    { day: 'Sun', date: 15, active: false },
];




export default function LawyerDashboard() {

    const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);


    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) {
                    setLoading(false);
                    return;
                }
                
                const user = JSON.parse(storedUser);
                const lawyerId = user.id || user._id; // Adjust based on your auth object

                if (!lawyerId) {
                    console.error("Lawyer ID not found.");
                    setLoading(false);
                    return;
                }
                
                const response = await fetch(`http://127.0.0.1:8000/api/lawyer/slots/${lawyerId}`);
                if (!response.ok) throw new Error("Failed to fetch");
                
                const data = await response.json();
                
                // Set slots safely ensuring it is an array
                setAvailabilitySlots(Array.isArray(data) ? data : (data.slots || []));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching slots:", error);
                setAvailabilitySlots([]);
                setLoading(false);
            }
        };

        fetchSlots();
    }, []);


    if (loading) return <div className="p-10">Loading Dashboard...</div>;

    const handleDeleteSlot = (id: string) => {
        setAvailabilitySlots(availabilitySlots.filter(slot => slot.id !== id));
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-[32px] font-bold text-[#181B25] tracking-tight leading-tight">Welcome back, Prabani</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Here is what's happening with your practice today.</p>
                </div>
                <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] text-sm font-bold text-slate-700 w-fit">
                    <Clock className="w-4 h-4 text-[#FF9000]" />
                    Thursday, March 12, 2026
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 py-7 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-orange-50 text-[#FF9000] rounded-xl">
                            <CalendarIcon className="w-6 h-6" />
                        </div>
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none font-bold">+2%</Badge>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Total Bookings</p>
                        <h3 className="text-[32px] font-black text-[#181B25] leading-none">142</h3>
                    </div>
                </div>

                <div className="bg-[#FF9000] p-6 py-7 rounded-2xl border border-[#FF9000] shadow-[0_8px_20px_-8px_rgba(255,144,0,0.4)] flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 transition text-white">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-white/20 text-white rounded-xl backdrop-blur-sm">
                            <Star className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-orange-100 uppercase tracking-widest mb-1.5">Profile Views</p>
                        <h3 className="text-[32px] font-black text-white leading-none">2,408</h3>
                    </div>
                </div>

                <div className="bg-white p-6 py-7 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-orange-50 text-[#FF9000] rounded-xl">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Pending Requests</p>
                        <h3 className="text-[32px] font-black text-[#181B25] leading-none">8</h3>
                    </div>
                </div>

                <div className="bg-white p-6 py-7 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                            <Users className="w-6 h-6" />
                        </div>
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none font-bold">+12%</Badge>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Active Clients</p>
                        <h3 className="text-[32px] font-black text-[#181B25] leading-none">84</h3>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">

                {/* Calendar & Schedule Section */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-6 md:px-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-[17px] font-bold text-[#181B25] flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5 text-[#FF9000]" />
                                    Schedule & Appointments
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">Manage your calendar capacity for the week.</p>
                            </div>
                            <Button className="bg-[#FF9000] hover:bg-[#E68200] rounded-full shadow-md shadow-orange-600/20 text-sm h-10 px-6 gap-2 text-white font-semibold">
                                <Plus className="h-4 w-4" /> Add Slot
                            </Button>
                        </div>

                        {/* Week Days Picker */}
                        <div className="px-6 md:px-8 py-5 border-b border-slate-100 flex items-center justify-between gap-2">
                            <button className="p-1.5 text-slate-400 hover:text-slate-700 transition"><ChevronLeft className="w-5 h-5" /></button>
                            <div className="flex gap-2 sm:gap-4 overflow-x-auto w-full justify-between pb-1 no-scrollbar">
                                {WEEK_DATES.map((d, i) => (
                                    <button key={i} className={`flex flex-col items-center justify-center min-w-[56px] h-[64px] rounded-2xl border transition hover:-translate-y-0.5 ${d.active ? 'bg-[#FF9000] border-[#FF9000] text-white shadow-lg shadow-[#FF9000]/30' : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300'}`}>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${d.active ? 'text-orange-100' : 'text-slate-400'}`}>{d.day}</span>
                                        <span className="text-xl font-bold">{d.date}</span>
                                    </button>
                                ))}
                            </div>
                            <button className="p-1.5 text-slate-400 hover:text-slate-700 transition"><ChevronRight className="w-5 h-5" /></button>
                        </div>

                        {/* Slots Timeline */}
                        <div className="p-6 md:p-8 pt-8">
                            <div className="relative border-l border-slate-200/80 ml-3 space-y-10 pb-4">

                                {availabilitySlots.map((slot, index) => {
                                    const isConsultation = slot.type === 'Consultation';
                                    const isCourt = slot.type === 'Court';
                                    const dotColor = slot.isBooked
                                        ? (isCourt ? 'bg-[#984FFF]' : 'bg-[#FF9000]')
                                        : 'bg-[#10B981]';

                                    const tagColors = slot.isBooked
                                        ? (isCourt ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600')
                                        : 'bg-emerald-50 text-emerald-600';

                                    const boxStyle = slot.isBooked
                                        ? 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
                                        : 'bg-slate-50/50 border-2 border-dashed border-slate-200 hover:border-emerald-300';

                                    return (
                                        <div key={slot.id} className="relative pl-10 group">
                                            {/* Dot */}
                                            <div className={`absolute -left-[6px] top-6 w-3 h-3 rounded-full ${dotColor} ring-4 ring-white`}></div>

                                            <div className={`p-5 rounded-2xl transition-all ${boxStyle}`}>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${tagColors}`}>
                                                                {slot.type}
                                                            </span>
                                                            <span className="text-[13px] font-bold text-[#181B25] flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {slot.time}</span>
                                                        </div>
                                                        <h4 className="text-lg font-bold text-[#181B25] tracking-tight">
                                                            {slot.isBooked ? slot.clientName : 'Open Available Slot'}
                                                        </h4>
                                                        <div className="flex items-center gap-1.5 mt-1.5 text-[13px] text-slate-500 font-medium">
                                                            <MapPin className="h-3.5 w-3.5" />
                                                            {slot.location}
                                                        </div>
                                                    </div>

                                                    <div className="shrink-0">
                                                        {slot.isBooked ? (
                                                            <button className="px-5 py-2.5 bg-[#181B25] hover:bg-[#0e1017] text-white text-sm font-bold rounded-full transition w-full sm:w-auto shadow-sm">
                                                                View Details
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => handleDeleteSlot(slot.id)} className="px-5 py-2.5 bg-white text-rose-500 border border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-sm font-bold rounded-full transition w-full sm:w-auto flex items-center justify-center gap-2 shadow-sm">
                                                                <Trash2 className="w-4 h-4" /> Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Tools */}
                <div className="lg:col-span-4 flex flex-col gap-6">

                    {/* Quick Actions Card */}
                    <div className="bg-[#181B25] rounded-2xl p-6 text-white overflow-hidden relative shadow-lg">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-400/20 to-transparent blur-2xl"></div>

                        <h3 className="text-base font-bold mb-5 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-[#FF9000]" />
                            Quick Actions
                        </h3>
                        <div className="space-y-3 relative z-10 block">
                            <button className="w-full flex items-center gap-4 p-3.5 rounded-xl bg-[#222635] hover:bg-[#2A2E3D] border border-slate-700/50 transition">
                                <div className="bg-[#2A2E3D] text-[#FF9000] p-2.5 rounded-full"><Plus className="w-4 h-4" /></div>
                                <span className="font-bold text-sm text-slate-200">Add New Slot</span>
                            </button>
                            <button className="w-full flex items-center gap-4 p-3.5 rounded-xl bg-[#222635] hover:bg-[#2A2E3D] border border-slate-700/50 transition">
                                <div className="bg-[#2A2E3D] text-[#984FFF] p-2.5 rounded-full"><Edit className="w-4 h-4" /></div>
                                <span className="font-bold text-sm text-slate-200">Update Profile Details</span>
                            </button>
                            <button className="w-full flex items-center gap-4 p-3.5 rounded-xl bg-[#222635] hover:bg-[#2A2E3D] border border-slate-700/50 transition">
                                <div className="bg-[#2A2E3D] text-[#10B981] p-2.5 rounded-full"><TrendingUp className="w-4 h-4" /></div>
                                <span className="font-bold text-sm text-slate-200">View Analytics Report</span>
                            </button>
                        </div>
                    </div>

                    {/* Action Required Card */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)]">
                        <h3 className="font-bold text-[#181B25] mb-4 flex items-center gap-2 text-base">
                            <Star className="w-5 h-5 text-[#FF9000]" /> Action Required
                        </h3>
                        <div className="bg-rose-50 border border-rose-100 rounded-xl p-5">
                            <div className="flex items-start gap-4">
                                <span className="relative flex h-2.5 w-2.5 mt-1.5 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                                </span>
                                <div>
                                    <p className="font-bold text-[#181B25] text-sm">Review Pending Documents</p>
                                    <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">Client "Nimal Silva" uploaded new case files regarding property dispute.</p>
                                    <button className="mt-4 text-[13px] font-bold text-rose-600 hover:text-rose-700 transition">Review Now</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
