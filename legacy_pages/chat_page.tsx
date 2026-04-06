"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import page from "@/app/page";
import SettingsModal from "@/components/chat/SettingsModal";
import CorporatePlanModal from "@/components/chat/CorporatePlanModal";
import SupportDeskModal from "@/components/chat/SupportDeskModal";
import { API_BASE_URL } from "@/lib/constants";
import { account } from "@/lib/appwrite";

export default function CogniLexAI() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isVoiceOn, setIsVoiceOn] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");
  const [stats, setStats] = useState<any>(null);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("General");
  const [showCorporatePlan, setShowCorporatePlan] = useState(false);
  const [showSupportDesk, setShowSupportDesk] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; userrole: string; avatar_url?: string; preferences?: { appearance: string; language: string } } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const BASE_URL = "https://unbonneted-stratagemical-hal.ngrok-free.dev";


  // --- Voice Controls ---
  const speak = (text: string) => {
    if (!isVoiceOn) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => window.speechSynthesis.cancel();

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported");
    const recognition = new SpeechRecognition();
    recognition.onresult = (e: any) => setQuestion(e.results[0][0].transcript);
    recognition.start();
  };

  // --- Fetch Analytics ---
  const fetchStats = async () => {
    try {
      const res = await fetch(`${BASE_URL}/get-analytics`, {
        headers: { "ngrok-skip-browser-warning": "69420" }
      });
      const data = await res.json();
      setStats(data.stats);
      setActiveTab("dashboard");
    } catch (err) {
      alert("Could not fetch analytics");
    }
  };

  // --- Load Logged-in User ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncUserFromStorageAndMongo = async () => {
      let isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
      let storedUser = localStorage.getItem("user");

      // OAuth redirects can arrive with Appwrite session cookie but without local storage.
      if (!isAuthenticated || !storedUser) {
        try {
          const appwriteUser = await account.get();

          // Upsert this OAuth user into MongoDB so they have a proper record with role="user".
          let mongoUser: any = null;
          try {
            const oauthRes = await fetch(`${API_BASE_URL}/register-oauth`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                appwrite_id: appwriteUser.$id,
                email: appwriteUser.email,
                name: appwriteUser.name || appwriteUser.email,
              }),
            });
            if (oauthRes.ok) {
              const oauthData = await oauthRes.json();
              mongoUser = oauthData?.user ?? null;
            }
          } catch {
            // Backend unavailable — fall back to Appwrite-only data.
          }

          const seedUser = {
            ...appwriteUser,
            ...mongoUser,
            role: mongoUser?.role || "user",
            userrole: (mongoUser?.role || "user").toLowerCase(),
          };
          localStorage.setItem("user", JSON.stringify(seedUser));
          localStorage.setItem("isAuthenticated", "true");

          try {
            const jwt = await account.createJWT();
            localStorage.setItem("accessToken", jwt.jwt);
            localStorage.setItem("tokenType", "Bearer");
            document.cookie = `isAuthenticated=true; Path=/; Max-Age=604800; SameSite=Lax`;
            document.cookie = `accessToken=${encodeURIComponent(jwt.jwt)}; Path=/; Max-Age=604800; SameSite=Lax`;
          } catch {
            // Appwrite session cookie is enough to keep route access when JWT cannot be created.
          }

          isAuthenticated = true;
          storedUser = localStorage.getItem("user");
        } catch {
          router.push("/login");
          return;
        }
      }


      try {
        const parsed = JSON.parse(storedUser ?? "{}");
        const email = parsed?.email || "";

        let mongoUser: any = null;
        if (email) {
          try {
            const response = await fetch(`${API_BASE_URL}/user/${encodeURIComponent(email)}`);
            if (response.ok) {
              mongoUser = await response.json();
            }
          } catch (fetchError) {
            console.error("Failed to fetch MongoDB user data", fetchError);
          }
        }

        const mergedUser = {
          ...parsed,
          ...mongoUser,
          role: mongoUser?.role || parsed?.role || parsed?.userrole || "user",
          userrole: (mongoUser?.role || parsed?.role || parsed?.userrole || "user").toLowerCase(),
          preferences: mongoUser?.preferences || parsed?.preferences || { appearance: "Dark Mode", language: "English (US)" },
        };

        localStorage.setItem("user", JSON.stringify(mergedUser));

        const currentAppearance = mergedUser.preferences?.appearance || "Dark Mode";
        setCurrentUser({
          name: mergedUser.name || mergedUser.email || "User",
          email: mergedUser.email || "",
          userrole: mergedUser.userrole,
          avatar_url: mergedUser.avatar_url,
          preferences: mergedUser.preferences,
        });

        if (currentAppearance === "Dark Mode" || currentAppearance === "System Default") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch (parseError) {
        console.error("Failed to read session user", parseError);
        router.push("/login");
      }
    };

    syncUserFromStorageAndMongo();
  }, [router]);

  const getUserInitials = (name?: string, email?: string) => {
    const source = name || email || "User";
    const parts = source.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("tokenType");

      // Crucial: Clear cookies so the middleware proxy knows you are logged out
      document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    setCurrentUser(null);
    router.push("/login");
  };

  // --- Handle PDF Upload ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessages(prev => [...prev, { role: "user", content: `📁 Analyzing Document: ${file.name}`, time: "Now" }]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/summarize-case`, {
        method: "POST",
        body: formData,
        headers: { "ngrok-skip-browser-warning": "69420" },
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", content: data.summary, time: "Now" }]);
      speak(data.summary);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", content: "Error analyzing the PDF file." }]);
    } finally {
      setLoading(false);
      setActiveTab("chat");
    }
  };

  // --- Handle Chat Send ---
  const handleSend = async () => {
    if (!question.trim()) return;
    const userMsg = { role: "user", content: question, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setQuestion("");
    stopSpeaking();

    try {
      const res = await fetch(`${BASE_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "69420" },
        body: JSON.stringify({ question: userMsg.content }),
      });
      const data = await res.json();
      const botMsg = { role: "bot", content: data.answer, time: "Now" };
      setMessages(prev => [...prev, botMsg]);
      speak(data.answer);
    } catch (e) {
      setMessages(prev => [...prev, { role: "bot", content: "Backend Connection Failed." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-hidden font-sans relative">

      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? "w-80" : "w-0"} bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-500 flex flex-col`}>
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-md border border-slate-200/50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                <path d="M7 21h10" />
                <path d="M12 3v18" />
                <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-50 dark:to-amber-200 bg-clip-text text-transparent">CogniLex AI</h1>
          </div>

          <button onClick={() => { setMessages([]); setActiveTab("chat"); }} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition mb-6 text-sm font-medium text-slate-700 dark:text-white">
            <span className="text-lg">+</span> New Consultation
          </button>

          <nav className="space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2">Navigation</p>

            <div onClick={() => setActiveTab("chat")} className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition ${activeTab === 'chat' ? 'bg-amber-100 dark:bg-amber-600/10 border border-amber-300 dark:border-amber-500/20 text-amber-600 dark:text-amber-500' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 border border-transparent'}`}>
              <span className="text-lg">💬</span>
              <span className="text-sm font-medium">Legal Chat</span>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 mb-3">Professional Network</p>

              <div
                onClick={() => router.push('/lawyer')}
                className="p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl flex items-center gap-3 cursor-pointer transition group border border-transparent hover:border-amber-500/30 mb-3"
              >
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-lg shadow-sm dark:shadow-lg group-hover:scale-110 transition">
                  ⚖️
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-300">Find Lawyer</p>
                  <p className="text-[10px] text-slate-500 tracking-tight">Directory of verified experts</p>
                </div>
              </div>

              <div
                onClick={() => {
                  if (currentUser?.userrole === 'lawyer') {
                    router.push('/lawyerDashboard')
                  } else {
                    router.push('/lawyerRegistation')
                  }
                }}

                className="p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl flex items-center gap-3 cursor-pointer transition group border border-transparent hover:border-slate-300 dark:hover:border-slate-500/30"
              >
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-lg shadow-sm dark:shadow-lg group-hover:scale-110 transition">
                  {currentUser?.userrole === 'lawyer' ? '🏛️' : '🎓'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-300">
                    {currentUser?.userrole === 'lawyer' ? 'Lawyer Dashboard' : 'Join Platform'}
                  </p>
                  <p className="text-[10px] text-slate-500 tracking-tight">
                    {currentUser?.userrole === 'lawyer' ? 'Manage your legal practice' : 'Register your legal practice'}
                  </p>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 relative">
          {showUserMenu && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 duration-200">
              <div className="p-3 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700">
                <div className="w-8 h-8 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-[10px] text-amber-500 border border-slate-200 dark:border-slate-700 font-bold overflow-hidden">
                  {currentUser?.avatar_url ? (
                    <img src={currentUser.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    getUserInitials(currentUser?.name, currentUser?.email)
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white leading-none">{currentUser?.name || "User"}</p>
                  <p className="text-[10px] text-slate-400 my-0.5">{currentUser?.email || ""}</p>
                  <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-amber-500/20 text-amber-500 text-[9px] font-bold rounded border border-amber-500/30 uppercase tracking-widest">
                    {currentUser?.userrole}
                  </span>
                </div>
              </div>
              <div className="p-1.5 space-y-0.5">
                <button onClick={() => { setShowCorporatePlan(true); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition text-[11px] text-slate-700 dark:text-slate-300">
                  <span className="text-sm">✨</span> Corporate Plan
                </button>
                <button onClick={() => { setShowSettings(true); setActiveSettingsTab("General"); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition text-[11px] text-slate-700 dark:text-slate-300">
                  <span className="text-sm">⚙️</span> Platform Settings
                </button>
              </div>
              <div className="p-1.5 border-t border-slate-100 dark:border-slate-700">
                <button onClick={() => { setShowSupportDesk(true); setShowUserMenu(false); }} className="w-full flex items-center justify-between gap-3 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition text-[11px] text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-3"><span>🎧</span> Support Desk</span>
                  <span>›</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-rose-500/10 rounded-lg transition text-[11px] text-rose-500 dark:text-rose-400 mt-1"
                >
                  <span className="text-sm">🚪</span> Secure Log Out
                </button>
              </div>
            </div>
          )}

          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-2 py-1.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            <div className="relative">
              <div className="w-9 h-9 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-amber-500 font-bold text-xs shadow-sm dark:shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                {currentUser?.avatar_url ? (
                  <img src={currentUser.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  getUserInitials(currentUser?.name, currentUser?.email)
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-white truncate leading-tight">{currentUser?.name || "User"}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mb-1">{currentUser?.email || ""}</p>
              <span className="inline-block px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-bold rounded-full border border-slate-300 dark:border-slate-700 uppercase tracking-widest shadow-sm">
                {currentUser?.userrole}
              </span>
            </div>
            <button className="px-3 py-1 bg-amber-600 text-white text-[10px] font-bold rounded-full hover:bg-amber-700 transition shrink-0 shadow-sm border border-amber-700">
              Upgrade
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col relative bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950">

        {/* Settings Modal */}
        {showSettings && (
          <SettingsModal
            onClose={() => setShowSettings(false)}
            activeTab={activeSettingsTab}
            setActiveTab={setActiveSettingsTab}
            currentUser={currentUser}
            onUpdateUser={(updatedUser) => {
              setCurrentUser(updatedUser);
              const storedUser = localStorage.getItem("user");
              if (storedUser) {
                const parsed = JSON.parse(storedUser);
                localStorage.setItem("user", JSON.stringify({ ...parsed, ...updatedUser }));
              }
            }}
          />
        )}

        {/* Corporate Plan Modal */}
        {showCorporatePlan && (
          <CorporatePlanModal onClose={() => setShowCorporatePlan(false)} />
        )}

        {/* Support Desk Modal */}
        {showSupportDesk && (
          <SupportDeskModal onClose={() => setShowSupportDesk(false)} />
        )}


        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800/50 backdrop-blur-md bg-white/80 dark:bg-slate-900/40 z-10">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition text-slate-400 font-bold text-xl">☰</button>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsVoiceOn(!isVoiceOn)} className={`text-xl transition-all hover:scale-110 ${isVoiceOn ? "text-amber-500" : "text-slate-600"}`}>{isVoiceOn ? "🔊" : "🔇"}</button>
              <button onClick={stopSpeaking} className="text-[10px] bg-rose-900/20 border border-rose-500/30 px-3 py-1 rounded-full text-rose-400 hover:bg-rose-500/40 transition font-bold uppercase tracking-wider">Halt Audio</button>
            </div>
          </div>
        </header>

        {/* CHAT AREA */}
        {activeTab === "chat" ? (
          <>
            <div className="flex-1 overflow-y-auto px-6 md:px-24 py-10 space-y-8">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-700">
                  <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center text-3xl mb-6 border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-[0_0_50px_rgba(217,119,6,0.05)] text-amber-500">⚖️</div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">CogniLex Legal Assistant</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md text-center">Secure AI intelligence tailored for Sri Lankan jurisprudence. Formulate your inquiry below.</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[85%] p-5 rounded-[2rem] ${msg.role === 'user' ? 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white rounded-br-none shadow-md object-none' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-none shadow-md'}`}>
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-light tracking-wide text-justify">{msg.content}</p>
                  </div>
                  <span className="text-[9px] mt-2 text-slate-600 font-bold px-2 uppercase tracking-tighter">{msg.time}</span>
                </div>
              ))}
              <div ref={scrollRef} />
              {loading && (
                <div className="flex items-center gap-3 text-amber-500 text-[11px] font-bold animate-pulse px-2 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div> Synthesizing Legal Response...
                </div>
              )}
            </div>

            <div className="px-6 md:px-32 pb-8 pt-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-full p-2 flex items-center gap-2 focus-within:border-amber-500/50 shadow-xl dark:shadow-2xl transition-all duration-300">
                <button onClick={startListening} className="p-3 text-slate-400 hover:text-amber-500 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                </button>
                <input className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500" placeholder="State your legal inquiry or scenario..." value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
                <button onClick={handleSend} className="bg-amber-600 hover:bg-amber-500 text-white p-3 rounded-full transition shadow-lg active:scale-95 group">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-10 md:px-20 animate-in fade-in slide-in-from-right-5 duration-500 text-center flex flex-col items-center justify-center">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">System Analytics</h2>
            <p className="text-slate-500 mb-8 max-w-sm">Review platform activity metrics</p>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 w-full">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl flex flex-col items-center">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Queries</p>
                <p className="text-4xl font-black text-slate-800 dark:text-white">{stats?.total_queries || 0}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl flex flex-col items-center">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Active Users</p>
                <p className="text-4xl font-black text-slate-800 dark:text-white">{stats?.active_users || 0}</p>
              </div>
            </div>
            <button onClick={() => setActiveTab("chat")} className="bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-8 py-3 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition text-sm font-bold text-slate-800 dark:text-white shadow-md">Return to Session</button>
          </div>
        )}
      </main>
    </div>
  );
}