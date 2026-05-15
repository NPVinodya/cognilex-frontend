'use client';

import React, { useState } from 'react';
import {
    User, Shield, Lock, Mail, Save,
    ShieldCheck, Key, Eye, EyeOff
} from 'lucide-react';

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [adminId, setAdminId] = useState<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Preferences states
    const [darkMode, setDarkMode] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(true);

    // Form states
    const [profileData, setProfileData] = useState({ name: 'System Admin', email: 'admin@cognilex.com' });
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [platformSettings, setPlatformSettings] = useState({
        markup_percentage: 20.0,
        maintenance_mode: false,
        allow_new_registrations: true
    });

    React.useEffect(() => {
        const adminStr = localStorage.getItem('adminUser');
        if (adminStr) {
            try {
                const admin = JSON.parse(adminStr);
                const id = admin.id || admin._id || null;
                setAdminId(id);
                setProfileData({
                    name: admin.name || 'System Admin',
                    email: admin.email || 'admin@cognilex.com'
                });
            } catch (e) {
                console.error("Failed to parse admin user", e);
            }
        }

        // Load preferences
        const prefs = localStorage.getItem('admin_prefs');
        if (prefs) {
            const parsed = JSON.parse(prefs);
            setDarkMode(parsed.darkMode || false);
            setPushNotifications(parsed.pushNotifications !== undefined ? parsed.pushNotifications : true);
            if (parsed.darkMode) document.documentElement.classList.add('dark');
        }

        fetchPlatformSettings();
        fetchAdminPreferences();
    }, []);

    const fetchAdminPreferences = async () => {
        try {
            if (adminId) {
                const response = await fetch(`${API_URL}/admin/preferences/${adminId}`);
                if (response.ok) {
                    const prefs = await response.json();
                    setDarkMode(prefs.darkMode);
                    setPushNotifications(prefs.pushNotifications);
                }
            }
        } catch (err) {
            console.error("Failed to fetch admin preferences", err);
        }
    };

    const fetchPlatformSettings = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/settings`);
            const data = await response.json();
            if (response.ok) {
                setPlatformSettings(data);
            }
        } catch (err) {
            console.error("Failed to fetch settings", err);
        }
    };

    const toggleDarkMode = async () => {
        const newVal = !darkMode;
        setDarkMode(newVal);

        // Save to local for immediate feedback
        const prefs = JSON.parse(localStorage.getItem('admin_prefs') || '{}');
        localStorage.setItem('admin_prefs', JSON.stringify({ ...prefs, darkMode: newVal }));

        // Save to backend
        try {
            if (adminId) {
                await fetch(`${API_URL}/admin/preferences/${adminId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ darkMode: newVal, pushNotifications }),
                });
            }
        } catch (err) {
            console.error("Failed to save dark mode pref", err);
        }
    };

    const toggleNotifications = async () => {
        const newVal = !pushNotifications;
        setPushNotifications(newVal);

        const prefs = JSON.parse(localStorage.getItem('admin_prefs') || '{}');
        localStorage.setItem('admin_prefs', JSON.stringify({ ...prefs, pushNotifications: newVal }));

        // Save to backend
        try {
            if (adminId) {
                await fetch(`${API_URL}/admin/preferences/${adminId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ darkMode, pushNotifications: newVal }),
                });
            }
        } catch (err) {
            console.error("Failed to save notification pref", err);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        if (!adminId) {
            setStatus({ type: 'error', message: 'Admin session expired. Please login again.' });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/admin/profile/${adminId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: profileData.name, email: profileData.email }),
            });

            const result = await response.json();
            if (response.ok) {
                setStatus({ type: 'success', message: 'Profile updated successfully!' });
                // Update local session
                const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');
                admin.name = profileData.name;
                admin.email = profileData.email;
                localStorage.setItem('adminUser', JSON.stringify(admin));
            } else {
                const detail = result.detail;
                const errorMessage = typeof detail === 'string' ? detail : (Array.isArray(detail) ? detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ') : JSON.stringify(detail) || 'Update failed');
                setStatus({ type: 'error', message: errorMessage });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Connection error' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            setStatus({ type: 'error', message: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        if (!adminId) {
            setStatus({ type: 'error', message: 'Admin session expired. Please login again.' });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/admin/change-password/${adminId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_password: passwordData.current,
                    new_password: passwordData.new
                }),
            });

            const result = await response.json();
            if (response.ok) {
                setStatus({ type: 'success', message: 'Password changed successfully!' });
                setPasswordData({ current: '', new: '', confirm: '' });
            } else {
                const detail = result.detail;
                const errorMessage = typeof detail === 'string' ? detail : (Array.isArray(detail) ? detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ') : JSON.stringify(detail) || 'Change failed');
                setStatus({ type: 'error', message: errorMessage });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Connection error' });
        } finally {
            setLoading(false);
        }
    };

    const handlePlatformUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch(`${API_URL}/admin/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(platformSettings),
            });

            const result = await response.json();
            if (response.ok) {
                setStatus({ type: 'success', message: 'Platform settings updated successfully!' });
            } else {
                const detail = result.detail;
                const errorMessage = typeof detail === 'string' ? detail : (Array.isArray(detail) ? detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ') : JSON.stringify(detail) || 'Update failed');
                setStatus({ type: 'error', message: errorMessage });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Connection error' });
        } finally {
            setLoading(false);
        }
    };

    const TABS = [
        { id: 'profile', name: 'Profile Settings', icon: User },
        { id: 'security', name: 'Security', icon: Shield },
        { id: 'platform', name: 'Platform Settings', icon: ShieldCheck },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col gap-1 mb-8">
                <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">
                    System Settings
                </h1>
                <p className="text-base text-slate-500 dark:text-slate-400 font-medium">Manage your administrative preferences and security.</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1 space-y-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === tab.id
                                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 translate-x-2'
                                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    {status.message && (
                        <div className={`mb-6 p-4 rounded-2xl border animate-in slide-in-from-top duration-300 ${status.type === 'success' ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400'
                            }`}>
                            <p className="font-bold text-sm flex items-center gap-2">
                                {status.type === 'success' ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                {status.message}
                            </p>
                        </div>
                    )}

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfileUpdate} className="p-8 md:p-12 space-y-8 animate-in slide-in-from-right duration-500">
                                <div className="flex items-center gap-6 border-b border-slate-100 pb-8">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=181B25&color=FF9000&bold=true`}
                                        alt="Admin Avatar"
                                        className="w-24 h-24 rounded-3xl shadow-2xl border-4 border-white object-cover"
                                    />
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900">{profileData.name}</h2>
                                        <p className="text-slate-500 font-medium">System Administrator</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Administrator Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF9000]" />
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                readOnly
                                                className="w-full pl-11 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-600 cursor-default"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Administrator Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                readOnly
                                                className="w-full pl-11 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-600 cursor-default"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                                    <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                        <span className="font-bold">Note:</span> For security reasons, administrative profile details (Name and Email) are managed at the system level and cannot be modified directly from this panel. Please contact the technical department for identity updates.
                                    </p>
                                </div>
                            </form>
                        )}

                        {activeTab === 'security' && (
                            <form onSubmit={handlePasswordChange} className="p-8 md:p-12 space-y-8 animate-in slide-in-from-right duration-500">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF9000]">
                                        <Lock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900">Security Credentials</h2>
                                        <p className="text-slate-500 font-medium">Update your password and authentication methods.</p>
                                    </div>
                                </div>

                                <div className="max-w-xl space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={passwordData.current}
                                            onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF9000] font-bold text-slate-900"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Create new password"
                                                value={passwordData.new}
                                                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF9000] font-bold text-slate-900"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Re-type new password"
                                            value={passwordData.confirm}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF9000] font-bold text-slate-900"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-4 bg-[#FF9000] text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-[#e68200] transition shadow-lg shadow-orange-900/20 disabled:opacity-50"
                                    >
                                        {loading ? 'Processing...' : <><ShieldCheck className="w-5 h-5" /> Update Credentials</>}
                                    </button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'platform' && (
                            <form onSubmit={handlePlatformUpdate} className="p-8 md:p-12 space-y-10 animate-in slide-in-from-right duration-500">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900">Platform Configuration</h2>
                                        <p className="text-slate-500 font-medium">Control global system parameters and financial logic.</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Financial Settings</h3>
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-slate-900">Platform Markup (%)</p>
                                                    <p className="text-xs text-slate-500 font-medium">Percentage added to lawyer fees.</p>
                                                </div>
                                                <div className="relative w-24">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={platformSettings.markup_percentage}
                                                        onChange={(e) => setPlatformSettings({ ...platformSettings, markup_percentage: parseFloat(e.target.value) })}
                                                        className="w-full pl-4 pr-8 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-right"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">System Controls</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                                <div>
                                                    <p className="font-bold text-slate-900">Maintenance Mode</p>
                                                    <p className="text-xs text-slate-500 font-medium">Restrict access during updates.</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setPlatformSettings({ ...platformSettings, maintenance_mode: !platformSettings.maintenance_mode })}
                                                    className={`w-14 h-8 rounded-full relative transition-all p-1 flex items-center ${platformSettings.maintenance_mode ? 'bg-rose-500 justify-end' : 'bg-slate-200 justify-start'}`}
                                                >
                                                    <div className="w-6 h-6 bg-white rounded-full shadow-md"></div>
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                                <div>
                                                    <p className="font-bold text-slate-900">Allow Registrations</p>
                                                    <p className="text-xs text-slate-500 font-medium">Enable/Disable new lawyer signups.</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setPlatformSettings({ ...platformSettings, allow_new_registrations: !platformSettings.allow_new_registrations })}
                                                    className={`w-14 h-8 rounded-full relative transition-all p-1 flex items-center ${platformSettings.allow_new_registrations ? 'bg-[#FF9000] justify-end' : 'bg-slate-200 justify-start'}`}
                                                >
                                                    <div className="w-6 h-6 bg-white rounded-full shadow-md"></div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition shadow-lg shadow-slate-900/20 disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : <><Save className="w-5 h-5" /> Save Global Configuration</>}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
