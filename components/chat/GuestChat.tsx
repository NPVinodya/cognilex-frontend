'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import MessageBubble from './MessageBubble';
import {
  Send,
  Scale,
  Gavel,
  Shield,
  Sparkles,
  X,
  ArrowRight,
  Lock,
  Mic,
} from 'lucide-react';
import { GUEST_MESSAGE_LIMIT, API_BASE_URL } from '@/lib/constants';
import type { Message } from '@/lib/types';
import { useGuestChatStore } from '@/store/guestChatStore';

/** Greeting bot message shown on first load — same tone as the main chatbot */
const GREETING_MESSAGE: Message = {
  id: 'greeting-0',
  text: `**Hello! 👋 Welcome to CogniLex AI.**

I'm your AI-powered Sri Lankan legal assistant. I can help you with:

- **Legal questions** about Sri Lankan statutes & acts
- **Case law** and court judgements
- **Rights & regulations** across all 9 provinces
- **Guidance** on legal procedures and documents

You have **${GUEST_MESSAGE_LIMIT} free questions** to try me out. What legal topic can I help you with today?`,
  sender: 'bot',
  timestamp: new Date(),
};

export default function GuestChat() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [greetingShown, setGreetingShown] = useState(false);

  // --- Zustand store --------------------------------------------------
  const messages = useGuestChatStore((s) => s.messages);
  const botResponseCount = useGuestChatStore((s) => s.botResponseCount);
  const addMessage = useGuestChatStore((s) => s.addMessage);
  const incrementBotCount = useGuestChatStore((s) => s.incrementBotCount);
  // --------------------------------------------------------------------

  const messageListRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLimitReached = botResponseCount >= GUEST_MESSAGE_LIMIT;
  const remaining = Math.max(0, GUEST_MESSAGE_LIMIT - botResponseCount);

  // Remove the auto-greeting effect from here
  useEffect(() => {
    // If there are already messages in the store (returned user), 
    // mark greeting as shown so we don't re-trigger it
    if (messages.length > 0) {
      setGreetingShown(true);
    }
  }, [messages.length]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    const el = messageListRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Auto-show modal when limit is reached
  useEffect(() => {
    if (isLimitReached && messages.length > 1) {
      const t = setTimeout(() => setShowSignupModal(true), 600);
      return () => clearTimeout(t);
    }
  }, [isLimitReached, messages.length]);

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;

    // If first time typing and no messages, show greeting
    if (val.length > 0 && !greetingShown && messages.length === 0) {
      setGreetingShown(true);
      addMessage(GREETING_MESSAGE);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLimitReached || loading) return;

    const userQuestion = input.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      text: userQuestion,
      sender: 'user',
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput('');
    resetTextareaHeight();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/guest_mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userQuestion, user_id: 'guest_user' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get response');
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        sender: 'bot',
        timestamp: new Date(),
        sources: data.sources || [],
        relatedCases: data.related_cases || [],
      };

      addMessage(botMessage);
      incrementBotCount();
    } catch (err: any) {
      console.error('Guest mode error:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: err.message || 'An error occurred. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
      };
      addMessage(errorMessage);
      incrementBotCount();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden p-2">
      {/* ── AMBIENT BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px] animate-pulse duration-[10s]" />
        <div className="absolute inset-0 opacity-[0.02]">
          <Scale className="absolute top-[15%] left-[10%] w-32 h-32 -rotate-12" />
          <Gavel className="absolute bottom-[20%] right-[10%] w-40 h-40 rotate-12" />
          <Shield className="absolute top-[40%] right-[15%] w-24 h-24 rotate-6" />
        </div>
      </div>

      <div className="relative z-10">
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between mb-6 px-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-playfair font-black text-white tracking-tight leading-none mb-2">
              Try it now
            </h3>
            <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live AI Intelligence
            </p>
          </div>
          <span className="px-4 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/30">
            Free Trial
          </span>
        </div>

        {/* ── MESSAGE LIST ── */}
        <div
          ref={messageListRef}
          className="space-y-6 min-h-[300px] max-h-[500px] overflow-y-auto mb-6 pr-2 no-scrollbar"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={msg.id === 'greeting-0' ? 'animate-in zoom-in-95 fade-in duration-500' : ''}
            >
              <MessageBubble message={msg} />
            </div>
          ))}

          {loading && (
            <div className="flex justify-start mb-6 animate-in fade-in duration-300">
              <div className="bg-white/10 backdrop-blur-xl rounded-[1.5rem] rounded-tl-none px-5 py-4 border border-white/20">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-amber-500/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-amber-500/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-amber-500/60 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── INPUT BAR (matches main chat style) ── */}
        <div className="px-4">
          <div
            className={`flex items-end gap-2 bg-white/10 backdrop-blur-md border rounded-[2rem] p-2 transition-all ${
              isLimitReached
                ? 'border-amber-500/40 opacity-60 cursor-not-allowed'
                : 'border-white/10 focus-within:border-amber-500/50'
            }`}
          >
            {/* Mic button — decorative, matches main chat layout */}
            {!isLimitReached && (
              <button
                type="button"
                className="p-3 text-white/30 hover:text-amber-400 transition-all hover:bg-white/5 rounded-full active:scale-90 shrink-0 self-end mb-0.5"
                tabIndex={-1}
                aria-label="Voice input (coming soon)"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}

            {isLimitReached ? (
              <div className="flex-1 flex items-center gap-2 px-2 py-3 text-white/40">
                <Lock className="w-4 h-4 text-amber-500/60 shrink-0" />
                <span className="text-sm font-medium">
                  Free limit reached — sign up to continue
                </span>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={input}
                rows={1}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about Sri Lankan law..."
                disabled={loading}
                className="flex-1 min-w-0 bg-transparent border-none outline-none px-2 py-3 text-white placeholder-white/30 font-medium font-inter resize-none min-h-[44px] max-h-[200px] overflow-y-auto leading-relaxed"
              />
            )}

            {/* Send / Sparkles button */}
            <button
              onClick={isLimitReached ? () => setShowSignupModal(true) : handleSend}
              disabled={!isLimitReached && (loading || !input.trim())}
              className="w-12 h-12 shrink-0 bg-amber-600 hover:bg-amber-500 text-white rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 shadow-lg shadow-amber-600/30 self-end"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : isLimitReached ? (
                <Sparkles className="w-5 h-5" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </div>

          {/* Counter / sign-up nudge */}
          {!isLimitReached && (
            <p className="text-center text-[10px] font-black text-white/30 uppercase tracking-widest mt-3">
              {remaining} free {remaining === 1 ? 'question' : 'questions'} remaining
            </p>
          )}
          {isLimitReached && (
            <button
              onClick={() => setShowSignupModal(true)}
              className="w-full text-center text-[10px] font-black text-amber-400/70 uppercase tracking-widest mt-4 hover:text-amber-400 transition cursor-pointer"
            >
              Sign up for unlimited access →
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SIGNUP MODAL OVERLAY
      ══════════════════════════════════════════════════════════ */}
      {showSignupModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center p-4"
          style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
        >
          {/* Dimmed overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowSignupModal(false)}
          />

          {/* Modal card */}
          <div className="relative w-full max-w-sm animate-in zoom-in-90 fade-in duration-300">
            {/* Glow ring */}
            <div className="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-br from-amber-500/40 via-amber-600/20 to-transparent blur-sm pointer-events-none" />

            <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-900/95 to-slate-800/95 backdrop-blur-2xl rounded-[2rem] border border-white/10 p-8 shadow-2xl">
              {/* Close button */}
              <button
                onClick={() => setShowSignupModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/80 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Logo */}
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="bg-white p-3 rounded-2xl shadow-2xl mb-3 transform hover:rotate-6 transition-transform duration-300">
                  <Scale className="w-10 h-10 text-amber-600" strokeWidth={2.5} />
                </div>
                <div className="text-center">
                  <h1 className="text-2xl font-black text-white tracking-tighter">CogniLex AI</h1>
                  <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.3em]">Legal Intelligence</p>
                </div>
              </div>

              {/* Copy */}
              <h4 className="text-2xl font-playfair font-bold text-white text-center mb-3 tracking-tight">
                You&apos;ve hit the limit
              </h4>
              <p className="text-white/50 text-sm text-center leading-relaxed mb-2">
                You&apos;ve used all{' '}
                <span className="text-amber-400 font-bold">{GUEST_MESSAGE_LIMIT} free questions</span>.
                Create a free account to unlock unlimited consultations.
              </p>
              <p className="text-white/30 text-xs text-center mb-8">
                Your conversation will be saved to your new account.
              </p>

              {/* Perks list */}
              <div className="space-y-2 mb-8">
                {[
                  'Unlimited AI legal consultations',
                  'Access to verified Sri Lankan lawyers',
                  'Save & revisit your chat history',
                ].map((perk) => (
                  <div key={perk} className="flex items-center gap-3 text-sm text-white/60">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block" />
                    </span>
                    {perk}
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/register')}
                  className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-2xl font-black shadow-xl hover:shadow-amber-500/25 hover:from-amber-500 hover:to-amber-400 transition-all active:scale-95 text-xs uppercase tracking-[0.2em] cursor-pointer flex items-center justify-center gap-2"
                >
                  Create Free Account
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-2xl font-bold border border-white/10 hover:border-white/20 transition-all text-xs uppercase tracking-[0.2em] cursor-pointer"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
