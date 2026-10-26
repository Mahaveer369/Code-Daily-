import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateDailyPlan } from './gemini';

// Mock fetch globally
global.fetch = vi.fn();

describe('gemini service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateDailyPlan', () => {
    it('should handle error when callPerplexity throws an API rate limit error', async () => {
      // Mock fetch to simulate an error response from Perplexity API
      const mockErrorResponse = {
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: async () => ({ error: { message: 'Quota exceeded' } })
      };

      (global.fetch as any).mockResolvedValueOnce(mockErrorResponse);

      // Expected behavior based on the implementation
      // `handleApiError` will be called, which throws an Error
      await expect(generateDailyPlan()).rejects.toThrow('API rate limit reached. Please try again in a minute.');
    });

    it('should handle error when callPerplexity throws an invalid API key error', async () => {
      // Mock fetch to simulate an error response from Perplexity API
      const mockErrorResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ error: { message: 'Unauthorized' } })
      };

      (global.fetch as any).mockResolvedValueOnce(mockErrorResponse);

      // Expected behavior based on the implementation
      // `handleApiError` will be called, which throws an Error
      await expect(generateDailyPlan()).rejects.toThrow('Invalid API Key. Please check your Perplexity API key.');
    });

    it('should handle general connection errors', async () => {
      // Mock fetch to simulate a network error
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(generateDailyPlan()).rejects.toThrow('Unable to connect to AI services. Please check your connection.');
    });
  });
});
