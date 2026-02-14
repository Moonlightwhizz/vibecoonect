
import React from 'react';
import { Sparkles, Heart, Globe, Edit3, ShieldCheck, Users, Circle, Moon, MinusCircle, Eye } from 'lucide-react';
import { UserProfile, PersonalityResult, Room, OnlineUser } from '../types';

interface Props {
  profile: UserProfile;
  result: PersonalityResult;
  rooms: Room[];
  onlineUsers: OnlineUser[];
  onJoinRoom: (room: Room) => void;
  onViewMatches: () => void;
  onEditProfile: () => void;
  onSelectUser: (user: OnlineUser) => void;
}

const StatusBadge = ({ status, size = "sm" }: { status: OnlineUser['status'], size?: "sm" | "md" }) => {
  const configs = {
    online: { color: "bg-green-500", label: "Syncing", icon: <Circle size={size === "sm" ? 8 : 12} fill="currentColor" /> },
    away: { color: "bg-amber-500", label: "Drifting", icon: <Moon size={size === "sm" ? 8 : 12} fill="currentColor" /> },
    busy: { color: "bg-rose-500", label: "Focused", icon: <MinusCircle size={size === "sm" ? 8 : 12} fill="currentColor" /> }
  };
  const config = configs[status];
  
  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${config.color}/10 text-${config.color.replace('bg-', '')} font-black uppercase tracking-widest text-[8px]`}>
      <div className={`${size === "sm" ? "" : "animate-pulse"}`}>{config.icon}</div>
      {config.label}
    </div>
  );
};

const LobbyView: React.FC<Props> = ({ profile, result, rooms, onlineUsers, onJoinRoom, onViewMatches, onEditProfile, onSelectUser }) => {
  return (
    <div className="w-full space-y-12 animate-fadeIn py-6">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl relative group cursor-pointer" onClick={onEditProfile}>
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10">
               <Edit3 className="text-white w-6 h-6" />
             </div>
             <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-800" style={{ boxShadow: `inset 0 0 20px ${profile.auraColor}` }}>
               😊
             </div>
             <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-[#0f172a] rounded-full z-20 shadow-lg" title="You are online" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight leading-none flex items-center gap-2">
              {profile.name}
              <ShieldCheck className="text-blue-400 w-5 h-5" />
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Status: Vibrating at {result.vibeScore}Hz</p>
              <StatusBadge status="online" />
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onViewMatches}
            className="bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-white/10 px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 group"
          >
            <Heart className="text-pink-500 group-hover:scale-125 transition-transform" size={20} />
            Soul Tribe
          </button>
        </div>
      </header>

      {/* Hero Profile Card */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden p-8 md:p-12 shadow-2xl flex flex-col lg:flex-row gap-12 items-center relative">
        <div className="absolute -top-10 -right-10 w-64 h-64 blur-3xl opacity-20 pointer-events-none rounded-full" style={{ backgroundColor: profile.auraColor }}></div>
        
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-4">
             <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
               Your Essence
             </div>
          </div>
          <h2 className="text-4xl font-black tracking-tight">{result.personalityType}</h2>
          <p className="text-xl text-gray-300 leading-relaxed font-medium italic">
            "{profile.bio || result.description}"
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            {profile.interests.map((int, i) => (
              <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-400 capitalize">
                #{int}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-72 aspect-square rounded-[3.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex flex-col items-center justify-center gap-2 shadow-xl relative group overflow-hidden">
          <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: profile.auraColor }} />
          <div className="text-8xl font-black leading-none z-10" style={{ color: profile.auraColor }}>{result.vibeScore}</div>
          <div className="text-xs font-black tracking-[0.2em] uppercase text-gray-500 z-10">Energy Synergy</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-end justify-between mb-2">
            <h3 className="text-3xl font-black flex items-center gap-4 tracking-tight">
              <Globe className="text-indigo-400" />
              Experience Nodes
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onJoinRoom(room)}
                className="glass-card p-8 rounded-[2.5rem] text-left hover:translate-y-[-8px] hover:border-white/30 transition-all group relative overflow-hidden flex flex-col h-full"
              >
                <div 
                  className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] transition-all group-hover:opacity-[0.1] -mr-8 -mt-8 rotate-12"
                  style={{ color: room.color }}
                >
                   <Sparkles size={128} fill="currentColor" />
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="text-5xl p-4 bg-white/5 rounded-3xl group-hover:scale-110 transition-transform">{room.icon}</div>
                  <div className="text-right">
                     <div className="text-[10px] font-black text-green-400 bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-widest">{room.online} Souls</div>
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="text-2xl font-black mb-2 tracking-tight">{room.name}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{room.description}</p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{room.theme} MODE</span>
                  <Sparkles className="w-4 h-4 text-gray-700 group-hover:text-pink-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black flex items-center gap-3 tracking-tight">
            <Users className="text-pink-400" />
            Registered Souls
          </h3>
          <div className="glass-card rounded-[2rem] p-6 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
            {onlineUsers.length === 0 ? (
               <div className="text-center py-10">
                 <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">No friends synced yet</p>
               </div>
            ) : onlineUsers.map((user, idx) => (
              <div 
                key={idx} 
                onClick={() => user.id !== profile.id && onSelectUser(user)}
                className={`flex items-center justify-between gap-3 group p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer ${user.id === profile.id ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl relative" style={{ boxShadow: user.auraColor ? `inset 0 0 10px ${user.auraColor}` : '' }}>
                    {user.avatar}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0f172a] ${
                      user.status === 'online' ? 'bg-green-500' : user.status === 'away' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors flex items-center gap-1">
                      {user.name}
                      {user.id === profile.id && <span className="text-[8px] opacity-50">(You)</span>}
                    </div>
                    <div className="text-[9px] text-gray-600 font-black uppercase tracking-tight">{user.personalityType || 'Synchronizing...'}</div>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye size={14} className="text-pink-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyView;
