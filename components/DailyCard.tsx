import React, { useState } from 'react';
import { DailyTopic, Category } from '../types';
import { getFastDefinition } from '../services/gemini';
import MarkdownRenderer from './MarkdownRenderer';

interface Props {
  topic: DailyTopic;
}

const getCategoryColor = (cat: Category) => {
  switch (cat) {
    case Category.CS_CORE: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case Category.DBMS: return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case Category.SYSTEM_DESIGN: return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case Category.DSA: return 'bg-green-500/10 text-green-400 border-green-500/20';
    default: return 'bg-gray-500/10 text-gray-400';
  }
};

const getDifficultyColor = (diff: string) => {
  switch (diff.toLowerCase()) {
    case 'easy': return 'text-green-400';
    case 'medium': return 'text-yellow-400';
    case 'hard': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

const DailyCard: React.FC<Props> = ({ topic }) => {
  const [expanded, setExpanded] = useState(false);
  const [quickDef, setQuickDef] = useState<{term: string, def: string} | null>(null);
  const [loadingDef, setLoadingDef] = useState(false);

  const handleQuickDef = async (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    if (quickDef?.term === term) {
      setQuickDef(null);
      return;
    }
    setLoadingDef(true);
    const def = await getFastDefinition(term);
    setQuickDef({ term, def });
    setLoadingDef(false);
  };

  return (
    <div className={`
      relative overflow-hidden rounded-xl border border-gray-800 bg-card transition-all duration-300
      ${expanded ? 'ring-2 ring-primary/50 shadow-2xl scale-[1.01]' : 'hover:border-gray-700 hover:shadow-lg'}
    `}>
      <div className="p-6 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(topic.category)}`}>
            {topic.category}
          </span>
          <span className={`text-xs font-bold uppercase tracking-wider ${getDifficultyColor(topic.difficulty)}`}>
            {topic.difficulty}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-white mb-2">{topic.title}</h3>
        
        <div className="text-gray-400 text-sm mb-4">
          <span className="text-gray-500 font-mono">Q: </span>
          {topic.question}
        </div>

        {/* Tags with Quick Def capability */}
        <div className="flex flex-wrap gap-2 mb-4">
          {topic.tags.map(tag => (
            <button
              key={tag}
              onClick={(e) => handleQuickDef(e, tag)}
              className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded transition-colors flex items-center gap-1 group"
              title="Click for AI Quick Definition"
            >
              <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {tag}
            </button>
          ))}
        </div>

        {/* Quick Definition Popover */}
        {(loadingDef || quickDef) && (
          <div className="mb-4 p-3 bg-gray-900/50 border-l-2 border-yellow-500 rounded text-sm text-gray-300 animate-fadeIn">
            {loadingDef ? (
              <span className="flex items-center gap-2">
                 <svg className="animate-spin h-4 w-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                Asking Gemini Flash-Lite...
              </span>
            ) : (
              <span>
                <strong className="text-yellow-500 block text-xs uppercase mb-1">Fast AI Definition: {quickDef?.term}</strong>
                {quickDef?.def}
              </span>
            )}
          </div>
        )}

        <div className={`transition-all duration-500 overflow-hidden ${expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-4 border-t border-gray-800">
             <div className="mb-6">
                <h4 className="text-sm font-semibold text-secondary mb-2 uppercase tracking-wide">Quick Answer</h4>
                <p className="text-gray-300 leading-relaxed">{topic.shortAnswer}</p>
             </div>
             
             <div>
                <h4 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">Detailed Explanation</h4>
                <MarkdownRenderer content={topic.detailedExplanation} />
             </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
            {expanded ? (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
               </svg>
            ) : (
               <span className="text-xs text-gray-500 font-medium">Click to reveal answer</span>
            )}
        </div>
      </div>
    </div>
  );
};

export default DailyCard;