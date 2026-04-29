'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import MessageBubble from './MessageBubble';
import { MessageSquare, Send, FileText, Scale, Gavel, Shield } from 'lucide-react';
import { GUEST_MESSAGE_LIMIT } from '@/lib/constants';

export default function GuestChat() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [guestMessageCount, setGuestMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const shouldPromptRegistration = guestMessageCount >= GUEST_MESSAGE_LIMIT;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || shouldPromptRegistration) return;

    // Add user message to UI
    const userMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setGuestMessageCount(prev => prev + 1);
    setInput('');
    setLoading(true);

    // Simulate response (replace with actual API call later)
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: 'This is a demo response. Connect to chatAPI to get actual responses.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="relative overflow-hidden p-2">

      {/* AMBIENT BACKGROUND ANIMATION - Removed yellow, kept subtle blue */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px] animate-pulse duration-[10s]"></div>

        {/* Law Symbols floating */}
        <div className="absolute inset-0 opacity-[0.02]">
          <Scale className="absolute top-[15%] left-[10%] w-32 h-32 -rotate-12" />
          <Gavel className="absolute bottom-[20%] right-[10%] w-40 h-40 rotate-12" />
          <Shield className="absolute top-[40%] right-[15%] w-24 h-24 rotate-6" />
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8 px-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-playfair font-black text-white tracking-tight leading-none mb-2">
              Try it now
            </h3>
            <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Live AI Intelligence
            </p>
          </div>
          <span className="px-4 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/30">
            Free Trial
          </span>
        </div>

        <div className="space-y-6 min-h-[300px] max-h-[500px] overflow-y-auto mb-8 pr-2 no-scrollbar">
          {messages.length === 0 ? (
            <div className="h-[250px] flex flex-col items-center justify-center text-center opacity-40">
              <MessageSquare className="w-12 h-12 text-white mb-4" />
              <p className="text-white font-medium">How can I assist you today?</p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))
          )}

          {shouldPromptRegistration && (
            <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-[2rem] p-8 text-center text-white border border-white/10 animate-in zoom-in-95 duration-500">
              <Shield className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <h4 className="text-xl font-playfair font-bold mb-2">Enjoying CogniLex AI?</h4>
              <p className="text-white/80 text-sm mb-6">
                Register now for unlimited questions, full citations, and access to our lawyer network.
              </p>
              <button
                onClick={() => router.push('/register')}
                className="w-full py-4 bg-white text-amber-900 rounded-2xl font-black shadow-xl hover:bg-slate-50 transition-all active:scale-95 text-xs uppercase tracking-[0.2em] cursor-pointer"
              >
                Continue with Free Registration
              </button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-4">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-2 focus-within:border-amber-500/50 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask about Sri Lankan law..."
              disabled={shouldPromptRegistration || loading}
              className="flex-1 min-w-0 bg-transparent border-none outline-none px-2 md:px-4 py-3 text-white placeholder-white/30 font-medium font-outfit"
            />

            <button
              onClick={handleSend}
              disabled={shouldPromptRegistration || loading || !input.trim()}
              className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-amber-600 text-white rounded-xl flex items-center justify-center hover:bg-amber-500 transition-all active:scale-90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          {!shouldPromptRegistration && (
            <p className="text-center text-[10px] font-black text-white/30 uppercase tracking-widest mt-4">
              {GUEST_MESSAGE_LIMIT - guestMessageCount} free questions remaining
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

