'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Scale } from 'lucide-react';

type SharedMessage = {
  role: 'user' | 'bot';
  content: string;
  created_at: string;
  sources?: string[];
  related_cases?: any[];
  latency?: string;
  mode?: string;
};

type SharedChat = {
  title: string;
  sharedBy: string;
  sharedAt: string;
  messages: SharedMessage[];
};

function getDisplayName(email: string): string {
  if (!email || email === 'Unknown') return 'Someone';
  return email.split('@')[0];
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function MessageRow({ msg }: { msg: SharedMessage }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-4 duration-500`}>
      <div
        className={`max-w-[90%] px-5 py-3 rounded-2xl shadow-lg relative overflow-hidden
          ${isUser
            ? 'bg-amber-600 text-white rounded-br-none font-medium'
            : 'bg-white/10 backdrop-blur-sm text-slate-100 border border-white/15 rounded-bl-none'
          }`}
      >
        {/* Left accent bar for bot messages */}
        {!isUser && (
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 rounded-l-2xl" />
        )}
        <div className={`text-[14px] md:text-[15px] leading-relaxed ${!isUser ? 'pl-3' : ''}`}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{msg.content}</p>
          ) : (
            <ReactMarkdown
              components={{
                p: ({ ...p }) => <p className="mb-3 last:mb-0" {...p} />,
                strong: ({ ...p }) => (
                  <strong className="font-black text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded-md border border-amber-400/20" {...p} />
                ),
                h3: ({ ...p }) => <h3 className="text-lg font-black text-white mb-3 mt-1" {...p} />,
                ul: ({ ...p }) => <ul className="space-y-2 mb-3 list-none pl-1" {...p} />,
                li: ({ ...p }) => (
                  <li className="flex items-start gap-3" {...p}>
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] shrink-0" />
                    <div className="flex-1">{(p as any).children}</div>
                  </li>
                ),
                blockquote: ({ ...p }) => (
                  <blockquote className="border-l-4 border-amber-500/50 bg-amber-500/5 pl-4 py-3 italic text-slate-300 rounded-r-xl mb-3" {...p} />
                ),
              }}
            >
              {msg.content}
            </ReactMarkdown>
          )}
        </div>
        <div className={`flex items-center gap-2 mt-2 text-[10px] uppercase tracking-widest font-bold ${isUser ? 'text-white/50' : 'text-white/30'}`}>
          <span>{isUser ? 'User' : 'CogniLex AI'}</span>
          {msg.created_at && <><span>•</span><span>{formatTime(msg.created_at)}</span></>}
          {msg.latency && <span className="text-emerald-400/70">⚡ {msg.latency}</span>}
        </div>
      </div>
    </div>
  );
}

export default function SharePage() {
  const params = useParams();
  const router = useRouter();
  const shareId = params?.shareId as string;

  const [chat, setChat] = useState<SharedChat | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load current user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const p = JSON.parse(stored);
        const email = p.email || '';
        if (email) {
          setCurrentUser({ id: email, email, name: p.name || email });
        }
      }
    } catch { /* ignore */ }
  }, []);

  // Fetch shared chat
  useEffect(() => {
    if (!shareId) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/share?shareId=${encodeURIComponent(shareId)}`);
        if (res.status === 404) { setNotFound(true); return; }
        if (!res.ok) { setNotFound(true); return; }
        const data: SharedChat = await res.json();
        setChat(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [shareId]);

  // Scroll to bottom when messages load
  useEffect(() => {
    if (chat) {
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [chat]);

  const handleSave = async () => {
    if (!currentUser || !shareId) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/share/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareId, userId: currentUser.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save');
      setSavedSessionId(data.newSessionId);
      // Redirect to the new session after brief delay
      setTimeout(() => {
        router.push(`/${encodeURIComponent(currentUser.email)}/chat/${data.newSessionId}`);
      }, 1200);
    } catch (e: any) {
      setSaveError(e.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Centered modal card */}
      <div className="relative w-full max-w-2xl animate-in fade-in zoom-in-95 duration-500">

        {/* Header bar above modal */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => router.push('/')}
          >
            <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl border border-white/10 group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-white/80 font-black text-sm tracking-tight group-hover:text-white transition-colors">
              CogniLex AI
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-white/40 font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] inline-block" />
            Shared Consultation
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-5">
              <div className="relative flex h-8 w-8">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-50" />
                <span className="relative inline-flex rounded-full h-8 w-8 bg-amber-600" />
              </div>
              <p className="text-white/40 text-xs font-black uppercase tracking-[0.2em]">Loading shared chat…</p>
            </div>
          )}

          {/* Not found state */}
          {!loading && notFound && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-8">
              <div className="text-5xl">🔗</div>
              <h2 className="text-white font-black text-xl">Link Not Found</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                This shared chat link is invalid or has been removed.
              </p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-black text-sm transition-all active:scale-95"
              >
                Back to Home
              </button>
            </div>
          )}

          {/* Chat content */}
          {!loading && !notFound && chat && (
            <>
              {/* Chat header */}
              <div className="px-6 py-5 border-b border-white/10 bg-white/5">
                <h1 className="text-white font-black text-lg leading-tight line-clamp-2">
                  {chat.title}
                </h1>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-white/40 font-bold">
                  <span>Shared by</span>
                  <span className="text-amber-400/70">{getDisplayName(chat.sharedBy)}</span>
                  {chat.sharedAt && (
                    <>
                      <span>•</span>
                      <span>{new Date(chat.sharedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{chat.messages.length} messages</span>
                </div>
              </div>

              {/* Scrollable messages */}
              <div className="overflow-y-auto max-h-[55vh] px-5 py-6 space-y-5 no-scrollbar">
                {chat.messages.length === 0 ? (
                  <p className="text-white/30 text-xs text-center py-10 font-bold italic">No messages in this chat.</p>
                ) : (
                  chat.messages.map((msg, i) => (
                    <MessageRow key={i} msg={msg} />
                  ))
                )}
                <div ref={scrollRef} />
              </div>

              {/* Footer actions */}
              <div className="px-6 py-5 border-t border-white/10 bg-white/[0.03]">
                {savedSessionId ? (
                  /* Success state */
                  <div className="flex items-center justify-center gap-3 text-emerald-400 font-black text-sm animate-in fade-in duration-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Chat saved! Redirecting to your dashboard…
                  </div>
                ) : currentUser ? (
                  /* Logged-in user: Save button */
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-white/60 text-xs font-bold">
                        Logged in as <span className="text-amber-400/80">{currentUser.name}</span>
                      </p>
                      {saveError && (
                        <p className="text-rose-400 text-[11px] font-bold mt-1">{saveError}</p>
                      )}
                    </div>
                    <button
                      id="save-shared-chat-btn"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2.5 px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-amber-600/30 whitespace-nowrap"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                            <path d="M12 2a10 10 0 0 1 10 10" />
                          </svg>
                          Saving…
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                          </svg>
                          Save to My Chats
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  /* Guest: Sign-in CTA */
                  <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
                    <p className="text-white/40 text-xs font-bold text-center sm:text-left leading-relaxed">
                      Sign in to save this consultation to your account
                    </p>
                    <button
                      id="signin-to-save-btn"
                      onClick={() => router.push(`/login?next=/share/${shareId}`)}
                      className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white rounded-2xl font-black text-sm transition-all active:scale-95 whitespace-nowrap"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                      </svg>
                      Sign In to Save
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-white/20 text-[10px] font-bold mt-4 tracking-widest uppercase">
          CogniLex — AI Legal Assistant for Sri Lanka
        </p>
      </div>
    </div>
  );
}