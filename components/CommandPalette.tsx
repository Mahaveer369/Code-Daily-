import React, { useState, useEffect, useRef } from 'react';
import { COURSES } from './LearningModule';
import { PRACTICE_PROBLEMS } from '../services/practiceProblems';
import { CHEAT_SHEETS } from '../services/cheatSheetsData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (
    tab: 'dashboard' | 'daily' | 'learn' | 'practice' | 'visualizer' | 'cheatsheets' | 'admin',
    courseId?: string,
    moduleId?: string
  ) => void;
  onOpenAccount: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  type: 'course' | 'module' | 'action' | 'problem' | 'cheatsheet';
  action: () => void;
}

const CommandPalette: React.FC<Props> = ({ isOpen, onClose, onNavigate, onOpenAccount }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items: SearchItem[] = React.useMemo(() => {
    const list: SearchItem[] = [
      {
        id: 'act-practice',
        title: 'Open Coding Practice Arena (Automated Judge)',
        subtitle: 'Solve algorithmic coding problems with automated multi-case verification',
        category: 'Practice',
        type: 'action',
        action: () => {
          onNavigate('practice');
          onClose();
        },
      },
      {
        id: 'act-visualizer',
        title: 'Launch Interactive Dry-Run Visualizers',
        subtitle: 'Step-by-step Binary Search, Sorting, SQL Joins & CPU Scheduling animations',
        category: 'Simulator',
        type: 'action',
        action: () => {
          onNavigate('visualizer');
          onClose();
        },
      },
      {
        id: 'act-cheatsheets',
        title: 'Open Quick-Reference Cheat Sheets & Roadmaps',
        subtitle: 'Big-O complexity tables, Python idioms, SQL window functions & career roadmaps',
        category: 'Reference',
        type: 'action',
        action: () => {
          onNavigate('cheatsheets');
          onClose();
        },
      },
      {
        id: 'act-learn',
        title: 'Browse All 14 Interactive Subject Tracks (350 Modules)',
        subtitle: 'HTML5, CSS3, JS, TS, React 19, Python, SQL/DBMS, DSA, C++/Java, OS, Networks, System Design, CS Core, AI',
        category: 'Tutorials',
        type: 'action',
        action: () => {
          onNavigate('learn');
          onClose();
        },
      },
      {
        id: 'act-daily',
        title: 'Open Daily Revision & Interview Q&A Mix',
        subtitle: 'Review daily flashcards and quick definitions',
        category: 'Daily',
        type: 'action',
        action: () => {
          onNavigate('daily');
          onClose();
        },
      },
      {
        id: 'act-account',
        title: 'Student Profile, Export JSON & Cloud Sync',
        subtitle: 'Manage Firebase account or export learning records',
        category: 'Account',
        type: 'action',
        action: () => {
          onOpenAccount();
          onClose();
        },
      },
    ];

    // Add Practice Problems
    PRACTICE_PROBLEMS.forEach((prob) => {
      list.push({
        id: `prob-${prob.id}`,
        title: `Practice: ${prob.title}`,
        subtitle: `${prob.difficulty} · ${prob.category} · ${prob.expectedTimeComplexity}`,
        category: 'Coding Problem',
        type: 'problem',
        action: () => {
          onNavigate('practice');
          onClose();
        },
      });
    });

    // Add Cheat Sheets
    CHEAT_SHEETS.forEach((sheet) => {
      list.push({
        id: `sheet-${sheet.id}`,
        title: sheet.title,
        subtitle: sheet.summary,
        category: 'Cheat Sheet',
        type: 'cheatsheet',
        action: () => {
          onNavigate('cheatsheets');
          onClose();
        },
      });
    });

    // Courses & Modules
    COURSES.forEach((course) => {
      list.push({
        id: `course-${course.id}`,
        title: course.title,
        subtitle: `${course.modules.length} chapters with Try-It-Yourself sandboxes`,
        category: course.shortTag || 'Track',
        type: 'course',
        action: () => {
          onNavigate('learn', course.id, course.modules[0]?.id);
          onClose();
        },
      });

      course.modules.forEach((module) => {
        list.push({
          id: `mod-${module.id}`,
          title: module.title,
          subtitle: `${course.title} · ${module.description}`,
          category: module.difficulty,
          type: 'module',
          action: () => {
            onNavigate('learn', course.id, module.id);
            onClose();
          },
        });
      });
    });

    return list;
  }, [onNavigate, onClose, onOpenAccount]);

  const filteredItems = React.useMemo(() => {
    if (!query.trim()) {
      return items.slice(0, 10);
    }
    const q = query.toLowerCase();
    return items
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
      .slice(0, 14);
  }, [items, query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  useEffect(() => {
    if (resultsRef.current) {
      const activeElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 md:pt-20 px-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="w-full max-w-2xl bg-[#111827] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-[#162032] gap-3">
          <input
            ref={inputRef}
            type="text"
            aria-label="Search all tutorials, coding problems, visualizers, and cheat sheets"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search tutorials, DSA problems, SQL joins, Flexbox, visualizers... (ESC to close)"
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white"
          >
            ESC
          </button>
        </div>

        <div ref={resultsRef} className="overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No matching tutorials or problems for &quot;{query}&quot;
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-colors flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-blue-600/20 text-white border border-blue-500/30' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white truncate">{item.title}</span>
                      <span className="text-[11px] font-mono text-blue-400 shrink-0">
                        · {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
