import React, { useState, useEffect, useMemo } from 'react';
import { Course, CourseModule, LessonContent, Category, MustSolveExercise } from '../types';
import MarkdownRenderer, { formatLatexMath } from './MarkdownRenderer';
import { db } from '../services/db';
import { getCurriculumLesson } from '../services/curriculum';
import { EXPANDED_COURSES } from '../services/curriculum/deepCatalog25';
import { getTrackVisualDataUri } from '../services/curriculum/visualAssets';
import CodePlayground from './CodePlayground';
import QuizComponent from './QuizComponent';

export const COURSES: Course[] = EXPANDED_COURSES;

export const TOTAL_MODULES_COUNT = COURSES.reduce((sum, c) => sum + c.modules.length, 0);

interface Props {
  onComplete: (moduleId: string) => void;
  initialCourseId?: string;
  initialModuleId?: string;
}

type DeckTab = 'code' | 'quiz' | 'interview' | 'resources';

const LearningModule: React.FC<Props> = ({ onComplete, initialCourseId, initialModuleId }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [topicSearch, setTopicSearch] = useState<string>('');
  const [sidebarFilter, setSidebarFilter] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState<CourseModule | null>(null);
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [activeDeckTab, setActiveDeckTab] = useState<DeckTab>('code');
  const [mobileZone, setMobileZone] = useState<'theory' | 'deck'>('theory');
  const [customTryCode, setCustomTryCode] = useState<{ code: string; language: string } | null>(null);
  const [isSplitTryitOpen, setIsSplitTryitOpen] = useState<boolean>(false);
  const [isModalFullscreen, setIsModalFullscreen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isCodeLabOpen, setIsCodeLabOpen] = useState<boolean>(false);
  const [isWideLab, setIsWideLab] = useState<boolean>(false);
  const [labPulse, setLabPulse] = useState<boolean>(false);

  // Interactive Fill-in-the-Blank & Must-Solve Exercises State
  const [exerciseInput, setExerciseInput] = useState<string>('');
  const [exerciseStatus, setExerciseStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showExerciseAnswer, setShowExerciseAnswer] = useState<boolean>(false);
  const [mustSolveInputs, setMustSolveInputs] = useState<Record<string, string>>({});
  const [mustSolveStatuses, setMustSolveStatuses] = useState<Record<string, 'idle' | 'correct' | 'wrong'>>({});
  const [mustSolveShowAns, setMustSolveShowAns] = useState<Record<string, boolean>>({});

  // Bookmark Note Modal
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Sync deep link courseId / moduleId (supports legacy c8 -> c-html, c9 -> c-js, c10 -> c-react)
  useEffect(() => {
    if (initialCourseId) {
      const legacyMap: Record<string, string> = {
        c8: 'c-html',
        c9: 'c-js',
        c10: 'c-react',
      };
      const resolvedCourseId = legacyMap[initialCourseId] || initialCourseId;
      const foundCourse = COURSES.find(c => c.id === resolvedCourseId);
      if (foundCourse) {
        setSelectedCourse(foundCourse);
        if (initialModuleId) {
          const foundMod = foundCourse.modules.find(m => m.id === initialModuleId);
          setActiveModule(foundMod || foundCourse.modules[0] || null);
        } else {
          setActiveModule(foundCourse.modules[0] || null);
        }
        setMobileZone('theory');
      }
    }
  }, [initialCourseId, initialModuleId]);

  // Load lesson content synchronously in O(1) & reset exercise state on chapter change
  useEffect(() => {
    if (!activeModule) {
      setLessonContent(null);
      setCustomTryCode(null);
      return;
    }

    setCustomTryCode(null);
    setExerciseInput('');
    setExerciseStatus('idle');
    setShowExerciseAnswer(false);
    setMustSolveInputs({});
    setMustSolveStatuses({});
    setMustSolveShowAns({});

    const content = getCurriculumLesson(activeModule.id) || db.getLesson(activeModule.id);
    if (content) {
      setLessonContent(content);
    } else {
      setLessonContent({
        id: activeModule.id,
        title: activeModule.title,
        estimatedReadingTime: '10 mins',
        beginnerSummary: `${activeModule.title}: ${activeModule.description}`,
        contentMarkdown: `# ${activeModule.title}\n\n${activeModule.description}\n\nClick **Run Code** in the right-hand sandbox to experiment with this concept live.`,
        quizzes: [],
        interviewQuestions: [],
        resources: []
      });
    }

    const user = db.getCurrentUser();
    if (user) {
      const bookmarks = db.getBookmarks(user.id);
      setIsBookmarked(bookmarks.some(b => b.moduleId === activeModule.id));
    }
  }, [activeModule]);

  const handleNextModule = () => {
    if (!selectedCourse || !activeModule) return;
    const currentIndex = selectedCourse.modules.findIndex(m => m.id === activeModule.id);
    if (currentIndex >= 0 && currentIndex < selectedCourse.modules.length - 1) {
      setActiveModule(selectedCourse.modules[currentIndex + 1]);
    } else {
      const courseIdx = COURSES.findIndex(c => c.id === selectedCourse.id);
      if (courseIdx >= 0 && courseIdx < COURSES.length - 1) {
        const nextCourse = COURSES[courseIdx + 1];
        setSelectedCourse(nextCourse);
        setActiveModule(nextCourse.modules[0]);
      }
    }
  };

  const handlePreviousModule = () => {
    if (!selectedCourse || !activeModule) return;
    const currentIndex = selectedCourse.modules.findIndex(m => m.id === activeModule.id);
    if (currentIndex > 0) {
      setActiveModule(selectedCourse.modules[currentIndex - 1]);
    }
  };

  const handleMarkCurrentComplete = () => {
    if (!selectedCourse || !activeModule) return;
    const user = db.getCurrentUser();
    if (user) {
      db.markModuleComplete(user.id, selectedCourse.id, activeModule.id, 100);
      onComplete(activeModule.id);
    }
  };

  const handleTryCodeInSandbox = (code: string, language: string) => {
    setCustomTryCode({ code, language });
    setIsModalFullscreen(false);
    setIsSplitTryitOpen(true);
    setActiveDeckTab('code');
    setLabPulse(true);
    window.setTimeout(() => setLabPulse(false), 1100);
  };

  const normalizeAnswerToken = (val: string) =>
    val
      .trim()
      .replace(/^\$\s+/, '')
      .replace(/\s+/g, ' ')
      .toLowerCase();

  const handleVerifyMustSolve = (ex: MustSolveExercise) => {
    const rawUser = mustSolveInputs[ex.id] || '';
    const normUser = normalizeAnswerToken(rawUser);
    if (!normUser) return;

    const candidates = [ex.answer, ...(ex.acceptedAnswers || [])].map(normalizeAnswerToken);
    if (candidates.includes(normUser)) {
      setMustSolveStatuses(prev => ({ ...prev, [ex.id]: 'correct' }));
      handleMarkCurrentComplete();
    } else {
      setMustSolveStatuses(prev => ({ ...prev, [ex.id]: 'wrong' }));
    }
  };

  const handleCheckExercise = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = lessonContent?.fillBlankExercise?.answer?.trim() || '';
    if (!expected) return;
    if (normalizeAnswerToken(exerciseInput) === normalizeAnswerToken(expected)) {
      setExerciseStatus('correct');
      handleMarkCurrentComplete();
    } else {
      setExerciseStatus('wrong');
    }
  };

  const handleBookmarkToggle = () => {
    if (!activeModule) return;
    const user = db.getCurrentUser();
    if (!user) return;

    if (isBookmarked) {
      const bookmarks = db.getBookmarks(user.id);
      const match = bookmarks.find(b => b.moduleId === activeModule.id);
      if (match) {
        db.removeBookmark(user.id, match.id);
        setIsBookmarked(false);
      }
    } else {
      setShowBookmarkModal(true);
    }
  };

  const handleSaveBookmark = () => {
    if (!activeModule) return;
    const user = db.getCurrentUser();
    if (user) {
      db.addBookmark(user.id, {
        id: Date.now().toString(),
        moduleId: activeModule.id,
        moduleTitle: activeModule.title,
        note: bookmarkNote || `Saved note for ${activeModule.title}`,
        timestamp: Date.now()
      });
      setIsBookmarked(true);
      setShowBookmarkModal(false);
      setBookmarkNote('');
    }
  };

  const filteredCourses = useMemo(() => {
    return COURSES.filter(c => {
      const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
      if (!topicSearch.trim()) return matchesCat;
      const q = topicSearch.toLowerCase();
      const titleMatch = c.title.toLowerCase().includes(q) || (c.shortTag || '').toLowerCase().includes(q);
      const modMatch = c.modules.some(
        m => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
      );
      return matchesCat && (titleMatch || modMatch);
    });
  }, [selectedCategory, topicSearch]);

  // Group current course modules by sectionGroup for structured chapter sidebar headers
  const groupedSidebarModules = useMemo(() => {
    if (!selectedCourse) return [];
    const q = sidebarFilter.trim().toLowerCase();
    const groups: { groupName: string; items: { mod: CourseModule; index: number }[] }[] = [];

    selectedCourse.modules.forEach((mod, idx) => {
      if (q && !mod.title.toLowerCase().includes(q) && !mod.description.toLowerCase().includes(q)) {
        return;
      }
      const groupName = mod.sectionGroup || 'Core Chapters';
      let existing = groups.find(g => g.groupName === groupName);
      if (!existing) {
        existing = { groupName, items: [] };
        groups.push(existing);
      }
      existing.items.push({ mod, index: idx });
    });
    return groups;
  }, [selectedCourse, sidebarFilter]);

  // ============================================================================
  // VIEW 1: All 14 Subject Tracks & 350-Module Catalog Browser
  // ============================================================================
  if (!selectedCourse || !activeModule) {
    const currentUser = db.getCurrentUser();
    const userProgress = currentUser ? db.getUserProgress(currentUser.id) : [];
    const courseProgressMap = new Map<string, number>();
    userProgress.forEach((prog) => {
      courseProgressMap.set(prog.courseId, prog.completedModuleIds.length);
    });

    return (
      <div className="space-y-8 pb-12">
        <div className="bg-[#121a2b] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Complete Engineering Curriculum · {COURSES.length} Subject Tracks · {TOTAL_MODULES_COUNT} Interactive Modules
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                25 Deep Chapters Per Subject with Visual Diagrams &amp; Popup Code Labs
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Select any subject track below to start from Chapter 1 or jump directly into any of the {TOTAL_MODULES_COUNT} interactive modules.
              </p>
            </div>

            <div className="w-full lg:w-80">
              <label htmlFor="tutorial-search" className="sr-only">
                Search all {TOTAL_MODULES_COUNT} modules and topics
              </label>
              <input
                id="tutorial-search"
                type="text"
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                placeholder={`Search all ${TOTAL_MODULES_COUNT} modules (e.g. Flexbox, Raft, MCP, B+Tree)...`}
                className="w-full min-h-[44px] bg-[#0b101b] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* 15-Subject Filter Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {[
              { id: 'all', label: `All ${COURSES.length} Tracks (${TOTAL_MODULES_COUNT} Modules)` },
              ...COURSES.map(c => ({ id: c.category, label: `${c.shortTag} (${c.modules.length})` }))
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === tab.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0b101b] text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid showing custom SVG banner + ALL 25 modules inside each track */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            const completedCount = courseProgressMap.get(course.id) || 0;
            const pct = Math.round((completedCount / course.modules.length) * 100);
            const visualUri = getTrackVisualDataUri(course.id);

            return (
              <div
                key={course.id}
                className="bg-[#121a2b] border border-slate-800 hover:border-emerald-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="border-b border-slate-800 bg-[#080e1c]">
                    <img
                      src={visualUri}
                      alt={`${course.title} Visual Architecture`}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-32 object-cover"
                    />
                  </div>

                  <div className="p-5 pb-2">
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-mono mb-2">
                      <span className="font-bold">{course.shortTag || course.category}</span>
                      <span className="tabular-nums text-slate-300">
                        {course.modules.length} Modules · {pct}% Done
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3">
                      {course.title}
                    </h3>

                    {/* Scrollable Full 25-Chapter List inside each Track Card */}
                    <div className="space-y-1.5 my-3 max-h-64 overflow-y-auto pr-1">
                      {course.modules.map((mod, idx) => (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => {
                            setSelectedCourse(course);
                            setActiveModule(mod);
                          }}
                          className="w-full min-h-[38px] text-left px-3 py-2 rounded-lg bg-[#0b101b] hover:bg-slate-800/90 border border-slate-800/80 text-xs text-slate-200 hover:text-white transition-colors flex items-center justify-between gap-2"
                        >
                          <span className="truncate">
                            <span className="font-mono text-emerald-400 mr-1.5">{idx + 1}.</span>
                            {mod.title}
                          </span>
                          <span className="text-emerald-400 shrink-0 font-mono text-[11px] font-semibold">
                            Open »
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-800/80 space-y-2.5">
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCourse(course);
                      setActiveModule(course.modules[0]);
                    }}
                    className="w-full min-h-[44px] py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Start {course.shortTag} Track ({course.modules.length} Modules) ❯
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: 3-Column Interactive Tutorial + Visual Diagram + Exercise + Sandbox
  // ============================================================================
  const currentIndex = selectedCourse.modules.findIndex(m => m.id === activeModule.id);
  const nextModule = selectedCourse.modules[currentIndex + 1];
  const prevModule = selectedCourse.modules[currentIndex - 1];
  const currentUser = db.getCurrentUser();
  const courseProgress = currentUser
    ? db.getUserProgress(currentUser.id).find(p => p.courseId === selectedCourse.id)
    : null;
  const completedSet = new Set(courseProgress?.completedModuleIds || []);
  const isCurrentCompleted = completedSet.has(activeModule.id);

  const sandboxInitialCode =
    customTryCode?.code ||
    lessonContent?.codingChallenge?.starterCode ||
    `# Interactive Sandbox for ${activeModule.title}\nprint("Exploring ${activeModule.title}")`;
  const sandboxLanguage =
    customTryCode?.language ||
    lessonContent?.codingChallenge?.language ||
    'python';

  return (
    <div className="min-h-full flex flex-col bg-[#0b101b] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Tutorial Navigation Bar (Zero-Overlap Responsive Layout) */}
      <div className="border-b border-slate-800 bg-[#121a2b] px-3 sm:px-5 py-2.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5">
        {/* Top Row on Mobile / Left Cluster on Desktop */}
        <div className="flex items-center gap-2 min-w-0 w-full lg:w-auto lg:flex-1">
          <button
            type="button"
            onClick={() => {
              setActiveModule(null);
              setSelectedCourse(null);
            }}
            className="min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors shrink-0 whitespace-nowrap"
          >
            ☰ All Tracks ({TOTAL_MODULES_COUNT})
          </button>

          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="hidden lg:inline-flex items-center min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#0b101b] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors shrink-0 whitespace-nowrap"
            title={isSidebarOpen ? 'Hide Syllabus Sidebar' : 'Show Syllabus Sidebar'}
          >
            {isSidebarOpen ? '◧ Hide Chapters' : '◧ Show Chapters'}
          </button>

          {/* Direct Track Switcher Dropdown */}
          <label htmlFor="course-track-select" className="sr-only">
            Switch Subject Track
          </label>
          <select
            id="course-track-select"
            value={selectedCourse.id}
            onChange={(e) => {
              const nextCourse = COURSES.find(c => c.id === e.target.value);
              if (nextCourse) {
                setSelectedCourse(nextCourse);
                setActiveModule(nextCourse.modules[0]);
              }
            }}
            className="min-h-[38px] flex-1 w-0 min-w-0 sm:w-auto sm:flex-none sm:max-w-[210px] truncate bg-[#0b101b] border border-slate-700 text-emerald-400 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {COURSES.map(c => (
              <option key={c.id} value={c.id}>
                {c.shortTag} ({c.modules.length} Ch)
              </option>
            ))}
          </select>

          <span className="text-slate-600 hidden md:inline shrink-0">/</span>
          <h2 className="text-xs sm:text-sm font-bold text-white truncate hidden md:block min-w-0 flex-1">
            {currentIndex + 1}. {activeModule.title}
          </h2>
          <span className="text-xs text-slate-400 hidden 2xl:inline font-mono shrink-0">
            ({currentIndex + 1} of {selectedCourse.modules.length} · {lessonContent?.estimatedReadingTime || '10 mins'})
          </span>
        </div>

        {/* Action Controls: 4-Col Equal Grid on Mobile, Flex Cluster on Desktop */}
        <div className="grid grid-cols-4 sm:flex items-center gap-1.5 sm:gap-2 w-full lg:w-auto shrink-0">
          <button
            type="button"
            onClick={handlePreviousModule}
            disabled={!prevModule}
            className="min-h-[38px] px-2 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-white rounded-lg transition-colors text-center truncate"
          >
            ❮ Prev
          </button>

          <button
            type="button"
            onClick={handleBookmarkToggle}
            className={`min-h-[38px] px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors text-center truncate ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isBookmarked ? '★ Saved' : '☆ Note'}
          </button>

          <button
            type="button"
            onClick={handleMarkCurrentComplete}
            className={`min-h-[38px] px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-colors text-center truncate ${
              isCurrentCompleted
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-400'
            }`}
          >
            {isCurrentCompleted ? '✓ Done' : 'Complete'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsModalFullscreen(false);
              setIsSplitTryitOpen(true);
            }}
            className="hidden sm:inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 hover:text-white transition-all duration-200 whitespace-nowrap"
            title="Pop up Interactive Code Editor Modal (with Fullscreen & Close options)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>⚡ Code Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCodeLabOpen((prev) => !prev)}
            className={`hidden xl:inline-flex items-center justify-center gap-1.5 min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 whitespace-nowrap ${
              isCodeLabOpen
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/50'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={isCodeLabOpen ? 'Collapse Side Drawer' : 'Dock Code Lab to Side'}
          >
            {isCodeLabOpen ? 'Hide Side ◨' : 'Side Lab ◨'}
          </button>

          <button
            type="button"
            onClick={handleNextModule}
            className="min-h-[38px] px-2.5 sm:px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-lg transition-colors text-center truncate"
          >
            Next ❯
          </button>
        </div>
      </div>

      {/* Mobile-First Chapter Picker & Zone Switcher (< lg) */}
      <div className="lg:hidden bg-[#0d1320] border-b border-slate-800 px-3 py-2.5 space-y-2.5 w-full overflow-hidden">
        <div className="flex items-center gap-2 w-full min-w-0">
          <label htmlFor="mobile-chapter-select" className="text-[11px] font-mono font-bold text-emerald-400 shrink-0">
            Ch {currentIndex + 1}/{selectedCourse.modules.length}:
          </label>
          <select
            id="mobile-chapter-select"
            value={activeModule.id}
            onChange={(e) => {
              const found = selectedCourse.modules.find(m => m.id === e.target.value);
              if (found) setActiveModule(found);
            }}
            className="flex-1 w-0 min-w-0 max-w-full truncate min-h-[40px] bg-[#0b101b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {selectedCourse.modules.map((m, idx) => (
              <option key={m.id} value={m.id}>
                {idx + 1}. {m.title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#090d16] rounded-xl border border-slate-800/90">
          <button
            type="button"
            onClick={() => setMobileZone('theory')}
            className={`min-h-[38px] py-1.5 px-2 text-xs font-bold rounded-lg transition-all duration-200 truncate ${
              mobileZone === 'theory'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📖 Lesson &amp; Use Cases
          </button>
          <button
            type="button"
            onClick={() => setMobileZone('deck')}
            className={`min-h-[38px] py-1.5 px-2 text-xs font-bold rounded-lg transition-all duration-200 truncate ${
              mobileZone === 'deck'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Code Lab &amp; Quiz ({lessonContent?.quizzes?.length || 0})
          </button>
        </div>
      </div>

      {/* Main Full-Width Desktop & Mobile Workspace with Smooth Animated Columns */}
      <div
        className={`relative flex-1 grid grid-cols-1 min-h-[760px] lg:h-[calc(100vh-146px)] transition-all duration-300 ease-out ${
          isSidebarOpen
            ? isCodeLabOpen
              ? isWideLab
                ? 'lg:grid-cols-[240px_minmax(0,1fr)_520px] xl:grid-cols-[255px_minmax(0,1fr)_600px] 2xl:grid-cols-[270px_minmax(0,1fr)_660px]'
                : 'lg:grid-cols-[240px_minmax(0,1fr)_400px] xl:grid-cols-[255px_minmax(0,1fr)_450px] 2xl:grid-cols-[270px_minmax(0,1fr)_500px]'
              : 'lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[270px_minmax(0,1fr)]'
            : isCodeLabOpen
              ? isWideLab
                ? 'lg:grid-cols-[minmax(0,1fr)_540px] xl:grid-cols-[minmax(0,1fr)_640px]'
                : 'lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_480px]'
              : 'lg:grid-cols-[minmax(0,1fr)]'
        }`}
      >
        {/* Column 1: Grouped 25-Chapter Sidebar */}
        {isSidebarOpen && (
          <aside className="hidden lg:flex border-r border-slate-800 bg-[#0e1525] p-3 flex-col gap-2 overflow-y-auto h-full">
            <div className="space-y-2 pb-2 border-b border-slate-800/80">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  {selectedCourse.shortTag} Syllabus
                </span>
                <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                  {completedSet.size}/{selectedCourse.modules.length}
                </span>
              </div>
              <input
                type="text"
                value={sidebarFilter}
                onChange={(e) => setSidebarFilter(e.target.value)}
                placeholder={`Filter ${selectedCourse.modules.length} chapters...`}
                aria-label="Filter chapters in sidebar"
                className="w-full bg-[#0b101b] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-4 overflow-y-auto pr-0.5">
              {groupedSidebarModules.map(group => (
                <div key={group.groupName} className="space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {group.groupName}
                  </div>
                  {group.items.map(({ mod, index }) => {
                    const isSelected = mod.id === activeModule.id;
                    const isDone = completedSet.has(mod.id);
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => setActiveModule(mod)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-start justify-between gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-600 text-white font-bold shadow-sm'
                            : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                        }`}
                      >
                        <span className="leading-snug">
                          <span className="font-mono opacity-75 mr-1">{index + 1}.</span>
                          {mod.title}
                        </span>
                        {isDone && (
                          <span className={isSelected ? 'text-white font-bold shrink-0' : 'text-emerald-400 font-bold shrink-0'}>
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Column 2: Center Interactive Lesson Page */}
        <div
          className={`p-4 sm:p-6 xl:p-8 overflow-y-auto h-full border-r border-slate-800 space-y-6 ${
            mobileZone === 'theory' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* 1. Student-Friendly "Plain English" Intuition & Real-World Analogy Box */}
          <div className="bg-[#111c2d] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">
                Chapter {currentIndex + 1} Overview · Plain-English Intuition
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {activeModule.difficulty} · {lessonContent?.estimatedReadingTime || '10 mins'}
              </span>
            </div>
            <p className="text-sm text-slate-100 leading-relaxed">
              {lessonContent?.beginnerSummary}
            </p>
            {lessonContent?.realWorldAnalogy && (
              <div className="bg-[#0b101b]/90 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
                <strong className="text-amber-400">Mental Model &amp; Analogy: </strong>
                {lessonContent.realWorldAnalogy}
              </div>
            )}
            {lessonContent?.keyTakeaways && lessonContent.keyTakeaways.length > 0 && (
              <ul className="pt-1 space-y-1 text-xs text-slate-300 list-disc list-inside">
                {lessonContent.keyTakeaways.map((kt, idx) => (
                  <li key={idx}>{kt}</li>
                ))}
              </ul>
            )}
          </div>

          {/* 2. Quick Syntax & Concept Reference Table */}
          {lessonContent?.syntaxCheatTable && lessonContent.syntaxCheatTable.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0e1525]">
              <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-bold text-white flex items-center justify-between">
                <span>Quick Syntax &amp; Architecture Reference</span>
                <span className="text-[11px] font-mono text-emerald-400">Reference Table</span>
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400">
                    <th className="py-2 px-3.5">Construct / Syntax</th>
                    <th className="py-2 px-3.5">What It Does</th>
                    <th className="py-2 px-3.5 font-mono">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {lessonContent.syntaxCheatTable.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className="py-2 px-3.5 font-mono font-semibold text-emerald-400 break-words">{row.syntax}</td>
                      <td className="py-2 px-3.5 text-slate-200 break-words">{row.description}</td>
                      <td className="py-2 px-3.5 font-mono text-blue-300 break-words">{row.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. Time & Space Complexity Masterclass Breakdown + Table (Strictly for DSA Complexity Module ds-1) */}
          {activeModule.id === 'ds-1' && lessonContent?.complexityTable && lessonContent.complexityTable.length > 0 && (
            <div data-testid="dsa-complexity-master-card" className="rounded-2xl border border-slate-800 bg-[#0e1525] overflow-hidden shadow-md">
              <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Complete Time &amp; Space Complexity Master Reference (O(1) → O(N!))
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleTryCodeInSandbox(
                      lessonContent.codingChallenge?.starterCode || sandboxInitialCode,
                      lessonContent.codingChallenge?.language || sandboxLanguage
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 hover:text-white transition-colors"
                >
                  ⚡ Benchmark All 9 Complexities in Popup Editor →
                </button>
              </div>

              {/* Visual Time T(N), Space S(N), and Mathematical Proof Summary Cards */}
              <div className="p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 border-b border-slate-800/80 bg-[#0b101b]/70">
                <div className="p-3 rounded-xl bg-[#11192b] border border-emerald-500/30">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Time Complexity Hierarchy T(N)
                  </div>
                  <div className="text-xs sm:text-sm font-mono font-extrabold text-white mt-0.5">
                    O(1) &lt; O(log N) &lt; O(√N) &lt; O(N) &lt; O(N log N) &lt; O(N²) &lt; O(2ⁿ) &lt; O(N!)
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Measures how elementary CPU operations scale with input size N (1 sec ≈ 10⁸ ops).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#11192b] border border-blue-500/30">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
                    Space Complexity S(N) = Heap + Call Stack
                  </div>
                  <div className="text-xs sm:text-sm font-mono font-extrabold text-white mt-0.5">
                    Auxiliary Memory + Recursion Depth
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Counts extra arrays/maps plus maximum simultaneous active stack frames on the call stack.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#11192b] border border-amber-500/30">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Why O(log N) &amp; Why O(N log N)?
                  </div>
                  <div className="text-xs font-mono font-bold text-amber-200 mt-1">
                    Halving N → N/2ᵏ = 1 ⇒ k = log₂(N) steps
                  </div>
                  <div className="text-[11px] font-mono text-emerald-300 mt-0.5">
                    log₂(N) tree levels × O(N) work/level = O(N log N)
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-300">
                      <th className="py-2.5 px-3.5">Complexity Class &amp; Pattern</th>
                      <th className="py-2.5 px-3.5 font-mono">Time Complexity</th>
                      <th className="py-2.5 px-3.5 font-mono">Space Complexity</th>
                      <th className="py-2.5 px-3.5">Why It Happens &amp; Concrete Examples</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {lessonContent.complexityTable.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3.5 font-semibold text-white">{formatLatexMath(row.operation)}</td>
                        <td className="py-2.5 px-3.5 font-mono text-emerald-400 tabular-nums">{formatLatexMath(row.timeComplexity)}</td>
                        <td className="py-2.5 px-3.5 font-mono text-blue-400 tabular-nums">{formatLatexMath(row.spaceComplexity)}</td>
                        <td className="py-2.5 px-3.5 text-slate-300">{formatLatexMath(row.notes)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3.2 Track HOME Foundational Research, RFCs & Industry Breakthroughs (Shown on Chapter 1 HOME Modules) */}
          {lessonContent?.homeResearchHighlights && lessonContent.homeResearchHighlights.length > 0 && (
            <div
              data-testid="home-research-showcase"
              className="bg-[#0f172a] border border-blue-500/35 rounded-2xl overflow-hidden shadow-md"
            >
              <div className="px-4 py-3 bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-900 border-b border-blue-500/25 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Track HOME · Foundational Research Papers, RFCs &amp; Architectural Breakthroughs
                  </span>
                </div>
                <span className="text-[11px] font-mono text-blue-300">
                  {selectedCourse.shortTag} Systems Lineage
                </span>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {lessonContent.homeResearchHighlights.map((paper, pIdx) => (
                  <div
                    key={pIdx}
                    className="bg-[#0a101d] border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-between gap-2.5"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono font-bold text-blue-400">
                          {paper.organizationOrPaper}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                          {paper.year}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                        {paper.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {paper.breakthroughSummary}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold shrink-0">
                        Production Adoption:
                      </span>
                      <span className="text-[11px] text-slate-300 text-right">
                        {paper.productionImpact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3.5 Module-Specific Real-World Industry Use Cases & Production Case Studies */}
          {lessonContent?.realWorldUseCases && lessonContent.realWorldUseCases.length > 0 && (
            <div
              data-testid="real-world-use-cases-section"
              className="bg-[#11192a] border border-slate-800 rounded-2xl overflow-hidden shadow-md"
            >
              <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Real-World Industry Use Cases · {activeModule.title}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">
                  3 Production Case Studies · Runnable in Pop-Out Editor
                </span>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {lessonContent.realWorldUseCases.map((uc, uIdx) => (
                  <div
                    key={uIdx}
                    className="min-w-0 overflow-hidden bg-[#0b101b] border border-slate-800/90 hover:border-emerald-500/40 rounded-xl p-3.5 flex flex-col justify-between gap-2.5 transition-colors"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <span className="text-xs font-extrabold text-emerald-400 font-mono truncate">
                          {uc.company}
                        </span>
                        <span className="text-[10px] font-mono font-semibold text-blue-300 bg-blue-950/50 border border-blue-800/50 px-2 py-0.5 rounded shrink-0">
                          Case #{uIdx + 1}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-100 leading-snug break-words">
                        {uc.scenario}
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed break-words">
                        {uc.architectureNote}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                          Production SLA
                        </span>
                        <span className="text-[11px] font-mono font-bold text-emerald-300 text-right">
                          {uc.impactMetric}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleTryCodeInSandbox(
                            uc.codeSnippet || lessonContent.codingChallenge?.starterCode || sandboxInitialCode,
                            uc.codeLanguage || lessonContent.codingChallenge?.language || sandboxLanguage
                          )
                        }
                        className="w-full py-2 px-2.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/35 hover:border-emerald-400 text-[11px] font-bold text-emerald-300 hover:text-white transition-colors flex items-center justify-between"
                      >
                        <span>⚡ Pop Out Case Study in Editor</span>
                        <span aria-hidden="true">⤢</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Main Tutorial Article + Embedded Architecture Diagram SVG + "Try it Yourself" Buttons */}
          {lessonContent && (
            <MarkdownRenderer
              content={lessonContent.contentMarkdown}
              svg={lessonContent.diagramSvg}
              onTryCode={handleTryCodeInSandbox}
            />
          )}

          {/* 5. Curated Must-Solve Practice Exercises Lab (Essential Exercises to Master This Topic) */}
          {lessonContent?.mustSolveExercises && lessonContent.mustSolveExercises.length > 0 && (
            <div
              data-testid="must-solve-exercises-lab"
              className="bg-[#10192b] border border-emerald-500/40 rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="px-4 sm:px-5 py-3.5 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border-b border-emerald-500/30 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300">
                      Must-Solve Practice Lab
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {lessonContent.mustSolveExercises.length} Essential Exercises
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                    Must-Solve Learning &amp; Command/Code Exercises for {activeModule.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleTryCodeInSandbox(
                      lessonContent.codingChallenge?.starterCode || sandboxInitialCode,
                      lessonContent.codingChallenge?.language || sandboxLanguage
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  ⚡ Open Interactive Popup Code Lab →
                </button>
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                {lessonContent.mustSolveExercises.map((ex, idx) => {
                  const status = mustSolveStatuses[ex.id] || 'idle';
                  const isAnswerShown = !!mustSolveShowAns[ex.id];
                  const val = mustSolveInputs[ex.id] ?? '';

                  return (
                    <div
                      key={ex.id}
                      data-testid={`must-solve-card-${idx + 1}`}
                      className={`rounded-xl border p-4 space-y-3 transition-colors ${
                        status === 'correct'
                          ? 'bg-emerald-950/20 border-emerald-500/60'
                          : 'bg-[#0b111e] border-slate-800'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-extrabold text-emerald-400">
                            #{idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-white">{ex.title}</h4>
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                              ex.difficulty === 'Mastery Challenge'
                                ? 'bg-amber-950/60 border-amber-600/50 text-amber-300'
                                : ex.difficulty === 'Core Practice'
                                ? 'bg-blue-950/60 border-blue-600/50 text-blue-300'
                                : 'bg-emerald-950/60 border-emerald-600/50 text-emerald-300'
                            }`}
                          >
                            {ex.difficulty}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-emerald-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            +{ex.xp} XP
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const nextShow = !isAnswerShown;
                            setMustSolveShowAns(prev => ({ ...prev, [ex.id]: nextShow }));
                            if (nextShow) {
                              setMustSolveInputs(prev => ({ ...prev, [ex.id]: ex.answer }));
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors"
                        >
                          {isAnswerShown ? 'Hide Solution' : 'Reveal Solution'}
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {formatLatexMath(ex.scenario)}
                      </p>

                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          handleVerifyMustSolve(ex);
                        }}
                        className="space-y-3"
                      >
                        <div className="bg-[#070b12] border border-slate-800 rounded-xl p-3.5 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed flex flex-wrap items-center gap-1.5">
                          <span className="whitespace-pre-wrap text-slate-400">{ex.codeBefore}</span>
                          <input
                            type="text"
                            aria-label={`Must-solve exercise ${idx + 1} input`}
                            value={val}
                            onChange={e => {
                              const nextVal = e.target.value;
                              setMustSolveInputs(prev => ({ ...prev, [ex.id]: nextVal }));
                              setMustSolveStatuses(prev => ({ ...prev, [ex.id]: 'idle' }));
                            }}
                            placeholder="Write command or code..."
                            style={{
                              width: `${Math.min(34, Math.max(16, (ex.answer.length || 8) + 4))}ch`,
                              maxWidth: '100%',
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-emerald-500/80 text-emerald-300 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          />
                          <span className="whitespace-pre-wrap text-slate-400">{ex.codeAfter}</span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="submit"
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                            >
                              Verify Answer »
                            </button>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Hint: {formatLatexMath(ex.hint)}
                            </span>
                          </div>

                          {status === 'correct' && (
                            <span className="text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-600/60 px-3 py-1 rounded-lg">
                              ✓ Verified Correct! (+{ex.xp} XP)
                            </span>
                          )}
                          {status === 'wrong' && (
                            <span className="text-xs font-bold text-amber-300 bg-amber-950/70 border border-amber-600/60 px-3 py-1 rounded-lg">
                              Not quite — check the hint or click &quot;Reveal Solution&quot;
                            </span>
                          )}
                        </div>
                      </form>

                      {(status === 'correct' || isAnswerShown) && (
                        <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1">
                          <div className="font-mono text-[11px] text-emerald-400 font-bold">
                            Expected Answer: <code className="text-white bg-slate-800 px-1.5 py-0.5 rounded">{ex.answer}</code>
                          </div>
                          <p className="leading-relaxed text-slate-300">{formatLatexMath(ex.explanation)}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5.5 Inline Chapter Quiz & Verified Interview Q&A (Always accessible in Full-Width View) */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 pt-2">
            {lessonContent?.quizzes && lessonContent.quizzes.length > 0 && (
              <div className="bg-[#11192a] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Chapter Mastery Quiz ({lessonContent.quizzes.length} Questions)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">+100 XP</span>
                </div>
                <QuizComponent
                  questions={lessonContent.quizzes}
                  onComplete={(score) => {
                    const user = db.getCurrentUser();
                    if (user && activeModule) {
                      db.markModuleComplete(user.id, selectedCourse.id, activeModule.id, score);
                      onComplete(activeModule.id);
                    }
                  }}
                />
              </div>
            )}

            {lessonContent?.interviewQuestions && lessonContent.interviewQuestions.length > 0 && (
              <div className="bg-[#11192a] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    Verified Technical Interview Q&amp;A ({lessonContent.interviewQuestions.length})
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Production Readiness</span>
                </div>
                <div className="space-y-3">
                  {lessonContent.interviewQuestions.map((q, idx) => (
                    <div key={idx} className="bg-[#0b101b] border border-slate-800 rounded-xl p-3.5 space-y-2">
                      <div className="text-[11px] font-bold text-emerald-400 font-mono">
                        {q.companyTag || 'Senior Engineering'} Interview Question
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-white leading-snug">
                        {q.question}
                      </div>
                      <div className="text-xs text-slate-300 bg-slate-900/90 p-3 rounded-lg leading-relaxed border border-slate-800/80">
                        {q.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 6. Unified SaaS Chapter Command & Studio Pop-Out Dock (Zero Button Chaos) */}
          <div
            data-testid="chapter-popout-dock"
            className="mt-6 bg-[#0d1526] border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-lg flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3"
          >
            {/* Left Zone: Chapter Position & Previous Stepper */}
            <div className="flex items-center justify-between xl:justify-start gap-2.5">
              <button
                type="button"
                onClick={handlePreviousModule}
                disabled={!prevModule}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold transition-colors whitespace-nowrap"
              >
                ← Prev Chapter
              </button>
              <span className="text-[11px] font-mono text-slate-400 px-2 py-1 rounded-lg bg-[#090e1a] border border-slate-800/80 whitespace-nowrap">
                Ch {currentIndex + 1} of {selectedCourse.modules.length}
              </span>
            </div>

            {/* Center Zone: Unified Code Studio Pop-Out & Split Drawer Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2 bg-[#090e1a] border border-slate-800/90 rounded-xl p-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsModalFullscreen(false);
                  setIsSplitTryitOpen(true);
                }}
                className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
              >
                <span>⚡ Pop Out Live Code Editor</span>
                <span aria-hidden="true">⤢</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsModalFullscreen(true);
                  setIsSplitTryitOpen(true);
                }}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs font-bold transition-colors whitespace-nowrap"
                title="Open Live Code Editor directly in Fullscreen IDE mode"
              >
                ⛶ Fullscreen IDE
              </button>

              <button
                type="button"
                onClick={() => setIsCodeLabOpen((prev) => !prev)}
                className={`hidden lg:inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap ${
                  isCodeLabOpen
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {isCodeLabOpen ? '◨ Hide Split Lab' : '◨ Dock Split Lab'}
              </button>
            </div>

            {/* Right Zone: Completion Action & Next Chapter Stepper */}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleMarkCurrentComplete}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap ${
                  isCurrentCompleted
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-emerald-400'
                }`}
              >
                {isCurrentCompleted ? '✓ Completed' : '✓ Mark Complete (+50 XP)'}
              </button>

              <button
                type="button"
                onClick={handleNextModule}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors whitespace-nowrap"
              >
                {nextModule ? `Next: Ch ${currentIndex + 2} →` : 'Next Track →'}
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Right Interactive Code Sandbox, Quiz & Interview Q&A (Animated Toggle Drawer) */}
        <div
          className={`flex-col bg-[#0e1422] overflow-y-auto h-full transition-all duration-300 ease-out ${
            labPulse ? 'ring-2 ring-emerald-500/80 bg-[#101b2e]' : ''
          } ${
            mobileZone === 'deck'
              ? 'flex'
              : isCodeLabOpen
                ? 'hidden lg:flex'
                : 'hidden'
          }`}
        >
          <div className="border-b border-slate-800 p-2 flex items-center gap-1 bg-slate-900/60 sticky top-0 z-20">
            {[
              { id: 'code', label: 'Code Lab' },
              { id: 'quiz', label: `Quiz (${lessonContent?.quizzes?.length || 0})` },
              { id: 'interview', label: `Interview (${lessonContent?.interviewQuestions?.length || 0})` },
              { id: 'resources', label: 'References' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveDeckTab(tab.id as DeckTab)}
                className={`flex-1 min-h-[38px] py-1.5 px-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap text-center truncate ${
                  activeDeckTab === tab.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsCodeLabOpen(false);
                setMobileZone('theory');
              }}
              className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/40 text-xs font-bold text-slate-300 hover:text-rose-300 transition-colors shrink-0"
              title="Close Code Lab panel to expand reading view"
            >
              ✕
            </button>
          </div>

          <div className="p-4 lg:p-5 flex-1 space-y-5">
            {activeDeckTab === 'code' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{customTryCode ? 'Loaded from Lesson ("Try it Yourself")' : 'Interactive Execution Sandbox'}</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white mt-0.5 truncate">
                      {customTryCode
                        ? `Live Editor · ${activeModule.title}`
                        : lessonContent?.codingChallenge?.title || activeModule.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsWideLab((prev) => !prev)}
                      className="hidden lg:inline-flex items-center min-h-[34px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-200 hover:text-white transition-colors"
                      title="Toggle Wide Lab Split Mode"
                    >
                      {isWideLab ? 'Compact ◧' : 'Wide Lab ◨'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSplitTryitOpen(true)}
                      className="min-h-[34px] px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 hover:text-white transition-colors shrink-0"
                      title="Open Fullscreen Split-Screen IDE"
                    >
                      Fullscreen ⤢
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCodeLabOpen(false);
                        setMobileZone('theory');
                      }}
                      className="min-h-[34px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors shrink-0"
                      title="Close Code Lab Drawer"
                    >
                      Close ✕
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {lessonContent?.codingChallenge?.description ||
                    `Interactive ${selectedCourse.shortTag || selectedCourse.title} execution environment. Edit the code below and click Run Code to inspect live output.`}
                </p>

                <CodePlayground
                  initialCode={sandboxInitialCode}
                  language={sandboxLanguage}
                  courseId={selectedCourse.id}
                />

                {lessonContent?.codingChallenge?.hint && (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300">
                    <strong className="text-emerald-400">Tip: </strong>
                    {lessonContent.codingChallenge.hint}
                  </div>
                )}
              </div>
            )}

            {activeDeckTab === 'quiz' && (
              <div>
                {lessonContent?.quizzes && lessonContent.quizzes.length > 0 ? (
                  <QuizComponent
                    questions={lessonContent.quizzes}
                    onComplete={(score) => {
                      const user = db.getCurrentUser();
                      if (user && activeModule) {
                        db.markModuleComplete(user.id, selectedCourse.id, activeModule.id, score);
                        onComplete(activeModule.id);
                      }
                    }}
                  />
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No quiz questions for this chapter. Try the Concept Check exercise or Code Sandbox!
                  </div>
                )}
              </div>
            )}

            {activeDeckTab === 'interview' && (
              <div className="space-y-4">
                <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  Verified Engineering Interview Questions
                </div>
                {lessonContent?.interviewQuestions && lessonContent.interviewQuestions.length > 0 ? (
                  lessonContent.interviewQuestions.map((q, idx) => (
                    <div key={idx} className="bg-[#141b2a] border border-slate-800 rounded-xl p-4 space-y-2.5">
                      <div className="text-xs font-bold text-emerald-400 font-mono">
                        {q.companyTag || 'Senior Engineering'} Interview Question
                      </div>
                      <div className="text-sm font-semibold text-white leading-snug">
                        {q.question}
                      </div>
                      <div className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-lg leading-relaxed border border-slate-800">
                        {q.answer}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Review the core trade-offs in the tutorial article for interview readiness.
                  </div>
                )}
              </div>
            )}

            {activeDeckTab === 'resources' && (
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  Further Reading &amp; Specifications
                </div>
                {lessonContent?.resources && lessonContent.resources.length > 0 ? (
                  lessonContent.resources.map((res, idx) => (
                    <div key={idx} className="bg-[#141b2a] border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-bold text-white mb-1">{res.title}</div>
                        <div className="text-xs text-slate-400 font-mono">
                          {res.authorOrSource} · {res.type}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    All required materials are included directly in this interactive module.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Popup & Full-Screen Code Editor Modal (Triggered by "Try it Yourself") */}
      {isSplitTryitOpen && (
        <div
          data-testid="popup-tryit-modal"
          className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center transition-all duration-200 ${
            isModalFullscreen ? 'p-0' : 'p-2 sm:p-6'
          }`}
        >
          <div
            className={`bg-[#0e1525] border border-emerald-500/40 flex flex-col overflow-hidden shadow-2xl transition-all duration-200 ${
              isModalFullscreen
                ? 'w-screen h-screen rounded-none border-0'
                : 'w-full max-w-6xl max-h-[90vh] rounded-2xl'
            }`}
          >
            <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-[#121a2b] flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {isModalFullscreen
                      ? `Full-Screen Split-View Code Editor · ${selectedCourse.shortTag}`
                      : `Interactive Popup Code Editor · ${selectedCourse.shortTag}`}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white truncate mt-0.5">
                  {customTryCode
                    ? `Try It Yourself: ${activeModule.title}`
                    : lessonContent?.codingChallenge?.title || activeModule.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  data-testid="toggle-modal-fullscreen"
                  onClick={() => setIsModalFullscreen((prev) => !prev)}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
                >
                  {isModalFullscreen ? '⤡ Windowed Popup' : '⤢ Fullscreen'}
                </button>
                <button
                  type="button"
                  data-testid="dock-modal-to-side"
                  onClick={() => {
                    setIsSplitTryitOpen(false);
                    setIsCodeLabOpen(true);
                  }}
                  className="hidden lg:inline-flex items-center min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
                >
                  ◨ Dock to Side
                </button>
                <button
                  type="button"
                  data-testid="close-tryit-modal"
                  onClick={() => setIsSplitTryitOpen(false)}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-xs font-bold text-rose-200 hover:text-white transition-colors"
                >
                  ✕ Close Editor
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-5 flex-1 overflow-y-auto">
              <CodePlayground
                initialCode={sandboxInitialCode}
                language={sandboxLanguage}
                courseId={selectedCourse.id}
                isFullscreen={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Bookmark Modal */}
      {showBookmarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#161f30] w-full max-w-md rounded-2xl border border-slate-700 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Save Personal Study Note</h3>
            <p className="text-xs text-slate-400 mb-4">
              Save a personal revision note for {activeModule.title}. It will appear on your Student Dashboard.
            </p>
            <textarea
              aria-label="Study note"
              value={bookmarkNote}
              onChange={(e) => setBookmarkNote(e.target.value)}
              className="w-full bg-[#0b0f19] p-3 rounded-xl text-white text-sm mb-4 h-28 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-slate-800 font-mono"
              placeholder="Write your revision takeaway or formula here..."
            />
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowBookmarkModal(false)}
                className="min-h-[42px] px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveBookmark}
                className="min-h-[42px] px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-lg"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningModule;
