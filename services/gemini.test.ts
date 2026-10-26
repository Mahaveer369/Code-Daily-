import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateLessonContent } from './gemini';
import { db } from './db';
import { LessonContent } from '../types';

// Mock the db dependency
vi.mock('./db', () => ({
  db: {
    getLesson: vi.fn(),
    saveLesson: vi.fn(),
  },
}));

// Stub the global fetch API
global.fetch = vi.fn();

describe('generateLessonContent', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return cached content if available in db', async () => {
    const mockCachedLesson: LessonContent = {
      id: 'mod1',
      title: 'Test Topic',
      estimatedReadingTime: '5 min',
      contentMarkdown: '## Test Content',
      quizzes: [],
      resources: [],
    };

    vi.mocked(db.getLesson).mockReturnValue(mockCachedLesson);

    const result = await generateLessonContent('mod1', 'Test Topic', 'Test Category');

    expect(db.getLesson).toHaveBeenCalledWith('mod1');
    expect(result).toEqual(mockCachedLesson);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should fetch from API, save to db, and return content on cache miss', async () => {
    vi.mocked(db.getLesson).mockReturnValue(null);

    const mockApiResponse = {
      title: 'New Topic',
      estimatedReadingTime: '15 min',
      contentMarkdown: '## New Content',
      quizzes: [],
      codingChallenge: undefined,
      interviewQuestions: [],
      resources: [],
    };

    const fetchResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockApiResponse),
            },
          },
        ],
      }),
    };
    vi.mocked(global.fetch).mockResolvedValue(fetchResponse as any);

    const result = await generateLessonContent('mod2', 'New Topic', 'Test Category');

    expect(db.getLesson).toHaveBeenCalledWith('mod2');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(db.saveLesson).toHaveBeenCalledWith('mod2', expect.objectContaining({
      id: 'mod2',
      title: 'New Topic',
      estimatedReadingTime: '15 min',
      contentMarkdown: '## New Content',
    }));

    expect(result).toEqual({ ...mockApiResponse, id: 'mod2' });
  });

  it('should deduplicate concurrent in-flight requests for the same moduleId', async () => {
    vi.mocked(db.getLesson).mockReturnValue(null);

    const mockApiResponse = {
      title: 'Dedupe Topic',
      estimatedReadingTime: '10 min',
      contentMarkdown: '## Dedupe Content',
    };

    // Simulate an API delay
    const fetchResponse = {
      ok: true,
      json: vi.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        return {
          choices: [
            {
              message: {
                content: JSON.stringify(mockApiResponse),
              },
            },
          ],
        };
      }),
    };
    vi.mocked(global.fetch).mockResolvedValue(fetchResponse as any);

    // Make 3 concurrent calls
    const promises = [
      generateLessonContent('mod3', 'Dedupe Topic', 'Cat'),
      generateLessonContent('mod3', 'Dedupe Topic', 'Cat'),
      generateLessonContent('mod3', 'Dedupe Topic', 'Cat'),
    ];

    const results = await Promise.all(promises);

    // API should only be called once
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // All promises should resolve to the same result
    expect(results[0]).toEqual({ ...mockApiResponse, id: 'mod3' });
    expect(results[1]).toEqual(results[0]);
    expect(results[2]).toEqual(results[0]);
  });

  it('should handle API errors and return a fallback lesson content', async () => {
    vi.mocked(db.getLesson).mockReturnValue(null);

    // Mock console.error to prevent it from cluttering the test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Force an API error
    vi.mocked(global.fetch).mockRejectedValue(new Error('Network Failure'));

    const result = await generateLessonContent('mod4', 'Error Topic', 'Test Category');

    expect(global.fetch).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      id: 'mod4',
      title: 'Error Topic',
      estimatedReadingTime: '10 min',
      contentMarkdown: '# Error Topic\n\nContent is being generated. Please refresh.',
      quizzes: [],
      resources: [],
    });

    consoleSpy.mockRestore();
  });

  it('should handle invalid JSON responses and return fallback content', async () => {
    vi.mocked(db.getLesson).mockReturnValue(null);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const fetchResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: 'this is not valid json',
            },
          },
        ],
      }),
    };
    vi.mocked(global.fetch).mockResolvedValue(fetchResponse as any);

    const result = await generateLessonContent('mod5', 'Invalid JSON Topic', 'Test Category');

    expect(result).toEqual({
      id: 'mod5',
      title: 'Invalid JSON Topic',
      estimatedReadingTime: '10 min',
      contentMarkdown: '# Invalid JSON Topic\n\nContent is being generated. Please refresh.',
      quizzes: [],
      resources: [],
    });

    consoleSpy.mockRestore();
  });
});
