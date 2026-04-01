'use client';

import React, { useState } from 'react';
import { User, Briefcase, CreditCard, Shield, Camera, Plus } from 'lucide-react';

const SETTINGS_TABS = [
    { name: 'Profile Details', icon: User, active: true },
    { name: 'Professional Info', icon: Briefcase, active: false },
    { name: 'Billing & Fees', icon: CreditCard, active: false },
    { name: 'Security', icon: Shield, active: false },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('Profile Details');

    return (
        <>
            <div className="mb-8">
                <h1 className="text-[32px] font-bold text-[#181B25] tracking-tight leading-tight">Settings</h1>
                <p className="text-slate-500 font-medium mt-1 text-sm">Manage your account preferences and professional profile.</p>
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
                                        <div className="relative">
                                            <img src="https://i.pravatar.cc/150?u=lawyer" alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm" />
                                            <button className="absolute bottom-0 right-0 p-2 bg-[#181B25] hover:bg-[#2A2E3D] text-white rounded-full shadow-md transition border-2 border-white">
                                                <Camera className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#181B25] text-base mb-1">Profile Photo</h4>
                                            <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-3">Upload a professional headshot. Recommended size is 400x400px. JPG, GIF, or PNG.</p>
                                            <div className="flex gap-3">
                                                <button className="px-4 py-2 bg-[#FF9000] hover:bg-[#E68200] text-white font-bold text-xs rounded-lg transition shadow-sm">Upload New</button>
                                                <button className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs rounded-lg transition">Remove</button>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-slate-100 mb-8" />

                                    {/* Form Inputs */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-[13px] font-bold text-slate-700 mb-2">First Name</label>
                                            <input type="text" defaultValue="Prabani" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition placeholder-slate-400 font-medium" />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-bold text-slate-700 mb-2">Last Name</label>
                                            <input type="text" defaultValue="Vinodya" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition placeholder-slate-400 font-medium" />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-bold text-slate-700 mb-2">Email Address</label>
                                            <input type="email" defaultValue="p.vinodya@cognilex.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition placeholder-slate-400 font-medium" />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-bold text-slate-700 mb-2">Phone Number</label>
                                            <input type="tel" defaultValue="+94 77 123 4567" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition placeholder-slate-400 font-medium" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-slate-700 mb-2">Professional Bio</label>
                                        <textarea rows={4} defaultValue="Experienced Civil Law attorney specializing in property disputes and family inheritance. Over 12 years of practice in the Supreme Court." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition placeholder-slate-400 font-medium resize-none leading-relaxed"></textarea>
                                    </div>
                                </div>

                                <div className="p-6 md:px-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                                    <button className="px-6 py-2.5 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 text-sm font-bold rounded-xl transition shadow-sm">Cancel</button>
                                    <button className="px-6 py-2.5 bg-[#181B25] hover:bg-[#0e1017] text-white text-sm font-bold rounded-xl transition shadow-sm">Save Changes</button>
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

                                    <div>
                                        <label className="block text-[13px] font-bold text-slate-700 mb-2">Bar Council Number</label>
                                        <input type="text" defaultValue="BAR/2021/12345" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition font-medium" />
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-slate-700 mb-2">Years of Experience</label>
                                        <input type="number" defaultValue="12" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition font-medium" />
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-slate-700 mb-2">Primary Practice Areas</label>
                                        <div className="p-4 border border-slate-200 bg-slate-50 rounded-xl flex flex-wrap gap-2">
                                            <span className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">Civil Law <button><Plus className="w-3 h-3 rotate-45" /></button></span>
                                            <span className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">Family Law <button><Plus className="w-3 h-3 rotate-45" /></button></span>
                                            <span className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">Property Law <button><Plus className="w-3 h-3 rotate-45" /></button></span>
                                            <button className="bg-white border border-dashed border-slate-300 text-slate-500 hover:text-slate-700 hover:border-slate-400 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition"><Plus className="w-3 h-3" /> Add Area</button>
                                        </div>
                                    </div>

                                </div>
                                <div className="p-6 md:px-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                                    <button className="px-6 py-2.5 bg-[#181B25] hover:bg-[#0e1017] text-white text-sm font-bold rounded-xl transition shadow-sm">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}
