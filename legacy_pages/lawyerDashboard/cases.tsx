'use client';

import React, { useState, useEffect, useContext } from 'react';
import { 
    Briefcase, Search, Filter, Plus, Calendar, AlertCircle, 
    CheckCircle2, Clock, X, User, MoreVertical, Trash2, Edit2, Loader2,
    ArrowUpRight, Info, ChevronRight, Gauge
} from 'lucide-react';
import { DashboardContext } from '@/app/lawyerDashboard/layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface LegalCase {
    id: string;
    title: string;
    clientName: string;
    caseType: string;
    status: 'In Progress' | 'Pending Review' | 'Court Phase' | 'Completed' | 'Canceled';
    progress: number;
    nextHearingDate: string;
    description: string;
    createdAt: string;
}

export default function CasesPage() {
    const { setIsPageLoading, setLoadingProgress } = useContext(DashboardContext);
    const [cases, setCases] = useState<LegalCase[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // Modals State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);

    // Form State (Add)
    const [formData, setFormData] = useState({
        title: '',
        clientName: '',
        caseType: 'Civil Law',
        status: 'In Progress',
        progress: 0,
        nextHearingDate: '',
        description: ''
    });

    // Form State (Edit)
    const [editData, setEditData] = useState({
        status: 'In Progress',
        progress: 0,
        nextHearingDate: '',
        description: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCases = async () => {
        try {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) return;
            const user = JSON.parse(storedUser);
            const lawyerId = user.id || user._id;

            const res = await fetch(`/api/lawyer/dashboard?lawyerId=${lawyerId}&type=cases`);
            const data = await res.json();
            
            if (data.success) {
                setCases(data.cases || []);
            }
        } catch (error) {
            console.error("Error fetching cases:", error);
            toast.error("Failed to load cases. Please check if the backend is running.");
        } finally {
            setLoading(false);
            setLoadingProgress(100);
            setTimeout(() => setIsPageLoading(false), 200);
        }
    };

    useEffect(() => {
        fetchCases();
    }, []);

    const handleCreateCase = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const storedUser = localStorage.getItem("user");
            const user = JSON.parse(storedUser || '{}');
            const lawyerId = user.id || user._id;

            const res = await fetch('/api/lawyer/dashboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'create_case',
                    lawyerId,
                    ...formData
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success("New case opened successfully!");
                setIsAddModalOpen(false);
                setFormData({
                    title: '', clientName: '', caseType: 'Civil Law',
                    status: 'In Progress', progress: 0, nextHearingDate: '', description: ''
                });
                fetchCases();
            } else {
                toast.error(data.message || "Failed to open case");
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateCase = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCase) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/lawyer/dashboard', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    caseId: selectedCase.id,
                    ...editData
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Case updated successfully!");
                setIsEditModalOpen(false);
                fetchCases();
            } else {
                toast.error(data.message || "Failed to update case");
            }
        } catch (error) {
            toast.error("Update failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCase = async (id: string) => {
        if (!confirm("Are you sure you want to delete this case record?")) return;
        try {
            const res = await fetch(`/api/lawyer/dashboard?caseId=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCases(prev => prev.filter(c => c.id !== id));
                toast.success("Case deleted successfully");
            }
        } catch (error) {
            toast.error("Failed to delete case");
        }
    };

    const openEditModal = (box: LegalCase) => {
        setSelectedCase(box);
        setEditData({
            status: box.status,
            progress: box.progress,
            nextHearingDate: box.nextHearingDate || '',
            description: box.description || ''
        });
        setIsEditModalOpen(true);
    };

    const filteredCases = cases.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             c.clientName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All' || c.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Court Phase': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Pending Review': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'Canceled': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-[32px] font-bold text-[#181B25] tracking-tight leading-tight">Legal Cases</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Manage litigation, track hearing dates, and monitor case progress.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 bg-[#FF9000] hover:bg-[#E68200] text-white px-6 py-3 rounded-2xl shadow-lg shadow-orange-600/20 text-sm font-bold transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" strokeWidth={3} /> Open New Case
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Cases</p>
                    <h3 className="text-2xl font-black text-[#181B25]">{cases.filter(c => c.status !== 'Completed').length}</h3>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Completed</p>
                    <h3 className="text-2xl font-black text-emerald-600">{cases.filter(c => c.status === 'Completed').length}</h3>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Records</p>
                    <h3 className="text-2xl font-black text-slate-400">{cases.length}</h3>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by case title, ID, or client name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] shadow-sm transition font-medium"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                    {['All', 'In Progress', 'Court Phase', 'Completed'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeFilter === filter 
                                ? 'bg-[#181B25] text-white shadow-md' 
                                : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cases Table/Grid */}
            <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-5 px-8 border-b border-slate-100 bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    <div className="col-span-4">Litigation Details</div>
                    <div className="col-span-2">Client</div>
                    <div className="col-span-3">Progress / Status</div>
                    <div className="col-span-2">Next Hearing</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>

                <div className="divide-y divide-slate-50">
                    {loading ? (
                        <div className="p-20 text-center flex flex-col items-center">
                            <Loader2 className="w-10 h-10 text-[#FF9000] animate-spin mb-4" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Case Files...</p>
                        </div>
                    ) : filteredCases.length > 0 ? (
                        filteredCases.map((box) => (
                            <div key={box.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 md:px-8 items-center hover:bg-slate-50/30 transition duration-200 group">
                                {/* Case Details */}
                                <div className="col-span-1 md:col-span-4 flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 text-[#FF9000] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-[16px] font-black text-[#181B25] truncate flex items-center gap-2">
                                            {box.title}
                                            <ArrowUpRight className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Ref: {box.id.slice(-8).toUpperCase()}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                            <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">{box.caseType}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Client */}
                                <div className="col-span-1 md:col-span-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                                            <User className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <span className="text-[14px] font-bold text-slate-700">{box.clientName}</span>
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="col-span-1 md:col-span-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${getStatusStyles(box.status)}`}>
                                            {box.status}
                                        </span>
                                        <span className="text-[11px] font-black text-[#181B25]">{box.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${box.progress === 100 ? 'bg-emerald-500' : 'bg-[#FF9000]'}`} 
                                            style={{ width: `${box.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Next Date */}
                                <div className="col-span-1 md:col-span-2">
                                    {box.nextHearingDate && box.nextHearingDate !== 'N/A' && box.nextHearingDate !== '' ? (
                                        <div className="flex items-center gap-2 text-[13px] font-bold text-slate-600 bg-slate-50 w-fit px-3 py-1.5 rounded-xl border border-slate-100">
                                            <Calendar className="w-4 h-4 text-[#FF9000]" />
                                            {new Date(box.nextHearingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    ) : (
                                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Not Scheduled</span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 md:col-span-1 flex justify-end gap-2">
                                    <button 
                                        onClick={() => handleDeleteCase(box.id)}
                                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => openEditModal(box)}
                                        className="p-2 text-slate-300 hover:text-[#181B25] hover:bg-slate-100 rounded-xl transition-all"
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                                <Info className="w-10 h-10 text-slate-200" />
                            </div>
                            <h3 className="text-xl font-bold text-[#181B25] mb-2">No active cases found</h3>
                            <p className="text-slate-500 max-w-sm font-medium mb-8">Start tracking your legal files by opening a new case record for your clients.</p>
                            <Button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-[#FF9000] hover:bg-[#E68200] text-white px-8 h-12 rounded-2xl font-bold"
                            >
                                <Plus className="w-5 h-5 mr-2" /> Open Your First Case
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* ADD CASE MODAL */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 pb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-[#181B25] tracking-tight">Open New Case File</h2>
                                <p className="text-sm text-slate-500 font-medium">Initialize a new litigation record in your dashboard.</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition text-slate-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateCase} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Case Title / Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. Perera vs. Silva Property Dispute"
                                        value={formData.title}
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF9000] outline-none transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Client Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="Full Name"
                                        value={formData.clientName}
                                        onChange={e => setFormData({...formData, clientName: e.target.value})}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF9000] outline-none transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Case Category</label>
                                    <select 
                                        value={formData.caseType}
                                        onChange={e => setFormData({...formData, caseType: e.target.value})}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF9000] outline-none transition appearance-none"
                                    >
                                        <option value="Civil Law">Civil Law</option>
                                        <option value="Criminal Law">Criminal Law</option>
                                        <option value="Corporate">Corporate Law</option>
                                        <option value="Family Law">Family Law</option>
                                        <option value="Property">Property Law</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Status</label>
                                    <select 
                                        value={formData.status}
                                        onChange={e => setFormData({...formData, status: e.target.value as any})}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF9000] outline-none transition appearance-none"
                                    >
                                        <option value="In Progress">In Progress</option>
                                        <option value="Court Phase">Court Phase</option>
                                        <option value="Pending Review">Pending Review</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Next Hearing Date</label>
                                    <input 
                                        type="date" 
                                        value={formData.nextHearingDate}
                                        onChange={e => setFormData({...formData, nextHearingDate: e.target.value})}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF9000] outline-none transition"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Brief Description / Notes</label>
                                    <textarea 
                                        rows={3}
                                        placeholder="Add important notes about this case..."
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF9000] outline-none transition resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button 
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 h-14 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl transition"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="flex-1 h-14 bg-[#FF9000] hover:bg-[#E68200] text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 transition active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Open Case'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT CASE MODAL */}
            {isEditModalOpen && selectedCase && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 pb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-[#181B25] tracking-tight">Update Case Progress</h2>
                                <p className="text-sm text-slate-500 font-medium">Modify litigation status and hearing dates for <strong>{selectedCase.title}</strong>.</p>
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition text-slate-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateCase} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3 md:col-span-2">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Gauge className="w-3 h-3" /> Case Progress
                                        </label>
                                        <span className="text-sm font-black text-[#FF9000]">{editData.progress}%</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        step="5"
                                        value={editData.progress}
                                        onChange={e => setEditData({...editData, progress: parseInt(e.target.value)})}
                                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#FF9000]"
                                    />
                                    <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase px-1">
                                        <span>Initial</span>
                                        <span>In Court</span>
                                        <span>Finalized</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Status</label>
                                    <select 
                                        value={editData.status}
                                        onChange={e => setEditData({...editData, status: e.target.value as any})}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF9000] outline-none transition appearance-none"
                                    >
                                        <option value="In Progress">In Progress</option>
                                        <option value="Court Phase">Court Phase</option>
                                        <option value="Pending Review">Pending Review</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Canceled">Canceled</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Next Hearing Date</label>
                                    <input 
                                        type="date" 
                                        value={editData.nextHearingDate}
                                        onChange={e => setEditData({...editData, nextHearingDate: e.target.value})}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF9000] outline-none transition"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Internal Notes / Update</label>
                                    <textarea 
                                        rows={3}
                                        placeholder="Add notes about the latest hearing or progress..."
                                        value={editData.description}
                                        onChange={e => setEditData({...editData, description: e.target.value})}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF9000] outline-none transition resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button 
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 h-14 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl transition"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="flex-1 h-14 bg-[#181B25] hover:bg-black text-white font-black rounded-2xl shadow-xl shadow-slate-900/20 transition active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
