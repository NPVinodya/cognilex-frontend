'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Sparkles, UserCheck, MessageCircle, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/constants';

interface LawyerChatCardProps {
  lawyerId: string;
  lawyerName: string;
}

export default function LawyerChatCard({ lawyerId, lawyerName }: LawyerChatCardProps) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [user, setUser] = useState<{ id: string } | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      setUser(JSON.parse(rawUser));
    }
  }, []);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/conversation/${user.id}/${lawyerId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
      const interval = setInterval(fetchHistory, 5000);
      return () => clearInterval(interval);
    }
  }, [user, lawyerId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAction = async () => {
    if (!question.trim()) return;

    if (!user) {
      setError('Please login to message the lawyer directly.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          lawyer_id: lawyerId,
          content: question,
          sender_role: 'user'
        })
      });

      if (res.ok) {
        setQuestion('');
        fetchHistory();
      } else {
        setError('Failed to send message.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "I'd like to schedule a consultation.",
    "What documents should I bring?",
    "Do you handle civil cases in Colombo?"
  ];

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-xl hover:border-amber-300 group">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Direct Communication</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Chat directly with {lawyerName}</p>
          </div>
        </div>

        {/* Conversation History */}
        {user && messages.length > 0 && (
          <div 
            ref={scrollRef}
            className="mb-6 max-h-[200px] overflow-y-auto pr-2 space-y-3 no-scrollbar"
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 px-4 rounded-2xl text-[13px] font-medium ${msg.sender_role === 'user' ? 'bg-[#181B25] text-white rounded-tr-sm shadow-sm' : 'bg-slate-100 text-slate-700 rounded-tl-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="relative mb-6">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Write your message to ${lawyerName}...`}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-5 pr-14 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-all min-h-[140px] resize-none"
          />
          <button
            onClick={handleAction}
            disabled={!question.trim() || loading}
            className="absolute bottom-4 right-4 p-3 bg-[#FF9000] text-white rounded-2xl shadow-lg shadow-orange-600/20 hover:bg-[#E68200] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-bold animate-in fade-in slide-in-from-top-2">
            <Info className="w-5 h-5" /> {error}
          </div>
        )}

        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 text-left">Quick Inquiries</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuestion(q)}
                className="px-4 py-2 bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700 rounded-xl text-[11px] font-bold transition-all border border-transparent hover:border-amber-200"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <UserCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          Secure & Direct Message
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Replies will appear in your dashboard
        </div>
      </div>
    </div>
  );
}

// Add missing imports
import { CheckCircle } from 'lucide-react';
