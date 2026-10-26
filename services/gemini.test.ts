import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateLessonContent } from './gemini';
import { db } from './db';

// Mock import.meta.env
vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_PERPLEXITY_API_KEY: 'test-api-key',
    },
  },
});

describe('gemini service', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.reject(new Error('Network Error'))
    );

    vi.spyOn(db, 'getLesson').mockReturnValue(null);
    vi.spyOn(db, 'saveLesson').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('generateLessonContent returns fallback content when callPerplexity throws', async () => {
    const moduleId = 'mod1';
    const topicTitle = 'Test Topic';
    const category = 'Test Category';

    const result = await generateLessonContent(moduleId, topicTitle, category);

    expect(result).toEqual({
      id: moduleId,
      title: topicTitle,
      estimatedReadingTime: "10 min",
      contentMarkdown: `# ${topicTitle}\n\nContent is being generated. Please refresh.`,
      quizzes: [],
      resources: []
    });
  });
});
