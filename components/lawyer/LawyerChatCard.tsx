'use client';

import { useState } from 'react';
import { MessageSquare, Send, Sparkles, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LawyerChatCardProps {
  lawyerId: string;
  lawyerName: string;
}

export default function LawyerChatCard({ lawyerId, lawyerName }: LawyerChatCardProps) {
  const [question, setQuestion] = useState('');
  const router = useRouter();

  const handleStartChat = () => {
    if (!question.trim()) return;
    
    // For now, we redirect to the main chat with a pre-filled question about this lawyer
    // or we could have a specific 'lawyer-context' chat mode in the future.
    const encodedQuestion = encodeURIComponent(`I am interested in ${lawyerName}. ${question}`);
    router.push(`/chat?q=${encodedQuestion}&context=lawyer&lawyerId=${lawyerId}`);
  };

  const quickQuestions = [
    "What are their main practice areas?",
    "Is this lawyer experienced in criminal law?",
    "Can you summarize their professional bio?"
  ];

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-xl hover:border-amber-300 group">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">AI Lawyer Assistant</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Get instant insights about {lawyerName}</p>
          </div>
        </div>

        <div className="relative mb-6">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Ask anything about ${lawyerName}'s expertise...`}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-5 pr-14 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all min-h-[120px] resize-none"
          />
          <button
            onClick={handleStartChat}
            disabled={!question.trim()}
            className="absolute bottom-4 right-4 p-3 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-900/20 hover:bg-amber-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 text-left">Quick Inquiries</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuestion(q)}
                className="px-4 py-2 bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700 rounded-xl text-[11px] font-bold transition-all border border-transparent hover:border-amber-200"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <UserCheck className="w-3.5 h-3.5 text-amber-500" />
          Powered by CogniLex RAG
        </div>
        <button 
           onClick={() => router.push('/chat')}
           className="text-[11px] font-black text-amber-600 hover:text-amber-700 uppercase tracking-widest flex items-center gap-1"
        >
          Open Full Chat <MessageSquare className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
