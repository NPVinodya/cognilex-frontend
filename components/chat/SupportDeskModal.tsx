import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function SupportDeskModal({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState('Billing & Subscriptions');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async () => {
    if (!description.trim()) return;
    
    setStatus('loading');
    
    try {
      // Get user info from localStorage
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      const payload = {
        name: user?.name || 'Anonymous User',
        email: user?.email || 'no-email@cognilex.ai',
        phone: user?.phone || '',
        subject: `[SUPPORT] ${category}`,
        message: description
      };

      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to submit request');

      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Support submission error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

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
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          {status === 'success' ? (
            <div className="py-12 text-center animate-in zoom-in duration-500">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Request Submitted!</h3>
              <p className="text-sm text-slate-400">Our support team will get back to you shortly.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {status === 'error' && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>Failed to submit request. Please try again.</p>
                  </div>
                )}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">How can we help?</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 transition"
                  >
                    <option>Billing & Subscriptions</option>
                    <option>Technical Issue</option>
                    <option>Feedback or Suggestion</option>
                    <option>Account Management</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Describe your issue</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4} 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 transition resize-none placeholder-slate-500" 
                    placeholder="Please provide details so our team can assist you effectively..."
                  ></textarea>
                </div>
              </div>
              
              <button 
                onClick={handleSubmit}
                disabled={status === 'loading' || !description.trim()}
                className="w-full py-3.5 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Request</>}
              </button>
              
              <div className="pt-6 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-400">Prefer direct contact?</p>
                <p className="text-sm font-bold text-white mt-1">support@cognilex.ai</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
