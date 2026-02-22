'use client';

import type { Message } from '@/lib/types';
import CitationBubble from './CitationBubble';


interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-white shadow-md text-gray-900 border border-gray-200'
        }`}
      >
        <p className="text-sm md:text-base whitespace-pre-wrap">{message.text}</p>
        
        {message.citation && <CitationBubble citation={message.citation} />}
        
        <p className="text-xs mt-2 opacity-70">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
