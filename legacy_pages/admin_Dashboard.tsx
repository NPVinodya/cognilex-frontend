'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Scale, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  MoreVertical,
  Download,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  ArrowUp,
  ArrowDown,
  Shield,
  Gavel,
  Award,
  MapPin,
  Briefcase,
  Star
} from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_users: 0,
    active_lawyers: 0,
    chat_sessions: 0,
    pending_approvals: 0
  });
  const [users, setUsers] = useState([]);
  const [lawyerApprovals, setLawyerApprovals] = useState([]);
  const [registeredLawyers, setRegisteredLawyers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch dashboard stats
  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchPendingLawyers();
    fetchRegisteredLawyers();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users?skip=0&limit=10`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingLawyers = async () => {
    try {
      const response = await axios.get(`${API_URL}/lawyer/pending`);
      setLawyerApprovals(response.data.lawyers || []);
    } catch (error) {
      console.error('Error fetching pending lawyers:', error);
    }
  };

  const fetchRegisteredLawyers = async () => {
    try {
      const response = await axios.get(`${API_URL}/lawyer/all?status=approved`);
      setRegisteredLawyers(response.data.lawyers || []);
    } catch (error) {
      console.error('Error fetching registered lawyers:', error);
    }
  };

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
      
      alert(`Lawyer ${action}d successfully!`);
      fetchPendingLawyers();
      fetchRegisteredLawyers();
      fetchStats();
    } catch (error: any) {
      alert(error.response?.data?.detail || `Failed to ${action} lawyer`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`);
      alert('User deleted successfully!');
      fetchUsers();
      fetchStats();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to delete user');
    }
  };

  // Check if user has registered as lawyer
  const isUserLawyer = (userEmail: string) => {
    return registeredLawyers.some((lawyer: any) => lawyer.email === userEmail);
  };

  const statsDisplay = [
    { 
      label: 'Total Users', 
      value: stats.total_users.toLocaleString(), 
      change: '+12.5%', 
      trend: 'up', 
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      label: 'Active Lawyers', 
      value: stats.active_lawyers.toLocaleString(), 
      change: '+8.2%', 
      trend: 'up', 
      icon: Scale,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      label: 'Chat Sessions', 
      value: stats.chat_sessions.toLocaleString(), 
      change: '+23.1%', 
      trend: 'up', 
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      label: 'Pending Approvals', 
      value: stats.pending_approvals.toLocaleString(), 
      change: '-4.3%', 
      trend: 'down', 
      icon: Clock,
      color: 'from-orange-500 to-amber-500'
    },
  ];

  // Filter lawyers based on search
  const filteredLawyers = registeredLawyers.filter((lawyer: any) =>
    lawyer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lawyer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lawyer.barCouncilNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
                <p className="text-blue-100 text-sm">CogniLex AI Platform Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  fetchStats();
                  fetchUsers();
                  fetchPendingLawyers();
                  fetchRegisteredLawyers();
                }}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition font-medium"
              >
                <Download className="w-4 h-4 inline mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsDisplay.map((stat, idx) => (
            <div key={idx} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity`}></div>
              <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                    stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    <span className="text-xs font-bold">{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {['overview', 'users', 'lawyers', 'approvals'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-bold capitalize transition relative ${
                    activeTab === tab
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Registered Lawyers */}
            {(activeTab === 'lawyers') && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <Scale className="w-6 h-6 text-blue-600" />
                    Registered Lawyers ({filteredLawyers.length})
                  </h2>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search lawyers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {filteredLawyers.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold">No registered lawyers found</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredLawyers.map((lawyer: any) => (
                      <div key={lawyer._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all">
                        <div className="flex gap-5">
                          {/* Profile Image */}
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                              {lawyer.profilePhotoUrl ? (
                                <img
                                  src={lawyer.profilePhotoUrl}
                                  alt={lawyer.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl">
                                  {lawyer.fullName?.charAt(0) || 'L'}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-center gap-1 mt-2 bg-amber-50 px-2 py-1 rounded-md">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-bold">{lawyer.rating?.toFixed(1) || '0.0'}</span>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{lawyer.fullName}</h3>
                            <p className="text-sm text-gray-600 mb-3">
                              <Briefcase className="w-3 h-3 inline mr-1" />
                              Bar: {lawyer.barCouncilNumber}
                            </p>

                            {/* Specializations */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {lawyer.practiceAreas?.map((area: string, idx: number) => (
                                <span key={idx} className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                  {area}
                                </span>
                              ))}
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-3 gap-3 text-sm">
                              <div className="flex items-center gap-1 text-gray-600">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                <span>{lawyer.province}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Award className="w-4 h-4 text-purple-600" />
                                <span>{lawyer.yearsOfExperience} Years</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <FileText className="w-4 h-4 text-amber-600" />
                                <span className="font-semibold">LKR {lawyer.consultationFee?.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            <button className="p-2 hover:bg-blue-50 rounded-lg transition" title="View Details">
                              <Eye className="w-4 h-4 text-blue-600" />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm('Deactivate this lawyer?')) {
                                  // Implement deactivate
                                }
                              }}
                              className="p-2 hover:bg-red-50 rounded-lg transition" 
                              title="Deactivate"
                            >
                              <UserX className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recent Users Table */}
            {(activeTab === 'overview' || activeTab === 'users') && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <Users className="w-6 h-6 text-blue-600" />
                    Recent Users ({users.length})
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Type</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Joined</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user: any) => {
                        const isLawyer = isUserLawyer(user.email);
                        
                        return (
                          <tr key={user.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 bg-gradient-to-br ${
                                  isLawyer ? 'from-amber-500 to-orange-500' : 'from-blue-500 to-purple-500'
                                } rounded-full flex items-center justify-center text-white font-bold`}>
                                  {user.name?.charAt(0) || 'U'}
                                </div>
                                <span className="font-semibold text-gray-900">{user.name || 'Unknown'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{user.email}</td>
                            <td className="px-6 py-4">
                              {isLawyer ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                                  <Scale className="w-3 h-3" />
                                  LAWYER
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                                  <Users className="w-3 h-3" />
                                  USER
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className="flex items-center gap-2 text-green-600 font-semibold">
                                <CheckCircle className="w-4 h-4" />
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 hover:bg-red-50 rounded-lg transition"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
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

            {/* Lawyer Approvals */}
            {(activeTab === 'overview' || activeTab === 'approvals') && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <Gavel className="w-6 h-6 text-purple-600" />
                    Pending Lawyer Approvals
                  </h2>
                  <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
                    {lawyerApprovals.length} Pending
                  </span>
                </div>

                {lawyerApprovals.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Gavel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold">No pending lawyer approvals</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {lawyerApprovals.map((lawyer: any) => (
                      <div key={lawyer._id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                              {lawyer.fullName?.charAt(0) || 'L'}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{lawyer.fullName}</h3>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-600">
                                  <span className="font-semibold">Email:</span> {lawyer.email}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-semibold">Bar Number:</span> {lawyer.barCouncilNumber}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-semibold">Province:</span> {lawyer.province}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-semibold">Experience:</span> {lawyer.yearsOfExperience} years
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleApproval(lawyer._id, 'approve')}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition font-bold flex items-center gap-2 shadow-lg"
                            >
                              <UserCheck className="w-4 h-4" />
                              Approve
                            </button>
                            <button 
                              onClick={() => handleApproval(lawyer._id, 'reject')}
                              className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition font-bold flex items-center gap-2 shadow-lg"
                            >
                              <UserX className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
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