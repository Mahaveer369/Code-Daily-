import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { ChatService } from '../services/gemini';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatBotProps {
  isOpenExternal?: boolean;
  onToggleExternal?: (nextOpen: boolean) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpenExternal, onToggleExternal }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = typeof isOpenExternal === 'boolean' ? isOpenExternal : internalOpen;

  const setIsOpen = (next: boolean) => {
    setInternalOpen(next);
    if (onToggleExternal) onToggleExternal(next);
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi! I'm your CS & Systems Engineering Study Tutor. Ask me anything about C++20, Java 21, DSA complexity, System Design, or any of the 477 modules.",
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatService = useRef<ChatService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatService.current = new ChatService();
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const modelMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: modelMsgId,
        role: 'model',
        text: '',
        isStreaming: true,
        timestamp: Date.now(),
      },
    ]);

    try {
      if (!chatService.current) chatService.current = new ChatService();

      const stream = await chatService.current.sendMessageStream(userMsg.text);
      let fullText = '';

      for await (const chunk of stream) {
        fullText += chunk;
        setMessages((prev) =>
          prev.map((msg) => (msg.id === modelMsgId ? { ...msg, text: fullText } : msg))
        );
      }

      setMessages((prev) =>
        prev.map((msg) => (msg.id === modelMsgId ? { ...msg, isStreaming: false } : msg))
      );
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === modelMsgId
            ? {
                ...msg,
                text: 'Unable to reach the study tutor service right now. Please try again.',
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Desktop Floating Action Button (Hidden on < md mobile so it NEVER covers the Mobile Home Bottom Bar) */}
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close study tutor' : 'Open study tutor'}
        className={`hidden md:flex fixed bottom-5 left-5 z-40 h-10 px-3.5 rounded-xl shadow-xl border transition-all duration-200 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
          isOpen
            ? 'bg-rose-600 border-rose-400 text-white'
            : 'bg-[#0f172a]/95 hover:bg-slate-800 border-slate-700 text-emerald-400'
        }`}
      >
        {isOpen ? (
          <>
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-xs font-bold text-white">Close Tutor</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span className="text-xs font-bold text-slate-200">Study Tutor</span>
          </>
        )}
      </button>

      {/* Responsive Chat Interface Panel (Above bottom nav bar on mobile, anchored bottom-left on desktop) */}
      <div
        className={`fixed bottom-[68px] md:bottom-20 left-3 right-3 md:left-5 md:right-auto z-50 md:w-[400px] bg-[#111827] border border-slate-700/90 rounded-2xl shadow-2xl transition-all duration-200 origin-bottom-left flex flex-col ${
          isOpen
            ? 'scale-100 opacity-100 translate-y-0'
            : 'scale-95 opacity-0 translate-y-6 pointer-events-none'
        }`}
        style={{ height: '500px', maxHeight: 'calc(100dvh - 140px)' }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-800 bg-[#0b101b] rounded-t-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">CS &amp; Systems Study Tutor</h3>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>477-Module Engineering Assistant</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close Study Tutor"
            className="min-h-[32px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors shrink-0"
          >
            ✕ Close
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-[#0b101b] text-slate-200 rounded-bl-none border border-slate-800'
                }`}
              >
                {msg.role === 'model' ? (
                  <div className="text-xs sm:text-sm">
                    <MarkdownRenderer content={msg.text} />
                    {msg.isStreaming && (
                      <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse" />
                    )}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm">{msg.text}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-800 bg-[#0b101b] rounded-b-2xl">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              aria-label="Chat message"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about C++, Java 21, DSA, System Design..."
              className="flex-1 min-h-[40px] bg-[#131c2e] border border-slate-700/80 text-white text-xs sm:text-sm rounded-xl py-2 px-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="min-h-[40px] px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 shrink-0"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatBot;