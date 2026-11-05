import React, { useState, useMemo } from 'react';
import { CourseProgress, CourseModule } from '../types';
import { COURSES } from './LearningModule';

interface LearningPathTimelineProps {
  userId: string;
  userProgress: CourseProgress[];
  onLaunchModule: (courseId: string, moduleId: string) => void;
  onToggleCompleteModule: (courseId: string, moduleId: string) => void;
}

interface MilestoneStage {
  stageNumber: number;
  title: string;
  rangeLabel: string;
  modules: { mod: CourseModule; chapterNumber: number }[];
  completedCount: number;
  totalCount: number;
  percent: number;
  status: 'Completed' | 'In Progress' | 'Ready';
}

const STAGE_TITLES = [
  'Milestone 1 · Core Foundations & Syntax',
  'Milestone 2 · Runtime Mechanics & Data Flow',
  'Milestone 3 · Engine Internals & Optimization',
  'Milestone 4 · Distributed & Production Scale',
  'Milestone 5 · Staff-Level Architecture Mastery',
];

const LearningPathTimeline: React.FC<LearningPathTimelineProps> = ({
  userProgress,
  onLaunchModule,
  onToggleCompleteModule,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(COURSES[0]?.id || 'c-html');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const activeCourse = useMemo(
    () => COURSES.find((c) => c.id === selectedCourseId) || COURSES[0],
    [selectedCourseId]
  );

  const completedSet = useMemo(() => {
    const prog = userProgress.find((p) => p.courseId === activeCourse.id);
    return new Set<string>(prog?.completedModuleIds || []);
  }, [userProgress, activeCourse.id]);

  const quizScoresMap = useMemo(() => {
    const prog = userProgress.find((p) => p.courseId === activeCourse.id);
    return prog?.quizScores || {};
  }, [userProgress, activeCourse.id]);

  const totalModules = activeCourse.modules.length;
  const completedCount = activeCourse.modules.filter((m) => completedSet.has(m.id)).length;
  const coursePercent = Math.min(100, Math.round((completedCount / Math.max(1, totalModules)) * 100));

  // Determine the next recommended module (first uncompleted module, or module 0)
  const nextUpModule = useMemo(() => {
    return activeCourse.modules.find((m) => !completedSet.has(m.id)) || activeCourse.modules[0];
  }, [activeCourse.modules, completedSet]);

  const inspectedModule = useMemo(() => {
    if (selectedNodeId) {
      const found = activeCourse.modules.find((m) => m.id === selectedNodeId);
      if (found) return found;
    }
    return nextUpModule;
  }, [activeCourse.modules, selectedNodeId, nextUpModule]);

  const inspectedIndex = useMemo(
    () => activeCourse.modules.findIndex((m) => m.id === inspectedModule?.id),
    [activeCourse.modules, inspectedModule]
  );

  // Partition 25 modules into 5 Milestone Stages of 5 nodes each
  const milestoneStages: MilestoneStage[] = useMemo(() => {
    const stages: MilestoneStage[] = [];
    const chunkSize = 5;
    const numStages = Math.ceil(activeCourse.modules.length / chunkSize);

    for (let s = 0; s < numStages; s++) {
      const start = s * chunkSize;
      const slice = activeCourse.modules.slice(start, start + chunkSize);
      const done = slice.filter((m) => completedSet.has(m.id)).length;
      const pct = Math.round((done / Math.max(1, slice.length)) * 100);
      const status: MilestoneStage['status'] =
        done === slice.length ? 'Completed' : done > 0 ? 'In Progress' : 'Ready';

      stages.push({
        stageNumber: s + 1,
        title: STAGE_TITLES[s] || `Milestone ${s + 1} · Advanced Engineering`,
        rangeLabel: `Ch ${start + 1}–${start + slice.length}`,
        modules: slice.map((mod, idx) => ({ mod, chapterNumber: start + idx + 1 })),
        completedCount: done,
        totalCount: slice.length,
        percent: pct,
        status,
      });
    }
    return stages;
  }, [activeCourse.modules, completedSet]);

  return (
    <section
      data-testid="learning-path-timeline"
      className="bg-[#121a2b] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6"
    >
      {/* Header & Track Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-emerald-400">
            Interactive 25-Node Learning Path Timeline · Milestone &amp; XP Tracker
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {activeCourse.title} — 25-Chapter Engineering Roadmap
          </h2>
          <p className="text-xs text-slate-400">
            Click any of the {totalModules} interactive nodes below to inspect milestone objectives, mark chapters complete (+50 XP), or launch the live sandbox lab.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <label htmlFor="timeline-course-select" className="text-xs font-semibold text-slate-300">
            Course Track:
          </label>
          <select
            id="timeline-course-select"
            data-testid="timeline-course-select"
            value={activeCourse.id}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setSelectedNodeId(null);
            }}
            className="min-h-[40px] bg-[#0b101b] border border-slate-700 text-emerald-400 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {COURSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.shortTag || c.title} ({c.modules.length} Nodes)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overall Track Progress Bar & Summary Metrics */}
      <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="font-semibold text-slate-200">
            Track Completion Status:{' '}
            <span className="font-mono font-bold text-emerald-400 tabular-nums">
              {completedCount} / {totalModules} Nodes Completed ({coursePercent}%)
            </span>
          </div>
          <div className="font-mono text-slate-400 tabular-nums">
            Track XP Earned: <span className="text-white font-bold">{completedCount * 50} XP</span> /{' '}
            {totalModules * 50} XP
          </div>
        </div>
        <div
          role="progressbar"
          aria-valuenow={coursePercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${activeCourse.title} completion progress`}
          className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800"
        >
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${coursePercent}%` }}
          />
        </div>
      </div>

      {/* 5 Milestone Stages with Interactive 25-Node Connected Timeline */}
      <div className="space-y-4">
        {milestoneStages.map((stage) => (
          <div
            key={stage.stageNumber}
            data-testid={`milestone-stage-${stage.stageNumber}`}
            className="bg-[#0b101b] border border-slate-800/90 rounded-xl p-4 space-y-3.5"
          >
            {/* Stage Header + Stage Progress Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {stage.rangeLabel}
                </span>
                <span className="text-slate-600" aria-hidden="true">
                  ·
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-white">{stage.title}</h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  {stage.completedCount}/{stage.totalCount} Nodes · {stage.percent}%
                </span>
                <span
                  className={`text-xs font-mono font-semibold ${
                    stage.status === 'Completed'
                      ? 'text-emerald-400'
                      : stage.status === 'In Progress'
                      ? 'text-amber-400'
                      : 'text-slate-400'
                  }`}
                >
                  {stage.status === 'Completed'
                    ? '✓ Milestone Complete'
                    : stage.status === 'In Progress'
                    ? '● Active Milestone'
                    : '○ Ready'}
                </span>
              </div>
            </div>

            {/* Stage Progress Bar */}
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  stage.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-500'
                }`}
                style={{ width: `${stage.percent}%` }}
              />
            </div>

            {/* 5 Interactive Module Nodes in this Milestone Stage */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-1">
              {stage.modules.map(({ mod, chapterNumber }, idx) => {
                const isDone = completedSet.has(mod.id);
                const isSelected = inspectedModule?.id === mod.id;
                const isNextUp = nextUpModule?.id === mod.id && !isDone;
                const score = quizScoresMap[mod.id];

                return (
                  <div key={mod.id} className="relative flex items-stretch">
                    {/* Horizontal Connector Line on Desktop between nodes */}
                    {idx < stage.modules.length - 1 && (
                      <div
                        aria-hidden="true"
                        className={`hidden sm:block absolute top-1/2 -right-2.5 w-2.5 h-0.5 z-0 ${
                          isDone ? 'bg-emerald-500/70' : 'bg-slate-800'
                        }`}
                      />
                    )}

                    <button
                      type="button"
                      data-testid={`timeline-node-${chapterNumber}`}
                      onClick={() => setSelectedNodeId(mod.id)}
                      className={`relative z-10 w-full text-left p-3 rounded-xl border transition-all flex flex-col justify-between gap-2 min-h-[88px] ${
                        isSelected
                          ? 'bg-[#15233b] border-emerald-400 ring-1 ring-emerald-400/50'
                          : isDone
                          ? 'bg-emerald-950/20 border-emerald-600/50 hover:border-emerald-400'
                          : isNextUp
                          ? 'bg-blue-950/25 border-blue-500/50 hover:border-blue-400'
                          : 'bg-[#101829] border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-xs font-mono font-bold tabular-nums text-emerald-400">
                          Node {String(chapterNumber).padStart(2, '0')}
                        </span>
                        <span
                          className={`text-[11px] font-mono font-bold ${
                            isDone
                              ? 'text-emerald-400'
                              : isNextUp
                              ? 'text-blue-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {isDone ? '✓ Done' : isNextUp ? 'Next Up' : mod.difficulty}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                        {mod.title}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                        <span>+50 XP</span>
                        <span>{score !== undefined ? `Quiz: ${score}%` : 'Interactive Lab'}</span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Node Inspector & Direct Milestone Actions */}
      {inspectedModule && (
        <div
          data-testid="timeline-node-inspector"
          className="bg-[#0b101b] border border-emerald-500/40 rounded-xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-emerald-400 font-bold">
                Selected Node #{inspectedIndex + 1} of {totalModules}
              </span>
              <span className="text-slate-600" aria-hidden="true">
                ·
              </span>
              <span className="text-slate-300">{inspectedModule.difficulty}</span>
              <span className="text-slate-600" aria-hidden="true">
                ·
              </span>
              <span
                className={
                  completedSet.has(inspectedModule.id)
                    ? 'text-emerald-400 font-bold'
                    : 'text-amber-400 font-semibold'
                }
              >
                {completedSet.has(inspectedModule.id)
                  ? '✓ Completed (+50 XP Awarded)'
                  : '○ Pending Completion (+50 XP Available)'}
              </span>
            </div>
            <h4 className="text-base font-bold text-white">
              Chapter {inspectedIndex + 1}: {inspectedModule.title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {inspectedModule.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {!completedSet.has(inspectedModule.id) && (
              <button
                type="button"
                data-testid="timeline-complete-node-btn"
                onClick={() => onToggleCompleteModule(activeCourse.id, inspectedModule.id)}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/40 text-xs font-bold text-emerald-300 hover:text-white transition-colors whitespace-nowrap"
              >
                ✓ Complete Node (+50 XP)
              </button>
            )}
            <button
              type="button"
              data-testid="timeline-launch-node-btn"
              onClick={() => onLaunchModule(activeCourse.id, inspectedModule.id)}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors whitespace-nowrap"
            >
              Launch Chapter {inspectedIndex + 1} Interactive Lab ❯
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default LearningPathTimeline;
