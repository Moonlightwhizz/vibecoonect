
import React, { useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import { Send, ArrowLeft, Loader2, Users, Circle, Moon, MinusCircle, Settings, Type, Eye } from 'lucide-react';
import { Room, Message, OnlineUser } from '../types';
import * as Engines from './RoomEngines';

interface Props {
  room: Room;
  messages: Message[];
  onlineUsers: OnlineUser[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
  userAvatar: string;
}

// Optimized individual message component
const ChatMessage = React.memo(({ 
  msg, 
  highContrast, 
  largeFont 
}: { 
  msg: Message, 
  highContrast: boolean, 
  largeFont: boolean 
}) => {
  const bubbleClasses = useMemo(() => {
    const base = `px-5 py-3 rounded-2xl leading-relaxed shadow-sm transition-all duration-300 ${largeFont ? 'text-lg' : 'text-sm'}`;
    if (msg.isYou) {
      return highContrast 
        ? `${base} bg-white text-black font-black rounded-tr-none` 
        : `${base} bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none`;
    }
    return highContrast 
      ? `${base} bg-black border-2 border-white text-white rounded-tl-none font-bold` 
      : `${base} bg-white/5 border border-white/10 rounded-tl-none text-gray-100`;
  }, [msg.isYou, highContrast, largeFont]);

  return (
    <div className={`flex gap-3 max-w-[92%] animate-fadeIn ${msg.isYou ? 'ml-auto flex-row-reverse' : ''}`}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 shadow-lg relative border ${highContrast ? 'bg-black border-white' : 'bg-slate-900 border-white/10'}`}>
        {msg.avatar}
        {msg.isYou && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900" />}
      </div>
      <div className={msg.isYou ? 'text-right' : ''}>
        <div className={`${bubbleClasses} ${msg.isStreaming ? 'opacity-80' : 'opacity-100'}`}>
          {msg.message || (msg.isStreaming && <Loader2 className="animate-spin w-4 h-4" />)}
        </div>
        <div className="flex items-center gap-2 mt-1.5 px-1">
           {!msg.isYou && <span className={`text-[9px] font-black uppercase tracking-widest ${highContrast ? 'text-white' : 'text-pink-500/80'}`}>{msg.user}</span>}
           <span className={`text-[8px] uppercase font-black tracking-widest ${highContrast ? 'text-white/60' : 'text-gray-600'}`}>{msg.time}</span>
        </div>
      </div>
    </div>
  );
});

const StatusIcon = React.memo(({ status }: { status: OnlineUser['status'] }) => {
  switch (status) {
    case 'online': return <Circle size={8} className="text-green-500 fill-current animate-pulse" />;
    case 'away': return <Moon size={8} className="text-amber-500 fill-current" />;
    case 'busy': return <MinusCircle size={8} className="text-rose-500 fill-current" />;
    default: return null;
  }
});

const ChatRoomView: React.FC<Props> = ({ room, messages, onlineUsers, onSendMessage, onBack }) => {
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [largeFont, setLargeFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Use layout effect to ensure scrolling happens before browser paint for a smoother feel
  useLayoutEffect(() => { 
    if (scrollRef.current) {
      const isAtBottom = scrollRef.current.scrollHeight - scrollRef.current.scrollTop <= scrollRef.current.clientHeight + 100;
      if (isAtBottom) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: messages.length < 5 ? 'auto' : 'smooth'
        });
      }
    }
  }, [messages]);

  const handleSend = useCallback(() => { 
    if (!input.trim()) return; 
    onSendMessage(input); 
    setInput(''); 
  }, [input, onSendMessage]);

  const renderEngine = useMemo(() => {
    switch(room.theme) {
      case 'quiet': return <Engines.ZenGarden />;
      case 'gaming': return <Engines.ReflexPulse />;
      case 'thoughtful': return <Engines.OracleDeck />;
      case 'artistic': return <Engines.PixelBoard />;
      case 'casual': return <Engines.VibeResonator />;
      case 'music': return <Engines.AudioVisualizer />;
      default: return null;
    }
  }, [room.theme]);

  const containerClasses = useMemo(() => 
    `w-full lg:w-[480px] glass-card rounded-[3rem] overflow-hidden flex flex-col shadow-2xl transition-colors duration-300 ${highContrast ? 'bg-black border-2 border-white' : 'bg-white/2'}`,
    [highContrast]
  );

  const headerClasses = useMemo(() => 
    `px-8 py-6 border-b flex items-center justify-between shrink-0 transition-colors ${highContrast ? 'border-white bg-black' : 'border-white/10 bg-white/5'}`,
    [highContrast]
  );

  return (
    <div className="w-full flex-1 flex flex-col lg:flex-row gap-6 animate-fadeIn h-[calc(100vh-100px)] lg:overflow-hidden">
      {/* Interactive Experience Node */}
      <div className="flex-1 lg:flex-[1.2] glass-card rounded-[3rem] overflow-hidden flex flex-col shadow-2xl relative">
        <div className="absolute top-8 left-8 z-10 flex items-center gap-3">
           <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Live Synthesis</span>
           </div>
           
           <div className="flex -space-x-3 hover:space-x-1 transition-all">
             {onlineUsers.map((user, i) => (
               <div key={user.name + i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs relative group cursor-help">
                 {user.avatar}
                 <div className="absolute -bottom-0.5 -right-0.5"><StatusIcon status={user.status} /></div>
                 <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black text-[8px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    {user.name} ({user.status})
                 </div>
               </div>
             ))}
             {room.online > onlineUsers.length && (
                <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-black text-gray-400">
                  +{room.online - onlineUsers.length}
                </div>
             )}
           </div>
        </div>

        <div className="flex-1">{renderEngine}</div>
        
        <div className="p-8 md:p-10 border-t border-white/5 bg-white/2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-black mb-1">{room.name} Node</h4>
              <p className="text-xs text-gray-500 leading-relaxed max-w-lg">{room.description}</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-xl">
               <Users size={12} /> {room.online} Synced
            </div>
          </div>
        </div>
      </div>

      {/* Social Stream (Chat) */}
      <div className={containerClasses}>
        <header className={headerClasses}>
          <div className="flex items-center gap-4">
            <button onClick={onBack} className={`p-3 rounded-2xl transition-all border ${highContrast ? 'bg-black border-white hover:bg-white/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className={`text-lg font-black tracking-tight ${highContrast ? 'text-white' : ''}`}>{room.name}</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className={`text-[10px] font-black uppercase tracking-widest ${highContrast ? 'text-white' : 'text-gray-500'}`}>Sync Active</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-3 rounded-2xl transition-all border ${highContrast ? 'bg-black border-white hover:bg-white/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
              aria-label="Accessibility Settings"
            >
              <Settings size={18} />
            </button>
            
            {showSettings && (
              <div className={`absolute top-full right-0 mt-3 w-56 rounded-2xl p-4 z-50 shadow-2xl animate-fadeIn border ${highContrast ? 'bg-black border-white' : 'bg-slate-900 border-white/10'}`}>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 px-1">Readability</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setLargeFont(!largeFont)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${largeFont ? 'bg-indigo-600' : 'bg-white/5 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Type size={16} />
                      <span className="text-xs font-bold">Large Font</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${largeFont ? 'bg-white/20' : 'bg-white/10'}`}>
                       <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${largeFont ? 'right-1' : 'left-1'}`} />
                    </div>
                  </button>
                  <button 
                    onClick={() => setHighContrast(!highContrast)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${highContrast ? 'bg-indigo-600' : 'bg-white/5 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Eye size={16} />
                      <span className="text-xs font-bold">Contrast</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${highContrast ? 'bg-white/20' : 'bg-white/10'}`}>
                       <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${highContrast ? 'right-1' : 'left-1'}`} />
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Message List Rendering Optimized */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 scroll-smooth custom-scrollbar">
          {messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              msg={msg} 
              highContrast={highContrast} 
              largeFont={largeFont} 
            />
          ))}
        </div>

        <div className={`p-6 border-t shrink-0 transition-colors ${highContrast ? 'bg-black border-white' : 'bg-white/5 border-white/10'}`}>
          <div className="flex gap-3">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              placeholder={room.placeholder || "Send a vibe..."} 
              className={`flex-1 rounded-2xl px-5 py-4 outline-none transition-all text-sm ${highContrast ? 'bg-black border-2 border-white text-white placeholder:text-gray-400' : 'bg-slate-950/50 border border-white/10 focus:border-pink-500/50 placeholder:text-gray-600'}`} 
            />
            <button 
              onClick={handleSend} 
              disabled={!input.trim()}
              className={`p-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 ${highContrast ? 'bg-white text-black font-black border-2 border-white' : 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white'}`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomView;
