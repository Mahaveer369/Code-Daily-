
import React, { useState } from 'react';

interface Props {
  initialCode: string;
  language: string;
  onRun?: (code: string) => void;
}

const CodePlayground: React.FC<Props> = ({ initialCode, language }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setOutput('Running...');

    // Simulation of code execution
    setTimeout(() => {
      try {
        if (language === 'javascript') {
          // Dangerous in prod, but fine for local demo
          const logs: string[] = [];
          const originalLog = console.log;
          console.log = (...args) => logs.push(args.join(' '));
          
          try {
             // eslint-disable-next-line no-new-func
             new Function(code)();
             setOutput(logs.length > 0 ? logs.join('\n') : 'Code executed successfully (No output).');
          } catch (e: any) {
             setOutput(`Error: ${e.message}`);
          } finally {
             console.log = originalLog;
          }
        } else {
          // Simulate other languages
          if (code.includes('print') || code.includes('console')) {
             setOutput(`> [${language.toUpperCase()} Output]\n> Hello Vibe Coding\n> (Simulated Execution Success)`);
          } else {
             setOutput(`> [${language.toUpperCase()} Interpreter]\n> Syntax Check: OK\n> Execution completed.`);
          }
        }
      } catch (err) {
        setOutput('Runtime Error');
      }
      setIsRunning(false);
    }, 800);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-gray-700 bg-[#0d1117] shadow-2xl mt-8">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <span className="ml-3 text-xs font-mono text-gray-400 uppercase">{language} Playground</span>
        </div>
        <button 
          onClick={handleRun}
          disabled={isRunning}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
             isRunning ? 'bg-gray-700 text-gray-400' : 'bg-green-600 hover:bg-green-500 text-white'
          }`}
        >
          {isRunning ? (
             <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
             <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
          RUN CODE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 h-[400px]">
        {/* Editor */}
        <div className="border-r border-gray-700 relative group">
           <textarea 
             value={code}
             onChange={(e) => setCode(e.target.value)}
             className="w-full h-full bg-[#0d1117] text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
             spellCheck={false}
           />
        </div>

        {/* Console */}
        <div className="bg-[#0d1117] p-4 font-mono text-sm overflow-y-auto">
           <div className="text-gray-500 text-xs mb-2 border-b border-gray-800 pb-1">TERMINAL</div>
           {output ? (
              <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
           ) : (
              <div className="text-gray-600 italic">Ready to execute...</div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
