'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, Trash2, CheckCircle, Scale 
} from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000';

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [registeredLawyers, setRegisteredLawyers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users?skip=0&limit=100`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredLawyers = async () => {
    try {
      const response = await axios.get(`${API_URL}/lawyer/all?status=approved`);
      setRegisteredLawyers(response.data.lawyers || []);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRegisteredLawyers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`);
      alert('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const isUserLawyer = (userEmail: string) => {
    return registeredLawyers.some((lawyer: any) => lawyer.email === userEmail);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mb-4"></div>
        <p className="text-slate-500 font-bold">Accessing user directory...</p>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-500 text-left">
      <div className="mb-10 flex items-center justify-between">
        <div className="text-left">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 text-sm font-bold mt-1 text-left">Monitor and manage platform participants</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-sm font-black text-slate-700">{users.length} Total Users</span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_4px_30px_-10px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden text-left">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">User Details</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Role</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Joined On</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user: any) => {
                const isLawyer = isUserLawyer(user.email);
                return (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border transition-transform duration-300 group-hover:scale-110 ${isLawyer ? 'bg-slate-900 text-amber-500 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-[15px] text-left">{user.name || 'Unknown'}</p>
                          <p className="text-sm font-bold text-slate-400 text-left">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {isLawyer ? (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-[0.1em]">
                          <Scale className="w-3.5 h-3.5" />
                          Lawyer
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black bg-slate-50 text-slate-500 border border-slate-100 uppercase tracking-[0.1em]">
                          <Users className="w-3.5 h-3.5" />
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <span className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </span>
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-500 text-sm italic">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={() => handleDeleteUser(user.id)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 rounded-2xl transition shadow-sm hover:border-rose-200 hover:bg-rose-50 hover:rotate-12" title="Delete record">
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
    </div>
  );
}
