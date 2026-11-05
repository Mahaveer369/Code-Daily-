import React, { useEffect, useState, useMemo } from 'react';
import { UserProfile, CourseProgress, Certificate, Bookmark, LeaderboardEntry } from '../types';
import { COURSES, TOTAL_MODULES_COUNT } from './LearningModule';
import { PRACTICE_PROBLEMS } from '../services/practiceProblems';
import { calculateLevelFromXp, calculateTierFromXp } from '../services/codeRunner';
import { HERO_ACADEMY_VISUAL_URI, getTrackVisualDataUri } from '../services/curriculum/visualAssets';
import { db } from '../services/db';
import LearningPathTimeline from './LearningPathTimeline';
import GlobalLeaderboard from './GlobalLeaderboard';

interface DashboardProps {
  progress: UserProfile;
  userName?: string;
  onCourseClick?: (courseId: string, moduleId?: string) => void;
  onOpenAllTutorials?: () => void;
  onOpenPractice?: () => void;
  onOpenVisualizer?: () => void;
  onOpenCheatSheets?: () => void;
  onProgressUpdated?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  progress,
  userName,
  onCourseClick,
  onOpenAllTutorials,
  onOpenPractice,
  onOpenVisualizer,
  onOpenCheatSheets,
  onProgressUpdated,
}) => {
  const [userProgress, setUserProgress] = useState<CourseProgress[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);

  const refreshDashboardData = () => {
    const current = db.getCurrentUser() || progress;
    setUserProgress(db.getUserProgress(current.id));
    setBookmarks(db.getBookmarks(current.id));
    setCertificates(db.getCertificates(current.id));
    setLeaderboardEntries(db.getGlobalLeaderboard(current));
  };

  useEffect(() => {
    refreshDashboardData();
  }, [progress.id, progress.xp, progress.tier]);

  const handleCompleteNodeFromTimeline = (courseId: string, moduleId: string) => {
    db.markModuleComplete(progress.id, courseId, moduleId, 100);
    refreshDashboardData();
    onProgressUpdated?.();
  };

  const courseProgressMap = useMemo(() => {
    const map = new Map<string, number>();
    userProgress.forEach((prog) => {
      const course = COURSES.find((c) => c.id === prog.courseId);
      const total = course?.modules.length || prog.totalModules || 25;
      const percent = Math.min(100, Math.round((prog.completedModuleIds.length / total) * 100));
      map.set(prog.courseId, percent);
    });
    return map;
  }, [userProgress]);

  const totalCompletedModules = useMemo(
    () => userProgress.reduce((sum, p) => sum + p.completedModuleIds.length, 0),
    [userProgress]
  );

  const solvedCount = progress.solvedProblemIds?.length || 0;
  const levelStats = calculateLevelFromXp(progress.xp || 0);
  const tierMeta = calculateTierFromXp(progress.xp || 0);
  const potd = PRACTICE_PROBLEMS.find((p) => p.isProblemOfTheDay) || PRACTICE_PROBLEMS[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with Architectural Visual & KPI Strip */}
      <div className="rounded-2xl bg-[#121a2b] border border-slate-800 p-5 sm:p-8 shadow-xl space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-emerald-400">
                Code It Out Engineering Academy · {COURSES.length} Tracks · {TOTAL_MODULES_COUNT} Deep Interactive Modules
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Welcome back, {userName || progress.name}
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                Master full-stack web engineering, systems programming, relational storage engines, distributed architectures, and AI transformers across <strong>{TOTAL_MODULES_COUNT} in-depth chapters</strong> (25 chapters per subject) with interactive learning paths, live sandboxes, and global leaderboard tiers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => onCourseClick?.('c-html', 'html-1')}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
              >
                Start HTML5 Track (25 Chapters) ❯
              </button>
              <button
                type="button"
                onClick={() => onOpenAllTutorials?.()}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
              >
                Explore All {TOTAL_MODULES_COUNT} Modules
              </button>
              <button
                type="button"
                onClick={() => onOpenPractice?.()}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Coding Judge ({PRACTICE_PROBLEMS.length} Problems)
              </button>
              <button
                type="button"
                onClick={() => onOpenVisualizer?.()}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Algorithm Visualizers
              </button>
            </div>
          </div>

          {/* Right Column: High-Resolution Technical Blueprint Illustration */}
          <div className="lg:col-span-5 rounded-xl overflow-hidden border border-slate-800 bg-[#070d19] flex flex-col justify-between">
            <img
              src={HERO_ACADEMY_VISUAL_URI}
              alt="Code It Out Distributed Systems, Data Structures, and Neural Architecture Blueprint"
              referrerPolicy="no-referrer"
              className="w-full h-48 sm:h-56 lg:h-full object-cover"
            />
          </div>
        </div>

        {/* Full-Width Student Progress, Tier Status & Scale Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-800">
          <div className="bg-[#0b101b] border border-slate-800/90 rounded-xl p-3.5">
            <div className="text-xs text-slate-400">Scholar Tier Status</div>
            <div
              data-testid="dashboard-hero-tier"
              className="text-base sm:text-lg font-bold text-emerald-400 font-mono mt-0.5"
            >
              {tierMeta.tier}
            </div>
          </div>
          <div className="bg-[#0b101b] border border-slate-800/90 rounded-xl p-3.5">
            <div className="text-xs text-slate-400">Scholar Rank &amp; XP</div>
            <div className="text-base sm:text-lg font-bold text-white font-mono tabular-nums mt-0.5">
              Level {levelStats.level} · {progress.xp} XP
            </div>
          </div>
          <div className="bg-[#0b101b] border border-slate-800/90 rounded-xl p-3.5">
            <div className="text-xs text-slate-400">Curriculum Completed</div>
            <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono tabular-nums mt-0.5">
              {totalCompletedModules} / {TOTAL_MODULES_COUNT} Modules
            </div>
          </div>
          <div className="bg-[#0b101b] border border-slate-800/90 rounded-xl p-3.5">
            <div className="text-xs text-slate-400">Judge Problems Solved</div>
            <div className="text-base sm:text-lg font-bold text-blue-400 font-mono tabular-nums mt-0.5">
              {solvedCount} / {PRACTICE_PROBLEMS.length} Solved
            </div>
          </div>
          <div className="bg-[#0b101b] border border-slate-800/90 rounded-xl p-3.5 col-span-2 sm:col-span-1">
            <div className="text-xs text-slate-400">Active Study Streak</div>
            <div className="text-base sm:text-lg font-bold text-amber-400 font-mono tabular-nums mt-0.5">
              {progress.streak} Days
            </div>
          </div>
        </div>
      </div>

      {/* 1. Interactive 25-Node Visual Learning Path Timeline */}
      <LearningPathTimeline
        userId={progress.id}
        userProgress={userProgress}
        onLaunchModule={(courseId, moduleId) => onCourseClick?.(courseId, moduleId)}
        onToggleCompleteModule={handleCompleteNodeFromTimeline}
      />

      {/* 2. Global Leaderboard & Gamified XP Tier Progression */}
      <GlobalLeaderboard
        currentUser={{ ...progress, tier: tierMeta.tier }}
        entries={leaderboardEntries}
      />

      {/* Problem of the Day + Quick Reference Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-[#121a2b] border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-amber-400 font-mono">
              ★ Daily Featured Challenge · {potd.category} · {potd.difficulty}
            </div>
            <h2 className="text-lg font-bold text-white">{potd.title}</h2>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {potd.description.replace(/[`*]/g, '')}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 font-mono">
              Target: {potd.expectedTimeComplexity} Time · {potd.expectedSpaceComplexity} Space · {potd.companies.slice(0, 3).join(', ')}
            </span>
            <button
              type="button"
              onClick={() => onOpenPractice?.()}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shrink-0"
            >
              Solve in Practice Judge →
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#121a2b] border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-emerald-400">
              Engineering Reference &amp; Career Pathways
            </div>
            <h2 className="text-lg font-bold text-white">
              Syntax Cheat Sheets &amp; Guided Roadmaps
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instant lookup tables for Big-O Complexity, Python 3 Idioms, SQL Window Functions, Flexbox/Grid, and Full-Stack / Systems Career Roadmaps.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => onOpenCheatSheets?.()}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              Open Reference Sheets →
            </button>
          </div>
        </div>
      </div>

      {/* All 18 Subject Tracks (25+ Modules Each = 452 Interactive Modules) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white">
              All {COURSES.length} Engineering Subject Tracks ({TOTAL_MODULES_COUNT} Interactive Modules)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Every subject contains 25 deep chapters with 3-panel architecture diagrams, real-world case studies, and popup code labs
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenAllTutorials?.()}
            className="min-h-[44px] px-3 text-xs font-bold text-emerald-400 hover:text-emerald-300 font-mono"
          >
            View Full {TOTAL_MODULES_COUNT}-Module Directory →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
          {COURSES.map((course) => {
            const percent = courseProgressMap.get(course.id) || 0;
            const visualUri = getTrackVisualDataUri(course.id);

            return (
              <div
                key={course.id}
                className="bg-[#121a2b] border border-slate-800 hover:border-emerald-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all"
              >
                <div>
                  {/* Custom SVG Architecture Illustration Banner */}
                  <div className="border-b border-slate-800 bg-[#080e1c]">
                    <img
                      src={visualUri}
                      alt={`${course.title} Architecture Diagram`}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-32 object-cover"
                    />
                  </div>

                  <div className="p-5 pb-2">
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="font-bold text-emerald-400">{course.shortTag || course.category}</span>
                      <span className="tabular-nums text-slate-300 font-semibold">
                        {course.modules.length} Modules · {percent}%
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base mb-3">{course.title}</h3>

                    {/* Direct 1-click links to sample chapters right on the Dashboard card */}
                    <div className="space-y-1.5 mb-3">
                      {course.modules.slice(0, 4).map((m, idx) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => onCourseClick?.(course.id, m.id)}
                          className="w-full min-h-[40px] text-left px-2.5 py-1.5 rounded-lg bg-[#0b101b] hover:bg-slate-800 border border-slate-800/80 text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-between gap-2"
                        >
                          <span className="truncate">
                            <span className="font-mono text-emerald-400 mr-1.5">{idx + 1}.</span>
                            {m.title}
                          </span>
                          <span className="text-[11px] font-mono text-emerald-400 shrink-0">Lab »</span>
                        </button>
                      ))}
                      {course.modules.length > 4 && (
                        <button
                          type="button"
                          onClick={() => onCourseClick?.(course.id, course.modules[24]?.id || course.modules[0]?.id)}
                          className="w-full text-left px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          + {course.modules.length - 4} more deep modules (up to Ch {course.modules.length}) →
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2">
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-emerald-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onCourseClick?.(course.id, course.modules[0]?.id)}
                    className="w-full min-h-[44px] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
                  >
                    Open {course.shortTag} ({course.modules.length} Modules) ❯
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved Notes & Certificates */}
      {(bookmarks.length > 0 || certificates.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#121a2b] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Saved Study Notes ({bookmarks.length})</h3>
            {bookmarks.length === 0 ? (
              <p className="text-xs text-slate-400">Bookmark any lesson to keep your personal revision notes here.</p>
            ) : (
              <div className="space-y-2.5">
                {bookmarks.map((b) => (
                  <div key={b.id} className="bg-[#0b101b] border border-slate-800 p-3.5 rounded-xl flex justify-between items-start gap-3">
                    <div>
                      <div className="text-xs font-bold text-emerald-400">{b.moduleTitle}</div>
                      <p className="text-xs text-slate-300 mt-1">{b.note}</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 shrink-0">
                      {new Date(b.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#121a2b] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Earned Certificates ({certificates.length})</h3>
            {certificates.length === 0 ? (
              <p className="text-xs text-slate-400">Complete all 25 chapters in any subject track to unlock your verified certificate.</p>
            ) : (
              <div className="space-y-2.5">
                {certificates.map((cert) => (
                  <div key={cert.id} className="bg-[#0b101b] border border-slate-800 p-3.5 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold text-white">{cert.courseTitle}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Issued: {cert.issueDate} · ID: {cert.verificationCode}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400">Verified</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
