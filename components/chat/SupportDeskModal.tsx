export default function SupportDeskModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl relative animate-in slide-in-from-right-10 duration-300">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-xl shadow-inner border border-slate-700">🎧</div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Support Desk</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">24/7 Assistance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">How can we help?</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 transition">
                <option>Billing & Subscriptions</option>
                <option>Technical Issue</option>
                <option>Feedback or Suggestion</option>
                <option>Account Management</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Describe your issue</label>
              <textarea rows={4} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 transition resize-none placeholder-slate-500" placeholder="Please provide details so our team can assist you effectively..."></textarea>
            </div>
          </div>
          
          <button className="w-full py-3.5 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition">Submit Request</button>
          
          <div className="pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">Prefer direct contact?</p>
            <p className="text-sm font-bold text-white mt-1">support@cognilex.ai</p>
          </div>
        </div>
      </div>
    </div>
  );
}
