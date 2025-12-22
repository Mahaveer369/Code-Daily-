
import { DailyPlan, Category, LessonContent } from '../types';
import { db } from './db';

// Perplexity API Configuration
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const getApiKey = () => import.meta.env.VITE_PERPLEXITY_API_KEY || '';

// --- Error Handling Helper ---
const handleApiError = (error: any): never => {
  console.error("Perplexity API Error:", error);
  const msg = error.message || '';

  if (msg.includes('429') || msg.includes('Quota')) {
    throw new Error("API rate limit reached. Please try again in a minute.");
  }
  if (msg.includes('401') || msg.includes('Unauthorized')) {
    throw new Error("Invalid API Key. Please check your Perplexity API key.");
  }

  throw new Error("Unable to connect to AI services. Please check your connection.");
};

// --- Perplexity Chat Completion ---
const callPerplexity = async (systemPrompt: string, userPrompt: string): Promise<string> => {
  const response = await fetch(PERPLEXITY_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
};

// --- Daily Plan ---
export const generateDailyPlan = async (): Promise<DailyPlan> => {
  const today = new Date().toDateString();

  const systemPrompt = `You are a senior Computer Science interviewer. 
Generate a structured JSON response containing exactly one "Question of the Day" for each category:
1. CS Fundamentals
2. DBMS
3. System Design
4. DSA

Return ONLY valid JSON with this exact structure:
{
  "date": "today's date",
  "topics": [
    {
      "category": "CS Fundamentals",
      "title": "...",
      "difficulty": "Easy|Medium|Hard",
      "question": "...",
      "shortAnswer": "2-3 sentences",
      "detailedExplanation": "markdown explanation",
      "tags": ["tag1", "tag2"]
    }
  ]
}`;

  try {
    const content = await callPerplexity(systemPrompt, `Generate today's study plan for: ${today}`);

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as DailyPlan;
    }

    // Fallback plan if parsing fails
    return {
      date: today,
      topics: [
        {
          category: Category.CS_CORE,
          title: "Process vs Thread",
          difficulty: "Medium",
          question: "What is the difference between a process and a thread?",
          shortAnswer: "A process is an independent program with its own memory space. A thread is a lightweight unit within a process sharing memory.",
          detailedExplanation: "Processes are isolated programs...",
          tags: ["OS", "Concurrency"]
        },
        {
          category: Category.DBMS,
          title: "ACID Properties",
          difficulty: "Medium",
          question: "Explain ACID properties in databases",
          shortAnswer: "ACID stands for Atomicity, Consistency, Isolation, Durability - key properties for reliable transactions.",
          detailedExplanation: "ACID ensures database reliability...",
          tags: ["Transactions", "SQL"]
        },
        {
          category: Category.SYSTEM_DESIGN,
          title: "Load Balancing",
          difficulty: "Medium",
          question: "How does a load balancer work?",
          shortAnswer: "A load balancer distributes incoming traffic across multiple servers to ensure reliability and performance.",
          detailedExplanation: "Load balancers use algorithms like round-robin...",
          tags: ["Scalability", "Infrastructure"]
        },
        {
          category: Category.DSA,
          title: "Binary Search",
          difficulty: "Easy",
          question: "When should you use binary search?",
          shortAnswer: "Use binary search when searching in a sorted collection for O(log n) time complexity.",
          detailedExplanation: "Binary search halves the search space each iteration...",
          tags: ["Algorithms", "Searching"]
        }
      ]
    };
  } catch (error) {
    handleApiError(error);
  }
};

export const getFastDefinition = async (term: string): Promise<string> => {
  try {
    const content = await callPerplexity(
      "You are a CS expert. Define terms concisely in max 30 words.",
      `Define "${term}" in CS context.`
    );
    return content || "Definition unavailable.";
  } catch (error) {
    console.warn("Fast def failed", error);
    return "Could not retrieve definition.";
  }
};

// --- Course Content Generation ---
const pendingRequests = new Map<string, Promise<LessonContent>>();

export const generateLessonContent = async (moduleId: string, topicTitle: string, category: string): Promise<LessonContent> => {
  // 1. Check cache first
  const cached = db.getLesson(moduleId);
  if (cached) return cached;

  // 2. Dedupe in-flight requests
  if (pendingRequests.has(moduleId)) {
    return pendingRequests.get(moduleId)!;
  }

  console.log(`[Perplexity] Fetching content for ${moduleId}`);

  const fetchPromise = (async () => {
    try {
      const systemPrompt = `You are a Senior Engineer creating course content. Return ONLY valid JSON.`;

      const userPrompt = `Create a learning module for: "${topicTitle}" in "${category}".
Return JSON with this structure:
{
  "title": "...",
  "estimatedReadingTime": "X min",
  "contentMarkdown": "## Introduction\\n...",
  "quizzes": [
    {"id": "q1", "question": "...", "options": ["A", "B", "C", "D"], "correctAnswerIndex": 0, "explanation": "..."}
  ],
  "codingChallenge": {
    "title": "...",
    "description": "...",
    "language": "python",
    "starterCode": "# Your code here",
    "solutionCode": "...",
    "hint": "..."
  },
  "interviewQuestions": [
    {"question": "...", "companyTag": "Google", "answer": "..."}
  ],
  "resources": [
    {"title": "...", "type": "Book", "authorOrSource": "..."}
  ]
}`;

      const content = await callPerplexity(systemPrompt, userPrompt);

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const lesson = JSON.parse(jsonMatch[0]) as LessonContent;
        lesson.id = moduleId;
        db.saveLesson(moduleId, lesson);
        return lesson;
      }

      throw new Error("Could not parse lesson content");
    } catch (error) {
      console.error(error);
      // Return fallback content
      return {
        id: moduleId,
        title: topicTitle,
        estimatedReadingTime: "10 min",
        contentMarkdown: `# ${topicTitle}\n\nContent is being generated. Please refresh.`,
        quizzes: [],
        resources: []
      } as LessonContent;
    } finally {
      pendingRequests.delete(moduleId);
    }
  })();

  pendingRequests.set(moduleId, fetchPromise);
  return fetchPromise;
};

// --- Chat Service ---
export class ChatService {
  async sendMessageStream(message: string): Promise<AsyncIterable<string>> {
    const content = await callPerplexity(
      "You are an expert CS tutor for Code IIT Out. Be concise, accurate, and code-focused.",
      message
    );

    // Simulate streaming by yielding the full response
    async function* textGenerator() {
      yield content;
    }
    return textGenerator();
  }
}
