
export interface UserProfile {
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
  id: number;
  name: string;
  age: number;
  type: string;
  interests: string[];
  vibeMatch: number;
  online: boolean;
  avatar: string;
  bio?: string;
}

export interface Message {
  id: number;
  user: string;
  avatar: string;
  message: string;
  time: string;
  isYou?: boolean;
  isStreaming?: boolean;
}

export interface OnlineUser {
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy';
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
