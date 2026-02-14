
import React from 'react';
import { Book, Music, Camera, Code, Palette, Coffee, Globe, Video, Heart, Users, MessageCircle, Sparkles } from 'lucide-react';
import { Room } from './types';

export const LOOKING_FOR_OPTIONS = [
  { icon: <Heart size={24} />, label: "Dating Partner", value: "dating", color: "#ff6b9d" },
  { icon: <Users size={24} />, label: "New Friends", value: "friends", color: "#4facfe" },
  { icon: <MessageCircle size={24} />, label: "Deep Conversations", value: "conversation", color: "#43e97b" },
  { icon: <Sparkles size={24} />, label: "Creative Collab", value: "creative", color: "#fa709a" }
];

export const INTEREST_OPTIONS = [
  { icon: <Book size={20} />, label: "Reading", key: "reading" },
  { icon: <Music size={20} />, label: "Music", key: "music" },
  { icon: <Camera size={20} />, label: "Photography", key: "photography" },
  { icon: <Code size={20} />, label: "Coding", key: "coding" },
  { icon: <Palette size={20} />, label: "Art", key: "art" },
  { icon: <Coffee size={20} />, label: "Coffee Chats", key: "coffee" },
  { icon: <Globe size={20} />, label: "Travel", key: "travel" },
  { icon: <Video size={20} />, label: "Gaming", key: "gaming" }
];

export const VIRTUAL_ROOMS: Room[] = [
  { 
    id: 1, 
    name: "Chill Lounge", 
    theme: "casual", 
    icon: "☕", 
    color: "#8B5CF6", 
    online: 12, 
    description: "Relaxed social waves and collective aura syncing.",
    placeholder: "Drop a vibe or a random thought..."
  },
  { 
    id: 2, 
    name: "Deep Talks", 
    theme: "thoughtful", 
    icon: "💭", 
    color: "#EC4899", 
    online: 8, 
    description: "Draw from the Oracle deck to start a soul-deep dive.",
    placeholder: "Answer the Oracle or ask a secret..."
  },
  { 
    id: 3, 
    name: "Creative Corner", 
    theme: "artistic", 
    icon: "🎨", 
    color: "#F59E0B", 
    online: 15, 
    description: "Build a persistent pixel masterpiece with the tribe.",
    placeholder: "What are we drawing today?"
  },
  { 
    id: 4, 
    name: "Introvert Haven", 
    theme: "quiet", 
    icon: "🍃", 
    color: "#10B981", 
    online: 6, 
    description: "Silent whispers and meditation. No shouting allowed.",
    placeholder: "Type a quiet meditation or a kind whisper..."
  },
  { 
    id: 5, 
    name: "Gaming Zone", 
    theme: "gaming", 
    icon: "🎮", 
    color: "#3B82F6", 
    online: 20, 
    description: "Hyper-speed reflex testing and friendly battles.",
    placeholder: "Drop your high score or a challenge!"
  },
  { 
    id: 6, 
    name: "Music Lovers", 
    theme: "music", 
    icon: "🎧", 
    color: "#EF4444", 
    online: 11, 
    description: "Sync your digital pulse to the collective frequency.",
    placeholder: "Which track is currently fueling your soul?"
  }
];

export const PERSONALITY_QUESTIONS = [
  {
    question: "How do you prefer to spend your weekends?",
    options: [
      { text: "Quiet time at home with a book or movie", trait: "introvert" },
      { text: "Out with friends at social events", trait: "extrovert" },
      { text: "Exploring new hobbies or learning something", trait: "curious" },
      { text: "Gaming or online activities", trait: "digital" }
    ]
  },
  {
    question: "What describes your communication style?",
    options: [
      { text: "I think before I speak, prefer deep conversations", trait: "thoughtful" },
      { text: "I'm spontaneous and love quick wit", trait: "spontaneous" },
      { text: "I express myself through creativity", trait: "creative" },
      { text: "I keep it real and straightforward", trait: "direct" }
    ]
  },
  {
    question: "What matters most in a connection?",
    options: [
      { text: "Shared values and deep understanding", trait: "depth" },
      { text: "Fun and adventure together", trait: "fun" },
      { text: "Intellectual stimulation", trait: "mental" },
      { text: "Mutual support and loyalty", trait: "support" }
    ]
  }
];
