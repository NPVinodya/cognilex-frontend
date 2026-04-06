export default function CorporatePlanModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full transition z-10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
        
        <div className="p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-amber-500/10 to-transparent"></div>
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-500 text-xs font-black uppercase tracking-widest rounded-full border border-amber-500/20 mb-4">Pricing Plans</span>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-4">Platform Access</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">Review your current subscription status and available platform features.</p>
          </div>
        </div>

        <div className="px-10 pb-12 flex justify-center relative z-10">
          {/* Free Plan */}
          <div className="bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-[2rem] p-10 flex flex-col w-full max-w-md shadow-sm">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Free Plan</h3>
              <p className="text-5xl font-black text-amber-600 dark:text-white">$0<span className="text-lg text-slate-400 font-normal">/mo</span></p>
              <p className="text-sm text-slate-500 mt-2 italic">Standard community access</p>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {["50 chats per month", "Standard context window", "Basic document analysis", "Community support", "Data encryption"].map((ft, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <svg className="text-amber-500" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  {ft}
                </li>
              ))}
            </ul>
            <button disabled className="w-full py-4 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-bold border border-slate-300 dark:border-slate-700 cursor-default">
              Active Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
