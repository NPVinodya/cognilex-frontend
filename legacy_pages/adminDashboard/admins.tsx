'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShieldCheck, UserPlus, Trash2, Mail, User, Shield, X, Lock, AlertCircle, CheckCircle, Info
} from 'lucide-react';


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminManagement() {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    // Get current logged in admin info
    const adminJson = localStorage.getItem('adminUser');
    if (adminJson) {
      setCurrentAdmin(JSON.parse(adminJson));
    }
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      // Using a dedicated endpoint for admins as they are in a separate collection
      const response = await axios.get(`${API_URL}/admin/admins`);
      setAdmins(response.data.admins || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
      // Fallback or empty state if endpoint doesn't exist yet
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Using dedicated /admin/register and including who added this admin
      await axios.post(`${API_URL}/admin/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        added_by: currentAdmin?.email || currentAdmin?.id || 'Primary Admin',
        role: 'admin'
      });

      setSuccess('New administrator added successfully!');
      setFormData({ name: '', email: '', password: '' });
      fetchAdmins();

      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess('');
      }, 2000);

    } catch (err: any) {
      const errorData = err.response?.data?.detail;
      let errorMessage = 'Failed to add administrator';

      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (Array.isArray(errorData)) {
        errorMessage = errorData.map(e => e.msg).join(', ');
      } else if (errorData && typeof errorData === 'object') {
        errorMessage = errorData.msg || JSON.stringify(errorData);
      } else {
        errorMessage = err.message || errorMessage;
      }

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to revoke administrative access for this user?')) return;
    try {
      await axios.delete(`${API_URL}/admin/admins/${adminId}`);
      alert('Administrative access revoked successfully');
      fetchAdmins();
    } catch (error) {
      alert('Failed to revoke access');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF9000] border-t-transparent mb-4"></div>
        <p className="text-slate-500 font-bold tracking-tight">Synchronizing administrative records...</p>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-500 text-left pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
          <p className="text-base text-slate-500 dark:text-slate-400 font-medium">Control and audit platform administrative access</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3.5 bg-[#181B25] text-white rounded-2xl hover:bg-slate-800 transition-all font-bold flex items-center gap-2 shadow-xl shadow-slate-900/10 active:scale-95 group"
        >
          <UserPlus className="w-5 h-5 text-[#FF9000] group-hover:scale-110 transition-transform" />
          Add New Admin
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {admins.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-[2.5rem] border-2 border-slate-100 border-dashed text-center">
            <Shield className="w-20 h-20 text-slate-100 mx-auto mb-4" />
            <p className="text-slate-400 font-black text-xl tracking-tight">No additional administrators found.</p>
            <p className="text-slate-300 text-sm font-bold uppercase tracking-widest mt-1 italic">Only the primary system account is active.</p>
          </div>
        ) : (
          admins.map((admin: any) => (
            <div key={admin.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:border-[#FF9000]/20 transition-all duration-500 flex flex-col sm:flex-row items-center gap-8 group">
              <div className="w-20 h-20 bg-[#181B25] rounded-[1.5rem] flex items-center justify-center text-[#FF9000] font-black text-2xl shadow-xl transition-transform duration-500 group-hover:rotate-3 shrink-0">
                {admin.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 w-full text-left">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{admin.name || 'Admin User'}</h3>
                  <span className="px-3 py-1.5 bg-orange-50 text-[#FF9000] text-[9px] font-black rounded-xl uppercase tracking-widest border border-orange-100 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Platform Admin
                  </span>
                </div>
                <div className="space-y-4">
                  <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" /> {admin.email}
                  </p>

                  {/* Tracking Creator */}
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Authorized By: <span className="text-slate-600">{admin.added_by || 'Primary Admin'}</span>
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                      Access ID: {admin.id?.slice(-8) || 'N/A'}
                    </span>
                    <button
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all active:scale-90"
                      title="Revoke Admin Roles"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Security Guidelines Section */}
      <div className="mt-12 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-left">
        <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#FF9000]" /> Security Audit Guidelines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <h4 className="font-bold text-slate-700 mb-2">Hierarchical Control</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Admins are stored in a dedicated secure collection. Every new admin creation is tracked for audit visibility.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <h4 className="font-bold text-slate-700 mb-2">Creator Visibility</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">The identity of the administrator who granted access is permanently stored in the audit record.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <h4 className="font-bold text-slate-700 mb-2">Revocation</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Revoking an admin will immediately terminate their active session and block API access keys across the entire platform.</p>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => !submitting && setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="bg-[#181B25] p-3 rounded-2xl shadow-lg">
                  <UserPlus className="w-6 h-6 text-[#FF9000]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Grant Privilege</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Authorize new platform admin</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition shadow-sm border border-transparent hover:border-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="p-8 space-y-6">
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-start gap-3 text-sm font-bold animate-in bounce-in duration-300">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-start gap-3 text-sm font-bold animate-in bounce-in duration-300">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  {success}
                </div>
              )}

              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 mb-4">
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-wider mb-1">Authorizing Agent (You)</p>
                  <p className="text-sm font-bold text-slate-700">{currentAdmin?.name || 'Administrator'} ({currentAdmin?.email})</p>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Identity</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#FF9000] focus:ring-4 focus:ring-[#FF9000]/10 transition font-bold text-slate-900 placeholder:text-slate-300"
                      placeholder="e.g., Alexander Maxwell"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Authority Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#FF9000] focus:ring-4 focus:ring-[#FF9000]/10 transition font-bold text-slate-900 placeholder:text-slate-300"
                      placeholder="admin@cognilex.ai"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Security Key (Password)</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#FF9000] focus:ring-4 focus:ring-[#FF9000]/10 transition font-bold text-slate-900 placeholder:text-slate-300"
                      placeholder="••••••••••••"
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#181B25] text-white rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Grant Administrative Access</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
