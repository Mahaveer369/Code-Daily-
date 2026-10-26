import React, { useState } from 'react';
import { getFastDefinition } from '../services/gemini';

interface Props {
  tags: string[];
}

const QuickDefTags: React.FC<Props> = ({ tags }) => {
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
    <>
      {/* Tags with Quick Def capability */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map(tag => (
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
    </>
  );
};

export default QuickDefTags;
