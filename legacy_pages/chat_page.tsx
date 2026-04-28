"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import SettingsModal from "@/components/chat/SettingsModal";
import CorporatePlanModal from "@/components/chat/CorporatePlanModal";
import SupportDeskModal from "@/components/chat/SupportDeskModal";
import { useRouter } from "next/navigation";
import { logoutFromAppwrite } from "@/lib/appwrite";
import { Scale } from "lucide-react";

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
  const [isVoiceOn, setIsVoiceOn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("General");
  const [showCorporatePlan, setShowCorporatePlan] = useState(false);
  const [showSupportDesk, setShowSupportDesk] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<{
    name: string; email: string; userrole: string;
    avatar_url?: string; preferences?: { appearance: string; language: string };
  } | null>(null);

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const renameSession = async (sid: string, newTitle: string) => {
    if (!newTitle.trim()) return setEditingSessionId(null);
    try {
      const res = await fetch(`/api/chat?session_id=${sid}&title=${encodeURIComponent(newTitle)}`, {
        method: "PATCH"
      });
      if (res.ok) {
        setSessions(prev => prev.map(s => s.id === sid ? { ...s, title: newTitle } : s));
      }
    } catch (e) {
      console.error("Failed to rename:", e);
    }
    setEditingSessionId(null);
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Voice ──────────────────────────────────────────────────────────────────
  const speak = (text: string) => {
    if (!isVoiceOn) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    
    // Auto-detect language based on character ranges
    if (/[\u0D80-\u0DFF]/.test(text)) {
      u.lang = "si-LK"; // Sinhala
    } else if (/[\u0B80-\u0BFF]/.test(text)) {
      u.lang = "ta-LK"; // Tamil
    } else {
      u.lang = "en-US"; // Default English
    }
    
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

  // ── Sessions & History ───────────────────────────────────────────────────
  const fetchSessions = async () => {
    try {
      const email = resolveUserId();
      const res = await fetch(`/api/chat?user_id=${email}`);
      const data = await res.json();
      if (res.ok) setSessions(data.sessions || []);
    } catch (e) { console.error("Failed to fetch sessions:", e); }
  };

  const loadSessionMessages = async (sid: string) => {
    setLoading(true);
    setActiveSessionId(sid);
    if(window.innerWidth < 768) setSidebarOpen(false);
    try {
      const res = await fetch(`/api/chat?session_id=${sid}`);
      const data = await res.json();
      if (res.ok && data.messages) {
        setMessages(data.messages.map((m: any) => ({
          role: m.role,
          content: m.content,
          time: m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Now",
          sources: m.sources,
          latency: m.latency,
          mode: m.mode
        })));
      } else {
        setMessages([]);
      }
    } catch (e) { 
      console.error("Failed to load history:", e);
      setMessages([]);
    }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const email = resolveUserId();
    if (email && email !== "guest_user") fetchSessions();
  }, []);

  // ── Core API call — Browser → /api/chat → REST API /chat/ask → RAG /ask ───
  const callChatAPI = async (q: string): Promise<Message> => {
    const currentSid = activeSessionId;
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        question: q, 
        user_id: resolveUserId(),
        session_id: currentSid 
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.detail || "Backend error");

    // If backend returned a new session_id, update our state
    if (data.session_id && data.session_id !== currentSid) {
      setActiveSessionId(data.session_id);
      // Pre-emptively add to list for instant UI feedback
      const newSess = { 
        id: data.session_id, 
        title: q.slice(0, 30) + (q.length > 30 ? "..." : ""),
        updated_at: new Date().toISOString()
      };
      setSessions(prev => [newSess, ...prev.filter(s => s.id !== data.session_id)]);
    }

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
    <div className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-hidden font-inter relative">

      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed md:relative z-40 h-full
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0"} 
        w-80 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
        transition-all duration-500 ease-in-out flex flex-col overflow-hidden
      `}>
        {/* FIXED TOP SECTION */}
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-2.5 rounded-xl shadow-lg border border-slate-200 dark:border-white/10">
              <Scale className="w-7 h-7 text-amber-600" />
            </div>
            <h1 className="text-2xl font-playfair font-bold tracking-tight bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-100 dark:to-amber-400 bg-clip-text text-transparent">CogniLex AI</h1>
          </div>

          <button 
            onClick={() => { 
              setMessages([]); 
              setActiveSessionId(null);
              if(window.innerWidth < 768) setSidebarOpen(false); 
            }} 
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white dark:bg-amber-600/10 border border-slate-200 dark:border-amber-500/20 rounded-2xl hover:bg-slate-50 dark:hover:bg-amber-600/20 transition-all duration-300 text-sm font-bold text-slate-800 dark:text-amber-400 shadow-sm hover:shadow-md"
          >
            <span className="text-xl">+</span> New Consultation
          </button>
        </div>

        {/* FIXED RECENT CHATS HEADER */}
        <div className="px-8 pt-6 pb-2 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-black px-2">Recent Chats</p>
        </div>

        {/* SCROLLABLE MIDDLE SECTION */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-2">
          <div className="animate-in fade-in slide-in-from-left duration-500">
            <div className="space-y-2">
              {sessions.length > 0 ? (
                sessions.map((s: any) => (
                  <div 
                    key={s.id} 
                    className={`
                      p-3 rounded-xl cursor-pointer transition-all duration-200 border text-xs font-bold flex items-center justify-between group/item
                      ${activeSessionId === s.id 
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400" 
                        : "border-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400"}
                    `}
                  >
                    {editingSessionId === s.id ? (
                      <input
                        autoFocus
                        className="bg-transparent border-none outline-none w-full text-amber-600 dark:text-amber-400 font-bold"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={() => renameSession(s.id, editingTitle)}
                        onKeyDown={(e) => e.key === "Enter" && renameSession(s.id, editingTitle)}
                      />
                    ) : (
                      <>
                        <div className="truncate flex-1" onClick={() => loadSessionMessages(s.id)}>
                          <span className="mr-2">📄</span> {s.title || "Untitled Legal Chat"}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSessionId(s.id);
                            setEditingTitle(s.title || "");
                          }}
                          className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-amber-500/20 rounded transition-all ml-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-slate-400 dark:text-slate-600 italic px-4 py-2">No previous consultations found.</p>
              )}
            </div>
          </div>
        </div>

        {/* FIXED BOTTOM SECTION (Network & User) */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-black px-2 mb-4">Professional Network</p>
          <div onClick={() => router.push("/lawyer")} className="p-3.5 hover:bg-white dark:hover:bg-white/5 rounded-2xl flex items-center gap-3 cursor-pointer transition-all duration-300 group border border-transparent hover:border-amber-500/30 mb-3 hover:shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">⚖️</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">Find Lawyer</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Directory of verified experts</p>
            </div>
          </div>
          <div onClick={() => router.push(currentUser?.userrole === "lawyer" ? "/lawyerDashboard" : "/lawyerRegistation")} className="p-3.5 hover:bg-white dark:hover:bg-white/5 rounded-2xl flex items-center gap-3 cursor-pointer transition-all duration-300 group border border-transparent hover:border-amber-500/30 mb-6 hover:shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
              {currentUser?.userrole === "lawyer" ? "🏛️" : "🎓"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{currentUser?.userrole === "lawyer" ? "Lawyer Dashboard" : "Join Platform"}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{currentUser?.userrole === "lawyer" ? "Manage your legal practice" : "Register your legal practice"}</p>
            </div>
          </div>

          <div className="h-px w-full bg-slate-200 dark:bg-slate-800/50 my-6"></div>

          {/* USER PANEL */}
          <div className="relative">
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-4 duration-300">
                <div className="p-5 flex items-center gap-4 border-b border-slate-100 dark:border-slate-700/50">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-xs text-amber-500 border border-slate-200 dark:border-slate-700 font-black overflow-hidden shadow-inner">
                    {currentUser?.avatar_url ? <img src={currentUser.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : getUserInitials(currentUser?.name, currentUser?.email)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-outfit font-semibold text-slate-800 dark:text-white leading-none truncate">{currentUser?.name || "User"}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">{currentUser?.email || ""}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black rounded-lg border border-amber-500/20 uppercase tracking-widest">{currentUser?.userrole}</span>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  <button onClick={() => { setShowCorporatePlan(true); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all text-xs font-bold text-slate-700 dark:text-slate-300"><span>✨</span> Corporate Plan</button>
                  <button onClick={() => { setShowSettings(true); setActiveSettingsTab("General"); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all text-xs font-bold text-slate-700 dark:text-slate-300"><span>⚙️</span> Platform Settings</button>
                </div>
                <div className="p-2 border-t border-slate-100 dark:border-slate-700/50">
                  <button onClick={() => { setShowSupportDesk(true); setShowUserMenu(false); }} className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all text-xs font-bold text-slate-700 dark:text-slate-300"><span className="flex items-center gap-3"><span>🎧</span> Support Desk</span><span>›</span></button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose-500/10 rounded-xl transition-all text-xs font-bold text-rose-500 dark:text-rose-400 mt-1"><span>🚪</span> Secure Log Out</button>
                </div>
              </div>
            )}
            <div onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-4 p-2 cursor-pointer hover:bg-white dark:hover:bg-white/5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md border border-transparent hover:border-slate-200 dark:hover:border-white/10">
              <div className="relative">
                <div className="w-11 h-11 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-amber-500 font-black text-sm shadow-inner border border-slate-200 dark:border-slate-700 overflow-hidden">
                  {currentUser?.avatar_url ? <img src={currentUser.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : getUserInitials(currentUser?.name, currentUser?.email)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-outfit font-semibold text-slate-800 dark:text-white truncate leading-tight">{currentUser?.name || "User"}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mb-1">{currentUser?.email || ""}</p>
                <span className="inline-block px-2 py-0.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black rounded-lg border border-slate-200 dark:border-slate-700 uppercase tracking-widest shadow-sm">{currentUser?.userrole}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col relative bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">

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

        <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 border-b border-slate-200 dark:border-slate-800/50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/40 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
              className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-500 dark:text-slate-400 border border-transparent hover:border-slate-200 dark:hover:border-white/10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/50">
              <button 
                onClick={() => setIsVoiceOn(!isVoiceOn)} 
                className={`p-2 rounded-lg transition-all ${isVoiceOn ? "bg-white dark:bg-slate-700 text-amber-500 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                title={isVoiceOn ? "Disable Voice Response" : "Enable Voice Response"}
              >
                {isVoiceOn ? "🔊" : "🔇"}
              </button>
            </div>
            <button onClick={stopSpeaking} className="hidden sm:block text-[10px] bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-black uppercase tracking-widest shadow-sm" title="Stop ongoing voice response">Halt Audio</button>
            <button onClick={() => fileInputRef.current?.click()} className="p-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-500 transition-all shadow-lg shadow-amber-600/20 border border-amber-500">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </button>
            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
          </div>
        </header>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto px-4 md:px-24 py-8 md:py-12 space-y-10 no-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-1000">
              <div className="bg-white p-4 rounded-[2rem] shadow-2xl mb-8 border border-slate-200 dark:border-white/10">
                <Scale className="w-12 h-12 text-amber-600" />
              </div>
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-slate-900 dark:text-white mb-4 tracking-tight text-center">CogniLex Legal Assistant</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-lg text-center leading-relaxed font-medium">
                Advanced AI intelligence specialized in the legal landscape of Sri Lanka. 
                Formulate your inquiry below.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} animate-in slide-in-from-bottom-6 duration-500`}>
              <div className={`
                max-w-[92%] md:max-w-[85%] px-5 py-2.5 rounded-2xl shadow-lg relative overflow-hidden font-roboto
                ${msg.role === "user" 
                  ? "bg-amber-600 text-white rounded-br-none font-medium shadow-amber-600/10" 
                  : "bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-bl-none shadow-slate-200 dark:shadow-none"}
              `}>
                {msg.role === "bot" && <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-amber-500 via-amber-600 to-amber-800"></div>}

                <div className={`text-[15px] md:text-[16px] leading-relaxed tracking-wide ${msg.role === "bot" ? "pl-3 md:pl-4" : ""}`}>
                  {msg.role === "user" ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <ReactMarkdown components={{
                      p: ({ ...p }) => <p className="mb-5 last:mb-0" {...p} />,
                      strong: ({ ...p }) => <strong className="font-black text-amber-700 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-400/10 px-1.5 py-0.5 rounded-lg border border-amber-500/20" {...p} />,
                      h3: ({ ...p }) => <h3 className="text-xl md:text-2xl font-playfair font-black text-slate-900 dark:text-white mb-4 mt-2 tracking-tight" {...p} />,
                      ul: ({ ...p }) => <ul className="space-y-3 mb-5 list-none pl-1" {...p} />,
                      li: ({ ...p }) => <li className="flex items-start gap-4" {...p}><span className="mt-2.5 w-2 h-2 rounded-full bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.5)] shrink-0"></span><div className="flex-1">{(p as any).children}</div></li>,
                      blockquote: ({ ...p }) => <blockquote className="border-l-4 border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/5 pl-5 py-4 italic text-slate-600 dark:text-slate-400 rounded-r-2xl mb-5" {...p} />,
                    }}>
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>

                {/* RAG Sources */}
                {msg.role === "bot" && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-6 pl-3 md:pl-4 border-t border-slate-200 dark:border-white/10 pt-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                      <span className="w-4 h-px bg-slate-300 dark:bg-slate-700"></span> 📚 Research Material
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((src, si) => (
                        <span key={si} className="text-[10px] md:text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-400/10 rounded-full px-4 py-1.5 font-bold border border-amber-500/20">{src}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-4 mt-3 px-6">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.3em]">{msg.time}</span>
                {msg.role === "bot" && msg.latency && <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">⚡ {msg.latency}</span>}
                {msg.role === "bot" && msg.mode && <span className="text-[10px] text-amber-600/80 dark:text-amber-400/70 font-bold italic truncate max-w-[180px] md:max-w-[300px]">{msg.mode}</span>}
              </div>
            </div>
          ))}

          <div ref={scrollRef} />
          {loading && (
            <div className="flex items-center gap-4 text-amber-600 dark:text-amber-400 text-[12px] font-black animate-pulse px-4 uppercase tracking-[0.2em]">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-600"></span>
              </div>
              Synthesizing response...
            </div>
          )}
        </div>

        {/* INPUT BAR */}
        <div className="px-4 md:px-32 lg:px-48 pb-8 pt-4 bg-gradient-to-t from-white dark:from-slate-950 via-white/80 dark:via-slate-950/80 to-transparent">
          <div className="bg-white dark:bg-slate-900/80 backdrop-blur-2xl border-2 border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-2 flex items-center gap-2 focus-within:border-amber-500 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-none transition-all duration-500 group">
            <button onClick={startListening} className="p-4 text-slate-400 hover:text-amber-500 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full active:scale-90">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
            </button>
            <input
              className="flex-1 bg-transparent border-none outline-none py-4 px-3 text-[15px] md:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium"
              placeholder="Consult with CogniLex AI..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} className="bg-amber-600 hover:bg-amber-500 text-white w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg shadow-amber-600/30 active:scale-95 group-hover:rotate-12">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
