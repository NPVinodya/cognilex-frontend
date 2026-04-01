export default function SettingsModal({
  onClose,
  activeTab,
  setActiveTab
}: {
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] w-full max-w-2xl h-[540px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-52 border-r border-slate-800 p-4 flex flex-col bg-slate-900">
            <button onClick={onClose} className="mb-6 p-2 text-slate-400 hover:text-white transition w-fit bg-slate-800/50 hover:bg-slate-800 rounded-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <nav className="space-y-1">
              {["General", "Notifications", "Personalization", "Security", "Account", "Apps & Data"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-wide transition ${activeTab === tab ? "bg-slate-800 text-amber-500 shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
            <h2 className="text-2xl font-black text-white mb-8 tracking-tight">{activeTab}</h2>
            
            {activeTab === "General" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                  <div>
                    <span className="block text-sm font-bold text-slate-200">Appearance</span>
                    <span className="text-[11px] text-slate-500">Choose your interface theme</span>
                  </div>
                  <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-white outline-none focus:border-amber-500/50 transition">
                    <option>System Default</option><option>Dark Mode</option><option>Light Mode</option>
                  </select>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                  <div>
                    <span className="block text-sm font-bold text-slate-200">Language</span>
                    <span className="text-[11px] text-slate-500">Primary display language</span>
                  </div>
                  <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-white outline-none focus:border-amber-500/50 transition">
                    <option>English (US)</option><option>Sinhala</option><option>Tamil</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="space-y-6">
                {[
                  { title: "Email Summaries", desc: "Receive daily or weekly legal chat summaries" },
                  { title: "Browser Alerts", desc: "Get notified when a new consultation starts" },
                  { title: "Product Updates", desc: "News and new features from CogniLex" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-800 pb-5">
                    <div>
                      <span className="block text-sm font-bold text-slate-200">{item.title}</span>
                      <span className="text-[11px] text-slate-500">{item.desc}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i === 0} />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Personalization" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                  <div>
                    <span className="block text-sm font-bold text-slate-200">Chat Bubble Density</span>
                    <span className="text-[11px] text-slate-500">Adjust the spacing in legal chats</span>
                  </div>
                  <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-white outline-none focus:border-amber-500/50 transition">
                    <option>Comfortable</option><option>Compact</option>
                  </select>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                  <div>
                    <span className="block text-sm font-bold text-slate-200">Typography Scale</span>
                    <span className="text-[11px] text-slate-500">Make text larger or smaller</span>
                  </div>
                  <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-white outline-none focus:border-amber-500/50 transition">
                    <option>Normal (14px)</option><option>Large (16px)</option><option>Extra Large (18px)</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === "Security" && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-5 space-y-4">
                  <div>
                    <span className="block text-sm font-bold text-slate-200 mb-1">Update Password</span>
                    <span className="text-[11px] text-slate-500">Ensure your account is using a long, random password</span>
                  </div>
                  <input type="password" placeholder="Current Password" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500/50" />
                  <input type="password" placeholder="New Password" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500/50" />
                  <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg border border-slate-700 transition">Save Password</button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-sm font-bold text-slate-200">Two-Factor Auth (2FA)</span>
                    <span className="text-[11px] text-slate-500">Add an extra layer of security</span>
                  </div>
                  <button className="px-3 py-1.5 bg-amber-600/20 text-amber-500 hover:bg-amber-600/30 text-xs font-bold rounded border border-amber-500/30 transition">Enable</button>
                </div>
              </div>
            )}

            {activeTab === "Account" && (
              <div className="space-y-6">
                <div className="space-y-4 border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-xl text-amber-500 font-bold border-2 border-slate-700">US</div>
                    <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded border border-slate-700 transition">Upload Avatar</button>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Full Name</label>
                    <input type="text" defaultValue="prabani" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500/50" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Email Address</label>
                    <input type="email" defaultValue="prabani@gmail.com" readOnly className="w-full bg-slate-900 border border-slate-800 text-slate-500 rounded-lg px-3 py-2 text-sm outline-none opacity-70 cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <button className="px-4 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-bold rounded-lg border border-rose-500/30 transition">Delete Account</button>
                </div>
              </div>
            )}

            {activeTab === "Apps & Data" && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-5">
                  <span className="block text-sm font-bold text-slate-200 mb-1">Export Chat History</span>
                  <span className="text-[11px] text-slate-500 max-w-sm block mb-4">Download all your legal consultations and AI answers as a secure PDF or CSV file.</span>
                  <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg border border-slate-700 transition flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    Download Archive
                  </button>
                </div>
                <div>
                  <span className="block text-sm font-bold text-slate-200 mb-3">Connected Services</span>
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-800/20 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl mb-2">🔌</span>
                    <span className="text-xs font-bold text-slate-300">No external apps connected</span>
                    <span className="text-[10px] text-slate-500 mt-1">Connect calendar or firm management tools later.</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
