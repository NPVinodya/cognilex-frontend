'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Calendar, FileText, ArrowLeft, User, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';
import DashboardLoading from '@/components/lawyerDashboard/DashboardLoading';
import { DashboardContext } from '@/app/lawyerDashboard/layout';

interface Message {
    id: string;
    user_id: string;
    userName: string;
    content: string;
    sender_role: 'user' | 'lawyer';
    timestamp: string;
    is_read: boolean;
}

interface Conversation {
    user_id: string;
    userName: string;
    messages: Message[];
    lastMessage: string;
    lastTime: string;
    unread: number;
}

export default function MessagesPage() {
    const { setIsPageLoading, setLoadingProgress } = React.useContext(DashboardContext);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [showChatMobile, setShowChatMobile] = useState(false);
    const [lawyerId, setLawyerId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async (isSilent = false) => {
        try {
            const rawUser = localStorage.getItem("user");
            if (!rawUser) return;
            const user = JSON.parse(rawUser);
            const lId = user.id || user._id;
            setLawyerId(lId);

            const res = await fetch(`${API_BASE_URL}/api/messages/lawyer/${lId}`);
            if (res.ok) {
                const data: Message[] = await res.json();
                
                // Group by User
                const grouped: Record<string, Conversation> = {};
                data.forEach(msg => {
                    if (!grouped[msg.user_id]) {
                        grouped[msg.user_id] = {
                            user_id: msg.user_id,
                            userName: msg.userName,
                            messages: [],
                            lastMessage: '',
                            lastTime: '',
                            unread: 0
                        };
                    }
                    grouped[msg.user_id].messages.push(msg);
                    grouped[msg.user_id].lastMessage = msg.content;
                    grouped[msg.user_id].lastTime = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    if (msg.sender_role === 'user' && !msg.is_read) {
                        grouped[msg.user_id].unread += 1;
                    }
                });

                const conversationList = Object.values(grouped).sort((a, b) => 
                    new Date(b.messages[b.messages.length - 1].timestamp).getTime() - 
                    new Date(a.messages[a.messages.length - 1].timestamp).getTime()
                );

                setConversations(conversationList);
                
                if (!selectedUserId && conversationList.length > 0 && !isSilent) {
                    setSelectedUserId(conversationList[0].user_id);
                    markAsRead(conversationList[0].user_id);
                }

                // If currently viewing a user, mark their messages as read automatically
                if (selectedUserId) {
                    const currentConv = grouped[selectedUserId];
                    if (currentConv && currentConv.unread > 0) {
                        markAsRead(selectedUserId);
                    }
                }
            }
        } catch (err) {
            console.error("Failed to fetch messages", err);
        } finally {
            if (!isSilent) {
                setLoadingProgress(100);
                setTimeout(() => setIsPageLoading(false), 200);
            }
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(() => fetchMessages(true), 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [selectedUserId, conversations]);

    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedUserId || !lawyerId) {
            console.error("Missing required fields for sending:", { newMessage, selectedUserId, lawyerId });
            return;
        }

        setIsSending(true);
        try {
            console.log("Sending message to user:", selectedUserId, "from lawyer:", lawyerId);
            const res = await fetch(`${API_BASE_URL}/api/messages/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: selectedUserId,
                    lawyer_id: lawyerId,
                    content: newMessage,
                    sender_role: 'lawyer'
                })
            });

            if (res.ok) {
                setNewMessage('');
                fetchMessages(true);
            } else {
                const errData = await res.json();
                console.error("Failed to send message:", errData);
                alert("Failed to send message. Please try again.");
            }
        } catch (err) {
            console.error("Send failed error:", err);
            alert("Network error. Please check your connection.");
        } finally {
            setIsSending(false);
        }
    };

    const markAsRead = async (userId: string) => {
        if (!lawyerId) return;
        
        // Update local state immediately for better UX
        setConversations(prev => prev.map(c => 
            c.user_id === userId ? { ...c, unread: 0 } : c
        ));

        try {
            await fetch(`${API_BASE_URL}/api/messages/read/${lawyerId}/${userId}`, { method: 'POST' });
        } catch (err) {
            console.error("Read mark failed", err);
        }
    };

    const selectedConv = conversations.find(c => c.user_id === selectedUserId);
    const filteredConversations = conversations.filter(c => 
        c.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-[calc(100vh-140px)]">
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 shrink-0">
                <div>
                    <h1 className="text-[32px] font-bold text-[#181B25] tracking-tight leading-tight">Messages</h1>
                    <p className="text-slate-500 font-medium text-sm">Direct communication with your clients</p>
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
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9000] transition"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {filteredConversations.length > 0 ? filteredConversations.map((chat) => (
                            <div 
                                key={chat.user_id} 
                                onClick={() => {
                                    setSelectedUserId(chat.user_id);
                                    setShowChatMobile(true);
                                    markAsRead(chat.user_id);
                                }}
                                className={`p-4 flex gap-4 cursor-pointer transition border-l-4 ${selectedUserId === chat.user_id ? 'bg-orange-50/50 border-[#FF9000]' : 'border-transparent hover:bg-slate-50'}`}
                            >
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500">
                                        {chat.userName.charAt(0)}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-[14px] text-[#181B25] truncate">{chat.userName}</h4>
                                        <span className={`text-[11px] font-bold ${chat.unread > 0 ? 'text-[#FF9000]' : 'text-slate-400'}`}>{chat.lastTime}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className={`text-[13px] truncate ${chat.unread > 0 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                                            {chat.lastMessage}
                                        </p>
                                        {chat.unread > 0 && (
                                            <span className="bg-[#FF9000] text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center shrink-0">
                                                {chat.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-slate-400">
                                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm font-bold">No messages found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Chat Pane */}
                <div className={`${showChatMobile ? 'flex' : 'hidden'} md:flex flex-1 flex-col h-full bg-[#F8F9FA]/50`}>
                    {selectedConv ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 px-6 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => setShowChatMobile(false)}
                                        className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-600 transition"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                        {selectedConv.userName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#181B25] text-sm md:text-base">{selectedConv.userName}</h3>
                                        <p className="text-[11px] font-bold text-emerald-500">Active conversation</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="p-2 text-slate-400 hover:text-[#FF9000] hover:bg-orange-50 rounded-lg transition"><Phone className="w-5 h-5" /></button>
                                    <button className="p-2 text-slate-400 hover:text-[#FF9000] hover:bg-orange-50 rounded-lg transition"><Video className="w-5 h-5" /></button>
                                    <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition"><MoreVertical className="w-5 h-5" /></button>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                                {selectedConv.messages.map((msg, i) => {
                                    const isLawyer = msg.sender_role === 'lawyer';
                                    return (
                                        <div key={msg.id} className={`flex gap-4 ${isLawyer ? 'flex-row-reverse' : ''}`}>
                                            {!isLawyer && <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-500">{selectedConv.userName.charAt(0)}</div>}
                                            <div className={`${isLawyer ? 'bg-[#181B25] text-white rounded-tr-sm' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'} shadow-sm p-4 rounded-2xl max-w-[85%] md:max-w-lg`}>
                                                <p className="text-[14px] leading-relaxed">{msg.content}</p>
                                                <p className={`text-[10px] font-bold mt-2 ${isLawyer ? 'text-slate-400' : 'text-slate-400'} text-right`}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 bg-white border-t border-slate-100">
                                <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-[#FF9000] focus-within:ring-1 focus-within:ring-[#FF9000] transition">
                                    <button className="p-2 text-slate-400 hover:text-slate-600 transition shrink-0"><Paperclip className="w-5 h-5" /></button>
                                    <textarea
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                        className="flex-1 bg-transparent resize-none focus:outline-none p-2 text-sm max-h-32 text-slate-700 font-medium"
                                        rows={1}
                                    />
                                    <button 
                                        onClick={handleSend}
                                        disabled={!newMessage.trim() || isSending}
                                        className="p-2.5 bg-[#FF9000] hover:bg-[#E68200] text-white rounded-xl transition shadow-sm shrink-0 disabled:opacity-50"
                                    >
                                        {isSending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center flex-col p-8 text-center">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6">
                                <MessageSquare className="w-10 h-10 text-orange-200" />
                            </div>
                            <h3 className="text-xl font-bold text-[#181B25]">Select a conversation</h3>
                            <p className="text-slate-500 max-w-xs mt-2 font-medium">Choose a client from the list to view your chat history and send replies.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
