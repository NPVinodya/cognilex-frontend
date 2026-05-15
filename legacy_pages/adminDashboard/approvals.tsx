'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Gavel, Shield, UserCheck, UserX, Clock, MapPin, Briefcase, FileText, Eye, X, Mail, Phone, GraduationCap, Building2, CreditCard, Languages, Banknote
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminApprovals() {
  const [loading, setLoading] = useState(true);
  const [lawyerApprovals, setLawyerApprovals] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState<any | null>(null);

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
      if (selectedLawyer && selectedLawyer._id === lawyerId) {
        setSelectedLawyer(null); // Close modal if open
      }
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Authorizations Queue</h1>
          <p className="text-base text-slate-500 dark:text-slate-400 font-medium">Review and verify new professional registrations</p>
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
              <div className="flex flex-wrap gap-3 w-full xl:w-auto mt-6 xl:mt-0 pt-8 xl:pt-0 border-t xl:border-t-0 border-slate-100 items-center justify-end">
                <button
                  onClick={() => setSelectedLawyer(lawyer)}
                  className="px-6 py-4 bg-slate-100 text-slate-700 rounded-[1.5rem] hover:bg-slate-200 transition-all duration-300 font-black flex items-center justify-center gap-2 shadow-sm active:scale-95 group/btn-view"
                >
                  <Eye className="w-5 h-5 text-slate-500 group-hover/btn-view:text-blue-500 transition-colors" />
                  <span className="uppercase tracking-widest text-[11px]">View Details</span>
                </button>
                <button onClick={() => handleApproval(lawyer._id, 'approve')} className="px-6 py-4 bg-slate-900 text-white rounded-[1.5rem] hover:bg-black transition-all duration-300 font-black flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 active:scale-95 group/btn">
                  <UserCheck className="w-5 h-5 text-emerald-400 group-hover/btn:scale-110 transition-transform" />
                  <span className="uppercase tracking-widest text-[11px]">Approve</span>
                </button>
                <button onClick={() => handleApproval(lawyer._id, 'reject')} className="px-6 py-4 bg-white border-2 border-slate-200 text-slate-500 rounded-[1.5rem] hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 transition-all duration-300 font-black flex items-center justify-center gap-2 shadow-sm active:scale-95 group/btn-x">
                  <UserX className="w-5 h-5 group-hover/btn-x:rotate-12 transition-transform" />
                  <span className="uppercase tracking-widest text-[11px]">Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lawyer Details Modal */}
      {selectedLawyer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-left">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedLawyer(null)}
          ></div>

          {/* Modal Content */}
          <div className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 border border-slate-200">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#FF9000]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Lawyer Registration Review</h2>
                  <p className="text-sm font-bold text-slate-500">Review all details and documents before approval</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLawyer(null)}
                className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Info */}
                <div className="space-y-8">
                  {/* Personal Info */}
                  <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-blue-500" /> Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div><p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Full Name</p><p className="font-bold text-slate-900">{selectedLawyer.fullName}</p></div>
                      <div><p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Email</p><p className="font-bold text-slate-900 flex items-center gap-2 break-all"><Mail className="w-4 h-4 text-slate-400 shrink-0" /> {selectedLawyer.email}</p></div>
                      <div><p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Phone</p><p className="font-bold text-slate-900 flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400 shrink-0" /> {selectedLawyer.phone}</p></div>
                      <div><p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Address</p><p className="font-bold text-slate-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {selectedLawyer.address}, {selectedLawyer.city}, {selectedLawyer.province}</p></div>
                      <div><p className="text-[10px] uppercase font-black tracking-widest text-slate-400">NIC Number</p><p className="font-bold text-slate-900 flex items-center gap-2"><CreditCard className="w-4 h-4 text-slate-400" /> {selectedLawyer.nicNumber}</p></div>
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-purple-500" /> Professional Details
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Lawyer ID</p><p className="font-bold text-slate-900">{selectedLawyer.lawyerId}</p></div>
                        <div><p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Bar Council No.</p><p className="font-bold text-slate-900">{selectedLawyer.barCouncilNumber}</p></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Specialization</p><p className="font-bold text-slate-900">{selectedLawyer.specialization}</p></div>
                        <div><p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Experience</p><p className="font-bold text-slate-900">{selectedLawyer.yearsOfExperience} Years</p></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Law Firm</p><p className="font-bold text-slate-900 flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-400" /> {selectedLawyer.lawFirm}</p></div>
                        <div><p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Fee (LKR)</p><p className="font-bold text-slate-900 flex items-center gap-2"><Banknote className="w-4 h-4 text-slate-400" /> Rs. {selectedLawyer.consultationFee}</p></div>
                      </div>
                      <div><p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Languages Spoken</p><p className="font-bold text-slate-900 flex items-center gap-2"><Languages className="w-4 h-4 text-slate-400" /> {selectedLawyer.languagesSpoken}</p></div>
                      <div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Practice Areas</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedLawyer.practiceAreas?.map((area: string) => (
                            <span key={area} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md">{area}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Education */}
                  <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-emerald-500" /> Education & Bio
                    </h3>
                    <div className="space-y-4">
                      <div><p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Law School</p><p className="font-bold text-slate-900">{selectedLawyer.lawSchool} (Class of {selectedLawyer.graduationYear})</p></div>
                      {selectedLawyer.additionalQualifications && (
                        <div><p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Qualifications</p><p className="font-medium text-sm text-slate-700">{selectedLawyer.additionalQualifications}</p></div>
                      )}
                      <div><p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Professional Bio</p><p className="font-medium text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl mt-1">{selectedLawyer.bio}</p></div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Documents */}
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-rose-500" /> Verification Documents
                  </h3>

                  {/* Profile Photo */}
                  <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-3">Profile Photo</p>
                    <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden relative group">
                      {selectedLawyer.profilePhotoUrl ? (
                        <img src={selectedLawyer.profilePhotoUrl} alt="Profile" className="w-full h-full object-contain bg-slate-900" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-slate-400 font-bold">No Image</div>
                      )}
                    </div>
                  </div>

                  {/* Lawyer ID / Bar Council */}
                  <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-3">Bar Council Certificate / ID</p>
                    <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden relative group">
                      {selectedLawyer.lawyerIdPhotoUrl ? (
                        <img src={selectedLawyer.lawyerIdPhotoUrl} alt="Lawyer ID" className="w-full h-full object-contain bg-slate-900" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-slate-400 font-bold">No Image</div>
                      )}
                    </div>
                  </div>

                  {/* NIC Front & Back */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-3">NIC Front</p>
                      <div className="w-full h-32 bg-slate-100 rounded-xl overflow-hidden">
                        {selectedLawyer.nicFrontPhotoUrl ? (
                          <img src={selectedLawyer.nicFrontPhotoUrl} alt="NIC Front" className="w-full h-full object-contain bg-slate-900" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-slate-400 font-bold text-xs">No Image</div>
                        )}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-3">NIC Back</p>
                      <div className="w-full h-32 bg-slate-100 rounded-xl overflow-hidden">
                        {selectedLawyer.nicBackPhotoUrl ? (
                          <img src={selectedLawyer.nicBackPhotoUrl} alt="NIC Back" className="w-full h-full object-contain bg-slate-900" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-slate-400 font-bold text-xs">No Image</div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-end gap-4 shrink-0">
              <button
                onClick={() => setSelectedLawyer(null)}
                className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApproval(selectedLawyer._id, 'reject')}
                className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-xl hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 transition-all font-black flex items-center gap-2"
              >
                <UserX className="w-4 h-4" /> Reject Request
              </button>
              <button
                onClick={() => handleApproval(selectedLawyer._id, 'approve')}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all font-black flex items-center gap-2 shadow-lg shadow-slate-900/10"
              >
                <UserCheck className="w-4 h-4" /> Approve Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
