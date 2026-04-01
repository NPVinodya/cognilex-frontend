export default function CorporatePlanModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] w-full max-w-4xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition z-10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
        
        <div className="p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-amber-500/10 to-transparent"></div>
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-black uppercase tracking-widest rounded-full border border-amber-500/20 mb-4">Pricing Plans</span>
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">Elevate Your Practice</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Get unlimited legal queries, priority support, and document summaries to streamline your workflow.</p>
          </div>
        </div>

        <div className="px-10 pb-12 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* Basic Plan */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-[2rem] p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Standard</h3>
              <p className="text-4xl font-black text-white">$0<span className="text-lg text-slate-500 font-normal">/mo</span></p>
              <p className="text-sm text-slate-400 mt-2">Perfect for casual queries.</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {["50 chats per month", "Standard context window", "Basic document analysis", "Community support"].map((ft, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <svg className="text-slate-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {ft}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition">Current Plan</button>
          </div>

          {/* Corporate Plan */}
          <div className="bg-slate-800 border-2 border-amber-500 rounded-[2rem] p-8 flex flex-col shadow-[0_0_40px_rgba(245,158,11,0.1)] relative">
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="bg-amber-500 text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Most Popular</span>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">Corporate <span className="text-amber-500">✨</span></h3>
              <p className="text-4xl font-black text-white">$49<span className="text-lg text-slate-500 font-normal">/mo</span></p>
              <p className="text-sm text-slate-400 mt-2">For serious legal professionals.</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {["Unlimited AI consultations", "Extended context memory", "Priority response times", "Bulk document analysis", "Dedicated support manager"].map((ft, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                  <svg className="text-amber-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {ft}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-500 transition shadow-lg shadow-amber-900/40">Upgrade Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
