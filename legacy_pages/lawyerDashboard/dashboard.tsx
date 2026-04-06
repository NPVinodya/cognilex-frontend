'use client';

import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon, MapPin, Clock, Plus, Edit, Trash2,
    Users, TrendingUp, Star, Settings, ChevronRight, ChevronLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AvailabilitySlot {
    id: string;
    date: string;
    time: string;
    location: string;
    isBooked: boolean;
    clientName?: string;
    type?: 'Consultation' | 'Court' | 'Meeting';
}

// Initial dates are now generated dynamically in the component




export default function LawyerDashboard() {
    const router = useRouter();

    const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [lawyerName, setLawyerName] = useState("Counsel");


    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(18);
    const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
    const [newSlot, setNewSlot] = useState({ date: '', time: '', type: 'Consultation', location: '' });
    const [isSaving, setIsSaving] = useState(false);

    // Calendar State
    const [pivotDate, setPivotDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewMode, setViewMode] = useState<'daily' | 'all'>('daily');

    const getWeekDays = (baseDate: Date) => {
        const days = [];
        const start = new Date(baseDate);
        // Start from Monday of the current week (optional, let's just show 7 days from base)
        // For the design in screenshot, it looks like a 7-day window.
        // Let's center it or start from pivot.
        for (let i = -3; i <= 3; i++) {
            const d = new Date(baseDate);
            d.setDate(baseDate.getDate() + i);
            days.push({
                full: d.toISOString().split('T')[0],
                dayName: d.toLocaleString('en-US', { weekday: 'short' }),
                dateNum: d.getDate(),
                isToday: d.toDateString() === new Date().toDateString()
            });
        }
        return days;
    };

    const weekDays = getWeekDays(pivotDate);

    const shiftWeek = (direction: number) => {
        const newPivot = new Date(pivotDate);
        newPivot.setDate(pivotDate.getDate() + (direction * 7));
        setPivotDate(newPivot);
    };

    const filteredSlots = availabilitySlots.filter(s => s.date === selectedDate);

    const fetchData = async () => {
        try {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                setLoadingProgress(100);
                setLoading(false);
                return;
            }

            const user = JSON.parse(storedUser);
            const lawyerId = user.id || user._id;
            if (user.name) setLawyerName(user.name.split(' ')[0]);

            if (!lawyerId) {
                setLoadingProgress(100);
                setLoading(false);
                return;
            }

            // Fetch Stats
            setLoadingProgress(45);
            const statsRes = await fetch(`/api/lawyer/dashboard?lawyerId=${lawyerId}&type=stats`);
            const statsData = await statsRes.json();
            if (statsData.success) setStats(statsData.stats);

            // Fetch Appointments
            setLoadingProgress(78);
            const slotsRes = await fetch(`/api/lawyer/dashboard?lawyerId=${lawyerId}&type=appointments`);
            const slotsData = await slotsRes.json();
            if (slotsData.success) setAvailabilitySlots(slotsData.slots || []);

            setLoadingProgress(100);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setLoadingProgress(100);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!loading) return;

        const timer = window.setInterval(() => {
            setLoadingProgress((prev) => (prev < 90 ? prev + 3 : prev));
        }, 220);

        return () => window.clearInterval(timer);
    }, [loading]);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="mb-3 text-center text-sm font-semibold text-slate-700">Loading Lawyer Dashboard...</p>
                    <Progress value={loadingProgress} className="h-3" />
                    <p className="mt-3 text-center text-xs font-bold text-orange-600">{Math.round(loadingProgress)}%</p>
                </div>
            </div>
        );
    }

    const handleSaveSlot = async () => {
        if (!newSlot.date || !newSlot.time) return alert("Please pick a Date and Time.");

        setIsSaving(true);
        try {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) throw new Error("User session not found.");

            const user = JSON.parse(storedUser);
            const lawyerId = user.id || user._id;

            if (!lawyerId) throw new Error("Lawyer ID not found in profile.");

            const res = await fetch('/api/lawyer/dashboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lawyerId,
                    date: newSlot.date,
                    time: newSlot.time,
                    type: newSlot.type,
                    location: newSlot.location || "Office"
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                alert("Slot created successfully!");
                fetchData();
                setIsAddSlotOpen(false);
                setNewSlot({ date: '', time: '', type: 'Consultation', location: '' });
            } else {
                alert(`Error: ${data.message || "Failed to create slot"}`);
            }
        } catch (error: any) {
            console.error("Save Error:", error);
            alert(`Error: ${error.message || "Connection failed"}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSlot = async (id: string) => {
        if (!window.confirm("Are you sure you want to remove this availability slot?")) return;
        try {
            const res = await fetch(`/api/lawyer/dashboard?slotId=${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                setAvailabilitySlots(availabilitySlots.filter(slot => slot.id !== id));
            } else {
                alert(data.message || "Failed to remove slot");
            }
        } catch (error) {
            alert("Error removing slot");
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-[32px] font-bold text-[#181B25] tracking-tight leading-tight">Welcome back, {lawyerName}</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Here is what's happening with your practice today.</p>
                </div>
                <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] text-sm font-bold text-slate-700 w-fit">
                    <Clock className="w-4 h-4 text-[#FF9000]" />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
                        <h3 className="text-[32px] font-black text-[#181B25] leading-none">{stats?.totalBookings || 0}</h3>
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
                        <h3 className="text-[32px] font-black text-white leading-none">{stats?.profileViews?.toLocaleString() || "0"}</h3>
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
                        <h3 className="text-[32px] font-black text-[#181B25] leading-none">{stats?.pendingRequests || 0}</h3>
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
                        <h3 className="text-[32px] font-black text-[#181B25] leading-none">{stats?.activeClients || 0}</h3>
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
                            <div className="flex items-center gap-3">
                                <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200">
                                    <button
                                        onClick={() => setViewMode('daily')}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'daily' ? 'bg-white text-[#FF9000] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Daily
                                    </button>
                                    <button
                                        onClick={() => setViewMode('all')}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'all' ? 'bg-white text-[#FF9000] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        All
                                    </button>
                                </div>
                                <Button
                                    onClick={() => setIsAddSlotOpen(true)}
                                    className="bg-[#FF9000] hover:bg-[#E68200] rounded-full shadow-md shadow-orange-600/20 text-sm h-10 px-6 gap-2 text-white font-semibold"
                                >
                                    <Plus className="h-4 w-4" /> Add Slot
                                </Button>
                            </div>
                        </div>

                        {/* Week Days Picker */}
                        <div className="px-6 md:px-8 py-5 border-b border-slate-100 flex items-center justify-between gap-2">
                            <button
                                onClick={() => shiftWeek(-1)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 transition"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="flex gap-2 sm:gap-4 overflow-x-auto w-full justify-between pb-1 no-scrollbar">
                                {weekDays.map((d, i) => {
                                    const isActive = d.full === selectedDate;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedDate(d.full)}
                                            className={`flex flex-col items-center justify-center min-w-[56px] h-[64px] rounded-2xl border transition hover:-translate-y-0.5 ${isActive ? 'bg-[#FF9000] border-[#FF9000] text-white shadow-lg shadow-[#FF9000]/30' : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300'} ${d.isToday && !isActive ? 'ring-2 ring-orange-100' : ''}`}
                                        >
                                            <span className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${isActive ? 'text-orange-100' : 'text-slate-400'}`}>{d.dayName}</span>
                                            <span className="text-xl font-bold">{d.dateNum}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => shiftWeek(1)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 transition"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Slots Timeline */}
                        <div className="p-6 md:p-8 pt-8">
                            <div className="relative border-l border-slate-200/80 ml-3 space-y-10 pb-4">

                                {(viewMode === 'all' ? availabilitySlots : filteredSlots).length > 0 ? (viewMode === 'all' ? availabilitySlots : filteredSlots).map((slot, index) => {
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
                                                            <span className="text-[13px] font-bold text-[#181B25] flex items-center gap-1.5">
                                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                                {viewMode === 'all' && <span className="text-orange-500">{slot.date} | </span>}
                                                                {slot.time}
                                                            </span>
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
                                }) : (
                                    <div className="py-10 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                            <CalendarIcon className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-slate-400 font-bold text-sm">No slots scheduled for this date.</p>
                                    </div>
                                )}
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
                            <button
                                onClick={() => setIsAddSlotOpen(true)}
                                className="w-full flex items-center gap-4 p-3.5 rounded-xl bg-[#222635] hover:bg-[#2A2E3D] border border-slate-700/50 transition group"
                            >
                                <div className="bg-[#2A2E3D] text-[#FF9000] p-2.5 rounded-full group-hover:scale-110 transition duration-300"><Plus className="w-4 h-4" /></div>
                                <span className="font-bold text-sm text-slate-200">Add New Slot</span>
                            </button>
                            <button
                                onClick={() => router.push('/lawyerDashboard/settings')}
                                className="w-full flex items-center gap-4 p-3.5 rounded-xl bg-[#222635] hover:bg-[#2A2E3D] border border-slate-700/50 transition group"
                            >
                                <div className="bg-[#2A2E3D] text-[#984FFF] p-2.5 rounded-full group-hover:scale-110 transition duration-300"><Edit className="w-4 h-4" /></div>
                                <span className="font-bold text-sm text-slate-200">Update Profile Details</span>
                            </button>
                            <button
                                onClick={() => router.push('/lawyerDashboard/analytics')}
                                className="w-full flex items-center gap-4 p-3.5 rounded-xl bg-[#222635] hover:bg-[#2A2E3D] border border-slate-700/50 transition group"
                            >
                                <div className="bg-[#2A2E3D] text-[#10B981] p-2.5 rounded-full group-hover:scale-110 transition duration-300"><TrendingUp className="w-4 h-4" /></div>
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

            {/* Add Slot Modal */}
            {isAddSlotOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Create Availability Slot</h3>
                            <p className="text-slate-500 mb-8 text-sm">Add a new time for consultations or court appearances.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FF9000] outline-none transition"
                                        value={newSlot.date}
                                        onChange={e => setNewSlot({ ...newSlot, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Time (e.g. 10:00 AM - 11:00 AM)</label>
                                    <input
                                        type="text"
                                        placeholder="10:00 AM - 11:00 AM"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FF9000] outline-none transition"
                                        value={newSlot.time}
                                        onChange={e => setNewSlot({ ...newSlot, time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Meeting Location (Physical Address)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. No 123, Galle Road, Colombo"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FF9000] outline-none transition"
                                        value={newSlot.location}
                                        onChange={e => setNewSlot({ ...newSlot, location: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Appointment Type</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FF9000] outline-none transition appearance-none"
                                        value={newSlot.type}
                                        onChange={e => setNewSlot({ ...newSlot, type: e.target.value })}
                                    >
                                        <option value="Consultation">Consultation</option>
                                        <option value="Court">Court Appearance</option>
                                        <option value="Meeting">Meeting</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-10">
                                <button
                                    onClick={() => setIsAddSlotOpen(false)}
                                    className="flex-1 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveSlot}
                                    disabled={isSaving}
                                    className="flex-1 px-6 py-3.5 bg-[#FF9000] hover:bg-[#E68200] text-white font-bold rounded-2xl transition shadow-lg shadow-orange-600/20 disabled:opacity-50"
                                >
                                    {isSaving ? "Saving..." : "Save Slot"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
