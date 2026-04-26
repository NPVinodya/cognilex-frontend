'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, Scale, MessageSquare, Clock, Download, ArrowUp, ArrowDown, 
  CheckCircle, Trash2, Gavel, Shield, UserCheck, UserX 
} from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000';

export default function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_users: 0, active_lawyers: 0, chat_sessions: 0, pending_approvals: 0 });
  const [users, setUsers] = useState([]);
  const [lawyerApprovals, setLawyerApprovals] = useState([]);
  const [registeredLawyers, setRegisteredLawyers] = useState([]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, pendingRes, lawyersRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`),
        axios.get(`${API_URL}/admin/users?skip=0&limit=10`), 
        axios.get(`${API_URL}/lawyer/pending`),
        axios.get(`${API_URL}/lawyer/all?status=approved`)
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data.users || []);
      setLawyerApprovals(pendingRes.data.lawyers || []);
      setRegisteredLawyers(lawyersRes.data.lawyers || []);
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      alert(`Action successful`);
      fetchData();
    } catch (error) {
      alert('Failed to process');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const isUserLawyer = (userEmail: string) => {
    return registeredLawyers.some((lawyer: any) => lawyer.email === userEmail);
  };

  const statsDisplay = [
    { label: 'Total Users', value: stats.total_users.toLocaleString(), change: '+12.5%', trend: 'up', icon: Users, color: 'from-slate-700 to-slate-900', textColor: 'text-slate-900' },
    { label: 'Active Professionals', value: stats.active_lawyers.toLocaleString(), change: '+8.2%', trend: 'up', icon: Scale, color: 'from-amber-400 to-amber-500', textColor: 'text-amber-500' },
    { label: 'Consultations', value: stats.chat_sessions.toLocaleString(), change: '+23.1%', trend: 'up', icon: MessageSquare, color: 'from-slate-600 to-slate-800', textColor: 'text-slate-800' },
    { label: 'Pending Approvals', value: stats.pending_approvals.toLocaleString(), change: '-4.3%', trend: 'down', icon: Gavel, color: 'from-amber-400 to-amber-500', textColor: 'text-amber-500' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mb-4"></div>
        <p className="text-slate-500 font-bold">Synchronizing dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-500 pb-20 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
          <p className="text-base text-slate-500 dark:text-slate-400 font-medium">Complete platform status & metrics</p>
        </div>
        <div>
          <button onClick={fetchData} className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-bold flex items-center gap-2 shadow-xl shadow-slate-900/20 active:scale-95">
            <Download className="w-4 h-4" /> Refresh All Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statsDisplay.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-[2rem] p-7 border border-slate-100 hover:shadow-2xl transition-all duration-500 group">
            <div className="flex items-start justify-between mb-6">
              <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-2xl shadow-lg text-white group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`px-3 py-1.5 rounded-xl text-xs font-black ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                {stat.change}
              </div>
            </div>
            <h3 className={`text-4xl font-black mb-1.5 ${stat.textColor} tracking-tight`}>{stat.value}</h3>
            <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-12">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left">
            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between transition group">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <Users className="w-6 h-6 text-[#FF9000]" /> Platform Users
                </h2>
                <div className="px-4 py-1.5 bg-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-500">Recently Active</div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Details</th>
                            <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Role</th>
                            <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-10 py-5 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {users.map((user: any) => {
                            const isLawyer = isUserLawyer(user.email);
                            return (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition group">
                                    <td className="px-10 py-6 flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-transform group-hover:scale-110 border ${isLawyer ? 'bg-slate-900 text-amber-500 border-slate-800' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                            {user.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 text-base">{user.name}</p>
                                            <p className="text-sm font-bold text-slate-400">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border ${isLawyer ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                            {isLawyer ? 'Lawyer' : 'User'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-black uppercase tracking-wide">
                                            <CheckCircle className="w-4 h-4" /> Active
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button onClick={() => handleDeleteUser(user.id)} className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-10 text-left">
            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-white">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <Gavel className="w-6 h-6 text-[#FF9000]" /> Pending Authorizations
                </h2>
                <div className="px-4 py-1.5 bg-orange-50 text-[#FF9000] rounded-xl text-[10px] font-black uppercase tracking-widest">
                    {lawyerApprovals.length} Requests
                </div>
            </div>
            <div className="p-10">
                {lawyerApprovals.length === 0 ? (
                    <div className="text-center py-10">
                        <Shield className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold">No pending authorizations.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {lawyerApprovals.slice(0, 3).map((lawyer: any) => (
                            <div key={lawyer._id} className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 flex flex-col lg:flex-row items-center justify-between gap-6 hover:border-amber-200 transition-all">
                                <div className="flex items-center gap-6 text-left">
                                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-amber-500 font-black text-2xl shadow-xl italic shrink-0">
                                        {lawyer.fullName?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900">{lawyer.fullName}</h3>
                                        <div className="flex flex-wrap gap-4 mt-1 text-xs font-bold text-slate-400">
                                            <span>{lawyer.email}</span>
                                            <span className="text-slate-200">|</span>
                                            <span>{lawyer.province}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 w-full lg:w-auto">
                                    <button onClick={() => handleApproval(lawyer._id, 'approve')} className="flex-1 lg:flex-none px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-black transition font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                        <UserCheck className="w-4 h-4 text-emerald-400" /> Approve
                                    </button>
                                    <button onClick={() => handleApproval(lawyer._id, 'reject')} className="flex-1 lg:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                        <UserX className="w-4 h-4" /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                        {lawyerApprovals.length > 3 && (
                            <p className="text-center text-xs font-bold text-slate-400 mt-2 italic">
                                And {lawyerApprovals.length - 3} more pending requests...
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
