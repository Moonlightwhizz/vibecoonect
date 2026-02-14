
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { AppView, UserProfile, PersonalityResult, Room, Match, Message, OnlineUser } from './types';
import { VIRTUAL_ROOMS, PERSONALITY_QUESTIONS } from './constants';
import WelcomeScreen from './components/WelcomeScreen';
import PersonalityQuiz from './components/PersonalityQuiz';
import LobbyView from './components/LobbyView';
import ChatRoomView from './components/ChatRoomView';
import MatchesView from './components/MatchesView';
import { analyzePersonality, generateMockMatches, createRoomChat, createMatchChat } from './services/geminiService';

const MOCK_NAMES = ["Stellar_99", "Echo_Mind", "Nova_Seeker", "Pixel_Witch", "Cyber_Zen", "Void_Walker", "Neon_Soul", "Aura_Hunter"];
const AVATARS = ["🛸", "🌌", "👾", "🌙", "🌊", "🔥", "💎", "🧿"];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.WELCOME);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [personalityResult, setPersonalityResult] = useState<PersonalityResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Chat & Social State
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const activeChatSession = useRef<any>(null);

  const [matches, setMatches] = useState<Match[]>([]);

  // Initialize and simulate online users
  useEffect(() => {
    const initialUsers: OnlineUser[] = MOCK_NAMES.map((name, i) => ({
      name,
      avatar: AVATARS[i],
      status: (['online', 'away', 'busy'] as const)[Math.floor(Math.random() * 3)]
    }));
    setOnlineUsers(initialUsers);

    const interval = setInterval(() => {
      setOnlineUsers(prev => prev.map(u => ({
        ...u,
        status: Math.random() > 0.8 ? (['online', 'away', 'busy'] as const)[Math.floor(Math.random() * 3)] : u.status
      })));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleStartAnalysis = (profile: UserProfile) => {
    setUserProfile(profile);
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
    setChatMessages([{ id: 1, user: "System", avatar: "🤖", message: `Connecting to ${room.name} energy...`, time: "Now" }]);
    activeChatSession.current = createRoomChat(room, { ...userProfile, ...personalityResult });
    setCurrentView(AppView.CHAT);
  };

  const startPrivateChat = (match: Match) => {
    if (!userProfile) return;
    setActiveMatch(match);
    setActiveRoom(null);
    setChatMessages([{ id: 1, user: "System", avatar: "🔐", message: `Secure vibe-encrypted channel opened with ${match.name}.`, time: "Now" }]);
    activeChatSession.current = createMatchChat(match, { ...userProfile, ...personalityResult });
    setCurrentView(AppView.PRIVATE_CHAT);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !userProfile || !activeChatSession.current) return;

    const userMsg: Message = {
      id: Date.now(),
      user: userProfile.name,
      avatar: "😊",
      message: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isYou: true
    };
    setChatMessages(prev => [...prev, userMsg]);

    const aiId = Date.now() + 1;
    const aiAvatar = activeMatch ? activeMatch.avatar : "🤖";
    const aiName = activeMatch ? activeMatch.name : `${activeRoom?.name} Host`;
    
    const streamingMsg: Message = {
      id: aiId,
      user: aiName,
      avatar: aiAvatar,
      message: "",
      time: "Typing...",
      isStreaming: true
    };
    setChatMessages(prev => [...prev, streamingMsg]);

    try {
      let fullResponse = "";
      const stream = await activeChatSession.current.sendMessageStream({ message: text });
      
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        setChatMessages(prev => prev.map(m => 
          m.id === aiId ? { ...m, message: fullResponse, time: "Just now" } : m
        ));
      }

      setChatMessages(prev => prev.map(m => 
        m.id === aiId ? { ...m, isStreaming: false } : m
      ));
    } catch (error) {
      console.error("Chat Error:", error);
      setChatMessages(prev => prev.map(m => 
        m.id === aiId ? { ...m, message: "My connection flickered. Can you repeat that?", isStreaming: false } : m
      ));
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl animate-float"></div>
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-pink-500/10 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <main className="relative z-10 w-full max-w-6xl px-4 py-8 flex-1 flex flex-col">
        {currentView === AppView.WELCOME && (
          <WelcomeScreen onStart={handleStartAnalysis} />
        )}
        {currentView === AppView.PERSONALITY && (
          <PersonalityQuiz onComplete={handleQuizComplete} />
        )}
        {currentView === AppView.ANALYZING && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8">
             <Sparkles className="w-20 h-20 text-indigo-400 animate-spin" />
             <h2 className="text-4xl font-black animate-pulse text-center">Synchronizing Vibe Archetype...</h2>
          </div>
        )}
        {currentView === AppView.LOBBY && personalityResult && userProfile && (
          <LobbyView
            profile={userProfile}
            result={personalityResult}
            rooms={VIRTUAL_ROOMS}
            onlineUsers={onlineUsers}
            onJoinRoom={joinRoom}
            onViewMatches={() => setCurrentView(AppView.MATCHES)}
            onEditProfile={() => setCurrentView(AppView.WELCOME)}
          />
        )}
        {(currentView === AppView.CHAT || currentView === AppView.PRIVATE_CHAT) && (activeRoom || activeMatch) && (
          <ChatRoomView
            room={activeRoom || ({ name: activeMatch?.name, theme: 'casual' } as Room)}
            messages={chatMessages}
            onlineUsers={onlineUsers.slice(0, activeRoom ? 4 : 1)} // Simulate specific room users
            onSendMessage={handleSendMessage}
            onBack={() => setCurrentView(activeMatch ? AppView.MATCHES : AppView.LOBBY)}
            userAvatar="😊"
          />
        )}
        {currentView === AppView.MATCHES && (
          <MatchesView
            matches={matches}
            result={personalityResult!}
            onBack={() => setCurrentView(AppView.LOBBY)}
            onConnect={startPrivateChat}
          />
        )}
      </main>
    </div>
  );
};

export default App;
