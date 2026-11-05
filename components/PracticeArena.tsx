import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { PRACTICE_PROBLEMS } from '../services/practiceProblems';
import { evaluateProblemSubmission, ProblemJudgeResult } from '../services/codeRunner';
import { PracticeProblem } from '../types';
import { db } from '../services/db';
import MarkdownRenderer from './MarkdownRenderer';

interface Props {
  onProblemSolved?: () => void;
}

const PracticeArena: React.FC<Props> = ({ onProblemSolved }) => {
  const [selectedProblem, setSelectedProblem] = useState<PracticeProblem>(PRACTICE_PROBLEMS[0]);
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'Easy' | 'Medium' | 'Hard'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
  const [code, setCode] = useState<string>(PRACTICE_PROBLEMS[0].starterCode.javascript);
  const [judgeResult, setJudgeResult] = useState<ProblemJudgeResult | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  const currentUser = db.getCurrentUser();
  const solvedIds = new Set(currentUser?.solvedProblemIds || []);

  const filteredProblems = PRACTICE_PROBLEMS.filter((p) => {
    const matchesDiff = difficultyFilter === 'ALL' || p.difficulty === difficultyFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDiff && matchesSearch;
  });

  const handleSelectProblem = (prob: PracticeProblem) => {
    setSelectedProblem(prob);
    setCode(prob.starterCode[language]);
    setJudgeResult(null);
    setShowHint(false);
  };

  const handleLanguageChange = (newLang: 'javascript' | 'python') => {
    setLanguage(newLang);
    setCode(selectedProblem.starterCode[newLang]);
    setJudgeResult(null);
  };

  const handleRunJudge = () => {
    const res = evaluateProblemSubmission(selectedProblem, code, language);
    setJudgeResult(res);
    if (res.verdict === 'Accepted' && currentUser) {
      db.markProblemSolved(currentUser.id, selectedProblem.id, selectedProblem.points);
      onProblemSolved?.();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Problem Selector Strip & Filters */}
      <div className="bg-[#121a2b] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-400">
              Code IIT Out Coding Arena · Automated Multi-Test-Case Judge
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">
              DSA &amp; Algorithm Practice Sheet ({solvedIds.size} / {PRACTICE_PROBLEMS.length} Solved)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              aria-label="Filter practice problems"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by topic, company, title..."
              className="bg-[#0b101b] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex items-center gap-1 bg-[#0b101b] p-1 rounded-xl border border-slate-800">
              {(['ALL', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    difficultyFilter === diff
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problem List Pills / Row Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filteredProblems.map((prob) => {
            const isSolved = solvedIds.has(prob.id);
            const isSelected = selectedProblem.id === prob.id;
            return (
              <button
                key={prob.id}
                type="button"
                onClick={() => handleSelectProblem(prob)}
                className={`text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500/60 text-white'
                    : 'bg-[#0b101b] border-slate-800/90 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">
                      {prob.title}
                    </span>
                    {prob.isProblemOfTheDay && (
                      <span className="text-[10px] font-mono text-amber-300 shrink-0">
                        ★ POTD
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    {prob.difficulty} · +{prob.points} XP · {prob.companies.slice(0, 2).join(', ')}
                  </div>
                </div>
                <span className="text-xs font-mono shrink-0">
                  {isSolved ? (
                    <span className="text-emerald-400 font-bold">✓ Solved</span>
                  ) : (
                    <span className="text-slate-500">Solve →</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Problem & Judge Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Problem Statement, Examples & Complexity */}
        <div className="lg:col-span-5 bg-[#121a2b] border border-slate-800 rounded-2xl p-6 space-y-5">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-slate-400 font-mono mb-2">
              <span>
                {selectedProblem.category} · {selectedProblem.difficulty} · +{selectedProblem.points} XP
              </span>
              {solvedIds.has(selectedProblem.id) && (
                <span className="text-emerald-400 font-bold">✓ Completed</span>
              )}
            </div>
            <h3 className="text-xl font-bold text-white">{selectedProblem.title}</h3>
            <div className="text-xs text-slate-400 mt-1">
              Asked in: <span className="text-slate-200 font-medium">{selectedProblem.companies.join(' · ')}</span>
            </div>
          </div>

          <div className="text-sm text-slate-300 leading-relaxed">
            <MarkdownRenderer content={selectedProblem.description} />
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sample Examples
            </h4>
            {selectedProblem.examples.map((ex, i) => (
              <div key={i} className="bg-[#0b101b] border border-slate-800 rounded-xl p-3.5 font-mono text-xs space-y-1">
                <div>
                  <span className="text-slate-400">Input: </span>
                  <span className="text-slate-200">{ex.input}</span>
                </div>
                <div>
                  <span className="text-slate-400">Output: </span>
                  <span className="text-emerald-400 font-bold">{ex.output}</span>
                </div>
                {ex.explanation && (
                  <div className="text-slate-400 font-sans pt-1">
                    Explanation: {ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Expected Complexity */}
          <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-3.5 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Expected Time Complexity:</span>
              <span className="font-mono font-bold text-blue-400">{selectedProblem.expectedTimeComplexity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Expected Auxiliary Space:</span>
              <span className="font-mono font-bold text-blue-400">{selectedProblem.expectedSpaceComplexity}</span>
            </div>
          </div>

          {/* Hint Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              {showHint ? 'Hide Hints' : 'Need a Hint? Click to Reveal'}
            </button>
            {showHint && (
              <ul className="mt-2 space-y-1.5 text-xs text-slate-300 bg-[#0b101b] p-3.5 rounded-xl border border-slate-800 list-disc list-inside">
                {selectedProblem.hints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right: Code Editor & Test Case Judge */}
        <div className="lg:col-span-7 bg-[#121a2b] border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-[#162033] border-b border-slate-800">
            <div className="flex items-center gap-2">
              <label htmlFor="judge-lang-select" className="sr-only">
                Solution Language
              </label>
              <select
                id="judge-lang-select"
                aria-label="Solution language"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as 'javascript' | 'python')}
                className="bg-slate-900 text-xs font-mono font-semibold text-white px-3 py-1.5 rounded-lg border border-slate-700"
              >
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="python">Python 3</option>
              </select>
              <span className="text-xs text-slate-400 font-mono">
                fn: {selectedProblem.functionName}()
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCode(selectedProblem.starterCode[language]);
                  setJudgeResult(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800"
              >
                Reset Starter
              </button>
              <button
                type="button"
                onClick={handleRunJudge}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
              >
                Submit & Run All Test Cases
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="border-b border-slate-800">
            <Editor
              height="280px"
              language={language}
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-dark"
              loading={
                <textarea
                  aria-label="Problem solution editor"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-[280px] bg-[#0b101b] text-slate-100 font-mono text-xs p-4 focus:outline-none"
                />
              }
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 14, bottom: 14 },
              }}
            />
          </div>

          {/* Judge Results Area */}
          <div className="p-5 bg-[#0b101b] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Automated Test Case Judge
              </span>
              {judgeResult && (
                <span
                  className={`text-xs font-mono font-bold ${
                    judgeResult.verdict === 'Accepted' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {judgeResult.verdict === 'Accepted' ? '✓ ACCEPTED' : `✕ ${judgeResult.verdict}`} · {judgeResult.passedCount}/{judgeResult.totalCount} Passed ({judgeResult.executionTimeMs}ms)
                </span>
              )}
            </div>

            {judgeResult?.errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/70 text-xs font-mono text-red-300">
                {judgeResult.errorMessage}
              </div>
            )}

            {judgeResult ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {judgeResult.results.map((tc, idx) => (
                  <div
                    key={tc.testCaseId}
                    className={`p-3 rounded-xl border font-mono text-xs space-y-1 ${
                      tc.passed
                        ? 'bg-emerald-950/20 border-emerald-800/60 text-slate-200'
                        : 'bg-red-950/20 border-red-800/60 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>Test Case #{idx + 1}</span>
                      <span className={tc.passed ? 'text-emerald-400' : 'text-red-400'}>
                        {tc.passed ? '✓ PASSED' : '✕ FAILED'}
                      </span>
                    </div>
                    <div className="text-slate-400 truncate">In: {tc.inputDisplay}</div>
                    <div>
                      Expected: <span className="text-emerald-300">{tc.expectedOutput}</span> · Got:{' '}
                      <span className={tc.passed ? 'text-emerald-300' : 'text-red-300'}>{tc.actualOutput}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-3">
                Click <strong className="text-white">&quot;Submit &amp; Run All Test Cases&quot;</strong> to verify your solution against {selectedProblem.testCases.length} automated test cases and earn +{selectedProblem.points} XP.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeArena;
