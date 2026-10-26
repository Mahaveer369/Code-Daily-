import React, { useState, useEffect, useRef } from 'react';
import { COURSES } from './LearningModule';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: 'dashboard' | 'daily' | 'learn' | 'admin', courseId?: string, moduleId?: string) => void;
  onOpenAccount: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  type: 'course' | 'module' | 'action';
  action: () => void;
}

const CommandPalette: React.FC<Props> = ({ isOpen, onClose, onNavigate, onOpenAccount }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus input whenever opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build searchable index
  const items: SearchItem[] = React.useMemo(() => {
    const list: SearchItem[] = [];

    // Core Actions
    list.push({
      id: 'act-dashboard',
      title: 'Go to Performance Dashboard',
      subtitle: 'View overall syllabus mastery, XP, streaks and completed tracks',
      category: 'Navigation',
      type: 'action',
      action: () => {
        onNavigate('dashboard');
        onClose();
      }
    });

    list.push({
      id: 'act-daily',
      title: 'Open Daily Interview Mix',
      subtitle: 'Solve today’s curated FAANG algorithm and system design questions',
      category: 'Navigation',
      type: 'action',
      action: () => {
        onNavigate('daily');
        onClose();
      }
    });

    list.push({
      id: 'act-learn',
      title: 'Browse All 7 Curriculum Tracks',
      subtitle: 'System Design, DBMS, OS, DSA, Networks, Python, and CS Fundamentals',
      category: 'Navigation',
      type: 'action',
      action: () => {
        onNavigate('learn');
        onClose();
      }
    });

    list.push({
      id: 'act-account',
      title: 'Security, Privacy & Account Settings',
      subtitle: 'Export GDPR data, password reset, UID session info',
      category: 'Security',
      type: 'action',
      action: () => {
        onOpenAccount();
        onClose();
      }
    });

    // Courses & Modules
    COURSES.forEach(course => {
      list.push({
        id: `course-${course.id}`,
        title: course.title,
        subtitle: `${course.modules.length} hands-on modules with runnable sandboxes`,
        category: 'Curriculum Track',
        type: 'course',
        action: () => {
          onNavigate('learn', course.id);
          onClose();
        }
      });

      course.modules.forEach(module => {
        list.push({
          id: `mod-${module.id}`,
          title: module.title,
          subtitle: `${course.title} · ${module.description}`,
          category: module.difficulty,
          type: 'module',
          action: () => {
            onNavigate('learn', course.id, module.id);
            onClose();
          }
        });
      });
    });

    return list;
  }, [onNavigate, onClose, onOpenAccount]);

  // Filter items
  const filteredItems = React.useMemo(() => {
    if (!query.trim()) {
      return items.slice(0, 8); // Default top recommendations
    }
    const q = query.toLowerCase();
    return items.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [items, query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
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

  // Scroll active item into view
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 md:pt-24 px-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="w-full max-w-2xl bg-[#111827] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-[#162032] gap-3">
          <svg className="w-5 h-5 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search tracks, architecture topics, code sandboxes, or actions... (ESC to close)"
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={resultsRef} className="overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm">No topics or modules matching &quot;{query}&quot;</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for &quot;Kafka&quot;, &quot;B+ Tree&quot;, &quot;Futex&quot;, &quot;Consistent Hashing&quot;, or &quot;Daily&quot;</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-colors flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-blue-600/20 text-white border border-blue-500/30' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-white truncate">{item.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono shrink-0 uppercase tracking-wider ${
                        item.type === 'action' ? 'bg-indigo-500/20 text-indigo-300' :
                        item.type === 'course' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                  </div>

                  <div className="shrink-0 text-slate-500 flex items-center">
                    {isSelected && (
                      <kbd className="hidden sm:inline-flex text-[10px] font-mono px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
                        ↵ Enter
                      </kbd>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="hidden sm:flex items-center justify-between px-4 py-2 border-t border-slate-800 bg-[#0c121e] text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="px-1 bg-slate-800 rounded font-mono">↑</kbd> <kbd className="px-1 bg-slate-800 rounded font-mono">↓</kbd> to navigate</span>
            <span><kbd className="px-1 bg-slate-800 rounded font-mono">Enter</kbd> to select</span>
          </div>
          <span>Google-Grade Fast Search</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
