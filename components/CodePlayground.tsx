import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import DOMPurify from 'dompurify';
import { db } from '../services/db';
import { executeSnippet, SnippetExecutionResult } from '../services/codeRunner';

export type SandboxLangId = 'python' | 'javascript' | 'sql' | 'html' | 'cpp' | 'java' | 'bash';

export interface SuitedLanguageOption {
  id: SandboxLangId;
  label: string;
  runtimeBadge: string;
}

const ALL_LANGUAGE_META: Record<SandboxLangId, SuitedLanguageOption> = {
  python: {
    id: 'python',
    label: 'Python 3.12',
    runtimeBadge: 'Python 3.12 Runtime'
  },
  javascript: {
    id: 'javascript',
    label: 'JavaScript (ES2025)',
    runtimeBadge: 'V8 / ES2025 Runtime'
  },
  sql: {
    id: 'sql',
    label: 'SQL Engine',
    runtimeBadge: 'Relational SQL Engine'
  },
  html: {
    id: 'html',
    label: 'HTML5 / CSS3',
    runtimeBadge: 'HTML5 & CSS3 Live DOM Engine'
  },
  cpp: {
    id: 'cpp',
    label: 'C++20 / C++23',
    runtimeBadge: 'C++20/23 Native Systems Runtime'
  },
  java: {
    id: 'java',
    label: 'Java 21 LTS',
    runtimeBadge: 'Java 21 LTS (OpenJDK HotSpot JVM)'
  },
  bash: {
    id: 'bash',
    label: 'Cloud, Git & Bash CLI',
    runtimeBadge: 'Git, Docker, K8s & Terraform CLI Terminal'
  }
};

const COURSE_SUITED_LANGUAGES: Record<string, SandboxLangId[]> = {
  'c-html': ['html'],
  'c-css': ['html'],
  'c-js': ['javascript'],
  'c-ts': ['javascript'],
  'c-react': ['javascript', 'html'],
  'c1': ['python'],
  'c5': ['sql', 'python'],
  'c4': ['python', 'cpp', 'java', 'javascript'],
  'c11': ['cpp'],
  'c-java': ['java'],
  'c3': ['python', 'cpp', 'bash'],
  'c7': ['python', 'javascript'],
  'c6': ['python', 'java', 'sql', 'javascript'],
  'c2': ['python', 'cpp'],
  'c12': ['python'],
  'c-harness': ['python', 'javascript'],
  'c-git': ['bash'],
  'c-docker': ['bash'],
  'c-terraform': ['bash']
};

export const normalizeSandboxLang = (rawLang?: string): SandboxLangId => {
  const clean = (rawLang || 'python').toLowerCase().trim();
  if (clean === 'bash' || clean === 'sh' || clean === 'git' || clean === 'shell') return 'bash';
  if (clean === 'html' || clean === 'css') return 'html';
  if (clean === 'javascript' || clean === 'js' || clean === 'typescript' || clean === 'ts' || clean === 'jsx' || clean === 'tsx') {
    return 'javascript';
  }
  if (clean === 'sql') return 'sql';
  if (clean === 'java') return 'java';
  if (clean === 'cpp' || clean === 'c++' || clean === 'c') return 'cpp';
  return 'python';
};

/**
 * Returns ONLY the programming languages that genuinely suit a given course track.
 * Prevents showing unrelated languages (e.g. no SQL/C++ in HTML5, no HTML/CSS in DSA or OS).
 */
export const getSuitedLanguagesForCourse = (
  courseId?: string,
  defaultLang?: string
): SuitedLanguageOption[] => {
  if (courseId && COURSE_SUITED_LANGUAGES[courseId]) {
    return COURSE_SUITED_LANGUAGES[courseId].map((id) => ALL_LANGUAGE_META[id]);
  }
  const normalizedDefault = normalizeSandboxLang(defaultLang);
  return [ALL_LANGUAGE_META[normalizedDefault]];
};

interface Props {
  initialCode: string;
  language: string;
  courseId?: string;
  isFullscreen?: boolean;
  onRun?: (code: string) => void;
}

const LANGUAGE_TEMPLATES: Record<string, string> = {
  python: `# Python 3.12 Interactive Sandbox
def two_pointer_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True

print("racecar ->", two_pointer_palindrome("racecar"))
print("system  ->", two_pointer_palindrome("system"))`,
  javascript: `// JavaScript (ES2025) / TypeScript Interactive Sandbox
const services = [
  { name: "API Gateway", p99Ms: 12, healthy: true },
  { name: "Auth Token Service", p99Ms: 8, healthy: true },
  { name: "Shard Replica 03", p99Ms: 45, healthy: true }
];

const summary = services
  .filter(s => s.healthy)
  .map(s => \`\${s.name} (\${s.p99Ms}ms)\`);

console.log("Active Services:", summary.join(" | "));`,
  sql: `-- Interactive Relational SQL Sandbox
-- Preloaded Tables: employees, departments, students, orders
SELECT name, role, department, salary
FROM employees
WHERE salary > 120000
ORDER BY salary DESC
LIMIT 4;`,
  html: `<div style="font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #334155;">
  <div style="font-size: 11px; color: #34d399; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">Code It Out Live Preview</div>
  <h3 style="margin: 6px 0 8px; font-size: 18px;">Interactive HTML5 &amp; CSS3 Component</h3>
  <p style="margin: 0 0 14px; font-size: 13px; color: #cbd5e1;">Edit this markup and click Run Code to see instant visual rendering.</p>
  <button style="background: #10b981; color: #052e16; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700;">
    Interactive Action
  </button>
</div>`,
  cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    cout << "Code It Out C++20/23 Native Systems Sandbox Ready!" << endl;
    cout << "RAII + IntroSort O(N log N) + Zero-Overhead Abstractions" << endl;
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Code It Out Java 21 LTS (OpenJDK HotSpot) Sandbox Ready!");
        System.out.println("Virtual Threads (Project Loom) + Generational ZGC Active");
    }
}`,
  bash: `# Interactive Git & GitHub CLI Terminal Sandbox
$ git init
$ git switch -c feat/oauth-login
$ git add src/auth.ts tests/auth.test.ts
$ git commit -m "feat(auth): enforce strict token expiration check"
$ git log --oneline --graph`
};

const CodePlayground: React.FC<Props> = ({ initialCode, language, courseId, isFullscreen = false }) => {
  const suitedLanguages = useMemo(
    () => getSuitedLanguagesForCourse(courseId, language),
    [courseId, language]
  );

  const [selectedLang, setSelectedLang] = useState<SandboxLangId>(() =>
    normalizeSandboxLang(language)
  );
  const [code, setCode] = useState<string>(initialCode || LANGUAGE_TEMPLATES.python);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [htmlPreview, setHtmlPreview] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  useEffect(() => {
    const normalized = normalizeSandboxLang(language);
    const allowedIds = suitedLanguages.map((l) => l.id);
    const activeLang = allowedIds.includes(normalized) ? normalized : allowedIds[0];

    setSelectedLang(activeLang);
    const nextCode = initialCode || LANGUAGE_TEMPLATES[activeLang] || LANGUAGE_TEMPLATES.python;
    setCode(nextCode);
    setOutput('');
    setError('');
    setExecutionTime(null);
    if (activeLang === 'html') {
      setHtmlPreview(nextCode);
    } else {
      setHtmlPreview(null);
    }
  }, [initialCode, language, suitedLanguages]);

  const getMonacoLanguage = (lang: string): string => {
    const map: Record<string, string> = {
      python: 'python',
      py: 'python',
      javascript: 'javascript',
      js: 'javascript',
      sql: 'sql',
      html: 'html',
      css: 'css',
      cpp: 'cpp',
      java: 'java',
      bash: 'shell',
      sh: 'shell',
      git: 'shell',
    };
    return map[lang.toLowerCase()] || 'javascript';
  };

  const executeCode = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter code before running.');
      return;
    }

    setIsRunning(true);
    setOutput('');
    setError('');

    try {
      let result: SnippetExecutionResult | null = null;

      if (selectedLang === 'python' || selectedLang === 'javascript') {
        try {
          const resp = await fetch('/api/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, language: selectedLang }),
          });
          if (resp.ok) {
            const data = await resp.json();
            if (data && typeof data.success === 'boolean') {
              result = data;
            }
          }
        } catch {
          // Fallback to deterministic browser runner
        }
      }

      if (!result) {
        result = executeSnippet(code, selectedLang);
      }

      setExecutionTime(result.execution_time_ms);
      if (result.htmlPreview) {
        setHtmlPreview(result.htmlPreview);
      } else {
        setHtmlPreview(null);
      }

      if (result.success) {
        setOutput(result.output || 'Program finished (0 errors)');
        setError('');
      } else {
        setOutput(result.output || '');
        setError(result.error || 'Execution error');
      }

      const user = db.getCurrentUser();
      db.logSecurityEvent({
        type: 'EXECUTION',
        details: `Executed ${selectedLang} snippet`,
        userId: user?.id,
      });
    } catch (err: any) {
      setError(err.message || 'Execution error');
    } finally {
      setIsRunning(false);
    }
  }, [code, selectedLang]);

  const handleLanguageSwitch = (newLang: SandboxLangId) => {
    setSelectedLang(newLang);
    const nativeNorm = normalizeSandboxLang(language);
    const nextCode =
      newLang === nativeNorm && initialCode
        ? initialCode
        : LANGUAGE_TEMPLATES[newLang] || LANGUAGE_TEMPLATES.python;
    setCode(nextCode);
    setOutput('');
    setError('');
    setExecutionTime(null);
    setHtmlPreview(newLang === 'html' ? nextCode : null);
  };

  const handleReset = () => {
    const nativeNorm = normalizeSandboxLang(language);
    const resetTarget =
      initialCode && selectedLang === nativeNorm
        ? initialCode
        : LANGUAGE_TEMPLATES[selectedLang] || LANGUAGE_TEMPLATES.python;
    setCode(resetTarget);
    setOutput('');
    setError('');
    setExecutionTime(null);
    if (selectedLang === 'html') setHtmlPreview(resetTarget);
  };

  const activeMeta = ALL_LANGUAGE_META[selectedLang] || ALL_LANGUAGE_META.python;

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0b101b] shadow-xl">
      {/* Course-Suited Runtime Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-[#121b2e] border-b border-slate-800">
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
          {suitedLanguages.length === 1 ? (
            /* Single Suited Language -> Authoritative Locked Runtime Badge */
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0b101b] border border-emerald-500/40 text-xs font-mono font-bold text-emerald-400"
              title="Dedicated runtime environment tailored to this course track"
            >
              <span>{suitedLanguages[0].runtimeBadge}</span>
            </div>
          ) : (
            /* 2-3 Suited Languages -> Clean Segmented Course-Suited Switcher */
            <div
              role="group"
              aria-label="Course suited programming languages"
              className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#090e19] border border-slate-800"
            >
              {suitedLanguages.map((langOpt) => {
                const isSelected = selectedLang === langOpt.id;
                return (
                  <button
                    key={langOpt.id}
                    type="button"
                    onClick={() => handleLanguageSwitch(langOpt.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-colors whitespace-nowrap ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    {langOpt.label}
                  </button>
                );
              })}
            </div>
          )}

          {executionTime !== null && (
            <span className="text-[11px] text-emerald-400 font-mono tabular-nums whitespace-nowrap px-1.5">
              · {executionTime}ms
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={executeCode}
            disabled={isRunning}
            className="min-h-[34px] px-3.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1 shadow-sm disabled:opacity-50 whitespace-nowrap"
          >
            <span>{isRunning ? 'Running...' : 'Run Code ▶'}</span>
          </button>
        </div>
      </div>

      {/* Code Input + Output (Stacked in Docked Mode, Side-by-Side Split in Fullscreen Mode) */}
      <div className={isFullscreen ? 'grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800' : 'flex flex-col'}>
        {/* Code Input (Textarea fallback + Monaco Editor) */}
        <div className={`grid grid-cols-1 ${isFullscreen ? '' : 'border-b border-slate-800'} bg-[#1e1e1e]`}>
          <div className={`relative ${isFullscreen ? 'min-h-[420px]' : 'min-h-[250px]'} pt-1`}>
            <Editor
              height={isFullscreen ? '420px' : '250px'}
              language={getMonacoLanguage(selectedLang)}
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-dark"
              loading={
                <textarea
                  aria-label="Code editor"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`w-full ${isFullscreen ? 'h-[420px]' : 'h-[250px]'} bg-[#0b101b] text-slate-100 font-mono text-xs p-4 focus:outline-none resize-none`}
                />
              }
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineHeight: 21,
                fontFamily: "'JetBrains Mono', monospace",
                lineNumbers: 'on',
                lineNumbersMinChars: 3,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                padding: { top: 14, bottom: 14 },
                tabSize: 2,
                fixedOverflowWidgets: true,
              }}
            />
          </div>
        </div>

        {/* Output / Live HTML Preview */}
        <div className={`bg-[#080c14] p-4 font-mono text-xs ${isFullscreen ? 'min-h-[420px] max-h-[430px]' : 'min-h-[145px] max-h-[280px]'} overflow-y-auto`}>
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-2 pb-1.5 border-b border-slate-800/80">
            <span className="font-semibold uppercase tracking-wider text-slate-300">
              {selectedLang === 'html'
                ? 'Live Browser DOM Render & Output'
                : `${activeMeta.label} Standard Output (stdout)`}
            </span>
            {(output || error) && (
              <button
                type="button"
                onClick={() => {
                  setOutput('');
                  setError('');
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Clear Output
              </button>
            )}
          </div>

          {htmlPreview && (
            <div
              className="mb-3 p-3.5 rounded-xl bg-slate-900/75 border border-slate-800 font-sans"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlPreview) }}
            />
          )}

          {error && (
            <pre className="whitespace-pre-wrap text-red-400 mb-2 leading-relaxed">
              Error: {error}
            </pre>
          )}

          {output && (
            <pre className="whitespace-pre-wrap text-emerald-300 leading-relaxed">
              {output}
            </pre>
          )}

          {!output && !error && !htmlPreview && (
            <div className="text-slate-400 py-4 leading-relaxed">
              Click <strong className="text-emerald-400">Run Code ▶</strong> above to execute this{' '}
              <span className="text-white font-semibold">{activeMeta.label}</span> program in real time.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
