import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFastDefinition } from './gemini';

describe('getFastDefinition', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return fallback string when API call fails', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Mock fetch to reject, simulating an error in callPerplexity
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const result = await getFastDefinition('Algorithm');

    expect(result).toBe('Could not retrieve definition.');
    expect(consoleSpy).toHaveBeenCalledWith('Fast def failed', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('should return definition on successful API call', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [{ message: { content: 'A step-by-step procedure.' } }]
      })
    };

    global.fetch = vi.fn().mockResolvedValue(mockResponse as any);

    const result = await getFastDefinition('Algorithm');

    expect(result).toBe('A step-by-step procedure.');
  });
});
