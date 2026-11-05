import React, { useState } from 'react';
import { CHEAT_SHEETS, CAREER_ROADMAPS } from '../services/cheatSheetsData';
import CodePlayground from './CodePlayground';

interface Props {
  onNavigateToModule: (courseId: string, moduleId?: string) => void;
}

const CheatSheetsView: React.FC<Props> = ({ onNavigateToModule }) => {
  const [selectedSheetId, setSelectedSheetId] = useState<string>(CHEAT_SHEETS[0].id);
  const [tryCodeSnippet, setTryCodeSnippet] = useState<{ code: string; language: string } | null>(null);

  const activeSheet = CHEAT_SHEETS.find((s) => s.id === selectedSheetId) || CHEAT_SHEETS[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Section 1: Guided Career Roadmaps */}
      <div className="bg-[#121a2b] border border-slate-800 rounded-2xl p-6 space-y-5">
        <div>
          <div className="text-xs font-semibold text-blue-400">
            Guided Engineering Roadmaps · Step-by-Step Syllabus
          </div>
          <h2 className="text-xl font-bold text-white mt-0.5">
            End-to-End Learning Pathways
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CAREER_ROADMAPS.map((rm) => (
            <div key={rm.id} className="bg-[#0b101b] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white">{rm.title}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {rm.targetRole} · {rm.duration}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {rm.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-3 rounded-lg bg-[#131c2e] border border-slate-800/90 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-md bg-blue-600/20 border border-blue-500/30 text-blue-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {step.stepNumber}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{step.title}</div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {step.topics.join(' · ')}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigateToModule(step.courseId, step.moduleId)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 transition-colors"
                    >
                      Open Module
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Quick Reference Cheat Sheets & Last Minute Notes */}
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-400">
              Last Minute Notes (LMNs) & Syntax Reference
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Quick-Reference Cheat Sheets
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-[#121a2b] p-1.5 rounded-xl border border-slate-800">
            {CHEAT_SHEETS.map((sheet) => (
              <button
                key={sheet.id}
                type="button"
                onClick={() => setSelectedSheetId(sheet.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedSheetId === sheet.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {sheet.category}
              </button>
            ))}
          </div>
        </div>

        {/* Active Cheat Sheet Card */}
        <div className="bg-[#121a2b] border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="text-xs text-slate-400 font-mono mb-1">
              {activeSheet.category} · {activeSheet.readTime}
            </div>
            <h3 className="text-2xl font-bold text-white">{activeSheet.title}</h3>
            <p className="text-sm text-slate-300 mt-1">{activeSheet.summary}</p>
          </div>

          {activeSheet.sections.map((sec, idx) => (
            <div key={idx} className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-white">{sec.heading}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{sec.description}</p>
              </div>

              {sec.rows && (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0b101b]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-300">
                        <th className="py-3 px-4 font-semibold">Concept / Operation</th>
                        <th className="py-3 px-4 font-semibold font-mono">Syntax / Complexity</th>
                        <th className="py-3 px-4 font-semibold">Engineering Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {sec.rows.map((r, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-900/40">
                          <td className="py-3 px-4 font-semibold text-white">{r.term}</td>
                          <td className="py-3 px-4 font-mono text-emerald-300">{r.syntax}</td>
                          <td className="py-3 px-4 text-slate-300">{r.meaning}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {sec.code && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0b101b]">
                  <div className="bg-[#162033] px-4 py-2 flex items-center justify-between border-b border-slate-800">
                    <span className="text-xs font-mono font-semibold uppercase text-blue-400">
                      {sec.language || 'code'} Snippet
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setTryCodeSnippet({
                          code: sec.code!,
                          language: sec.language || 'python',
                        })
                      }
                      className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                    >
                      Try it Yourself →
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                    <code>{sec.code}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}

          {tryCodeSnippet && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">
                  Interactive Cheat Sheet Sandbox
                </h4>
                <button
                  type="button"
                  onClick={() => setTryCodeSnippet(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close Sandbox
                </button>
              </div>
              <CodePlayground
                initialCode={tryCodeSnippet.code}
                language={tryCodeSnippet.language}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheatSheetsView;
