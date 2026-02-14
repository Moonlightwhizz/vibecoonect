
import React, { useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
// Added missing ShieldCheck and MessageSquare icons to the lucide-react import list.
import { Send, ArrowLeft, Loader2, Users, Circle, Moon, MinusCircle, Settings, Type, Eye, Sparkles, UserCheck, ChevronDown, ChevronUp, ShieldCheck, MessageSquare } from 'lucide-react';
import { Room, Message, OnlineUser } from '../types';
import * as Engines from './RoomEngines';

interface Props {
  room: Room;
  messages: Message[];
  onlineUsers: OnlineUser[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
  userAvatar: string;
  isPeerChat?: boolean;
}

const ChatMessage = React.memo(({ 
  msg, 
  highContrast, 
  largeFont 
}: { 
  msg: Message, 
  highContrast: boolean, 
  largeFont: boolean 
}) => {
  if (msg.type === 'system') {
    return (
      <div className="flex justify-center my-6 animate-fadeIn">
        <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-500 shadow-inner">
          {msg.message}
        </div>
      </div>
    );
  }

  const bubbleClasses = useMemo(() => {
    const base = `px-5 py-4 rounded-[1.5rem] leading-relaxed shadow-lg transition-all duration-300 relative group overflow-hidden ${largeFont ? 'text-lg' : 'text-[15px]'}`;
    
    if (msg.isYou) {
      return highContrast 
        ? `${base} bg-white text-black font-black rounded-tr-none border-2 border-white` 
        : `${base} bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-none border border-white/10`;
    }
    
    if (msg.type === 'ai') {
      return highContrast
        ? `${base} bg-black border-2 border-indigo-400 text-indigo-300 font-black rounded-tl-none`
        : `${base} bg-indigo-950/40 border border-indigo-500/30 text-indigo-50 rounded-tl-none font-medium`;
    }

    return highContrast 
      ? `${base} bg-black border-2 border-white text-white rounded-tl-none font-bold` 
      : `${base} bg-slate-800/80 border border-white/10 rounded-tl-none text-gray-100 backdrop-blur-sm`;
  }, [msg.isYou, msg.type, highContrast, largeFont]);

  return (
    <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] animate-messageIn ${msg.isYou ? 'ml-auto flex-row-reverse' : ''}`}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-2xl relative border-2 ${msg.isYou ? 'border-indigo-400' : 'border-white/10'} ${highContrast ? 'bg-black border-white' : 'bg-slate-900'}`}>
        {msg.avatar}
        {!msg.isYou && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />}
      </div>
      <div className={`flex flex-col ${msg.isYou ? 'items-end' : 'items-start'}`}>
        <div className={bubbleClasses}>
           {msg.isStreaming && !msg.message ? (
             <div className="flex gap-1 py-1">
               <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
               <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
               <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
             </div>
           ) : msg.message}
        </div>
        <div className="flex items-center gap-2 mt-2 px-1">
           {!msg.isYou && (
             <span className={`text-[10px] font-black uppercase tracking-widest ${msg.type === 'ai' ? 'text-indigo-400' : 'text-pink-500'}`}>
               {msg.user} {msg.type === 'ai' && '[Host]'}
             </span>
           )}
           <span className="text-[9px] font-bold text-gray-600 uppercase">{msg.time}</span>
        </div>
      </div>
    </div>
  );
});

const ChatRoomView: React.FC<Props> = ({ room, messages, onlineUsers, onSendMessage, onBack, isPeerChat }) => {
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [largeFont, setLargeFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [showNode, setShowNode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => { 
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(() => { 
    if (!input.trim()) return; 
    onSendMessage(input); 
    setInput(''); 
  }, [input, onSendMessage]);

  const renderEngine = useMemo(() => {
    if (isPeerChat) return <Engines.VibeResonator />;
    switch(room.theme) {
      case 'quiet': return <Engines.ZenGarden />;
      case 'gaming': return <Engines.ReflexPulse />;
      case 'thoughtful': return <Engines.OracleDeck />;
      case 'artistic': return <Engines.PixelBoard />;
      case 'casual': return <Engines.VibeResonator />;
      case 'music': return <Engines.AudioVisualizer />;
      default: return null;
    }
  }, [room.theme, isPeerChat]);

  return (
    <div className="w-full flex-1 flex flex-col h-[calc(100vh-120px)] animate-fadeIn">
      {/* Dynamic Vibe Header */}
      <div className={`shrink-0 glass-card rounded-t-[3rem] p-6 border-b border-white/10 transition-all duration-500 overflow-hidden ${showNode ? 'max-h-[500px]' : 'max-h-[140px]'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
             <button onClick={onBack} className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <ArrowLeft size={20} />
             </button>
             <div>
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                  {room.name}
                  {isPeerChat && <ShieldCheck className="text-indigo-400 w-4 h-4" />}
                </h2>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  {isPeerChat ? 'Private Vibe Session' : `${Math.max(onlineUsers.length, 1)} Synchronized Souls`}
                </div>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button 
                onClick={() => setShowNode(!showNode)}
                className={`p-3 rounded-2xl transition-all border ${showNode ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
             >
                {showNode ? <ChevronUp size={20} /> : <Sparkles size={20} />}
             </button>
             <button 
               onClick={() => setShowSettings(!showSettings)}
               className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400"
             >
               <Settings size={20} />
             </button>
          </div>
        </div>
        
        {showNode && (
          <div className="h-[300px] mt-4 rounded-3xl bg-black/40 border border-white/5 relative overflow-hidden animate-slideDown">
             {renderEngine}
          </div>
        )}
      </div>

      {/* Social Stream (Chat Area) */}
      <div className={`flex-1 overflow-hidden relative flex flex-col bg-slate-950/40 border-x border-white/5 transition-all duration-300 ${highContrast ? 'bg-black' : ''}`}>
        
        {/* Settings Overlay */}
        {showSettings && (
          <div className="absolute top-4 right-6 w-56 glass-card rounded-2xl p-4 z-50 shadow-2xl animate-fadeIn border border-white/10">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 px-1">Readability</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setLargeFont(!largeFont)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${largeFont ? 'bg-indigo-600' : 'bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                  <Type size={16} />
                  <span className="text-xs font-bold">Large Font</span>
                </div>
              </button>
              <button 
                onClick={() => setHighContrast(!highContrast)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${highContrast ? 'bg-indigo-600' : 'bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                  <Eye size={16} />
                  <span className="text-xs font-bold">Contrast</span>
                </div>
              </button>
            </div>
            <button onClick={() => setShowSettings(false)} className="w-full mt-4 py-2 text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors">Close</button>
          </div>
        )}

        {/* Message List */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-10">
               <MessageSquare size={48} className="mb-4" />
               <p className="text-sm font-black uppercase tracking-widest">Beginning of the vibe stream...</p>
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              msg={msg} 
              highContrast={highContrast} 
              largeFont={largeFont} 
            />
          ))}
        </div>

        {/* Input Bar */}
        <div className={`p-6 border-t border-white/10 shrink-0 ${highContrast ? 'bg-black' : 'bg-slate-900/60'}`}>
          <div className="flex gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                  placeholder={room.placeholder || "Send a message..."} 
                  className={`w-full rounded-[1.8rem] pl-6 pr-14 py-5 outline-none transition-all text-[15px] shadow-inner ${
                    highContrast 
                    ? 'bg-black border-2 border-white text-white placeholder:text-gray-500' 
                    : 'bg-white/5 border border-white/10 focus:border-indigo-500/50 text-white placeholder:text-gray-500'
                  }`} 
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                </div>
            </div>
            <button 
              onClick={handleSend} 
              disabled={!input.trim()}
              className={`p-5 rounded-[1.5rem] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 ${
                highContrast ? 'bg-white text-black font-black' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
              }`}
            >
              <Send size={22} fill={highContrast ? 'black' : 'none'} />
            </button>
          </div>
          <p className="text-[9px] text-center mt-4 font-black uppercase tracking-[0.3em] text-gray-600">Vibe-Encrypted Channel</p>
        </div>
      </div>
      <div className="h-4 bg-indigo-600/20 rounded-b-[3rem] blur-xl -mt-4 opacity-50" />
    </div>
  );
};

export default ChatRoomView;
