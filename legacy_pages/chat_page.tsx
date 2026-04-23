"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import SettingsModal from "@/components/chat/SettingsModal";
import CorporatePlanModal from "@/components/chat/CorporatePlanModal";
import SupportDeskModal from "@/components/chat/SupportDeskModal";
import { useRouter } from "next/navigation";
import { logoutFromAppwrite } from "@/lib/appwrite";

type Message = {
  role: "user" | "bot";
  content: string;
  time: string;
  sources?: string[];
  latency?: string;
  mode?: string;
};

/** Resolve user_id from localStorage — used as RAG session key */
function resolveUserId(): string {
  try {
    return JSON.parse(localStorage.getItem("user") ?? "{}")?.email || "guest_user";
  } catch {
    return "guest_user";
  }
}

export default function CogniLexAI() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isVoiceOn, setIsVoiceOn] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("General");
  const [showCorporatePlan, setShowCorporatePlan] = useState(false);
  const [showSupportDesk, setShowSupportDesk] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string; email: string; userrole: string;
    avatar_url?: string; preferences?: { appearance: string; language: string };
  } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Voice ──────────────────────────────────────────────────────────────────
  const speak = (text: string) => {
    if (!isVoiceOn) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  };
  const stopSpeaking = () => window.speechSynthesis.cancel();
  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return alert("Browser not supported");
    const r = new SR();
    r.onresult = (e: any) => setQuestion(e.results[0][0].transcript);
    r.start();
  };

  // ── Load user ──────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const p = JSON.parse(stored);
        const ap = p?.preferences?.appearance || "Dark Mode";
        if (ap === "Dark Mode" || ap === "System Default")
          document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
        setCurrentUser({
          name: p.name || "User", email: p.email || "",
          userrole: p.userrole || "user", avatar_url: p.avatar_url,
          preferences: p.preferences || { appearance: "Dark Mode", language: "English (US)" },
        });
      }
    } catch { /* ignore */ }
  }, []);

  const getUserInitials = (name?: string, email?: string) => {
    const src = name || email || "User";
    const pts = src.trim().split(/\s+/);
    return pts.length === 1 ? pts[0][0].toUpperCase() : (pts[0][0] + pts[1][0]).toUpperCase();
  };

  const handleLogout = async () => {
    try { await logoutFromAppwrite(); } catch { }
    try { await fetch("/api/logout", { method: "POST" }); } catch { }
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenType");
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setCurrentUser(null);
    router.push("/login");
  };

  // ── Core API call — Browser → /api/chat → REST API /chat/ask → RAG /ask ───
  const callChatAPI = async (q: string): Promise<Message> => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q, user_id: resolveUserId() }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.detail || "Backend error");
    return {
      role: "bot",
      content: data.answer ?? "No response received.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sources: data.sources,
      latency: data.latency,
      mode: data.mode,
    };
  };

  // ── Send chat message ──────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!question.trim()) return;
    const q = question.trim();
    setMessages(p => [...p, { role: "user", content: q, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setLoading(true);
    setQuestion("");
    stopSpeaking();
    try {
      const bot = await callChatAPI(q);
      setMessages(p => [...p, bot]);
      speak(bot.content);
    } catch (e: any) {
      setMessages(p => [...p, { role: "bot", content: e.message || "Backend Connection Failed.", time: "Now" }]);
    } finally {
      setLoading(false);
    }
  };

  // ── PDF upload — asks RAG to describe the file ────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const q = `📁 Please summarize and analyse the legal document: ${file.name}`;
    setMessages(p => [...p, { role: "user", content: q, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setLoading(true);
    try {
      const bot = await callChatAPI(q);
      setMessages(p => [...p, bot]);
      speak(bot.content);
    } catch (e: any) {
      setMessages(p => [...p, { role: "bot", content: e.message || "Error reaching the RAG backend.", time: "Now" }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-hidden font-sans relative">

      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? "w-80" : "w-0"} bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-500 flex flex-col overflow-hidden`}>
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-md border border-slate-200/50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                <path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-50 dark:to-amber-200 bg-clip-text text-transparent">CogniLex AI</h1>
          </div>

          <button onClick={() => setMessages([])} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition mb-6 text-sm font-medium text-slate-700 dark:text-white">
            <span className="text-lg">+</span> New Consultation
          </button>

          <nav className="space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2">Navigation</p>
            <div className="p-3 rounded-xl flex items-center gap-3 bg-amber-100 dark:bg-amber-600/10 border border-amber-300 dark:border-amber-500/20 text-amber-600 dark:text-amber-500">
              <span className="text-lg">💬</span>
              <span className="text-sm font-medium">Legal Chat</span>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 mb-3">Professional Network</p>
              <div onClick={() => router.push("/lawyer")} className="p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl flex items-center gap-3 cursor-pointer transition group border border-transparent hover:border-amber-500/30 mb-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-lg group-hover:scale-110 transition">⚖️</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-300">Find Lawyer</p>
                  <p className="text-[10px] text-slate-500">Directory of verified experts</p>
                </div>
              </div>
              <div onClick={() => router.push(currentUser?.userrole === "lawyer" ? "/lawyerDashboard" : "/lawyerRegistation")} className="p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl flex items-center gap-3 cursor-pointer transition group border border-transparent hover:border-slate-300 dark:hover:border-slate-500/30">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-lg group-hover:scale-110 transition">
                  {currentUser?.userrole === "lawyer" ? "🏛️" : "🎓"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-300">{currentUser?.userrole === "lawyer" ? "Lawyer Dashboard" : "Join Platform"}</p>
                  <p className="text-[10px] text-slate-500">{currentUser?.userrole === "lawyer" ? "Manage your legal practice" : "Register your legal practice"}</p>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* User panel */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 relative">
          {showUserMenu && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 duration-200">
              <div className="p-3 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700">
                <div className="w-8 h-8 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-[10px] text-amber-500 border border-slate-200 dark:border-slate-700 font-bold overflow-hidden">
                  {currentUser?.avatar_url ? <img src={currentUser.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : getUserInitials(currentUser?.name, currentUser?.email)}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white leading-none">{currentUser?.name || "User"}</p>
                  <p className="text-[10px] text-slate-400 my-0.5">{currentUser?.email || ""}</p>
                  <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-amber-500/20 text-amber-500 text-[9px] font-bold rounded border border-amber-500/30 uppercase tracking-widest">{currentUser?.userrole}</span>
                </div>
              </div>
              <div className="p-1.5 space-y-0.5">
                <button onClick={() => { setShowCorporatePlan(true); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition text-[11px] text-slate-700 dark:text-slate-300"><span>✨</span> Corporate Plan</button>
                <button onClick={() => { setShowSettings(true); setActiveSettingsTab("General"); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition text-[11px] text-slate-700 dark:text-slate-300"><span>⚙️</span> Platform Settings</button>
              </div>
              <div className="p-1.5 border-t border-slate-100 dark:border-slate-700">
                <button onClick={() => { setShowSupportDesk(true); setShowUserMenu(false); }} className="w-full flex items-center justify-between gap-3 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition text-[11px] text-slate-700 dark:text-slate-300"><span className="flex items-center gap-3"><span>🎧</span> Support Desk</span><span>›</span></button>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-rose-500/10 rounded-lg transition text-[11px] text-rose-500 dark:text-rose-400 mt-1"><span>🚪</span> Secure Log Out</button>
              </div>
            </div>
          )}
          <div onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-3 px-2 py-1.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
            <div className="relative">
              <div className="w-9 h-9 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-amber-500 font-bold text-xs shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {currentUser?.avatar_url ? <img src={currentUser.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : getUserInitials(currentUser?.name, currentUser?.email)}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-white truncate leading-tight">{currentUser?.name || "User"}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mb-1">{currentUser?.email || ""}</p>
              <span className="inline-block px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-bold rounded-full border border-slate-300 dark:border-slate-700 uppercase tracking-widest shadow-sm">{currentUser?.userrole}</span>
            </div>
            <button className="px-3 py-1 bg-amber-600 text-white text-[10px] font-bold rounded-full hover:bg-amber-700 transition shrink-0 shadow-sm border border-amber-700">Upgrade</button>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col relative bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950">

        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} activeTab={activeSettingsTab} setActiveTab={setActiveSettingsTab} currentUser={currentUser}
            onUpdateUser={(u) => {
              setCurrentUser(u);
              const s = localStorage.getItem("user");
              if (s) localStorage.setItem("user", JSON.stringify({ ...JSON.parse(s), ...u }));
            }}
          />
        )}
        {showCorporatePlan && <CorporatePlanModal onClose={() => setShowCorporatePlan(false)} />}
        {showSupportDesk && <SupportDeskModal onClose={() => setShowSupportDesk(false)} />}

        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800/50 backdrop-blur-md bg-white/80 dark:bg-slate-900/40 z-10">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition text-slate-400 font-bold text-xl">☰</button>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsVoiceOn(!isVoiceOn)} className={`text-xl transition-all hover:scale-110 ${isVoiceOn ? "text-amber-500" : "text-slate-600"}`}>{isVoiceOn ? "🔊" : "🔇"}</button>
            <button onClick={stopSpeaking} className="text-[10px] bg-rose-900/20 border border-rose-500/30 px-3 py-1 rounded-full text-rose-400 hover:bg-rose-500/40 transition font-bold uppercase tracking-wider">Halt Audio</button>
            <button onClick={() => fileInputRef.current?.click()} className="text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition font-bold uppercase tracking-wider">📁 Upload PDF</button>
            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
          </div>
        </header>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto px-6 md:px-24 py-10 space-y-8">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-700">
              <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center text-3xl mb-6 border border-slate-200 dark:border-slate-700 shadow-xl text-amber-500">⚖️</div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">CogniLex Legal Assistant</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md text-center">Secure AI intelligence tailored for Sri Lankan jurisprudence. Formulate your inquiry below.</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[88%] p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden ${msg.role === "user" ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-br-none font-medium" : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-bl-none"}`}>
                {msg.role === "bot" && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-500 to-amber-700"></div>}

                <div className={`text-[15.5px] leading-relaxed tracking-wide ${msg.role === "bot" ? "pl-2" : ""}`}>
                  {msg.role === "user" ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <ReactMarkdown components={{
                      p: ({ ...p }) => <p className="mb-4 last:mb-0" {...p} />,
                      strong: ({ ...p }) => <strong className="font-extrabold text-amber-700 dark:text-amber-400 bg-amber-600/5 dark:bg-amber-400/10 px-1.5 py-0.5 rounded-md border-b-2 border-amber-500/20" {...p} />,
                      h3: ({ ...p }) => <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3 mt-1 uppercase tracking-wider" {...p} />,
                      ul: ({ ...p }) => <ul className="space-y-2 mb-4 list-none pl-1" {...p} />,
                      li: ({ ...p }) => <li className="flex items-start gap-3" {...p}><span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><div>{(p as any).children}</div></li>,
                      blockquote: ({ ...p }) => <blockquote className="border-l-4 border-slate-300 dark:border-slate-700 pl-4 py-1 italic text-slate-500 dark:text-slate-400 mb-4" {...p} />,
                    }}>
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>

                {/* RAG Sources */}
                {msg.role === "bot" && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pl-2 border-t border-slate-200/60 dark:border-white/10 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">📚 Sources</p>
                    <ul className="space-y-1">
                      {msg.sources.map((src, si) => (
                        <li key={si} className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 rounded-lg px-3 py-1.5 font-mono">{src}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-3 mt-3 px-5">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em]">{msg.time}</span>
                {msg.role === "bot" && msg.latency && <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">⚡ {msg.latency}</span>}
                {msg.role === "bot" && msg.mode && <span className="text-[10px] text-amber-500/70 font-medium truncate max-w-[200px]">{msg.mode}</span>}
              </div>
            </div>
          ))}

          <div ref={scrollRef} />
          {loading && (
            <div className="flex items-center gap-3 text-amber-500 text-[11px] font-bold animate-pulse px-2 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div> Synthesizing Legal Response...
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="px-6 md:px-32 pb-8 pt-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-full p-2 flex items-center gap-2 focus-within:border-amber-500/50 shadow-xl transition-all duration-300">
            <button onClick={startListening} className="p-3 text-slate-400 hover:text-amber-500 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
            </button>
            <input
              className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="State your legal inquiry or scenario..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} className="bg-amber-600 hover:bg-amber-500 text-white p-3 rounded-full transition shadow-lg active:scale-95">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
