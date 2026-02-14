
import React, { useState } from 'react';
import { Sparkles, Zap, Palette, Heart } from 'lucide-react';
import { UserProfile } from '../types';
import { LOOKING_FOR_OPTIONS, INTEREST_OPTIONS } from '../constants';

interface Props {
  onStart: (profile: UserProfile) => void;
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
          <span className="text-sm font-semibold tracking-wider uppercase text-pink-300">Identity Synthesis</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
          Craft Your <span className="gradient-text">Vibe</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Your digital aura is the key to meaningful connections.
        </p>
      </div>

      <div className="glass-card rounded-[3rem] p-8 md:p-14 shadow-2xl relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Left Column: Basic Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Digital Alias</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What shall we call you?"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-lg outline-none focus:border-pink-500/50 transition-all placeholder:text-gray-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Soul Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="18+"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-lg outline-none focus:border-pink-500/50 transition-all placeholder:text-gray-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Your Essence (Bio)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What fuels your spirit? Tell the tribe about yourself..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-lg outline-none focus:border-pink-500/50 transition-all h-32 resize-none placeholder:text-gray-700"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Heart size={14} className="text-pink-500" /> Looking For
              </label>
              <div className="grid grid-cols-2 gap-3">
                {LOOKING_FOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => toggle(lookingFor, setLookingFor, opt.value)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-bold transition-all
                      ${lookingFor.includes(opt.value) 
                        ? 'bg-white text-black border-white shadow-lg' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                  >
                    <span className={lookingFor.includes(opt.value) ? 'text-black' : 'text-gray-500'}>
                      {/* FIX: Use specific type cast to avoid 'size' property error during React.cloneElement */}
                      {React.cloneElement(opt.icon as React.ReactElement<any>, { size: 18 })}
                    </span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Aesthetics & Interests */}
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Palette size={14} /> Aura Frequency
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['#EC4899', '#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'].map(color => (
                  <button
                    key={color}
                    onClick={() => setAuraColor(color)}
                    className={`h-16 rounded-2xl transition-all relative ${auraColor === color ? 'ring-4 ring-white shadow-2xl scale-105' : 'opacity-30 hover:opacity-60'}`}
                    style={{ backgroundColor: color }}
                  >
                    {auraColor === color && <div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Core Interests</label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => toggle(interests, setInterests, opt.key)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-xs font-black uppercase tracking-widest transition-all
                      ${interests.includes(opt.key) ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6 rounded-3xl bg-pink-500/5 border border-pink-500/10 mt-auto">
               <p className="text-sm text-pink-200/60 leading-relaxed italic text-center">
                 "Our AI will analyze your aura, bio, and quiz responses to build a unique social frequency just for you."
               </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleGo}
          className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-xl font-black shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
        >
          <Zap className="group-hover:animate-pulse" />
          SYNTHESIZE IDENTITY
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
