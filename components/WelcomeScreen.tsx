
import React, { useState } from 'react';
import { Sparkles, Zap, Palette, Heart, User, Clock, PenTool } from 'lucide-react';
import { UserProfile } from '../types';
import { LOOKING_FOR_OPTIONS, INTEREST_OPTIONS } from '../constants';

interface Props {
  onStart: (profile: Omit<UserProfile, 'id'>) => void;
}

const WelcomeScreen: React.FC<Props> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [auraColor, setAuraColor] = useState('#EC4899');
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  const toggle = (list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleGo = () => {
    if (!name || !age || !bio || lookingFor.length === 0 || interests.length === 0) {
      alert("Every soul needs a complete profile! Please ensure you've filled out your name, age, bio, and selected at least one option for 'Looking For' and 'Interests'.");
      return;
    }
    onStart({ name, age, lookingFor, interests, bio, auraColor });
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-10 animate-fadeIn px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-4 mb-4 bg-white/5 px-6 py-2 rounded-full border border-white/10">
          <Sparkles className="text-pink-400 w-6 h-6" />
          <span className="text-sm font-semibold tracking-wider uppercase text-pink-300 font-bold">Identity Synthesis</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
          Craft Your <span className="gradient-text">Vibe</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
          Your digital aura is the key to meaningful connections.
        </p>
      </div>

      <div className="glass-card rounded-[3rem] p-8 md:p-14 shadow-2xl relative overflow-hidden border border-white/10">
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Left Column: Basic Info */}
          <div className="space-y-8">
            <div className="space-y-3 group">
              <label className="text-sm font-black text-indigo-300 uppercase tracking-[0.2em] ml-1 flex items-center gap-2 transition-colors group-focus-within:text-pink-400">
                <User size={16} /> Digital Alias
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What shall we call you?"
                className="w-full bg-white/10 border border-white/20 rounded-2xl p-5 text-lg text-white outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all placeholder:text-slate-500 font-semibold"
              />
            </div>

            <div className="space-y-3 group">
              <label className="text-sm font-black text-indigo-300 uppercase tracking-[0.2em] ml-1 flex items-center gap-2 transition-colors group-focus-within:text-pink-400">
                <Clock size={16} /> Soul Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Your earthly years (18+)"
                className="w-full bg-white/10 border border-white/20 rounded-2xl p-5 text-lg text-white outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all placeholder:text-slate-500 font-semibold"
              />
            </div>

            <div className="space-y-3 group">
              <label className="text-sm font-black text-indigo-300 uppercase tracking-[0.2em] ml-1 flex items-center gap-2 transition-colors group-focus-within:text-pink-400">
                <PenTool size={16} /> Your Essence (Bio)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What fuels your spirit? Tell the tribe about yourself..."
                className="w-full bg-white/10 border border-white/20 rounded-2xl p-5 text-lg text-white outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all h-40 resize-none placeholder:text-slate-500 font-medium leading-relaxed"
              />
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-sm font-black text-indigo-300 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Heart size={16} className="text-pink-500" /> Looking For
              </label>
              <div className="grid grid-cols-2 gap-3">
                {LOOKING_FOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    /* Fix: Corrected typo 'looking_for' to 'lookingFor' to match state variable */
                    onClick={() => toggle(lookingFor, setLookingFor, opt.value)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-bold transition-all
                      ${lookingFor.includes(opt.value) 
                        ? 'bg-white text-black border-white shadow-lg scale-[1.02]' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/30'}`}
                  >
                    <span className={lookingFor.includes(opt.value) ? 'text-black' : 'text-gray-500'}>
                      {React.cloneElement(opt.icon as React.ReactElement<any>, { size: 18 })}
                    </span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Aesthetics & Interests */}
          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-sm font-black text-indigo-300 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Palette size={16} /> Aura Frequency
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['#EC4899', '#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'].map(color => (
                  <button
                    key={color}
                    onClick={() => setAuraColor(color)}
                    className={`h-20 rounded-2xl transition-all relative border-2 ${auraColor === color ? 'border-white ring-4 ring-white/20 shadow-2xl scale-105' : 'border-transparent opacity-40 hover:opacity-80'}`}
                    style={{ backgroundColor: color }}
                  >
                    {auraColor === color && <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black text-indigo-300 uppercase tracking-[0.2em] ml-1">Core Interests</label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => toggle(interests, setInterests, opt.key)}
                    className={`flex items-center gap-3 px-5 py-3 rounded-xl border text-xs font-black uppercase tracking-widest transition-all
                      ${interests.includes(opt.key) 
                        ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/20' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 mt-auto">
               <p className="text-sm text-indigo-200/60 leading-relaxed italic text-center font-medium">
                 "Our AI maps your personality frequency through your bio and chosen aesthetics to synchronize you with the collective."
               </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleGo}
          className="w-full py-8 rounded-[2rem] bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-2xl font-black shadow-2xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 group mt-4"
        >
          <Zap className="group-hover:animate-pulse" fill="currentColor" />
          SYNTHESIZE IDENTITY
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
