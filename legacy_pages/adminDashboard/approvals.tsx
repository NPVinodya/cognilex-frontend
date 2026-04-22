'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Gavel, Shield, UserCheck, UserX, Clock, MapPin, Briefcase, FileText 
} from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000';

export default function AdminApprovals() {
  const [loading, setLoading] = useState(true);
  const [lawyerApprovals, setLawyerApprovals] = useState([]);

  const fetchPendingLawyers = async () => {
    try {
      const response = await axios.get(`${API_URL}/lawyer/pending`);
      setLawyerApprovals(response.data.lawyers || []);
    } catch (error) {
      console.error('Error fetching pending lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLawyers();
  }, []);

  const handleApproval = async (lawyerId: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await axios.post(`${API_URL}/lawyer/${lawyerId}/approve`);
      } else {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;
        const formData = new FormData();
        formData.append('reason', reason);
        await axios.post(`${API_URL}/lawyer/${lawyerId}/reject`, formData);
      }
      alert(`Lawyer action successful`);
      fetchPendingLawyers();
    } catch (error: any) {
      alert('Failed to process authorization');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mb-4"></div>
        <p className="text-slate-500 font-bold">Retrieving authorization queue...</p>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-500 text-left">
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4 text-left">
             Authorizations Queue
          </h1>
          <p className="text-slate-500 text-sm font-bold mt-1 text-left">Review and verify new professional registrations</p>
        </div>
        <div className="px-6 py-3 bg-orange-50 border border-orange-100 text-[#FF9000] rounded-2xl text-xs font-black uppercase tracking-[0.15em] shadow-sm">
          {lawyerApprovals.length} Pending Requests
        </div>
      </div>

      {lawyerApprovals.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-slate-100 border-dashed">
          <Shield className="w-20 h-20 text-slate-100 mx-auto mb-6" />
          <p className="text-slate-400 font-black text-xl">Queue is empty.</p>
          <p className="text-slate-300 text-sm font-bold mt-1 uppercase tracking-widest">Everything is up to date!</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {lawyerApprovals.map((lawyer: any) => (
            <div key={lawyer._id} className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 hover:shadow-2xl hover:border-amber-400 transition-all duration-500 flex flex-col xl:flex-row xl:items-center justify-between gap-10 group bg-gradient-to-br from-white to-slate-50/30">
              <div className="flex flex-col sm:flex-row items-start gap-8 flex-1 text-left">
                <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-amber-500 font-black text-4xl italic shadow-2xl border-4 border-white transition-transform duration-500 group-hover:rotate-6 shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent"></div>
                    <span className="relative z-10">{lawyer.fullName?.charAt(0) || 'L'}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{lawyer.fullName}</h3>
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-lg border border-amber-100 uppercase tracking-widest">Pending Review</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
                    <p className="text-sm text-slate-600 font-bold flex items-center gap-3"><span className="text-slate-300 font-black uppercase tracking-widest text-[9px] w-20">Email</span> {lawyer.email}</p>
                    <p className="text-sm text-slate-600 font-bold flex items-center gap-3"><span className="text-slate-300 font-black uppercase tracking-widest text-[9px] w-20">Bar ID</span> {lawyer.barCouncilNumber}</p>
                    <p className="text-sm text-slate-600 font-bold flex items-center gap-3"><span className="text-slate-300 font-black uppercase tracking-widest text-[9px] w-20">Location</span> {lawyer.province}</p>
                    <p className="text-sm text-slate-600 font-bold flex items-center gap-3"><span className="text-slate-300 font-black uppercase tracking-widest text-[9px] w-20">Experience</span> {lawyer.yearsOfExperience} Years Practice</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 w-full xl:w-auto mt-6 xl:mt-0 pt-8 xl:pt-0 border-t xl:border-t-0 border-slate-100">
                <button onClick={() => handleApproval(lawyer._id, 'approve')} className="flex-1 xl:flex-none px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] hover:bg-black transition-all duration-300 font-black flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 active:scale-95 group/btn">
                  <UserCheck className="w-5 h-5 text-emerald-400 group-hover/btn:scale-110 transition-transform" /> 
                  <span className="uppercase tracking-widest text-xs">Approve Access</span>
                </button>
                <button onClick={() => handleApproval(lawyer._id, 'reject')} className="flex-1 xl:flex-none px-8 py-4 bg-white border-2 border-slate-200 text-slate-500 rounded-[1.5rem] hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 transition-all duration-300 font-black flex items-center justify-center gap-3 shadow-sm active:scale-95 group/btn-x">
                  <UserX className="w-5 h-5 group-hover/btn-x:rotate-12 transition-transform" /> 
                  <span className="uppercase tracking-widest text-xs">Reject Request</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
