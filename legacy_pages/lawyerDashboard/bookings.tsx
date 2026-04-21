'use client';

import React, { useState, useEffect } from 'react';
import { 
    Calendar as CalendarIcon, MapPin, Clock, Plus, Search, Filter, 
    MoreVertical, FileText, CheckCircle2, User, CreditCard, Mail
} from 'lucide-react';

interface Booking {
    id: string;
    clientName: string;
    clientEmail: string;
    amount: number;
    currency: string;
    appointmentDate: string;
    appointmentTime: string;
    location: string;
    service: string;
    status: string;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) return;
                const user = JSON.parse(storedUser);
                const lawyerId = user.id || user._id;

                const res = await fetch(`/api/lawyer/dashboard?lawyerId=${lawyerId}&type=bookings`);
                const data = await res.json();
                console.log("[Bookings Debug] Data received:", data);
                if (data.success) {
                    setBookings(data.bookings || []);
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter((b) => {
        return (b.clientName || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
               (b.id || "").toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-[32px] font-bold text-[#181B25] tracking-tight leading-tight">Bookings</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Review your transaction history and client payment records.</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200">
                    <CreditCard className="w-4 h-4 text-[#FF9000]" />
                    <span className="text-sm font-bold text-slate-700">Total Records: {bookings.length}</span>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
                <div className="p-6 md:px-8 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/50">
                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search bookings by client or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="hidden md:grid grid-cols-12 gap-4 p-4 px-8 border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                <th className="col-span-3 text-left border-none">Client</th>
                                <th className="col-span-2 text-left border-none">Appointment Date</th>
                                <th className="col-span-2 text-left border-none">Location</th>
                                <th className="col-span-2 text-left border-none">Service</th>
                                <th className="col-span-1 text-left border-none">Amount</th>
                                <th className="col-span-2 text-right border-none">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80">
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 md:px-8 items-center hover:bg-slate-50/50 transition">
                                        <td className="col-span-1 md:col-span-3 flex items-center gap-4 border-none">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                                <User className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-[15px] font-bold text-[#181B25] truncate">{booking.clientName}</h4>
                                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <Mail className="w-3.5 h-3.5" /> {booking.clientEmail}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="col-span-1 md:col-span-2 border-none">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#181B25]">{booking.appointmentDate || 'N/A'}</span>
                                                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {booking.appointmentTime || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="col-span-1 md:col-span-2 border-none">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span className="truncate">{booking.location || 'Virtual'}</span>
                                            </div>
                                        </td>
                                        <td className="col-span-1 md:col-span-2 text-sm text-slate-600 border-none truncate">
                                            {booking.service}
                                        </td>
                                        <td className="col-span-1 md:col-span-1 border-none text-sm font-black text-[#181B25]">
                                            {booking.currency} {booking.amount?.toLocaleString()}
                                        </td>
                                        <td className="col-span-1 md:col-span-2 text-right border-none">
                                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                                                <CheckCircle2 className="w-3 h-3" /> {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={12} className="p-16 text-center border-none">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                            <CreditCard className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <h3 className="text-[#181B25] font-bold text-lg mb-1">No bookings found</h3>
                                        <p className="text-slate-500 text-sm">Records will appear here once clients start booking your slots.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
