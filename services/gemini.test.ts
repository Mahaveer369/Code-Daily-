import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChatService } from './gemini';

// Setup environment variable used by gemini.ts
vi.stubEnv('VITE_PERPLEXITY_API_KEY', 'test-api-key');

describe('ChatService', () => {
  let chatService: ChatService;

  beforeEach(() => {
    chatService = new ChatService();
    // Clear mocks before each test
    vi.restoreAllMocks();
  });

  it('should successfully send a message and consume the async stream', async () => {
    const mockResponseText = 'This is a mock response from the AI.';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: mockResponseText
            }
          }
        ]
      })
    });

    global.fetch = mockFetch;

    const stream = await chatService.sendMessageStream('Hello, how does a binary search work?');

    let result = '';
    for await (const chunk of stream) {
      result += chunk;
    }

    // Check that fetch was called with the correct parameters
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchArgs = mockFetch.mock.calls[0];
    expect(fetchArgs[0]).toBe('https://api.perplexity.ai/chat/completions');
    expect(fetchArgs[1].method).toBe('POST');
    expect(fetchArgs[1].headers).toEqual({
      'Authorization': 'Bearer test-api-key',
      'Content-Type': 'application/json',
    });

    // Check that the payload was correct
    const body = JSON.parse(fetchArgs[1].body);
    expect(body.model).toBe('sonar');
    expect(body.messages[0].role).toBe('system');
    expect(body.messages[1].role).toBe('user');
    expect(body.messages[1].content).toBe('Hello, how does a binary search work?');

    // Check the final streamed result
    expect(result).toBe(mockResponseText);
  });

  it('should handle API rate limit errors (429)', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests'
    });

    global.fetch = mockFetch;

    await expect(chatService.sendMessageStream('Hello')).rejects.toThrow('API rate limit reached. Please try again in a minute.');
  });

  it('should handle unauthorized errors (401)', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    });

    global.fetch = mockFetch;

    await expect(chatService.sendMessageStream('Hello')).rejects.toThrow('Invalid API Key. Please check your Perplexity API key.');
  });

  it('should handle other connection or API errors', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));

    global.fetch = mockFetch;

    await expect(chatService.sendMessageStream('Hello')).rejects.toThrow('Unable to connect to AI services. Please check your connection.');
  });
});
