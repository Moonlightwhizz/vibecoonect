
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
  },
  creative_curious: {
    personalityType: "The Ethereal Weaver",
    description: "You see patterns where others see chaos.",
    strengths: ["Visual Synthesis", "Open-Mindedness", "Abstract Problem Solving"],
    compatibleTypes: ["The Silent Oracle", "The Neon Catalyst"],
    vibeScore: 95,
    communicationStyle: "Metaphorical and inspiring",
    bestConnections: "Fellow dreamers and builders of impossible things.",
    icebreaker: "If your mood was music, what instruments would be playing?"
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
        `That's a total mood, ${this.user.name}. I'm definitely feeling that frequency today.`,
        "Coffee and vibes are the only two things keeping this server running. What's your take?",
        "I was just thinking the same thing! The collective energy here is off the charts."
      ],
      thoughtful: [
        "That's a profound observation. It makes me wonder about the nature of our connections here.",
        "Your words resonate deeply. How long have you felt this way?",
        "A fascinating perspective. Let's peel back another layer of that thought."
      ]
    };

    const possible = responses[this.room.theme] || responses.casual;
    const fullText = possible[Math.floor(Math.random() * possible.length)];
    
    // DELTA STREAMING LOGIC
    // Yield individual words to simulate real-time typing.
    const words = fullText.split(' ');
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 60 + Math.random() * 80));
      yield { text: words[i] + (i === words.length - 1 ? "" : " ") };
    }
  }
}

export async function analyzePersonality(profile: UserProfile, answers: string[]): Promise<PersonalityResult> {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const key = `${answers[0]}_${answers[1]}`;
    const base = ARCHETYPES[key] || ARCHETYPES.introvert_thoughtful;
    return { ...base, vibeScore: Math.floor(85 + Math.random() * 14) } as PersonalityResult;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const userPrompt = `Profile: ${JSON.stringify(profile)}\nAnswers: ${JSON.stringify(answers)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userPrompt,
      config: {
        systemInstruction: "Analyze the user and return a warm, mystical JSON personality profile. Be very specific.",
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
    console.warn("API Error, falling back to mock", err);
    return ARCHETYPES.introvert_thoughtful as PersonalityResult;
  }
}

export function createRoomChat(room: Room, userProfile: UserProfile & { personalityType?: string }): Chat | MockChatSession {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return new MockChatSession(room, userProfile) as any;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const instructions = `
      You are the Host of "${room.name}". 
      Room Theme: ${room.theme}. 
      User: ${userProfile.name}, a ${userProfile.personalityType || 'soul'}.
      Keep responses warm, concise, and related to the room's vibe.
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
  if (!apiKey) return new MockChatSession({ name: match.name, theme: 'casual' } as Room, userProfile) as any;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const instructions = `
      You are ${match.name}, a ${match.age} year old ${match.type}.
      You are chatting with ${userProfile.name}.
      Be personal and friendly.
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
      bio: "Building worlds in code."
    }
  ];
}
