'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Scale, Search, Briefcase, MapPin, FileText, Star
} from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000';

export default function AdminLawyers() {
    const [loading, setLoading] = useState(true);
    const [registeredLawyers, setRegisteredLawyers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchRegisteredLawyers = async () => {
        try {
            const response = await axios.get(`${API_URL}/lawyer/all?status=approved`);
            setRegisteredLawyers(response.data.lawyers || []);
        } catch (error) {
            console.error('Error fetching lawyers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegisteredLawyers();
    }, []);

    const filteredLawyers = registeredLawyers.filter((lawyer: any) =>
        lawyer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.barCouncilNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mb-4"></div>
                <p className="text-slate-500 font-bold">Opening professional directory...</p>
            </div>
        );
    }

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verified Professionals</h1>
                    <p className="text-slate-500 text-sm font-bold mt-1">Directory of legally authorized practitioners</p>
                </div>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, ID or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-96 pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition text-slate-900 font-bold placeholder:text-slate-300"
                    />
                </div>
            </div>

            {filteredLawyers.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-slate-100 border-dashed">
                    <Scale className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-black text-xl">No practitioners found.</p>
                    <p className="text-slate-300 text-sm font-bold mt-1">Try adjusting your search query.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {filteredLawyers.map((lawyer: any) => (
                        <div key={lawyer._id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:border-amber-200 transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-colors duration-500"></div>

                            <div className="flex flex-col sm:flex-row gap-8 relative z-10">
                                <div className="flex-shrink-0">
                                    <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-slate-50 bg-slate-100 shadow-xl transition-transform duration-500 group-hover:scale-105">
                                        {lawyer.profilePhotoUrl ? (
                                            <img src={lawyer.profilePhotoUrl} alt={lawyer.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-slate-900 flex items-center justify-center text-amber-500 font-black text-4xl italic">
                                                {lawyer.fullName?.charAt(0) || 'L'}
                                            </div>
                                        )}
                                    </div>

                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-amber-600 transition-colors duration-300 tracking-tight">{lawyer.fullName}</h3>
                                            <p className="text-sm text-slate-400 font-black flex items-center gap-2 mt-1 uppercase tracking-widest">
                                                <Briefcase className="w-4 h-4 text-slate-300" />
                                                {lawyer.barCouncilNumber}
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors">
                                            <FileText className="w-5 h-5 text-slate-300 group-hover:text-amber-500 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6 mt-4">
                                        {lawyer.practiceAreas?.map((area: string, idx: number) => (
                                            <span key={idx} className="text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl border border-slate-100 group-hover:bg-white group-hover:border-amber-100 transition-all">
                                                {area}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                                <MapPin className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <span className="text-xs font-bold">{lawyer.province}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                                <Scale className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <span className="text-xs font-black text-slate-900">LKR {lawyer.consultationFee?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
