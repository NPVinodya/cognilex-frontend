'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { User, Briefcase, CreditCard, Shield, Camera, Plus, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import axios from 'axios';

const SETTINGS_TABS = [
    { name: 'Profile Details', icon: User, active: true },
    { name: 'Professional Info', icon: Briefcase, active: false },
    { name: 'Billing & Fees', icon: CreditCard, active: false },
    { name: 'Security', icon: Shield, active: false },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('Profile Details');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        bio: '',
        barCouncilNumber: '',
        yearsOfExperience: 0,
        practiceAreas: [] as string[],
        consultationFee: 0,
        location: 'Office',
        profilePhotoUrl: ''
    });

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [showImageModal, setShowImageModal] = useState(false);

    // Fetch profile data on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userJson = localStorage.getItem('user');
                if (!userJson) return;
                const user = JSON.parse(userJson);

                const response = await axios.get(`${API_URL}/lawyer-dashboard/${user.id}/profile`);
                if (response.data.success) {
                    setProfile(response.data.profile);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setMessage({ type: 'error', text: 'Failed to load profile data.' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async (section: string) => {
        setIsSaving(true);
        setMessage(null);
        try {
            const userJson = localStorage.getItem('user');
            if (!userJson) return;
            const user = JSON.parse(userJson);

            const response = await axios.patch(`http://localhost:8000/lawyer-dashboard/${user.id}/profile`, profile);
            if (response.data.success) {
                setMessage({ type: 'success', text: 'Changes saved successfully!' });
                // Update localStorage if email/name changed
                localStorage.setItem('user', JSON.stringify({ ...user, name: profile.fullName, email: profile.email }));
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to save changes.' });
        } finally {
            setIsSaving(false);
            // Clear message after 3s
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        setIsSaving(true);
        try {
            const response = await axios.post(`http://localhost:8000/lawyer-dashboard/password/update`, {
                email: profile.email,
                current_password: passwords.current,
                new_password: passwords.new
            });
            if (response.data.message) {
                setMessage({ type: 'success', text: 'Password updated successfully!' });
                setPasswords({ current: '', new: '', confirm: '' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to update password.' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-10 h-10 text-[#FF9000] animate-spin" />
                <p className="text-slate-500 font-bold animate-pulse text-lg">Loading your profile details...</p>
            </div>
        );
    }

    return (
        <>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-[32px] font-bold text-[#181B25] tracking-tight leading-tight">Settings</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Manage your account preferences and professional profile.</p>
                </div>
                {message && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                        {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {message.text}
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-12 gap-8">

                {/* Left Settings Navigation */}
                <div className="lg:col-span-3">
                    <div className="bg-white border md:sticky md:top-8 border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] p-4 flex flex-col gap-2">
                        {SETTINGS_TABS.map((tab) => {
                            const isActive = activeTab === tab.name;
                            return (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition w-full text-left ${isActive
                                        ? 'bg-orange-50 text-[#FF9000] font-bold'
                                        : 'hover:bg-slate-50 text-slate-600 font-semibold'
                                        }`}
                                >
                                    <tab.icon className={`h-5 w-5 ${isActive ? 'text-[#FF9000]' : 'text-slate-400'}`} />
                                    <span className="text-[14px]">{tab.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Settings Form Area */}
                <div className="lg:col-span-9">

                    {activeTab === 'Profile Details' && (
                        <div className="flex flex-col gap-6">
                            {/* Basic Info Card */}
                            <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
                                <div className="p-6 md:px-8 border-b border-slate-100 bg-slate-50/50">
                                    <h2 className="text-[17px] font-bold text-[#181B25]">Basic Information</h2>
                                    <p className="text-slate-500 text-sm mt-1">This information will be displayed publicly on your directory profile.</p>
                                </div>

                                <div className="p-6 md:p-8">
                                    {/* Avatar Upload */}
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="relative group cursor-pointer" onClick={() => setShowImageModal(true)}>
                                            <img
                                                src={profile.profilePhotoUrl || "https://i.pravatar.cc/150?u=lawyer"}
                                                alt="Profile"
                                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md group-hover:opacity-90 transition"
                                            />
                                            <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                <Plus className="text-white w-6 h-6" />
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); console.log("Upload triggered"); }}
                                                className="absolute bottom-0 right-0 p-2 bg-[#181B25] hover:bg-[#2A2E3D] text-white rounded-full shadow-md transition border-2 border-white"
                                            >
                                                <Camera className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#181B25] text-base mb-1">Profile Photo</h4>
                                            <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-0">Your professional headshot. Click the image to preview.</p>
                                        </div>
                                    </div>

                                    <hr className="border-slate-100 mb-8" />

                                    {/* Form Inputs */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                        <div className="sm:col-span-2">
                                            <label className="block text-[13px] font-bold text-slate-700 mb-2">Display Name</label>
                                            <input
                                                type="text"
                                                value={profile.fullName}
                                                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition placeholder-slate-400 font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-bold text-slate-700 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition placeholder-slate-400 font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-bold text-slate-700 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={profile.phone}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition placeholder-slate-400 font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-slate-700 mb-2">Professional Bio</label>
                                        <textarea
                                            rows={4}
                                            value={profile.bio}
                                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition placeholder-slate-400 font-medium resize-none leading-relaxed"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="p-6 md:px-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                                    <button
                                        onClick={() => handleSave('Profile Details')}
                                        disabled={isSaving}
                                        className="px-6 py-2.5 bg-[#181B25] hover:bg-[#0e1017] text-white text-sm font-bold rounded-xl transition shadow-sm flex items-center gap-2"
                                    >
                                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Professional Info' && (
                        <div className="flex flex-col gap-6">
                            <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
                                <div className="p-6 md:px-8 border-b border-slate-100 bg-slate-50/50">
                                    <h2 className="text-[17px] font-bold text-[#181B25]">Credentials & Practice</h2>
                                    <p className="text-slate-500 text-sm mt-1">Manage your legal qualifications and verifiable credentials.</p>
                                </div>
                                <div className="p-6 md:p-8 space-y-6">

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[13px] font-bold text-slate-700 mb-2">Bar Council Number</label>
                                            <input
                                                type="text"
                                                readOnly
                                                value={profile.barCouncilNumber}
                                                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 border-dashed rounded-xl text-sm text-slate-500 cursor-not-allowed font-bold"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[13px] font-bold text-slate-700 mb-2">Years of Experience</label>
                                            <input
                                                type="number"
                                                value={profile.yearsOfExperience}
                                                onChange={(e) => setProfile({ ...profile, yearsOfExperience: parseInt(e.target.value) || 0 })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-slate-700 mb-2">Primary Practice Areas</label>
                                        <div className="p-4 border border-slate-200 bg-slate-50 rounded-xl flex flex-wrap gap-2">
                                            {profile.practiceAreas.map((area, idx) => (
                                                <span key={idx} className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                                                    {area}
                                                    <button onClick={() => setProfile({ ...profile, practiceAreas: profile.practiceAreas.filter(a => a !== area) })}>
                                                        <Plus className="w-3 h-3 rotate-45" />
                                                    </button>
                                                </span>
                                            ))}
                                            <button className="bg-white border border-dashed border-slate-300 text-slate-500 hover:text-slate-700 hover:border-slate-400 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition"><Plus className="w-3 h-3" /> Add Area</button>
                                        </div>
                                    </div>

                                </div>
                                <div className="p-6 md:px-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                                    <button
                                        onClick={() => handleSave('Professional Info')}
                                        disabled={isSaving}
                                        className="px-6 py-2.5 bg-[#181B25] hover:bg-[#0e1017] text-white text-sm font-bold rounded-xl transition shadow-sm flex items-center gap-2"
                                    >
                                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Billing & Fees' && (
                        <div className="flex flex-col gap-6">
                            <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
                                <div className="p-6 md:px-8 border-b border-slate-100 bg-slate-50/50">
                                    <h2 className="text-[17px] font-bold text-[#181B25]">Financial Preferences</h2>
                                    <p className="text-slate-500 text-sm mt-1">Set your consultation rates and payment preferences.</p>
                                </div>
                                <div className="p-6 md:p-8 space-y-6">
                                    <div>
                                        <label className="block text-[13px] font-bold text-slate-700 mb-2">30-Min Consultation Fee (LKR)</label>
                                        <input
                                            type="number"
                                            value={profile.consultationFee}
                                            onChange={(e) => setProfile({ ...profile, consultationFee: parseFloat(e.target.value) || 0 })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition font-medium"
                                        />
                                        <p className="text-xs text-slate-400 mt-2">Professional fee for a standard 30-minute legal advice session.</p>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-slate-700 mb-2">Primary Office Location</label>
                                        <input
                                            type="text"
                                            value={profile.location}
                                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                            placeholder="e.g. Higher Court Complex, Colombo"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="p-6 md:px-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                                    <button
                                        onClick={() => handleSave('Billing')}
                                        disabled={isSaving}
                                        className="px-6 py-2.5 bg-[#181B25] hover:bg-[#0e1017] text-white text-sm font-bold rounded-xl transition shadow-sm flex items-center gap-2"
                                    >
                                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Security' && (
                        <div className="flex flex-col gap-6 font-sans animate-in fade-in slide-in-from-bottom-3 duration-500">
                            {/* Main Card */}
                            <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
                                <div className="p-6 md:px-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h2 className="text-xl font-black text-[#181B25] tracking-tight">Security & Privacy</h2>
                                            <p className="text-slate-500 text-[12px] font-bold">Manage your login credentials and session safety.</p>
                                        </div>
                                    </div>

                                </div>

                                <div className="p-6 md:p-8">
                                    <div className="grid lg:grid-cols-2 gap-8">

                                        {/* Password Form */}
                                        <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                            <div className="space-y-5">
                                                {/* Current Password */}
                                                <div className="relative group">
                                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-[0.15em]">
                                                        Current Password
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={showPasswords.current ? "text" : "password"}
                                                            required
                                                            placeholder="••••••••"
                                                            value={passwords.current}
                                                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl text-sm focus:outline-none focus:border-[#FF9000] focus:bg-white transition-all duration-300 font-bold placeholder:text-slate-300 shadow-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <hr className="border-slate-50" />

                                                {/* New Password */}
                                                <div className="relative group">
                                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-[0.15em]">
                                                        New Password
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={showPasswords.new ? "text" : "password"}
                                                            required
                                                            placeholder="New credentials"
                                                            value={passwords.new}
                                                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all duration-300 font-bold placeholder:text-slate-300 shadow-sm"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Confirm Password */}
                                                <div className="relative group">
                                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-[0.15em]">
                                                        Confirm Identity
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={showPasswords.confirm ? "text" : "password"}
                                                            required
                                                            placeholder="Confirm new credentials"
                                                            value={passwords.confirm}
                                                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                                            className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all duration-300 font-bold placeholder:text-slate-300 shadow-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="w-full py-4 bg-[#181B25] hover:bg-black text-white text-[14px] font-black rounded-xl transition-all shadow-lg hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                                            >
                                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                                Update Security
                                            </button>
                                        </form>

                                        {/* Security Checklist Panel */}
                                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.15em] mb-5 flex items-center gap-3">
                                                Standards
                                                <div className="h-px flex-1 bg-slate-200 rounded-full" />
                                            </h3>

                                            <div className="space-y-5">
                                                {[
                                                    { title: "Complexity", desc: "Use 8+ characters.", ok: passwords.new.length >= 8 },
                                                    { title: "Verification", desc: "Confirmation match.", ok: passwords.new !== '' && passwords.new === passwords.confirm },
                                                    { title: "Encryption", desc: "Hashed data sync.", ok: true }
                                                ].map((item, idx) => (
                                                    <div key={idx} className="flex gap-3 group">
                                                        <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center transition-colors ${item.ok ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                                            <CheckCircle className="w-2.5 h-2.5" />
                                                        </div>
                                                        <div>
                                                            <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 transition-colors ${item.ok ? 'text-emerald-700' : 'text-slate-500'}`}>
                                                                {item.title}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 font-bold leading-tight">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-8 p-4 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                                                <p className="text-[11px] font-black text-[#181B25] mb-1 relative z-10 flex items-center gap-2">
                                                    <Shield className="w-3.5 h-3.5 text-[#FF9000]" />
                                                    MFA Enabled
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold leading-relaxed relative z-10">
                                                    Multi-Factor Authentication sync is active for this account.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Image Preview Modal */}
            {showImageModal && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={() => setShowImageModal(false)}
                >
                    <button
                        onClick={() => setShowImageModal(false)}
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition group flex items-center gap-2"
                    >
                        <span className="text-xs font-black uppercase tracking-widest">Close Preview</span>
                        <X className="w-8 h-8" />
                    </button>

                    <div className="relative max-w-4xl w-full flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={profile.profilePhotoUrl || "https://i.pravatar.cc/150?u=lawyer"}
                            alt="Profile Large"
                            className="max-h-[70vh] w-auto rounded-3xl shadow-2xl border-4 border-white/10 animate-in zoom-in-95 duration-500"
                        />
                        <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-white/80 text-sm font-bold flex items-center gap-3">
                            <Shield className="w-4 h-4 text-[#FF9000]" />
                            Verified Legal Professional Profile
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
