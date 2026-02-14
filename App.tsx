
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, MessageSquare, ShieldCheck, Heart } from 'lucide-react';
import { AppView, UserProfile, PersonalityResult, Room, Match, Message, OnlineUser } from './types';
import { VIRTUAL_ROOMS } from './constants';
import WelcomeScreen from './components/WelcomeScreen';
import PersonalityQuiz from './components/PersonalityQuiz';
import LobbyView from './components/LobbyView';
import ChatRoomView from './components/ChatRoomView';
import MatchesView from './components/MatchesView';
import Logo from './components/Logo';
import { analyzePersonality, generateMockMatches, createRoomChat, createMatchChat } from './services/geminiService';
import { socialService } from './services/socialService';

const STORAGE_KEY_USER = 'vibeconnect_user_profile';
const STORAGE_KEY_RESULT = 'vibeconnect_personality_result';

const ProfileModal: React.FC<{ user: OnlineUser, onClose: () => void, onChat: (match: Match) => void }> = ({ user, onClose, onChat }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-card w-full max-w-lg rounded-[3rem] overflow-hidden relative shadow-2xl border-white/20">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10">
          <X size={20} />
        </button>
        <div className="h-32 w-full relative overflow-hidden">
          <div className="absolute inset-0 opacity-50 blur-xl" style={{ backgroundColor: user.auraColor || '#6366f1' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
        </div>
        <div className="px-10 pb-10 -mt-16 relative">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl mb-4 border-4 border-slate-950 relative" style={{ backgroundColor: user.auraColor || '#6366f1' }}>
              {user.avatar}
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-950"></div>
            </div>
            <h2 className="text-3xl font-black flex items-center gap-2">
              {user.name}, {user.age}
              <ShieldCheck className="text-blue-400 w-5 h-5" />
            </h2>
            <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs mt-1">{user.personalityType || 'New Soul'}</p>
            <div className="mt-6 p-6 rounded-2xl bg-white/5 border border-white/10 w-full text-left">
              <p className="text-gray-300 italic leading-relaxed">"{user.bio || 'Synchronizing with the collective pulse.'}"</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {user.interests?.map((int, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-300">
                  #{int}
                </span>
              ))}
            </div>
            <button 
              onClick={() => {
                onChat({
                  id: user.id,
                  name: user.name,
                  age: parseInt(user.age || '18'),
                  type: user.personalityType || 'Synchronized Soul',
                  interests: user.interests || [],
                  vibeMatch: 100,
                  online: true,
                  avatar: user.avatar,
                  isRealUser: true,
                  auraColor: user.auraColor
                });
                onClose();
              }}
              className="w-full mt-8 py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-500/20"
            >
              <MessageSquare size={18} />
              Open Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.WELCOME);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [personalityResult, setPersonalityResult] = useState<PersonalityResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);
  const activeChatSession = useRef<any>(null);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY_USER);
    const savedResult = localStorage.getItem(STORAGE_KEY_RESULT);
    if (savedUser && savedResult) {
      const user = JSON.parse(savedUser);
      const result = JSON.parse(savedResult);
      setUserProfile(user);
      setPersonalityResult(result);
      setMatches(generateMockMatches(result));
      setCurrentView(AppView.LOBBY);
      socialService.init(
        { id: user.id, name: user.name, avatar: "😊", status: 'online', lastSeen: Date.now(), age: user.age, bio: user.bio, interests: user.interests, auraColor: user.auraColor, personalityType: result.personalityType },
        handleRemoteMessage,
        setOnlineUsers
      );
    }
  }, []);

  const handleRemoteMessage = (msg: Message) => {
    setChatMessages(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
  };

  const handleStartAnalysis = (profile: Omit<UserProfile, 'id'>) => {
    const profileWithId: UserProfile = { ...profile, id: Math.random().toString(36).substr(2, 9) };
    setUserProfile(profileWithId);
    setCurrentView(AppView.PERSONALITY);
  };

  const handleQuizComplete = async (answers: string[]) => {
    if (!userProfile) return;
    setIsAnalyzing(true);
    setCurrentView(AppView.ANALYZING);
    try {
      const result = await analyzePersonality(userProfile, answers);
      setPersonalityResult(result);
      setMatches(generateMockMatches(result));
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userProfile));
      localStorage.setItem(STORAGE_KEY_RESULT, JSON.stringify(result));
      socialService.init(
        { id: userProfile.id, name: userProfile.name, avatar: "😊", status: 'online', lastSeen: Date.now(), age: userProfile.age, bio: userProfile.bio, interests: userProfile.interests, auraColor: userProfile.auraColor, personalityType: result.personalityType },
        handleRemoteMessage,
        setOnlineUsers
      );
      setIsAnalyzing(false);
      setCurrentView(AppView.LOBBY);
    } catch (error: any) {
      console.error("Synthesis Error:", error);
      setIsAnalyzing(false);
      alert(error.message || "Synthesis failed. Try again.");
      setCurrentView(AppView.PERSONALITY);
    }
  };

  const joinRoom = (room: Room) => {
    if (!userProfile) return;
    setActiveRoom(room);
    setActiveMatch(null);
    setChatMessages([]);
    socialService.updateRoom(room.id);
    activeChatSession.current = createRoomChat(room, { ...userProfile, ...personalityResult });
    setCurrentView(AppView.CHAT);
    
    // Welcome message is a system-like host greeting, does NOT trigger a loop
    const greetingId = 'greet-' + Date.now();
    setChatMessages([{
      id: greetingId,
      userId: 'ai-host',
      user: `${room.name} Host`,
      avatar: room.icon,
      message: `Welcome, ${userProfile.name}! The energy here is perfect for a ${room.theme} session. What's on your mind?`,
      time: "Just now",
      type: 'ai',
      roomId: room.id
    }]);
  };

  const startPrivateChat = (match: Match) => {
    if (!userProfile) return;
    setActiveMatch(match);
    setActiveRoom(null);
    setChatMessages([]);
    socialService.updateRoom(null);
    if (match.isRealUser) {
      activeChatSession.current = null;
    } else {
      activeChatSession.current = createMatchChat(match, { ...userProfile, ...personalityResult });
      setChatMessages([{
        id: 'greet-' + Date.now(),
        userId: 'ai-host',
        user: match.name,
        avatar: match.avatar,
        message: `Hey ${userProfile.name}! I noticed our vibes are highly compatible. How's your journey going?`,
        time: "Just now",
        type: 'ai'
      }]);
    }
    setCurrentView(AppView.PRIVATE_CHAT);
  };

  const handleSendMessage = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || !userProfile) return;

    const isPeerChat = activeMatch?.isRealUser;
    const msgId = Math.random().toString(36).substr(2, 9);
    
    // 1. Create and add user message
    const userMsg: Message = {
      id: msgId,
      userId: userProfile.id,
      user: userProfile.name,
      avatar: "😊",
      message: trimmedText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isYou: true,
      type: 'chat',
      recipientId: isPeerChat ? activeMatch?.id.toString() : undefined,
      roomId: activeRoom?.id || undefined
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    socialService.sendMessage(userMsg);

    // 2. Trigger AI response if not a peer-to-peer chat
    if (!isPeerChat && activeChatSession.current) {
      const aiId = 'ai-' + Date.now();
      const streamingMsg: Message = {
        id: aiId,
        userId: 'ai-host',
        user: activeMatch ? activeMatch.name : `${activeRoom?.name} Host`,
        avatar: activeMatch ? activeMatch.avatar : (activeRoom?.icon || "🤖"),
        message: "",
        time: "Synthesizing...",
        isStreaming: true,
        type: 'ai',
        roomId: activeRoom?.id || undefined
      };
      
      setChatMessages(prev => [...prev, streamingMsg]);

      try {
        let fullResponse = "";
        const stream = await activeChatSession.current.sendMessageStream({ message: trimmedText });
        
        for await (const chunk of stream) {
          const chunkText = chunk.text;
          
          // ROBUST ACCUMULATION LOGIC:
          // Handles both "cumulative" (Vercel/Stream) and "delta" (Local/Direct) chunks.
          if (chunkText.startsWith(fullResponse) && chunkText.length > fullResponse.length) {
            fullResponse = chunkText; // Replace if cumulative
          } else if (!fullResponse.endsWith(chunkText)) {
            fullResponse += chunkText; // Append if delta
          }
          
          setChatMessages(prev => prev.map(m => 
            m.id === aiId ? { ...m, message: fullResponse, time: "Just now" } : m
          ));
        }
        
        setChatMessages(prev => prev.map(m => 
          m.id === aiId ? { ...m, isStreaming: false } : m
        ));
      } catch (error) {
        console.error("Chat Stream Error:", error);
        setChatMessages(prev => prev.map(m => 
          m.id === aiId ? { ...m, message: "Aura disruption detected. Please try refreshing.", isStreaming: false } : m
        ));
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_RESULT);
    window.location.reload();
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl animate-float"></div>
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-pink-500/10 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      <nav className="relative z-20 w-full max-w-6xl px-6 py-4 flex items-center justify-between">
        <Logo onClick={() => setCurrentView(AppView.LOBBY)} />
        {userProfile && currentView !== AppView.WELCOME && (
          <div className="flex items-center gap-3 md:gap-6">
            <button onClick={() => setCurrentView(AppView.LOBBY)} className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Lobby</button>
            <button onClick={() => setCurrentView(AppView.MATCHES)} className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Tribes</button>
            <button onClick={handleLogout} className="text-[10px] md:text-xs font-black uppercase tracking-widest text-pink-500/50 hover:text-pink-500 transition-colors">Sign Out</button>
          </div>
        )}
      </nav>
      <main className="relative z-10 w-full max-w-6xl px-4 py-4 flex-1 flex flex-col min-h-0">
        {currentView === AppView.WELCOME && <WelcomeScreen onStart={handleStartAnalysis} />}
        {currentView === AppView.PERSONALITY && <PersonalityQuiz onComplete={handleQuizComplete} />}
        {currentView === AppView.ANALYZING && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8">
             <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
                <Sparkles className="w-20 h-20 text-indigo-400 animate-spin relative z-10" />
             </div>
             <h2 className="text-4xl font-black animate-pulse text-center tracking-tighter">Synthesizing Aura...</h2>
          </div>
        )}
        {currentView === AppView.LOBBY && personalityResult && userProfile && (
          <LobbyView profile={userProfile} result={personalityResult} rooms={VIRTUAL_ROOMS} onlineUsers={onlineUsers} onJoinRoom={joinRoom} onViewMatches={() => setCurrentView(AppView.MATCHES)} onEditProfile={() => setCurrentView(AppView.WELCOME)} onSelectUser={setSelectedUser} />
        )}
        {(currentView === AppView.CHAT || currentView === AppView.PRIVATE_CHAT) && (activeRoom || activeMatch) && (
          <ChatRoomView
            room={activeRoom || ({ id: -1, name: activeMatch?.name, theme: 'casual' } as Room)}
            messages={chatMessages}
            onlineUsers={onlineUsers.filter(u => u.currentRoomId === activeRoom?.id)}
            onSendMessage={handleSendMessage}
            onBack={() => { socialService.updateRoom(null); setCurrentView(activeMatch ? AppView.MATCHES : AppView.LOBBY); }}
            userAvatar="😊"
            isPeerChat={activeMatch?.isRealUser}
          />
        )}
        {currentView === AppView.MATCHES && <MatchesView matches={matches} onlineUsers={onlineUsers.filter(u => u.id !== userProfile?.id)} result={personalityResult!} onBack={() => setCurrentView(AppView.LOBBY)} onConnect={startPrivateChat} />}
      </main>
      {selectedUser && <ProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} onChat={startPrivateChat} />}
    </div>
  );
};

export default App;
