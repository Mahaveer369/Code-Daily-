import React from 'react';

const MarkdownRenderer: React.FC<{ content: string; svg?: string }> = ({ content, svg }) => {
  if (!content && !svg) return null;

  const processContent = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
        const language = match ? match[1] : '';
        const code = match ? match[2] : part.slice(3, -3);
        
        return (
          <div key={index} className="my-6 rounded-lg overflow-hidden bg-[#0d1117] border border-gray-700 shadow-xl">
            {language && (
              <div className="bg-[#161b22] px-4 py-2 text-xs text-gray-400 border-b border-gray-700 font-mono uppercase tracking-wider flex justify-between">
                <span>{language}</span>
                <span className="text-gray-600">Snippet</span>
              </div>
            )}
            <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      } else {
        return (
          <div key={index} className="whitespace-pre-wrap mb-4 text-gray-300 leading-relaxed text-base">
            {part.split('\n').map((line, i) => {
               // Bold
               const boldParts = line.split(/(\*\*.*?\*\*)/g);
               // Headers (Simple implementation)
               if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-blue-400 mt-6 mb-2">{line.replace('### ', '')}</h3>;
               if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-white mt-8 mb-3 pb-2 border-b border-gray-700">{line.replace('## ', '')}</h2>;
               if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc marker:text-primary pl-2 mb-1">{line.replace('- ', '')}</li>;

               return (
                 <p key={i} className="mb-2">
                   {boldParts.map((sub, j) => {
                      if (sub.startsWith('**') && sub.endsWith('**')) {
                        return <strong key={j} className="text-white font-semibold">{sub.slice(2, -2)}</strong>;
                      }
                      if (sub.startsWith('`') && sub.endsWith('`')) {
                         return <code key={j} className="bg-gray-800 px-1.5 py-0.5 rounded text-secondary text-sm font-mono">{sub.slice(1, -1)}</code>;
                      }
                      return sub;
                   })}
                 </p>
               )
            })}
          </div>
        );
      }
    });
  };

  return (
    <div className="markdown-body">
      {svg && (
        <div className="my-8 p-6 bg-dark/50 border border-gray-700 rounded-xl flex flex-col items-center">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-4 w-full text-center border-b border-gray-800 pb-2">AI Generated Diagram</div>
          <div 
            className="w-full max-w-lg overflow-hidden rounded-lg [&>svg]:w-full [&>svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: svg }} 
          />
        </div>
      )}
      {processContent(content)}
    </div>
  );
};

export default MarkdownRenderer;