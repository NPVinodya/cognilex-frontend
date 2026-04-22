'use client';

import React, { useState } from 'react';
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Calendar, FileText, ArrowLeft } from 'lucide-react';

const CONVERSATIONS = [
    { id: '1', name: 'Sarah Jenkins', preview: 'Could you please check the attached brief?', time: '10:42 AM', unread: 2, online: true },
    { id: '2', name: 'Malinga Perera', preview: 'I will be there at the decided time.', time: 'Yesterday', unread: 0, online: false },
    { id: '3', name: 'Corporate Tech Inc.', preview: 'Thanks for the contract review Prabani.', time: 'Mar 24', unread: 0, online: true },
];

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState(CONVERSATIONS[0]);
    const [showChatMobile, setShowChatMobile] = useState(false);

    return (
        <div className="flex flex-col h-[calc(100vh-140px)]">
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 shrink-0">
                <div>
                    <h1 className="text-[32px] font-bold text-[#181B25] tracking-tight leading-tight">Messages</h1>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden flex-1 flex relative">
                {/* Left Sidebar Pane */}
                <div className={`${showChatMobile ? 'hidden' : 'flex'} md:flex w-full md:w-80 lg:w-96 border-r border-slate-100 flex-col shrink-0 h-full`}>
                    <div className="p-4 border-b border-slate-100">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {CONVERSATIONS.map((chat) => (
                            <div 
                                key={chat.id} 
                                onClick={() => {
                                    setSelectedChat(chat);
                                    setShowChatMobile(true);
                                }}
                                className={`p-4 flex gap-4 cursor-pointer transition border-l-4 ${selectedChat.id === chat.id ? 'bg-orange-50/50 border-[#FF9000]' : 'border-transparent hover:bg-slate-50'}`}
                            >
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                                        {chat.name.charAt(0)}
                                    </div>
                                    {chat.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-[14px] text-[#181B25] truncate">{chat.name}</h4>
                                        <span className={`text-[11px] font-bold ${chat.unread ? 'text-[#FF9000]' : 'text-slate-400'}`}>{chat.time}</span>
                                    </div>
                                    <p className="text-[13px] text-slate-500 truncate">{chat.preview}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Chat Pane */}
                <div className={`${showChatMobile ? 'flex' : 'hidden'} md:flex flex-1 flex-col h-full bg-[#F8F9FA]/50`}>

                    {/* Chat Header */}
                    <div className="p-4 px-6 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setShowChatMobile(false)}
                                className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-600 transition"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                                {selectedChat.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-[#181B25] text-sm md:text-base">{selectedChat.name}</h3>
                                <p className="text-[11px] font-bold text-emerald-500">
                                    {selectedChat.online ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-slate-400 hover:text-[#FF9000] hover:bg-orange-50 rounded-lg transition"><Phone className="w-5 h-5" /></button>
                            <button className="p-2 text-slate-400 hover:text-[#FF9000] hover:bg-orange-50 rounded-lg transition"><Video className="w-5 h-5" /></button>
                            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition"><MoreVertical className="w-5 h-5" /></button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="flex justify-center">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Today</span>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0"></div>
                            <div className="bg-white border border-slate-100 shadow-sm p-4 rounded-2xl rounded-tl-sm max-w-[85%] md:max-w-lg">
                                <p className="text-[14px] text-slate-700 leading-relaxed">Hi Prabani, Could you please check the attached brief? I have highlighted the areas regarding the property split.</p>
                                <div className="mt-2 flex items-center gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-xl w-fit cursor-pointer">
                                    <div className="p-1.5 bg-red-100 text-red-600 rounded-lg"><FileText className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-xs font-bold text-[#181B25]">Jenkins_Brief_V2.pdf</p>
                                        <p className="text-[10px] text-slate-500">2.4 MB</p>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold mt-2 text-right">10:42 AM</p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-white border-t border-slate-100">
                        <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-[#FF9000] focus-within:ring-1 focus-within:ring-[#FF9000] transition">
                            <button className="p-2 text-slate-400 hover:text-slate-600 transition shrink-0"><Paperclip className="w-5 h-5" /></button>
                            <textarea
                                placeholder="Type your message..."
                                className="flex-1 bg-transparent resize-none focus:outline-none p-2 text-sm max-h-32 text-slate-700 font-medium"
                                rows={1}
                            />
                            <button className="p-2.5 bg-[#FF9000] hover:bg-[#E68200] text-white rounded-xl transition shadow-sm shrink-0">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
