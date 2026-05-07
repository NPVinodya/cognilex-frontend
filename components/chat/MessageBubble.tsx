'use client';

import type { Message } from '@/lib/types';
import CitationBubble from './CitationBubble';
import ReactMarkdown from 'react-markdown';


interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 group animate-in slide-in-from-bottom-2 duration-300`}>
      <div
        className={`max-w-[85%] rounded-[1.5rem] px-5 py-4 shadow-2xl transition-all duration-300 ${isUser
          ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-tr-none border border-amber-400/20'
          : 'bg-white/10 backdrop-blur-xl text-white rounded-tl-none border border-white/20'
          }`}
      >
        <div className="text-white selection:bg-amber-500/30">
          <ReactMarkdown
            components={{
              strong: ({ ...props }) => <strong className="font-extrabold text-amber-400 bg-amber-500/10 px-1 rounded shadow-[0_1px_2px_rgba(0,0,0,0.2)]" {...props} />,
              p: ({ ...props }) => <p className="mb-3 last:mb-0 leading-relaxed font-inter" {...props} />,
              ul: ({ ...props }) => <ul className="list-disc pl-6 mb-3 space-y-2 font-inter marker:text-amber-500" {...props} />,
              ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-3 space-y-2 font-inter marker:text-amber-500" {...props} />,
              li: ({ ...props }) => <li className="pl-1" {...props} />,
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>

        {message.citation && <CitationBubble citation={message.citation} />}

        <div className={`flex items-center gap-2 text-[10px] mt-3 uppercase tracking-widest font-black ${isUser ? 'text-white/60' : 'text-white/40'}`}>
          <span>{isUser ? 'You' : 'CogniLex AI'}</span>
          <span>•</span>
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
}
