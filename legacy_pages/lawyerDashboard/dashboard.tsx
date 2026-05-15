'use client';

import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import {
    Calendar as CalendarIcon, MapPin, Clock, Plus, Edit, Trash2,
    Users, TrendingUp, Star, Settings, ChevronRight, ChevronLeft, CheckCircle2,
    X, Info, User, FileText, XCircle, Loader2, MessageSquare
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardContext } from '@/app/lawyerDashboard/layout';
import { format } from "date-fns";
import { toast } from 'sonner';
import Swal from 'sweetalert2';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const TIME_SLOTS = [
    "08:00 AM - 09:00 AM",
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM",
];

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

    const { setIsPageLoading, setLoadingProgress } = React.useContext(DashboardContext);
    const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [lawyerName, setLawyerName] = useState("Counsel");


    const [loading, setLoading] = useState(false);
    const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
    const [showInlineAdd, setShowInlineAdd] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedApt, setSelectedApt] = useState<any>(null);
    const [newSlot, setNewSlot] = useState({ date: '', time: '', type: 'Consultation', location: '' });
    const [isSaving, setIsSaving] = useState(false);

    // Calendar State
    const [pivotDate, setPivotDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
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
                full: format(d, 'yyyy-MM-dd'),
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

    const fetchData = async (isSilent = false) => {
        try {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                if (!isSilent) setIsPageLoading(false);
                return;
            }

            const user = JSON.parse(storedUser);
            let currentLawyerId = user.id || user._id;

            // Fallback logic
            if (!currentLawyerId && user.email) {
                try {
                    const profileRes = await fetch(`/api/lawyer/all?email=${encodeURIComponent(user.email)}`);
                    const profileData = await profileRes.json();
                    if (profileData.success && profileData.lawyers?.length > 0) {
                        currentLawyerId = profileData.lawyers[0].id || profileData.lawyers[0]._id;
                    }
                } catch (e) {
                    console.error("Email fallback check failed", e);
                }
            }

            if (user.name) setLawyerName(user.name.split(' ')[0]);

            if (!currentLawyerId) {
                if (!isSilent) setIsPageLoading(false);
                return;
            }

            const [statsRes, slotsRes] = await Promise.all([
                fetch(`/api/lawyer/dashboard?lawyerId=${currentLawyerId}&type=stats`),
                fetch(`/api/lawyer/dashboard?lawyerId=${currentLawyerId}&type=appointments`)
            ]);

            const statsData = await statsRes.json();
            const slotsData = await slotsRes.json();

            // Calculate Today's counts
            const todayStr = format(new Date(), 'yyyy-MM-dd');
            const todayBookings = (slotsData.slots || []).filter((s: any) => s.date === todayStr && s.isBooked).length;
            const todayTotalSlots = (slotsData.slots || []).filter((s: any) => s.date === todayStr).length;

            const statsObj = statsData.stats || (statsData.success ? statsData : null);

            if (statsObj) {
                const normalizedStats = {
                    totalBookings: statsObj.totalBookings ?? statsObj.total_bookings ?? statsObj.bookings_count ?? 0,
                    todayBookings: todayBookings,
                    todaySlots: todayTotalSlots,
                    pendingRequests: statsObj.pendingRequests ?? statsObj.pending_requests ?? statsObj.pending_count ?? 0,
                    activeClients: statsObj.activeClients ?? statsObj.active_clients ?? statsObj.clients_count ?? 0
                };
                setStats(normalizedStats);
            }

            if (slotsData.success) setAvailabilitySlots(slotsData.slots || []);

            if (!isSilent) {
                setLoadingProgress(100);
                setTimeout(() => setIsPageLoading(false), 200);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            if (!isSilent) setIsPageLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchData(true);
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const handleSaveSlot = async () => {
        if (!newSlot.date || !newSlot.time) return toast.error("Please pick a Date and Time.");

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
                toast.success("Availability slot created successfully!");
                fetchData();
                setIsAddSlotOpen(false);
                setNewSlot({ date: newSlot.date, time: '', type: 'Consultation', location: newSlot.location });
            } else {
                toast.error(`Error: ${data.message || "Failed to create slot"}`);
            }
        } catch (error: any) {
            console.error("Save Error:", error);
            toast.error(`Error: ${error.message || "Connection failed"}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSlot = async (id: string) => {
        Swal.fire({
            title: 'Remove Slot?',
            text: "Are you sure you want to remove this availability slot?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF9000',
            cancelButtonColor: '#f43f5e',
            confirmButtonText: 'Yes, remove it',
            customClass: {
                popup: 'rounded-3xl',
                confirmButton: 'rounded-xl',
                cancelButton: 'rounded-xl'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`/api/lawyer/dashboard?slotId=${id}`, {
                        method: 'DELETE'
                    });
                    const data = await res.json();
                    if (data.success) {
                        setAvailabilitySlots(availabilitySlots.filter(slot => slot.id !== id));
                        if (isDetailModalOpen) setIsDetailModalOpen(false);
                        toast.success("Slot removed successfully");
                    } else {
                        toast.error(data.message || "Failed to remove slot");
                    }
                } catch (error) {
                    toast.error("Error removing slot");
                }
            }
        });
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const apiStatus = newStatus.toLowerCase();
            const res = await fetch('/api/lawyer/dashboard', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId: id, status: apiStatus })
            });
            const data = await res.json();
            if (data.success) {
                // Update local state
                setAvailabilitySlots(prev => prev.map(apt =>
                    apt.id === id ? { ...apt, status: newStatus } : apt
                ));
                if (selectedApt && selectedApt.id === id) {
                    setSelectedApt({ ...selectedApt, status: newStatus });
                }
                toast.success(`Appointment ${newStatus.toLowerCase()} successfully`);
                fetchData(true); // Silent refresh to keep stats in sync
            }
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Pending': return 'bg-orange-50 text-[#FF9000] border-orange-100';
            case 'Completed': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Canceled': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'Available': return 'bg-slate-50 text-slate-500 border-slate-200';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-[32px] font-bold text-[#181B25] tracking-tight leading-tight">Welcome back, {lawyerName}</h1>
                    <p className="text-slate-500 font-medium mt-1 text-xs md:text-sm">Here is what's happening with your practice today.</p>
                </div>
                <div className="inline-flex items-center gap-2 bg-white px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-slate-200 shadow-sm text-xs md:text-sm font-bold text-slate-700 w-fit">
                    <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#FF9000]" />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {/* Total Bookings Card */}
                <div className="bg-white p-5 md:p-6 md:py-7 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="p-2.5 md:p-3 bg-orange-50 text-[#FF9000] rounded-xl">
                            <CalendarIcon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none font-bold text-[10px]">All Time</Badge>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Bookings</p>
                        <h3 className="text-2xl md:text-[32px] font-black text-[#181B25] leading-none">{stats?.totalBookings || 0}</h3>
                    </div>
                </div>

                {/* Today's Bookings Card */}
                <div className="bg-white p-5 md:p-6 md:py-7 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="p-2.5 md:p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                            <Users className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none font-bold text-[10px]">Real-time</Badge>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Today's Bookings</p>
                        <h3 className="text-2xl md:text-[26px] font-black text-[#181B25] leading-none">{stats?.todayBookings || 0}</h3>
                    </div>
                </div>

                {/* Today's Total Slots Card */}
                <div className="bg-white p-5 md:p-6 md:py-7 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="p-2.5 md:p-3 bg-slate-50 text-slate-500 rounded-xl">
                            <Clock className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <Badge variant="secondary" className="bg-slate-50 text-slate-600 hover:bg-slate-50 border-none font-bold text-[10px]">Capacity</Badge>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Today's Slots</p>
                        <h3 className="text-2xl md:text-[26px] font-black text-[#181B25] leading-none">{stats?.todaySlots || 0}</h3>
                    </div>
                </div>

                {/* Active Clients Card */}
                <div className="bg-white p-5 md:p-6 md:py-7 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="p-2.5 md:p-3 bg-orange-50 text-[#FF9000] rounded-xl">
                            <Star className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <Badge variant="secondary" className="bg-orange-50 text-orange-600 hover:bg-orange-50 border-none font-bold text-[10px]">Active</Badge>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Clients</p>
                        <h3 className="text-2xl md:text-[26px] font-black text-[#181B25] tracking-tighter leading-none">{stats?.activeClients || 0}</h3>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">

                {/* Calendar & Schedule Section */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-5 md:p-6 md:px-8 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-[16px] md:text-[17px] font-bold text-[#181B25] flex items-center gap-2">
                                     <CalendarIcon className="w-5 h-5 text-[#FF9000]" />
                                     Schedule & Appointments
                                 </h2>
                                <p className="text-slate-500 text-[12px] md:text-sm mt-1">Manage your calendar capacity for the week.</p>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200">
                                    <button
                                        onClick={() => setViewMode('daily')}
                                        className={`px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all ${viewMode === 'daily' ? 'bg-white text-[#FF9000] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Daily
                                    </button>
                                    <button
                                        onClick={() => setViewMode('all')}
                                        className={`px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all ${viewMode === 'all' ? 'bg-white text-[#FF9000] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        All
                                    </button>
                                </div>
                                <Button
                                    onClick={() => setIsAddSlotOpen(true)}
                                    className="bg-[#FF9000] hover:bg-[#E68200] rounded-full shadow-md shadow-orange-600/20 text-xs md:text-sm h-9 md:h-10 px-4 md:px-6 gap-2 text-white font-semibold flex-1 sm:flex-initial"
                                >
                                    <Plus className="h-4 w-4" /> Add Slot
                                </Button>
                            </div>
                        </div>

                        {/* Week Days Picker */}
                        <div className="px-4 md:px-8 py-5 border-b border-slate-100 flex items-center justify-between gap-2 overflow-hidden">
                            <button
                                onClick={() => shiftWeek(-1)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 transition shrink-0"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="flex gap-2 sm:gap-4 overflow-x-auto w-full justify-start md:justify-between pb-1 no-scrollbar min-w-0">
                                {weekDays.map((d, i) => {
                                    const isActive = d.full === selectedDate;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedDate(d.full)}
                                            className={`flex flex-col items-center justify-center min-w-[50px] md:min-w-[56px] h-[58px] md:h-[64px] rounded-xl md:rounded-2xl border transition hover:-translate-y-0.5 shrink-0 ${isActive ? 'bg-[#FF9000] border-[#FF9000] text-white shadow-lg shadow-[#FF9000]/30' : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300'} ${d.isToday && !isActive ? 'ring-2 ring-orange-100' : ''}`}
                                        >
                                            <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-0.5 ${isActive ? 'text-orange-100' : 'text-slate-400'}`}>{d.dayName}</span>
                                            <span className="text-base md:text-xl font-bold">{d.dateNum}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => shiftWeek(1)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 transition shrink-0"
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
                                        <div key={slot.id} className="relative pl-7 md:pl-10 group">
                                            {/* Dot */}
                                            <div className={`absolute -left-[6px] top-6 w-3 h-3 rounded-full ${dotColor} ring-4 ring-white`}></div>

                                            <div className={`p-4 md:p-5 rounded-2xl transition-all ${boxStyle}`}>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-5">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 md:py-1 rounded-full uppercase tracking-widest ${tagColors}`}>
                                                                {slot.type}
                                                            </span>
                                                            <span className="text-[11px] md:text-[13px] font-bold text-[#181B25] flex items-center gap-1.5">
                                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                                {viewMode === 'all' && <span className="text-orange-500">{slot.date} | </span>}
                                                                {slot.time}
                                                            </span>
                                                        </div>

                                                        <h4 className="text-base md:text-lg font-bold text-[#181B25] tracking-tight">
                                                            {slot.isBooked ? slot.clientName : 'Open Available Slot'}
                                                        </h4>
                                                        <div className="flex items-center gap-1.5 mt-1.5 text-[12px] md:text-[13px] text-slate-500 font-medium">
                                                            <MapPin className="h-3.5 w-3.5" />
                                                            {slot.location}
                                                        </div>
                                                    </div>

                                                    <div className="shrink-0 w-full sm:w-auto">
                                                        {slot.isBooked ? (
                                                            <button
                                                                onClick={() => { setSelectedApt(slot); setIsDetailModalOpen(true); }}
                                                                className="px-5 py-2.5 bg-[#181B25] hover:bg-[#0e1017] text-white text-sm font-bold rounded-xl transition w-full sm:w-auto shadow-sm"
                                                            >
                                                                View Details
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => handleDeleteSlot(slot.id)} className="px-5 py-2.5 bg-white text-rose-500 border border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-sm font-bold rounded-xl transition w-full sm:w-auto flex items-center justify-center gap-2 shadow-sm">
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
                                        <p className="text-slate-400 font-bold text-sm">No slots scheduled for this date.</p>
                                    </div>
                                )}

                                {/* Always show add option at the bottom */}
                                <div className="pt-6 border-t border-slate-100 mt-6">
                                    {!showInlineAdd ? (
                                        <button
                                            onClick={() => setShowInlineAdd(true)}
                                            className="group flex items-center gap-4 p-4 w-full rounded-2xl border-2 border-dashed border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-300"
                                        >
                                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Plus className="w-6 h-6 text-[#FF9000]" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-slate-900 font-bold text-[15px]">Add More Availability</p>
                                                <p className="text-slate-400 text-xs font-medium">Click to open the quick add form</p>
                                            </div>
                                        </button>
                                    ) : (
                                        <div className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
                                            <div className="flex flex-col sm:flex-row items-end gap-4">
                                                <div className="flex-1 w-full space-y-2">
                                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Select Date</label>
                                                    <input
                                                        type="date"
                                                        value={newSlot.date}
                                                        onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                                                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9000] outline-none transition font-medium"
                                                    />
                                                </div>
                                                <div className="flex-1 w-full space-y-2">
                                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Select Time</label>
                                                    <Select onValueChange={(val) => setNewSlot({ ...newSlot, time: val })} value={newSlot.time}>
                                                        <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl font-medium">
                                                            <SelectValue placeholder="Time" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {TIME_SLOTS.map(t => (
                                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex-1 w-full space-y-2">
                                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Location</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Location"
                                                        value={newSlot.location}
                                                        onChange={(e) => setNewSlot({ ...newSlot, location: e.target.value })}
                                                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#FF9000] outline-none transition font-medium"
                                                    />
                                                </div>
                                                <div className="shrink-0 w-full sm:w-auto">
                                                    <Button
                                                        disabled={isSaving}
                                                        onClick={handleSaveSlot}
                                                        className="h-11 px-8 bg-[#FF9000] hover:bg-[#E68200] text-white font-bold rounded-xl w-full flex items-center gap-2 shadow-lg shadow-orange-500/20"
                                                    >
                                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                                        Add
                                                    </Button>
                                                </div>
                                                <button
                                                    onClick={() => setShowInlineAdd(false)}
                                                    className="h-11 w-11 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Tools */}
                <div className="lg:col-span-4 flex flex-col gap-6">

                    {/* Quick Actions Card - Premium White Style */}
                    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 text-slate-900 overflow-hidden relative shadow-xl border border-slate-100 group/card">
                        {/* Soft atmospheric glows for light mode */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-orange-200/40 to-transparent blur-[80px] group-hover/card:scale-125 transition-transform duration-700"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-blue-100/30 to-transparent blur-[80px]"></div>

                        <h3 className="text-[16px] md:text-[17px] font-bold mb-5 md:mb-6 flex items-center gap-2.5 relative z-10">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center border border-orange-200">
                                <Settings className="w-4 h-4 text-[#FF9000]" />
                            </div>
                            Quick Actions
                        </h3>

                        <div className="space-y-3 relative z-10">
                            <button
                                onClick={() => setIsAddSlotOpen(true)}
                                className="w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-all duration-300 group/btn"
                            >
                                <div className="bg-orange-100 text-[#FF9000] p-2 md:p-2.5 rounded-lg md:rounded-xl border border-orange-200 group-hover/btn:scale-110 group-hover/btn:bg-orange-200 transition duration-300 shrink-0">
                                    <Plus className="w-4 h-4" />
                                </div>
                                <div className="text-left min-w-0">
                                    <span className="font-bold text-[13px] md:text-[14px] text-slate-900 block truncate">Add New Slot</span>
                                    <span className="text-[9px] md:text-[10px] text-slate-400 font-medium tracking-tight truncate block">Create client availability</span>
                                </div>
                                <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover/btn:text-orange-500 transition-colors shrink-0" />
                            </button>

                            <button
                                onClick={() => router.push('/lawyerDashboard/settings')}
                                className="w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-all duration-300 group/btn"
                            >
                                <div className="bg-purple-100 text-[#984FFF] p-2 md:p-2.5 rounded-lg md:rounded-xl border border-purple-200 group-hover/btn:scale-110 group-hover/btn:bg-purple-200 transition duration-300 shrink-0">
                                    <Edit className="w-4 h-4" />
                                </div>
                                <div className="text-left min-w-0">
                                    <span className="font-bold text-[13px] md:text-[14px] text-slate-900 block truncate">Update Profile</span>
                                    <span className="text-[9px] md:text-[10px] text-slate-400 font-medium tracking-tight truncate block">Modify public details</span>
                                </div>
                                <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover/btn:text-purple-500 transition-colors shrink-0" />
                            </button>

                            <button
                                onClick={() => router.push('/lawyerDashboard/analytics')}
                                className="w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-all duration-300 group/btn"
                            >
                                <div className="bg-emerald-100 text-[#10B981] p-2 md:p-2.5 rounded-lg md:rounded-xl border border-emerald-200 group-hover/btn:scale-110 group-hover/btn:bg-emerald-200 transition duration-300 shrink-0">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                                <div className="text-left min-w-0">
                                    <span className="font-bold text-[13px] md:text-[14px] text-slate-900 block truncate">View Analytics</span>
                                    <span className="text-[9px] md:text-[10px] text-slate-400 font-medium tracking-tight truncate block">Track performance metrics</span>
                                </div>
                                <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover/btn:text-emerald-500 transition-colors shrink-0" />
                            </button>
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
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-[#FF9000] outline-none transition"
                                        value={newSlot.date}
                                        onChange={e => setNewSlot({ ...newSlot, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Time Slot</label>
                                    <Select
                                        value={newSlot.time}
                                        onValueChange={(val) => setNewSlot({ ...newSlot, time: val })}
                                    >
                                        <SelectTrigger className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-6 text-slate-900 focus:ring-2 focus:ring-[#FF9000] outline-none transition">
                                            <SelectValue placeholder="Select a time slot" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border border-slate-200 shadow-xl rounded-xl">
                                            {TIME_SLOTS.map((slot) => (
                                                <SelectItem key={slot} value={slot} className="hover:bg-orange-50 focus:bg-orange-50 cursor-pointer py-3 px-4">
                                                    {slot}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Meeting Location (Physical Address)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. No 123, Galle Road, Colombo"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-[#FF9000] outline-none transition"
                                        value={newSlot.location}
                                        onChange={e => setNewSlot({ ...newSlot, location: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Appointment Type</label>
                                    <Select
                                        value={newSlot.type}
                                        onValueChange={(val) => setNewSlot({ ...newSlot, type: val })}
                                    >
                                        <SelectTrigger className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-6 text-slate-900 focus:ring-2 focus:ring-[#FF9000] outline-none transition">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border border-slate-200 shadow-xl rounded-xl">
                                            <SelectItem value="Consultation" className="hover:bg-orange-50 focus:bg-orange-50 cursor-pointer py-3 px-4">Consultation</SelectItem>
                                            <SelectItem value="Court" className="hover:bg-orange-50 focus:bg-orange-50 cursor-pointer py-3 px-4">Court Appearance</SelectItem>
                                            <SelectItem value="Meeting" className="hover:bg-orange-50 focus:bg-orange-50 cursor-pointer py-3 px-4">Meeting</SelectItem>
                                            <SelectItem value="Others" className="hover:bg-orange-50 focus:bg-orange-50 cursor-pointer py-3 px-4">Others</SelectItem>
                                        </SelectContent>
                                    </Select>
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

            {/* Detail Modal */}
            {isDetailModalOpen && selectedApt && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Info className="w-5 h-5 text-[#FF9000]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Appointment Details</h2>
                                    <p className="text-xs text-slate-400 font-medium tracking-tight uppercase">Reference ID: {selectedApt.id.slice(-8)}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsDetailModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition">
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
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mt-1 border ${getStatusColor(selectedApt.status || (selectedApt.isBooked ? 'Confirmed' : 'Available'))}`}>
                                            {selectedApt.status || (selectedApt.isBooked ? 'Confirmed' : 'Available')}
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
                                {(selectedApt.status === 'Pending' || (!selectedApt.status && selectedApt.isBooked)) && (
                                    <>
                                        <button onClick={() => handleUpdateStatus(selectedApt.id, 'Confirmed')} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition">Confirm Appointment</button>
                                        <button onClick={() => handleUpdateStatus(selectedApt.id, 'Canceled')} className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-sm transition border border-rose-100">Cancel</button>
                                    </>
                                )}
                                {selectedApt.status === 'Confirmed' && (
                                    <button onClick={() => handleUpdateStatus(selectedApt.id, 'Completed')} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition">Mark as Completed</button>
                                )}
                                {!selectedApt.isBooked && (
                                    <button onClick={() => handleDeleteSlot(selectedApt.id)} className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-sm transition border border-rose-100">Remove from Schedule</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

