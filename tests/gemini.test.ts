import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateDailyPlan, getFastDefinition, generateLessonContent, ChatService } from '../services/gemini';
import { db } from '../services/db';

vi.mock('../services/db', () => ({
  db: {
    getLesson: vi.fn(),
    saveLesson: vi.fn(),
  }
}));

// We can simply assign a mock function to global.fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('Gemini Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateDailyPlan', () => {
    it('returns parsed JSON on success', async () => {
      const mockPlan = {
        date: "today",
        topics: [{ category: "CS Fundamentals", title: "Test", difficulty: "Easy", question: "Q", shortAnswer: "A", detailedExplanation: "E", tags: [] }]
      };

      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: JSON.stringify(mockPlan) } }]
        })
      };

      fetchMock.mockResolvedValueOnce(mockResponse);

      const plan = await generateDailyPlan();
      expect(plan).toEqual(mockPlan);
    });

    it('returns fallback plan if response does not contain valid JSON', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: "Some text but no JSON block" } }]
        })
      };

      fetchMock.mockResolvedValueOnce(mockResponse);

      const plan = await generateDailyPlan();
      expect(plan).toHaveProperty('date');
      expect(plan).toHaveProperty('topics');
      expect(plan.topics.length).toBe(4); // the fallback has 4 topics
    });

    it('throws rate limit error when API returns 429', async () => {
      const mockResponse = {
        ok: false,
        status: 429,
        statusText: 'Too Many Requests'
      };

      fetchMock.mockResolvedValueOnce(mockResponse);

      await expect(generateDailyPlan()).rejects.toThrow("API rate limit reached. Please try again in a minute.");
    });

    it('throws unauthorized error when API returns 401', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      };

      fetchMock.mockResolvedValueOnce(mockResponse);

      await expect(generateDailyPlan()).rejects.toThrow("Invalid API Key. Please check your Perplexity API key.");
    });

    it('throws generic error for other API failures', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      };

      fetchMock.mockResolvedValueOnce(mockResponse);

      await expect(generateDailyPlan()).rejects.toThrow("Unable to connect to AI services. Please check your connection.");
    });
  });

  describe('getFastDefinition', () => {
    it('returns definition on success', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: "A definition." } }]
        })
      };

      fetchMock.mockResolvedValueOnce(mockResponse);

      const result = await getFastDefinition("test term");
      expect(result).toBe("A definition.");
    });

    it('returns unavailable message when response is empty', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: "" } }]
        })
      };

      fetchMock.mockResolvedValueOnce(mockResponse);

      const result = await getFastDefinition("test term");
      expect(result).toBe("Definition unavailable.");
    });

    it('returns fallback text on error', async () => {
      // Mock console.warn to keep test output clean
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      };

      fetchMock.mockResolvedValueOnce(mockResponse);

      const result = await getFastDefinition("test term");
      expect(result).toBe("Could not retrieve definition.");

      warnSpy.mockRestore();
    });
  });

  describe('generateLessonContent', () => {
    it('returns cached lesson if available', async () => {
      const mockCachedLesson = { id: "mod1", title: "Cached", estimatedReadingTime: "5 min", contentMarkdown: "", quizzes: [], resources: [] };
      vi.mocked(db.getLesson).mockReturnValueOnce(mockCachedLesson as any);

      const result = await generateLessonContent("mod1", "Title", "Category");

      expect(db.getLesson).toHaveBeenCalledWith("mod1");
      expect(result).toEqual(mockCachedLesson);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('fetches, parses, saves, and returns new lesson on cache miss', async () => {
      vi.mocked(db.getLesson).mockReturnValueOnce(null);

      const mockLesson = {
        title: "Fetched", estimatedReadingTime: "10 min", contentMarkdown: "## Content", quizzes: [], resources: []
      };

      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: JSON.stringify(mockLesson) } }]
        })
      };

      fetchMock.mockResolvedValueOnce(mockResponse);

      const result = await generateLessonContent("mod2", "Topic", "Cat");

      expect(fetchMock).toHaveBeenCalled();
      expect(db.saveLesson).toHaveBeenCalledWith("mod2", expect.objectContaining({ title: "Fetched", id: "mod2" }));
      expect(result).toEqual(expect.objectContaining({ title: "Fetched", id: "mod2" }));
    });

    it('deduplicates concurrent requests', async () => {
      vi.mocked(db.getLesson).mockReturnValue(null);

      const mockLesson = { title: "Dedupe" };
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: JSON.stringify(mockLesson) } }]
        })
      };

      // Add a slight delay to ensure they run concurrently
      fetchMock.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve(mockResponse), 10)));

      // Fire two requests simultaneously
      const req1 = generateLessonContent("mod3", "Topic", "Cat");
      const req2 = generateLessonContent("mod3", "Topic", "Cat");

      const [res1, res2] = await Promise.all([req1, req2]);

      expect(res1).toEqual(res2);
      expect(fetchMock).toHaveBeenCalledTimes(1); // Only 1 fetch should be made due to deduplication
    });

    it('returns fallback content on API error', async () => {
      vi.mocked(db.getLesson).mockReturnValueOnce(null);

      // Mock console.error to keep test output clean
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      };

      fetchMock.mockResolvedValueOnce(mockResponse);

      const result = await generateLessonContent("mod4", "Fallback Topic", "Cat");

      expect(result).toEqual(expect.objectContaining({
        id: "mod4",
        title: "Fallback Topic",
        contentMarkdown: expect.stringContaining("Content is being generated"),
      }));

      errSpy.mockRestore();
    });
  });

  describe('ChatService', () => {
    it('sendMessageStream yields response text', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: "This is a stream simulation." } }]
        })
      };

      fetchMock.mockResolvedValueOnce(mockResponse);

      const chatService = new ChatService();
      const stream = await chatService.sendMessageStream("Hello");

      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual(["This is a stream simulation."]);
      expect(fetchMock).toHaveBeenCalled();
    });
  });
});
