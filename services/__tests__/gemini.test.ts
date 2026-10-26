import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getFastDefinition } from '../gemini';

describe('getFastDefinition', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    global.fetch = vi.fn();
    vi.stubEnv('VITE_PERPLEXITY_API_KEY', 'test-api-key');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('should return a concise definition on successful API call', async () => {
    const mockContent = 'Binary search is an efficient algorithm for finding an item from a sorted list of items.';
    const mockResponse = {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: mockContent,
            },
          },
        ],
      }),
    };
    (global.fetch as any).mockResolvedValueOnce(mockResponse);

    const result = await getFastDefinition('Binary search');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://api.perplexity.ai/chat/completions', expect.objectContaining({
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      }
    }));

    expect(result).toBe(mockContent);
  });

  it('should return "Definition unavailable." if API returns empty content', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: '',
            },
          },
        ],
      }),
    };
    (global.fetch as any).mockResolvedValueOnce(mockResponse);

    const result = await getFastDefinition('Unknown term');

    expect(result).toBe('Definition unavailable.');
  });

  it('should return "Definition unavailable." if API response format is unexpected', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        // Missing choices array
      }),
    };
    (global.fetch as any).mockResolvedValueOnce(mockResponse);

    const result = await getFastDefinition('Unknown term');

    expect(result).toBe('Definition unavailable.');
  });

  it('should return "Could not retrieve definition." if fetch fails', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    // Spy on console.warn to keep test output clean and verify it's called
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await getFastDefinition('Network failure term');

    expect(result).toBe('Could not retrieve definition.');
    expect(warnSpy).toHaveBeenCalled();
  });

  it('should return "Could not retrieve definition." if API returns non-ok status', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    };
    (global.fetch as any).mockResolvedValueOnce(mockResponse);

    // Spy on console.warn to keep test output clean and verify it's called
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await getFastDefinition('Error term');

    expect(result).toBe('Could not retrieve definition.');
    expect(warnSpy).toHaveBeenCalled();
  });
});
