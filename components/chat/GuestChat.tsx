'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import MessageBubble from './MessageBubble';
import { MessageSquare, Send, FileText } from 'lucide-react';
import { GUEST_MESSAGE_LIMIT } from '@/lib/constants';

export default function GuestChat() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [guestMessageCount, setGuestMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const shouldPromptRegistration = guestMessageCount >= GUEST_MESSAGE_LIMIT;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || shouldPromptRegistration) return;
    
    // Add user message to UI
    const userMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setGuestMessageCount(prev => prev + 1);
    setInput('');
    setLoading(true);

    // Simulate response (replace with actual API call later)
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: 'This is a demo response. Connect to chatAPI to get actual responses.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 border-2 border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
          Try it now - No login required
        </h3>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Free Trial
        </span>
      </div>

      <div className="space-y-4 min-h-[300px] max-h-[500px] overflow-y-auto mb-6">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {shouldPromptRegistration && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 text-center">
            <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Enjoying LegalLK AI?
            </h4>
            <p className="text-gray-600 mb-4">
              Register now for unlimited questions, full citations, and access to our lawyer network
            </p>
            <button
              onClick={() => router.push('/register')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Continue with Free Registration
            </button>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about Sri Lankan law..."
            disabled={shouldPromptRegistration || loading}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          <button
            onClick={handleSend}
            disabled={shouldPromptRegistration || loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
           {loading ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div></>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        {!shouldPromptRegistration && (
          <p className="text-center text-sm text-gray-500">
            {GUEST_MESSAGE_LIMIT - guestMessageCount} free questions remaining
          </p>
        )}
      </div>
    </div>
  );
}

