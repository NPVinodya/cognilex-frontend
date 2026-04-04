import { useState, useRef } from "react";
import axios from "axios";

export default function SettingsModal({
  onClose,
  activeTab,
  setActiveTab,
  currentUser,
  onUpdateUser
}: {
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser?: { name: string; email: string; userrole: string; preferences?: { appearance: string; language: string } } | null;
  onUpdateUser?: (user: any) => void;
}) {
  const [name, setName] = useState(currentUser?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [appearance, setAppearance] = useState(currentUser?.preferences?.appearance || "Dark Mode");
  const [language, setLanguage] = useState(currentUser?.preferences?.language || "English (US)");
  
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>((currentUser as any)?.avatar_url || null);
  const [showImageModal, setShowImageModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview only
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };
  
  const handleSaveProfile = async () => {
    if (!currentUser?.email) return;
    setIsSavingProfile(true);
    let avatarUrl = (currentUser as any)?.avatar_url;

    try {
      // 1. Upload to R2 if a new file is selected
      if (selectedFile) {
        setIsUploadingAvatar(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("email", currentUser.email);

        const res = await axios.post("/api/user/avatar/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        avatarUrl = res.data.avatar_url;
        setIsUploadingAvatar(false);
      }

      // 2. Save profile (name + avatarUrl)
      await axios.patch("/api/user/profile", {
        email: currentUser.email,
        name,
        avatar_url: avatarUrl // Assuming the backend profile endpoint is updated to accept this
      });

      if (onUpdateUser) {
        onUpdateUser({ ...currentUser, name, avatar_url: avatarUrl });
      }
      setSelectedFile(null); // Clear pending file
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
      setIsUploadingAvatar(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser?.email) return;
    if (!window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.")) {
      return;
    }

    try {
      await axios.delete(`/api/user/profile/delete?email=${encodeURIComponent(currentUser.email)}`);
      alert("Your account has been permanently deleted.");
      localStorage.clear();
      window.location.href = "/"; // Redirect to landing
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete account.");
    }
  };

  const handleSavePassword = async () => {
    if (!currentUser?.email || !currentPassword || !newPassword) return;
    setIsSavingPassword(true);
    try {
      await axios.patch("/api/user/password", {
        email: currentUser.email,
        currentPassword,
        newPassword
      });
      alert("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!currentUser?.email) return;
    setIsSavingPreferences(true);
    try {
      await axios.patch("/api/user/preferences", {
        email: currentUser.email,
        appearance,
        language
      });
      if (onUpdateUser) {
        onUpdateUser({ ...currentUser, preferences: { appearance, language } });
      }
      alert("Preferences updated successfully!");
      // Optionally apply dark mode to document here if appearance changes
      if (appearance === "Dark Mode") document.documentElement.classList.add("dark");
      if (appearance === "Light Mode") document.documentElement.classList.remove("dark");
    } catch (err: any) {
      let errorMsg = err.response?.data?.message || err.response?.data || err.message;
      if (typeof errorMsg === 'string' && errorMsg.includes("<!DOCTYPE html>")) {
        errorMsg = "System Error: API Route Not Found. Please restart your Next.js server!";
      }
      alert("Error Details: " + (typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg));
    } finally {
      setIsSavingPreferences(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] w-full max-w-2xl h-[540px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-52 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col bg-slate-50 dark:bg-slate-900">
            <button onClick={onClose} className="mb-6 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition w-fit bg-slate-200 dark:bg-slate-800/50 hover:bg-slate-300 dark:hover:bg-slate-800 rounded-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <nav className="space-y-1">
              {["General", "Notifications", "Personalization", "Security", "Account", "Apps & Data"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-wide transition ${activeTab === tab ? "bg-amber-100 dark:bg-slate-800 text-amber-600 dark:text-amber-500 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/50"}`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 p-8 overflow-y-auto no-scrollbar bg-white dark:bg-slate-900">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-8 tracking-tight">{activeTab}</h2>
            
            {activeTab === "General" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
                  <div>
                    <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">Appearance</span>
                    <span className="text-[11px] text-slate-500">Choose your interface theme</span>
                  </div>
                  <select value={appearance} onChange={e => setAppearance(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-amber-500/50 transition">
                    <option>System Default</option><option>Dark Mode</option><option>Light Mode</option>
                  </select>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
                  <div>
                    <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">Language</span>
                    <span className="text-[11px] text-slate-500">Primary display language</span>
                  </div>
                  <select value={language} onChange={e => setLanguage(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-amber-500/50 transition">
                    <option>English (US)</option><option>Sinhala</option><option>Tamil</option>
                  </select>
                </div>
                <div className="pt-2">
                  <button onClick={handleSavePreferences} disabled={isSavingPreferences} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition">
                    {isSavingPreferences ? "Saving..." : "Save Preferences"}
                  </button>
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
                  <div key={i} className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
                    <div>
                      <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
                      <span className="text-[11px] text-slate-500">{item.desc}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i === 0} />
                      <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Personalization" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
                  <div>
                    <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">Chat Bubble Density</span>
                    <span className="text-[11px] text-slate-500">Adjust the spacing in legal chats</span>
                  </div>
                  <select className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-amber-500/50 transition">
                    <option>Comfortable</option><option>Compact</option>
                  </select>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
                  <div>
                    <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">Typography Scale</span>
                    <span className="text-[11px] text-slate-500">Make text larger or smaller</span>
                  </div>
                  <select className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-amber-500/50 transition">
                    <option>Normal (14px)</option><option>Large (16px)</option><option>Extra Large (18px)</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === "Security" && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-5 space-y-4">
                  <div>
                    <span className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Update Password</span>
                    <span className="text-[11px] text-slate-500">Ensure your account is using a long, random password</span>
                  </div>
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current Password" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-amber-500/50" />
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-amber-500/50" />
                  <button onClick={handleSavePassword} disabled={isSavingPassword} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 transition">
                    {isSavingPassword ? "Saving..." : "Save Password"}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">Two-Factor Auth (2FA)</span>
                    <span className="text-[11px] text-slate-500">Add an extra layer of security</span>
                  </div>
                  <button className="px-3 py-1.5 bg-amber-600/20 text-amber-500 hover:bg-amber-600/30 text-xs font-bold rounded border border-amber-500/30 transition">Enable</button>
                </div>
              </div>
            )}

            {activeTab === "Account" && (
              <div className="space-y-6">
                <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <div 
                        onClick={() => previewUrl && setShowImageModal(true)}
                        className={`w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xl text-amber-500 font-bold border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-inner ${previewUrl ? 'cursor-pointer hover:border-amber-500 transition-all' : ''}`}
                      >
                        {previewUrl ? (
                          <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover transition transform group-hover:scale-110" />
                        ) : (
                          currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"
                        )}
                      </div>
                      {isUploadingAvatar && (
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleAvatarUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()} 
                        disabled={isUploadingAvatar}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded border border-slate-200 dark:border-slate-700 transition disabled:opacity-50"
                      >
                        {isUploadingAvatar ? "Uploading..." : "Upload Image"}
                      </button>
                      <p className="text-[10px] text-slate-500 mt-1">JPG, PNG or GIF. Max 5MB.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white outline-none focus:border-amber-500/50" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Email Address</label>
                    <input type="email" value={currentUser?.email || ""} readOnly className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-lg px-3 py-2 text-sm outline-none opacity-70 cursor-not-allowed" />
                  </div>
                  <div className="pt-2">
                    <button onClick={handleSaveProfile} disabled={isSavingProfile} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition">
                      {isSavingProfile ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
                <div>
                  <button 
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-bold rounded-lg border border-rose-500/30 transition disabled:opacity-50"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {activeTab === "Apps & Data" && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                  <span className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Export Chat History</span>
                  <span className="text-[11px] text-slate-500 max-w-sm block mb-4">Download all your legal consultations and AI answers as a secure PDF or CSV file.</span>
                  <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 transition flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    Download Archive
                  </button>
                </div>
                <div>
                  <span className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Connected Services</span>
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl mb-2">🔌</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">No external apps connected</span>
                    <span className="text-[10px] text-slate-500 mt-1">Connect calendar or firm management tools later.</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      
      {/* Larger Image Preview Modal */}
      {showImageModal && previewUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <button onClick={() => setShowImageModal(false)} className="absolute top-8 right-8 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <div className="max-w-4xl max-h-full overflow-hidden rounded-3xl shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
            <img src={previewUrl} alt="Large Avatar" className="w-full h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
