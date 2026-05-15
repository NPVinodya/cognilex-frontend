'use client';

import React, { useState, useEffect } from 'react';
import {
    MessageSquare, Mail, Phone, Calendar, Trash2, CheckCircle,
    Clock, Search, Filter, ExternalLink, ChevronRight, User
} from 'lucide-react';

interface Feedback {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    created_at: string;
    status: string;
}

export default function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [activeTab, setActiveTab] = useState<'feedback' | 'support'>('feedback');

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/feedback`);
            const data = await response.json();
            if (data.feedbacks) {
                setFeedbacks(data.feedbacks);
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const response = await fetch(`${API_URL}/admin/feedback/${id}/status?status_value=${status}`, {
                method: 'PATCH',
            });
            if (response.ok) {
                setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, status } : f));
                if (selectedFeedback?.id === id) {
                    setSelectedFeedback({ ...selectedFeedback, status });
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const deleteFeedback = async (id: string) => {
        if (!confirm('Are you sure you want to delete this feedback?')) return;
        try {
            const response = await fetch(`${API_URL}/admin/feedback/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setFeedbacks(feedbacks.filter(f => f.id !== id));
                setSelectedFeedback(null);
            }
        } catch (error) {
            console.error('Error deleting feedback:', error);
        }
    };

    const filteredData = feedbacks.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.subject.toLowerCase().includes(searchTerm.toLowerCase());

        const isSupport = f.subject.startsWith('[SUPPORT]');

        if (activeTab === 'support') return matchesSearch && isSupport;
        return matchesSearch && !isSupport;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Communications
                    </h1>
                    <p className="text-base text-slate-500 font-medium">Monitor and manage platform inquiries & support</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search inquiries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 shadow-sm transition-all text-slate-900"
                        />
                    </div>
                </div>
            </div>

            {/* Tab System */}
            <div className="flex gap-2 p-1.5 bg-slate-100 w-fit rounded-2xl border border-slate-200 mb-8">
                <button
                    onClick={() => { setActiveTab('feedback'); setSelectedFeedback(null); }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'feedback' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <MessageSquare className="w-4 h-4" />
                    Customer Feedback
                </button>
                <button
                    onClick={() => { setActiveTab('support'); setSelectedFeedback(null); }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'support' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Mail className="w-4 h-4" />
                    Support Desk
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* List Section */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="bg-white p-20 rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-4 border-[#FF9000] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500 mt-4 font-bold">Synchronizing Data...</p>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="bg-white p-20 rounded-3xl border border-dashed border-slate-300 text-center">
                            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold text-xl">No {activeTab === 'feedback' ? 'feedback' : 'support requests'} found.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">User Details</th>
                                            <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Subject</th>
                                            <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredData.map((item) => (
                                            <tr
                                                key={item.id}
                                                className={`group hover:bg-slate-50/80 transition-colors cursor-pointer ${selectedFeedback?.id === item.id ? 'bg-orange-50/50' : ''}`}
                                                onClick={() => setSelectedFeedback(item)}
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-[#181B25] text-white flex items-center justify-center font-bold text-sm">
                                                            {item.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                                                            <p className="text-[11px] text-slate-400 font-medium">{item.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-sm font-bold text-slate-700">{item.subject}</p>
                                                    <p className="text-[11px] text-slate-400">{new Date(item.created_at).toLocaleDateString()}</p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        item.status === 'read' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <button className="p-2 text-slate-300 group-hover:text-[#FF9000] transition-colors">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Detail Section */}
                <div className="lg:col-span-1">
                    {selectedFeedback ? (
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl sticky top-8 animate-in slide-in-from-right duration-500">
                            <div className="flex items-center justify-between mb-8">
                                <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${selectedFeedback.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                    selectedFeedback.status === 'read' ? 'bg-blue-100 text-blue-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                    {selectedFeedback.status}
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteFeedback(selectedFeedback.id); }}
                                    className="p-2 text-rose-400 hover:bg-rose-50 rounded-xl transition"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 mb-6">{selectedFeedback.subject}</h2>

                            <div className="space-y-6 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <User className="w-4 h-4 text-slate-500" />
                                    <p className="text-sm font-bold text-slate-700">{selectedFeedback.name}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <p className="text-sm text-slate-500 font-medium">{selectedFeedback.email}</p>
                                </div>
                                {selectedFeedback.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <p className="text-sm text-slate-500 font-medium">{selectedFeedback.phone}</p>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <p className="text-sm text-slate-500 font-medium">
                                        {new Date(selectedFeedback.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-10">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Message Content</p>
                                <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                                    {selectedFeedback.message}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                {selectedFeedback.status === 'pending' && (
                                    <button
                                        onClick={() => updateStatus(selectedFeedback.id, 'read')}
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-900/20"
                                    >
                                        <CheckCircle className="w-5 h-5" /> Mark as Read
                                    </button>
                                )}
                                {selectedFeedback.status !== 'resolved' && (
                                    <button
                                        onClick={() => updateStatus(selectedFeedback.id, 'resolved')}
                                        className="w-full py-4 bg-[#FF9000] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#e68200] transition shadow-lg shadow-orange-900/20"
                                    >
                                        <CheckCircle className="w-5 h-5" /> Mark as Resolved
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-100/50 p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center h-full flex flex-col items-center justify-center min-h-[500px]">
                            <MessageSquare className="w-16 h-16 text-slate-200 mb-6" />
                            <p className="text-slate-400 font-bold max-w-[200px] mx-auto">Select a feedback entry to view detailed information.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
