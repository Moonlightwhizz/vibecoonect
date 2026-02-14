
import React, { useState } from 'react';
import { Zap, Brain, Headphones, Trash2, MousePointer2, Wind } from 'lucide-react';

export const ZenGarden = React.memo(() => {
  const [aura, setAura] = useState(0);
  const [status, setStatus] = useState('Silent');

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 space-y-8 animate-fadeIn">
      <div className="relative">
        <div className={`w-32 h-32 rounded-full border-2 border-green-500/20 flex items-center justify-center transition-all duration-1000 ${aura > 0 ? 'scale-125 bg-green-500/5' : ''}`}>
          <Wind className={`w-12 h-12 text-green-400 transition-opacity ${aura > 0 ? 'opacity-100' : 'opacity-20'}`} />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-black mb-2 tracking-tight">Silence Nurturer</h3>
        <p className="text-sm text-gray-400">Hold to meditate and heal the room's energy.</p>
      </div>
      <button 
        onMouseDown={() => { setAura(100); setStatus('Vibrating'); }}
        onMouseUp={() => { setAura(0); setStatus('Silent'); }}
        className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-all font-bold text-green-200"
      >
        Synchronize Breath
      </button>
      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500/50">{status}</div>
    </div>
  );
});

export const ReflexPulse = React.memo(() => {
  const [target, setTarget] = useState({ top: 50, left: 50 });
  const [score, setScore] = useState(0);
  const [active, setActive] = useState(false);

  const spawn = () => {
    setTarget({ 
      top: 15 + Math.random() * 70, 
      left: 15 + Math.random() * 70 
    });
  };

  const start = () => {
    setScore(0);
    setActive(true);
    spawn();
  };

  return (
    <div className="relative h-full w-full bg-black/40 rounded-[3rem] overflow-hidden border border-white/5">
      {!active ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center">
          <Zap className="w-16 h-16 text-blue-400 animate-pulse" />
          <h3 className="text-2xl font-black">Reflex Blitz</h3>
          <button onClick={start} className="px-10 py-4 rounded-2xl bg-blue-500 text-white font-black">PLAY</button>
        </div>
      ) : (
        <>
          <div className="absolute top-8 left-8 text-xs font-black text-blue-500">SYNC: {score}</div>
          <button 
            onClick={() => { setScore(s => s + 1); spawn(); }}
            className="absolute w-14 h-14 bg-blue-400 rounded-2xl shadow-xl flex items-center justify-center animate-bounce-slow"
            style={{ top: `${target.top}%`, left: `${target.left}%`, transform: 'translate(-50%, -50%)' }}
          >
            <MousePointer2 size={24} />
          </button>
          <button onClick={() => setActive(false)} className="absolute bottom-8 right-8 text-[10px] uppercase opacity-40">Stop</button>
        </>
      )}
    </div>
  );
});

export const OracleDeck = React.memo(() => {
  const [card, setCard] = useState<string | null>(null);
  const draw = () => {
    const prompts = [
      "What is a fear you've recently hugged?",
      "If your soul had a color today, what would it be?",
      "What's a secret you're ready to share?",
      "Which dream did you wake up from too early?"
    ];
    setCard(prompts[Math.floor(Math.random() * prompts.length)]);
  };
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-8 animate-fadeIn">
      <div className={`w-full max-w-[260px] aspect-[2/3.5] rounded-[3rem] border-4 border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-transparent flex flex-col items-center justify-center p-8 transition-all shadow-2xl ${card ? 'scale-105' : ''}`}>
        {card ? (
          <p className="text-lg font-bold italic text-white animate-fadeIn">"{card}"</p>
        ) : (
          <Brain className="w-12 h-12 text-pink-400 opacity-20" />
        )}
      </div>
      <button onClick={draw} className="px-8 py-4 rounded-2xl bg-pink-500 text-white font-black shadow-xl">Draw Soul Card</button>
    </div>
  );
});

export const PixelBoard = React.memo(() => {
  const [pixels, setPixels] = useState(Array(100).fill('#ffffff05'));
  const [color, setColor] = useState('#F59E0B');
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-950/20 rounded-[3rem]">
      <div className="grid grid-cols-10 gap-1 mb-8 bg-black/40 p-2 rounded-2xl">
        {pixels.map((p, i) => (
          <div 
            key={i} 
            onClick={() => { const n = [...pixels]; n[i] = color; setPixels(n); }}
            className="w-5 h-5 rounded-sm cursor-pointer hover:scale-125 transition-all"
            style={{ backgroundColor: p }}
          />
        ))}
      </div>
      <div className="flex gap-2">
        {['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#EF4444'].map(c => (
          <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full transition-all ${color === c ? 'scale-125 ring-2 ring-white' : 'opacity-40'}`} style={{ backgroundColor: c }} />
        ))}
        <button onClick={() => setPixels(Array(100).fill('#ffffff05'))} className="p-2 bg-white/5 rounded-lg"><Trash2 size={16} /></button>
      </div>
    </div>
  );
});

export const VibeResonator = React.memo(() => {
  const [val, setVal] = useState(70);
  return (
    <div className="h-full flex flex-col items-center justify-center p-12 space-y-12 animate-fadeIn">
      <div className="w-48 h-48 rounded-full border-8 border-white/5 flex items-center justify-center relative">
         <div className="absolute inset-0 rounded-full border-8 border-purple-500 transition-all duration-700" style={{ opacity: val/100, scale: String(0.8 + (val/200)) }} />
         <div className="text-4xl font-black z-10">{val}%</div>
      </div>
      <input type="range" value={val} onChange={(e) => setVal(parseInt(e.target.value))} className="w-full h-2 bg-white/10 rounded-full accent-purple-500 cursor-pointer" />
    </div>
  );
});

export const AudioVisualizer = React.memo(() => {
  const [active, setActive] = useState(false);
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 space-y-8 animate-fadeIn">
      <div onClick={() => setActive(!active)} className={`w-32 h-32 rounded-3xl border-2 border-red-500/20 flex items-center justify-center cursor-pointer transition-all ${active ? 'scale-110 shadow-xl' : ''}`}>
        <Headphones className={`w-12 h-12 text-red-500 ${active ? 'animate-bounce' : 'opacity-20'}`} />
      </div>
      <div className="flex items-end gap-1.5 h-24">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-2 bg-red-500/40 rounded-full" style={{ height: active ? `${20 + Math.random() * 80}%` : '5%' }} />
        ))}
      </div>
    </div>
  );
});
