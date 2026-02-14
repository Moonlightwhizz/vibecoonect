
import React, { useMemo } from 'react';
import { ArrowLeft, Star, Heart, MessageSquare, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { Match, PersonalityResult, OnlineUser } from '../types';

interface Props {
  matches: Match[];
  onlineUsers: OnlineUser[];
  result: PersonalityResult;
  onBack: () => void;
  onConnect: (match: Match) => void;
}

const MatchesView: React.FC<Props> = ({ matches, onlineUsers, result, onBack, onConnect }) => {
  const realMatches = useMemo(() => {
    return onlineUsers.map(u => ({
      id: u.id,
      name: u.name,
      age: parseInt(u.age || '18'),
      type: u.personalityType || 'Synchronized Soul',
      interests: u.interests || [],
      vibeMatch: 100, // Real-time connections are 100% vibe-synced
      online: true,
      avatar: u.avatar || '😊',
      bio: u.bio,
      isRealUser: true,
      auraColor: u.auraColor
    } as Match));
  }, [onlineUsers]);

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
          <h1 className="text-5xl font-black tracking-tight">Soul Tribe</h1>
          <p className="text-gray-400 font-medium">Connect with AI archetypes and <span className="text-indigo-400 font-bold">real humans</span> synced to your vibe.</p>
        </div>
      </header>

      {/* Synchronized Real Souls Section */}
      {realMatches.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <UserCheck className="text-indigo-400" size={24} />
             <h2 className="text-2xl font-black tracking-tight">Synchronized Souls (Online Now)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {realMatches.map((match) => (
              <div key={match.id} className="glass-card rounded-[2.5rem] p-10 flex flex-col items-center text-center hover:scale-[1.02] transition-all group relative border-indigo-500/20">
                <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-indigo-500/20">
                  <ShieldCheck size={12} />
                  Real Human
                </div>
                
                <div 
                  className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-xl mb-6 transform group-hover:rotate-6 transition-transform relative"
                  style={{ backgroundColor: match.auraColor || '#6366f1' }}
                >
                  <div className="absolute inset-0 bg-white/10 rounded-3xl animate-pulse" />
                  <span className="relative z-10">{match.avatar}</span>
                </div>

                <h4 className="text-3xl font-black mb-1">{match.name}, {match.age}</h4>
                <p className="text-indigo-400 text-sm font-bold tracking-widest uppercase mb-4">{match.type}</p>

                <p className="text-gray-500 text-sm mb-6 line-clamp-2 italic font-medium px-4">
                  "{match.bio || "Synchronizing with the collective consciousness."}"
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {match.interests.slice(0, 3).map((int, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      #{int}
                    </span>
                  ))}
                </div>

                <div className="w-full">
                  <button 
                    onClick={() => onConnect(match)}
                    className="w-full py-4 rounded-xl bg-indigo-600 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all text-white"
                  >
                    <MessageSquare size={16} />
                    Instant Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AI Matches Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
           <Sparkles className="text-pink-400" size={24} />
           <h2 className="text-2xl font-black tracking-tight">AI Generated Archetypes</h2>
        </div>
        
        <div className="glass-card p-10 rounded-[2.5rem] bg-indigo-500/10 border-indigo-500/20 relative overflow-hidden mb-8">
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
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-pink-500/20 transition-all text-white"
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
      </section>
    </div>
  );
};

export default MatchesView;
