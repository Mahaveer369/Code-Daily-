
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { DailyPlan, Category, LessonContent } from '../types';
import { db } from './db';

// Initialize Gemini Client
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Error Handling Helper ---
const handleGeminiError = (error: any): never => {
  console.error("Gemini API Error:", error);
  const msg = error.message || '';
  
  if (msg.includes('429') || msg.includes('Quota')) {
    throw new Error("We've hit the AI speed limit (Quota Exceeded). Please try again in a minute.");
  }
  if (msg.includes('503') || msg.includes('Overloaded')) {
    throw new Error("The AI servers are currently overloaded. Please wait a moment.");
  }
  if (msg.includes('API key')) {
    throw new Error("Invalid API Key configuration.");
  }
  
  throw new Error("Unable to connect to AI services. Please check your connection.");
};

const SYSTEM_INSTRUCTION_DAILY = `
You are a senior Computer Science interviewer. 
Generate a structured JSON response containing exactly one "Question of the Day" for each category:
1. CS Fundamentals
2. DBMS
3. System Design
4. DSA

Ensure questions are challenging. "shortAnswer" must be 2-3 sentences. "detailedExplanation" must be markdown.
`;

const DAILY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    date: { type: Type.STRING },
    topics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, enum: Object.values(Category) },
          title: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
          question: { type: Type.STRING },
          shortAnswer: { type: Type.STRING },
          detailedExplanation: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["category", "title", "difficulty", "question", "shortAnswer", "detailedExplanation", "tags"]
      }
    }
  },
  required: ["date", "topics"]
};

// --- Daily Plan ---
export const generateDailyPlan = async (): Promise<DailyPlan> => {
  const ai = getAiClient();
  const today = new Date().toDateString();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate the daily study plan for today: ${today}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_DAILY,
        responseMimeType: "application/json",
        responseSchema: DAILY_SCHEMA,
        temperature: 0.7,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as DailyPlan;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    handleGeminiError(error);
  }
};

export const getFastDefinition = async (term: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: `Define "${term}" in CS context. Max 30 words. Plain text.`,
    });
    return response.text || "Definition unavailable.";
  } catch (error) {
    console.warn("Fast def failed", error);
    return "Could not retrieve definition.";
  }
};

// --- Course Content Generation ---

const LESSON_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    estimatedReadingTime: { type: Type.STRING },
    contentMarkdown: { type: Type.STRING, description: "Deep-dive article with Introduction, Core Concepts, and Internals." },
    diagramSvg: { type: Type.STRING, description: "Professional SVG diagram visualizing the concept architecture." },
    quizzes: {
      type: Type.ARRAY,
      description: "List of 3-5 assessment questions",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswerIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING }
        },
        required: ["question", "options", "correctAnswerIndex", "explanation"]
      }
    },
    codingChallenge: {
      type: Type.OBJECT,
      description: "An interactive coding problem for the playground",
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        language: { type: Type.STRING, enum: ['python', 'javascript', 'sql', 'java'] },
        starterCode: { type: Type.STRING },
        solutionCode: { type: Type.STRING },
        hint: { type: Type.STRING }
      },
      required: ["title", "description", "language", "starterCode", "solutionCode"]
    },
    interviewQuestions: {
      type: Type.ARRAY,
      description: "List of 2 potential interview questions related to this topic.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          companyTag: { type: Type.STRING, description: "e.g. Google, Amazon" },
          answer: { type: Type.STRING }
        },
        required: ["question", "answer"]
      }
    },
    resources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
           title: { type: Type.STRING },
           type: { type: Type.STRING, enum: ['Book', 'Research Paper', 'Documentation'] },
           authorOrSource: { type: Type.STRING }
        },
        required: ["title", "type", "authorOrSource"]
      }
    }
  },
  required: ["title", "contentMarkdown", "quizzes", "resources", "estimatedReadingTime"]
};

// In-memory Deduplication Map to prevent double fetching
const pendingRequests = new Map<string, Promise<LessonContent>>();

const generateSearchUrl = (resource: any) => {
  const query = encodeURIComponent(`${resource.title} ${resource.authorOrSource} ${resource.type}`);
  return `https://www.google.com/search?q=${query}`;
};

export const generateLessonContent = async (moduleId: string, topicTitle: string, category: string): Promise<LessonContent> => {
  // 1. Check "Database" first
  const cached = db.getLesson(moduleId);
  if (cached) return cached;

  // 2. Check if a request is already in flight (Deduplication)
  if (pendingRequests.has(moduleId)) {
    return pendingRequests.get(moduleId)!;
  }

  // 3. If miss, fetch from AI
  console.log(`[Gemini] Fetching new content for ${moduleId}`);
  
  const fetchPromise = (async () => {
    const ai = getAiClient();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: `
          Act as a Senior Engineer and Course Creator for 'Vibe Coding' Academy.
          Create a mastery-level learning module for: "${topicTitle}" in the course "${category}".
          
          **Requirements:**
          1. **Deep Theory**: Markdown format. History, Syntax, Memory Internals (Stack/Heap), and Advanced Usage.
          2. **Visuals**: A clean, technical SVG diagram.
          3. **Assessment**: 3 distinct quiz questions testing conceptual understanding.
          4. **Code Lab**: A coding challenge that requires the user to write code. Provide starter code and a solution.
          5. **Career Prep**: 2 Real interview questions.
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: LESSON_SCHEMA,
          temperature: 0.2,
        }
      });

      if (response.text) {
        const content = JSON.parse(response.text) as LessonContent;
        content.id = moduleId;
        
        // Enrich resources with search links
        content.resources = content.resources.map(r => ({
          ...r,
          url: generateSearchUrl(r)
        }));

        // 4. Save to "Database"
        db.saveLesson(moduleId, content);
        return content;
      }
      throw new Error("No lesson generated");
    } catch (error) {
      handleGeminiError(error);
      throw error;
    } finally {
      pendingRequests.delete(moduleId);
    }
  })();

  pendingRequests.set(moduleId, fetchPromise);
  return fetchPromise;
}

// --- Chat Service ---
export class ChatService {
  private chat: Chat | null = null;
  private model: string = 'gemini-3-pro-preview';

  constructor() {
    const ai = getAiClient();
    this.chat = ai.chats.create({
      model: this.model,
      config: {
        systemInstruction: "You are an expert CS tutor for Vibe Coding. Concise, accurate, code-focused.",
      }
    });
  }

  async sendMessageStream(message: string): Promise<AsyncIterable<string>> {
    if (!this.chat) throw new Error("Chat not initialized");
    
    try {
      const responseStream = await this.chat.sendMessageStream({ message });
      async function* textGenerator() {
        for await (const chunk of responseStream) {
          if (chunk.text) yield chunk.text;
        }
      }
      return textGenerator();
    } catch (error) {
      handleGeminiError(error);
    }
  }
}
