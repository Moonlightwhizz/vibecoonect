
export interface UserProfile {
  id: string; // Unique session ID
  name: string;
  age: string;
  lookingFor: string[];
  interests: string[];
  bio: string;
  auraColor: string;
}

export interface PersonalityResult {
  personalityType: string;
  description: string;
  strengths: string[];
  compatibleTypes: string[];
  vibeScore: number;
  communicationStyle: string;
  bestConnections: string;
  icebreaker: string;
}

export interface Room {
  id: number;
  name: string;
  theme: 'casual' | 'thoughtful' | 'artistic' | 'quiet' | 'gaming' | 'music';
  icon: string;
  color: string;
  online: number;
  description: string;
  placeholder: string;
}

export interface Match {
  id: string | number;
  name: string;
  age: number;
  type: string;
  interests: string[];
  vibeMatch: number;
  online: boolean;
  avatar: string;
  bio?: string;
  isRealUser?: boolean;
  auraColor?: string;
}

export interface Message {
  id: string;
  userId: string;
  user: string;
  avatar: string;
  message: string;
  time: string;
  isYou?: boolean;
  isStreaming?: boolean;
  type?: 'chat' | 'system' | 'ai';
  recipientId?: string; // For private peer-to-peer messages
  roomId?: number | null; // For room messages
}

export interface OnlineUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy';
  lastSeen: number;
  currentRoomId?: number | null;
  // Shared profile data for discovery
  age?: string;
  bio?: string;
  interests?: string[];
  auraColor?: string;
  personalityType?: string;
}

export enum AppView {
  WELCOME = 'welcome',
  PERSONALITY = 'personality',
  ANALYZING = 'analyzing',
  LOBBY = 'lobby',
  CHAT = 'chat',
  MATCHES = 'matches',
  PRIVATE_CHAT = 'private_chat'
}
