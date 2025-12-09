import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { ChatService } from '../services/gemini';
import MarkdownRenderer from './MarkdownRenderer';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi! I'm your CS Study Buddy. Ask me anything about today's topics or other CS concepts.",
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatService = useRef<ChatService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat service once
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
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const modelMsgId = (Date.now() + 1).toString();
    // Add placeholder model message
    setMessages(prev => [...prev, {
      id: modelMsgId,
      role: 'model',
      text: '',
      isStreaming: true,
      timestamp: Date.now()
    }]);

    try {
      if (!chatService.current) chatService.current = new ChatService();
      
      const stream = await chatService.current.sendMessageStream(userMsg.text);
      let fullText = '';

      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === modelMsgId ? { ...msg, text: fullText } : msg
        ));
      }
      
      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId ? { ...msg, isStreaming: false } : msg
      ));

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId ? { ...msg, text: "Sorry, I encountered an error. Please try again.", isStreaming: false } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-primary hover:bg-blue-600'
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Interface Panel */}
      <div className={`fixed bottom-24 right-6 z-40 w-full max-w-md bg-card border border-gray-700 rounded-2xl shadow-2xl transition-all duration-300 origin-bottom-right flex flex-col ${
        isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10 pointer-events-none'
      }`}
      style={{ height: '600px', maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 bg-gray-800/50 rounded-t-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-white">CS Study Assistant</h3>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
              Powered by Gemini 3 Pro
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
              }`}>
                {msg.role === 'model' ? (
                   <div className="text-sm">
                      <MarkdownRenderer content={msg.text} />
                      {msg.isStreaming && <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse"/>}
                   </div>
                ) : (
                   <p className="text-sm">{msg.text}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/30 rounded-b-2xl">
          <form onSubmit={handleSendMessage} className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about complexity, design patterns..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-full py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-800 text-primary hover:text-white rounded-full hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatBot;