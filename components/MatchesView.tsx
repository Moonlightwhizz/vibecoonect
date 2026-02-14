
import React from 'react';
import { ArrowLeft, Star, Heart, MessageSquare } from 'lucide-react';
import { Match, PersonalityResult } from '../types';

interface Props {
  matches: Match[];
  result: PersonalityResult;
  onBack: () => void;
  onConnect: (match: Match) => void;
}

const MatchesView: React.FC<Props> = ({ matches, result, onBack, onConnect }) => {
  return (
    <div className="w-full space-y-10 animate-fadeIn py-6">
      <header className="flex items-center gap-6">
        <button 
          onClick={onBack}
          className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
        >
          <ArrowLeft />
        </button>
        <div>
          <h1 className="text-5xl font-black tracking-tight">Your Soul Tribe</h1>
          <p className="text-gray-400 font-medium">AI-matched connections based on <span className="text-pink-400 font-bold">{result.personalityType}</span> traits.</p>
        </div>
      </header>

      <div className="glass-card p-10 rounded-[2.5rem] bg-indigo-500/10 border-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0 p-6 rounded-3xl bg-indigo-500/20">
             <Star className="text-indigo-400 w-12 h-12" fill="currentColor" />
          </div>
          <div>
            <h3 className="text-2xl font-black mb-2 tracking-tight">Compatibility Insights</h3>
            <p className="text-lg text-indigo-100/80 leading-relaxed">
              Based on your unique vibe, we've identified souls that share your core values. 
              <strong> You connect best with:</strong> {result.bestConnections}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {matches.map((match) => (
          <div key={match.id} className="glass-card rounded-[2.5rem] p-10 flex flex-col items-center text-center hover:scale-[1.02] transition-all group relative">
            {match.online && (
              <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Online
              </div>
            )}
            
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl shadow-xl mb-6 transform group-hover:rotate-6 transition-transform">
              {match.avatar}
            </div>

            <h4 className="text-3xl font-black mb-1">{match.name}, {match.age}</h4>
            <p className="text-pink-400 text-sm font-bold tracking-widest uppercase mb-4">{match.type}</p>

            <div className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 mb-6 flex flex-col items-center">
              <div className="text-4xl font-black gradient-text">{match.vibeMatch}%</div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Synergy Match</div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {match.interests.map((int, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 group-hover:border-pink-500/30 transition-colors">
                  #{int}
                </span>
              ))}
            </div>

            <div className="w-full flex gap-3">
              <button 
                onClick={() => onConnect(match)}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-pink-500/20 transition-all"
              >
                <MessageSquare size={18} />
                Connect
              </button>
              <button className="p-4 rounded-xl border border-white/10 hover:border-pink-500 transition-colors group/heart">
                <Heart size={18} className="group-hover/heart:fill-pink-500 group-hover/heart:text-pink-500 transition-all" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchesView;
