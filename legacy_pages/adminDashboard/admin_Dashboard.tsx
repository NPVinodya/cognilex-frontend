'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, Scale, MessageSquare, TrendingUp, Calendar, FileText, AlertCircle, CheckCircle, Clock, Search, Filter, MoreVertical, Download, Eye, Trash2, UserCheck, UserX, ArrowUp, ArrowDown, Shield, Gavel, Award, MapPin, Briefcase, Star
} from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_users: 0, active_lawyers: 0, chat_sessions: 0, pending_approvals: 0 });
  const [users, setUsers] = useState([]);
  const [lawyerApprovals, setLawyerApprovals] = useState([]);
  const [registeredLawyers, setRegisteredLawyers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStats(); fetchUsers(); fetchPendingLawyers(); fetchRegisteredLawyers();
  }, []);

  const fetchStats = async () => { try { const response = await axios.get(`${API_URL}/admin/stats`); setStats(response.data); } catch (error) { console.error('Error fetching stats:', error); } };
  const fetchUsers = async () => { try { const response = await axios.get(`${API_URL}/admin/users?skip=0&limit=10`); setUsers(response.data.users); } catch (error) { console.error('Error fetching users:', error); } finally { setLoading(false); } };
  const fetchPendingLawyers = async () => { try { const response = await axios.get(`${API_URL}/lawyer/pending`); setLawyerApprovals(response.data.lawyers || []); } catch (error) { console.error('Error fetching pending lawyers:', error); } };
  const fetchRegisteredLawyers = async () => { try { const response = await axios.get(`${API_URL}/lawyer/all?status=approved`); setRegisteredLawyers(response.data.lawyers || []); } catch (error) { console.error('Error fetching registered lawyers:', error); } };

  const handleApproval = async (lawyerId: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') { await axios.post(`${API_URL}/lawyer/${lawyerId}/approve`); }
      else {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;
        const formData = new FormData();
        formData.append('reason', reason);
        await axios.post(`${API_URL}/lawyer/${lawyerId}/reject`, formData);
      }
      alert(`Lawyer action successful`);
      fetchPendingLawyers(); fetchRegisteredLawyers(); fetchStats();
    } catch (error: any) { alert('Failed'); }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`);
      alert('User deleted successfully!');
      fetchUsers(); fetchStats();
    } catch (error: any) { alert('Failed to delete user'); }
  };

  const isUserLawyer = (userEmail: string) => { return registeredLawyers.some((lawyer: any) => lawyer.email === userEmail); };

  const statsDisplay = [
    { label: 'Total Users', value: stats.total_users.toLocaleString(), change: '+12.5%', trend: 'up', icon: Users, color: 'from-slate-700 to-slate-900', textColor: 'text-slate-900' },
    { label: 'Active Professionals', value: stats.active_lawyers.toLocaleString(), change: '+8.2%', trend: 'up', icon: Scale, color: 'from-amber-500 to-amber-600', textColor: 'text-amber-600' },
    { label: 'Consultations', value: stats.chat_sessions.toLocaleString(), change: '+23.1%', trend: 'up', icon: MessageSquare, color: 'from-slate-600 to-slate-800', textColor: 'text-slate-800' },
    { label: 'Pending Approvals', value: stats.pending_approvals.toLocaleString(), change: '-4.3%', trend: 'down', icon: Clock, color: 'from-amber-400 to-amber-500', textColor: 'text-amber-500' },
  ];

  const filteredLawyers = registeredLawyers.filter((lawyer: any) =>
    lawyer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lawyer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lawyer.barCouncilNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Loading secure dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 shadow-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl shadow-inner">
                <Shield className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">System Administration</h1>
                <p className="text-slate-400 text-sm font-medium mt-1">CogniLex Platform Operations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { fetchStats(); fetchUsers(); fetchPendingLawyers(); fetchRegisteredLawyers(); }}
                className="px-5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition font-bold shadow-sm"
              >
                <Download className="w-4 h-4 inline mr-2" />
                Sync Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsDisplay.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl shadow-sm text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                  {stat.trend === 'up' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                  <span className="text-xs font-black tracking-wider">{stat.change}</span>
                </div>
              </div>
              <h3 className={`text-4xl font-black mb-1 ${stat.textColor}`}>{stat.value}</h3>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8">
          <div className="border-b border-slate-200 bg-slate-50/50">
            <div className="flex overflow-x-auto">
              {['overview', 'users', 'lawyers', 'approvals'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-5 font-bold uppercase tracking-wider text-sm transition relative whitespace-nowrap ${activeTab === tab ? 'text-amber-600 bg-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500"></div>}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {(activeTab === 'lawyers') && (
              <div className="mb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <Scale className="w-7 h-7 text-amber-600" />
                    Verified Professionals ({filteredLawyers.length})
                  </h2>
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search directory..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full md:w-80 pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition text-slate-900 font-medium"
                    />
                  </div>
                </div>

                {filteredLawyers.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                    <Scale className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold text-lg">No professionals match criteria.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredLawyers.map((lawyer: any) => (
                      <div key={lawyer._id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-amber-300 transition-all group">
                        <div className="flex gap-5">
                          <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                              {lawyer.profilePhotoUrl ? (
                                <img src={lawyer.profilePhotoUrl} alt={lawyer.fullName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-amber-500 font-black text-3xl">
                                  {lawyer.fullName?.charAt(0) || 'L'}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-center gap-1.5 mt-3 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              <span className="text-xs font-black text-amber-900">{lawyer.rating?.toFixed(1) || '0.0'}</span>
                            </div>
                          </div>

                          <div className="flex-1">
                            <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-amber-700 transition">{lawyer.fullName}</h3>
                            <p className="text-sm text-slate-500 font-bold mb-3 flex items-center gap-1.5">
                              <Briefcase className="w-4 h-4 text-slate-400" />
                              Bar Council: {lawyer.barCouncilNumber}
                            </p>

                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {lawyer.practiceAreas?.map((area: string, idx: number) => (
                                <span key={idx} className="text-[11px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200">
                                  {area}
                                </span>
                              ))}
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm border-t border-slate-100 pt-3">
                              <div className="flex items-center gap-2 text-slate-600 font-medium">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                {lawyer.province}
                              </div>
                              <div className="flex items-center gap-2 text-slate-600 font-medium">
                                <FileText className="w-4 h-4 text-slate-400" />
                                LKR <span className="font-bold text-slate-900">{lawyer.consultationFee?.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(activeTab === 'overview' || activeTab === 'users') && (
              <div className="mb-0">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <Users className="w-7 h-7 text-amber-600" />
                    Platform Users ({users.length})
                  </h2>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">User Details</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Role</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Joined On</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {users.map((user: any) => {
                        const isLawyer = isUserLawyer(user.email);
                        return (
                          <tr key={user.id} className="hover:bg-slate-50/80 transition group">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-sm border ${isLawyer ? 'bg-slate-900 text-amber-500 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                  {user.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900">{user.name || 'Unknown'}</p>
                                  <p className="text-sm font-medium text-slate-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              {isLawyer ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
                                  <Scale className="w-3.5 h-3.5" />
                                  Lawyer
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
                                  <Users className="w-3.5 h-3.5" />
                                  User
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-5">
                              <span className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-5 font-medium text-slate-500 text-sm">
                              {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-5 text-right">
                              <button onClick={() => handleDeleteUser(user.id)} className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 rounded-lg transition shadow-sm hover:border-rose-200 hover:bg-rose-50" title="Delete record">
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
            )}

            {(activeTab === 'overview' || activeTab === 'approvals') && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <Gavel className="w-7 h-7 text-amber-600" />
                    Pending Authorizations
                  </h2>
                  <span className="px-4 py-1.5 bg-amber-100 border border-amber-200 text-amber-800 rounded-lg text-sm font-black uppercase tracking-wider shadow-inner">
                    {lawyerApprovals.length} Queue
                  </span>
                </div>

                {lawyerApprovals.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                    <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold text-lg">No pending authorizations.</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {lawyerApprovals.map((lawyer: any) => (
                      <div key={lawyer._id} className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-amber-400 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-start gap-6">
                          <div className="w-20 h-20 bg-slate-900 rounded-xl flex items-center justify-center text-amber-500 font-black text-3xl shadow-md border-2 border-slate-800 shrink-0">
                            {lawyer.fullName?.charAt(0) || 'L'}
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">{lawyer.fullName}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                              <p className="text-sm text-slate-600 font-medium"><span className="text-slate-400 font-bold uppercase tracking-wider text-xs mr-2">Email</span> {lawyer.email}</p>
                              <p className="text-sm text-slate-600 font-medium"><span className="text-slate-400 font-bold uppercase tracking-wider text-xs mr-2">Bar Num</span> {lawyer.barCouncilNumber}</p>
                              <p className="text-sm text-slate-600 font-medium"><span className="text-slate-400 font-bold uppercase tracking-wider text-xs mr-2">Location</span> {lawyer.province}</p>
                              <p className="text-sm text-slate-600 font-medium"><span className="text-slate-400 font-bold uppercase tracking-wider text-xs mr-2">Experience</span> {lawyer.yearsOfExperience} yrs</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                          <button onClick={() => handleApproval(lawyer._id, 'approve')} className="flex-1 lg:flex-none px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition font-bold flex items-center justify-center gap-2 shadow-md">
                            <UserCheck className="w-4 h-4 text-emerald-400" /> Approve
                          </button>
                          <button onClick={() => handleApproval(lawyer._id, 'reject')} className="flex-1 lg:flex-none px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 transition font-bold flex items-center justify-center gap-2 shadow-sm">
                            <UserX className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}