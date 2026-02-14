
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { UserProfile, PersonalityResult, Room, Match } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

// --- MOCK LOGIC FOR NO-API-KEY MODE ---
const ARCHETYPES: Record<string, Partial<PersonalityResult>> = {
  introvert_thoughtful: {
    personalityType: "The Silent Oracle",
    description: "A deep soul who finds wisdom in the spaces between words.",
    strengths: ["Deep Listening", "Strategic Intuition", "Emotional Depth"],
    compatibleTypes: ["The Radiant Spark", "The Ethereal Weaver"],
    vibeScore: 92,
    communicationStyle: "Thoughtful and measured",
    bestConnections: "People who appreciate silence and long letters.",
    icebreaker: "If you could whisper a secret to the moon, what would it be?"
  },
  extrovert_spontaneous: {
    personalityType: "The Neon Catalyst",
    description: "A burst of pure social energy.",
    strengths: ["Magnetic Charisma", "Infinite Energy", "Adaptive Wit"],
    compatibleTypes: ["The Grounded Sage", "The Digital Nomad"],
    vibeScore: 98,
    communicationStyle: "Rapid, witty, and infectious",
    bestConnections: "Anyone ready for an unplanned adventure.",
    icebreaker: "What's the most spontaneous thing you've done in the last 24 hours?"
  }
};

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
        `I totally get that frequency, ${this.user.name}.`,
        "Vibes are immaculate in this channel right now.",
        "Your energy is definitely shifting the room's atmosphere in a good way."
      ],
      thoughtful: [
        "That's a very centered observation. How long have you felt that way?",
        "Interesting. The Oracle deck suggests your path is currently aligned with that thought.",
        "A profound perspective. Connections are built on such clarity."
      ]
    };

    const possible = responses[this.room.theme] || responses.casual;
    const fullText = possible[Math.floor(Math.random() * possible.length)];
    
    // Yield words as deltas to simulate typing
    const words = fullText.split(' ');
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
      yield { text: words[i] + (i === words.length - 1 ? "" : " ") };
    }
  }
}

export async function analyzePersonality(profile: UserProfile, answers: string[]): Promise<PersonalityResult> {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const key = `${answers[0]}_${answers[1]}`;
    const base = ARCHETYPES[key] || ARCHETYPES.introvert_thoughtful;
    return { ...base, vibeScore: Math.floor(85 + Math.random() * 14) } as PersonalityResult;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Profile: ${JSON.stringify(profile)}\nAnswers: ${JSON.stringify(answers)}`,
      config: {
        systemInstruction: "Analyze the user based on their profile and quiz answers. Return a warm, mystical JSON personality profile.",
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
  } catch (e) {
    console.error("Synthesis Error:", e);
    // Fallback to mock on any error
    return ARCHETYPES.introvert_thoughtful as PersonalityResult;
  }
}

export function createRoomChat(room: Room, userProfile: UserProfile & { personalityType?: string }): any {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') return new MockChatSession(room, userProfile);

  const ai = new GoogleGenAI({ apiKey });
  return ai.chats.create({
    model: MODEL_NAME,
    config: { 
      systemInstruction: `You are the Host of the "${room.name}" room. Theme: ${room.theme}. User is ${userProfile.name}, a ${userProfile.personalityType || 'new soul'}. Be warm, concise, and stay focused on the room's vibe.` 
    }
  });
}

export function createMatchChat(match: Match, userProfile: UserProfile & { personalityType?: string }): any {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'undefined') return new MockChatSession({ name: match.name, theme: 'casual' } as Room, userProfile);

  const ai = new GoogleGenAI({ apiKey });
  return ai.chats.create({
    model: MODEL_NAME,
    config: { 
      systemInstruction: `You are ${match.name}, a ${match.age} year old ${match.type}. You are chatting with ${userProfile.name}. Be friendly, slightly mysterious, and engaging.` 
    }
  });
}

export function generateMockMatches(result: PersonalityResult): Match[] {
  return [
    {
      id: "aria-ai",
      name: "Aria",
      age: 23,
      type: result.compatibleTypes[0] || "Creative Soul",
      interests: ["art", "music"],
      vibeMatch: 96,
      online: true,
      avatar: "🎨",
      bio: "Lost in colors, found in sound."
    },
    {
      id: "kai-ai",
      name: "Kai",
      age: 26,
      type: result.compatibleTypes[1] || "Deep Thinker",
      interests: ["coding", "gaming"],
      vibeMatch: 89,
      online: true,
      avatar: "🚀",
      bio: "Building worlds in code and exploring them in books."
    }
  ];
}
