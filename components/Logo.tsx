
import React from 'react';
import { Sparkles } from 'lucide-react';

/* Define props interface for Logo to include onClick and className */
interface LogoProps {
  className?: string;
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ className = "", onClick }) => {
  return (
    <div 
      className={`flex items-center gap-2 group cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 blur-md opacity-40 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform border border-white/20">
          <Sparkles className="text-white w-6 h-6" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-black tracking-tighter leading-none italic">
          VIBE<span className="text-pink-500">CONNECT</span>
        </span>
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-500">AI Synthesis</span>
      </div>
    </div>
  );
};

export default Logo;
