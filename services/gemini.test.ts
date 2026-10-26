import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateDailyPlan } from './gemini';
import { Category } from '../types';

describe('generateDailyPlan', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return a parsed plan on successful valid JSON response', async () => {
    const mockPlan = {
      date: new Date().toDateString(),
      topics: [
        {
          category: 'CS Fundamentals',
          title: 'Mock Title',
          difficulty: 'Easy',
          question: 'Mock Question?',
          shortAnswer: 'Mock short answer.',
          detailedExplanation: 'Mock detailed explanation.',
          tags: ['mock', 'test']
        }
      ]
    };
    const mockResponse = {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify(mockPlan)
            }
          }
        ]
      })
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const plan = await generateDailyPlan();
    expect(plan).toEqual(mockPlan);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should return the fallback plan when the response does not contain valid JSON', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: "I'm sorry, I cannot provide a JSON right now."
            }
          }
        ]
      })
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const plan = await generateDailyPlan();

    // Check that it returns the fallback plan by verifying structure
    expect(plan).toBeDefined();
    expect(plan?.date).toBe(new Date().toDateString());
    expect(plan?.topics).toHaveLength(4);
    expect(plan?.topics[0].title).toBe("Process vs Thread");
  });

  it('should throw an error on API rate limit (429 status)', async () => {
    const mockResponse = {
      ok: false,
      status: 429,
      statusText: 'Too Many Requests'
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    await expect(generateDailyPlan()).rejects.toThrow('API rate limit reached. Please try again in a minute.');
  });

  it('should throw an error on Unauthorized (401 status)', async () => {
    const mockResponse = {
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    await expect(generateDailyPlan()).rejects.toThrow('Invalid API Key. Please check your Perplexity API key.');
  });
});
