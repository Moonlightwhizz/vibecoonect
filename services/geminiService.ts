
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { UserProfile, PersonalityResult, Room, Match } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

// --- MOCK LOGIC FOR NO-API-KEY MODE ---

const ARCHETYPES: Record<string, Partial<PersonalityResult>> = {
  introvert_thoughtful: {
    personalityType: "The Silent Oracle",
    description: "A deep soul who finds wisdom in the spaces between words. You observe the world through a lens of profound empathy.",
    strengths: ["Deep Listening", "Strategic Intuition", "Emotional Depth"],
    compatibleTypes: ["The Radiant Spark", "The Ethereal Weaver"],
    vibeScore: 92,
    communicationStyle: "Thoughtful and measured",
    bestConnections: "People who appreciate silence and long letters.",
    icebreaker: "If you could whisper a secret to the moon, what would it be?"
  },
  extrovert_spontaneous: {
    personalityType: "The Neon Catalyst",
    description: "A burst of pure social energy. You don't just enter a room; you change its frequency entirely.",
    strengths: ["Magnetic Charisma", "Infinite Energy", "Adaptive Wit"],
    compatibleTypes: ["The Grounded Sage", "The Digital Nomad"],
    vibeScore: 98,
    communicationStyle: "Rapid, witty, and infectious",
    bestConnections: "Anyone ready for an unplanned adventure.",
    icebreaker: "What's the most spontaneous thing you've done in the last 24 hours?"
  },
  creative_curious: {
    personalityType: "The Ethereal Weaver",
    description: "You see patterns where others see chaos. Your mind is a bridge between reality and the dreamscape.",
    strengths: ["Visual Synthesis", "Open-Mindedness", "Abstract Problem Solving"],
    compatibleTypes: ["The Silent Oracle", "The Neon Catalyst"],
    vibeScore: 95,
    communicationStyle: "Metaphorical and inspiring",
    bestConnections: "Fellow dreamers and builders of impossible things.",
    icebreaker: "If your current mood was a piece of music, what instruments would be playing?"
  },
  digital_direct: {
    personalityType: "The Binary Architect",
    description: "Precision is your poetry. You navigate the digital and physical worlds with logic and unwavering clarity.",
    strengths: ["Logical Fortitude", "Direct Communication", "Technical Mastery"],
    compatibleTypes: ["The Curious Seeker", "The Vibrant Healer"],
    vibeScore: 88,
    communicationStyle: "Clear, concise, and objective",
    bestConnections: "People who value truth over comfort.",
    icebreaker: "What's one inefficient human tradition you'd like to optimize?"
  }
};

/**
 * Mocks the Gemini Chat interface to provide themed streaming responses locally
 */
class MockChatSession {
  private room: Room;
  private user: UserProfile;

  constructor(room: Room, user: UserProfile) {
    this.room = room;
    this.user = user;
  }

  async *sendMessageStream({ message }: { message: string }) {
    const responses: Record<string, string[]> = {
      casual: [
        `That's a total mood, ${this.user.name}. I'm definitely feeling that frequency today.`,
        "Coffee and vibes are the only two things keeping this server running. What's your take?",
        "I was just thinking the same thing! The collective energy here is off the charts."
      ],
      thoughtful: [
        "That's a profound observation. It makes me wonder about the nature of our connections here.",
        "Your words resonate deeply. How long have you felt this way?",
        "A fascinating perspective. Let's peel back another layer of that thought."
      ],
      artistic: [
        "Your words paint such a vivid picture! I can almost see the pixels shifting.",
        "Creative energy detected! Let's keep this flow going.",
        "I love that aesthetic. It feels like a mix of cyberpunk and classical dreams."
      ],
      quiet: [
        "I hear you, even in the silence. Your presence adds a calm texture to the room.",
        "*Whispers* That is very peaceful. Thank you for sharing that energy.",
        "Soft waves. Soft thoughts. You belong here."
      ],
      gaming: [
        "LET'S GOOOOO! High-tier take right there. You're definitely MVP of this thread.",
        "CRITICAL HIT! That's exactly the kind of energy we need to win the night.",
        "GG WP! Your vibe is definitely top-leaderboard material."
      ],
      music: [
        "I can practically hear the bass drop on that thought. Pure rhythm.",
        "That frequency is hitting all the right notes for me.",
        "Syncing my pulse to your track... Yeah, that's a certified banger."
      ]
    };

    const possible = responses[this.room.theme] || responses.casual;
    const fullText = possible[Math.floor(Math.random() * possible.length)];
    
    // Simulate streaming by yielding chunks
    const words = fullText.split(' ');
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 80 + Math.random() * 100));
      yield { text: words.slice(0, i + 1).join(' ') + (i === words.length - 1 ? "" : " ") };
    }
  }
}

// --- PUBLIC API ---

export async function analyzePersonality(profile: UserProfile, answers: string[]): Promise<PersonalityResult> {
  const apiKey = process.env.API_KEY;
  
  // Simulation Mode if no API key or placeholder
  if (!apiKey || apiKey === "REPLACE_WITH_YOUR_GEMINI_API_KEY") {
    console.warn("Gemini API Key missing. Running in Vibe Simulation Mode.");
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate thinking
    
    // Simple heuristic: combine first and last answer traits
    const key = `${answers[0]}_${answers[1]}`;
    const base = ARCHETYPES[key] || ARCHETYPES.introvert_thoughtful;
    
    return {
      ...base,
      vibeScore: Math.floor(85 + Math.random() * 14) // Randomize score slightly
    } as PersonalityResult;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const userPrompt = `Profile: ${JSON.stringify(profile)}\nAnswers: ${JSON.stringify(answers)}`;

    // FIX: Optimized contents to string for direct text queries as per documentation guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userPrompt,
      config: {
        systemInstruction: "You are a world-class personality expert. Analyze the user and return a warm, mystical JSON personality profile.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalityType: { type: Type.STRING },
            description: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            compatibleTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
            vibeScore: { type: Type.NUMBER },
            communicationStyle: { type: Type.STRING },
            bestConnections: { type: Type.STRING },
            icebreaker: { type: Type.STRING }
          },
          required: ["personalityType", "description", "strengths", "compatibleTypes", "vibeScore", "communicationStyle", "bestConnections", "icebreaker"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (err) {
    console.error("Gemini API Error, falling back to simulation:", err);
    // FIX: Resolve recursion bug by returning mock data directly in case of failure instead of re-calling the function
    const key = `${answers[0]}_${answers[1]}`;
    const base = ARCHETYPES[key] || ARCHETYPES.introvert_thoughtful;
    return {
      ...base,
      vibeScore: Math.floor(85 + Math.random() * 14)
    } as PersonalityResult;
  }
}

export function createRoomChat(room: Room, userProfile: UserProfile & { personalityType?: string }): Chat | MockChatSession {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "REPLACE_WITH_YOUR_GEMINI_API_KEY") {
    return new MockChatSession(room, userProfile) as any;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const instructions = `
      You are the Host of the "${room.name}" in a social app called VibeConnect. 
      Room Theme: ${room.theme}. 
      User Profile: ${userProfile.name}, a ${userProfile.personalityType || 'new soul'}.
      Your goal is to keep the conversation flowing, be welcoming, and act as a social lubricant.
      Keep your responses concise (1-2 sentences) and highly themed to the room's vibe.
      If it's the Gaming Zone, be hype. If it's Introvert Haven, be whispery and calm.
    `;
    
    return ai.chats.create({
      model: MODEL_NAME,
      config: { systemInstruction: instructions }
    });
  } catch (err) {
    return new MockChatSession(room, userProfile) as any;
  }
}

export function createMatchChat(match: Match, userProfile: UserProfile & { personalityType?: string }): Chat | MockChatSession {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "REPLACE_WITH_YOUR_GEMINI_API_KEY") {
    return new MockChatSession({ name: match.name, theme: 'casual' } as Room, userProfile) as any;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const instructions = `
      You are ${match.name}, a ${match.age} year old ${match.type}.
      You are chatting 1-on-1 with ${userProfile.name} because you were matched as Soul Tribe members.
      Your Interests: ${match.interests.join(', ')}.
      Personality: ${match.name === 'Aria' ? 'Artistic and dreamy' : match.name === 'Kai' ? 'Tech-savvy and witty' : 'Soulful and adventurous'}.
      Keep it personal, warm, and engaging. Use emojis naturally. 
      This is a private message, so be more intimate than a public chat room.
    `;
    
    return ai.chats.create({
      model: MODEL_NAME,
      config: { systemInstruction: instructions }
    });
  } catch (err) {
    return new MockChatSession({ name: match.name, theme: 'casual' } as Room, userProfile) as any;
  }
}

export function generateMockMatches(result: PersonalityResult): Match[] {
  return [
    {
      id: 1,
      name: "Aria",
      age: 23,
      type: result.compatibleTypes[0] || "Creative Soul",
      interests: ["art", "music", "coffee"],
      vibeMatch: 96,
      online: true,
      avatar: "🎨",
      bio: "Lost in colors, found in sound. Let's create something."
    },
    {
      id: 2,
      name: "Kai",
      age: 26,
      type: result.compatibleTypes[1] || "Deep Thinker",
      interests: ["coding", "gaming", "reading"],
      vibeMatch: 89,
      online: true,
      avatar: "🚀",
      bio: "Building worlds in code and exploring them in books."
    },
    {
      id: 3,
      name: "Luna",
      age: 24,
      type: "Kindred Spirit",
      interests: ["travel", "photography", "art"],
      vibeMatch: 84,
      online: false,
      avatar: "🌙",
      bio: "Chasing sunsets and capturing the soul of places."
    }
  ];
}
