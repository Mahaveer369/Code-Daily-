
import React, { useState, useRef, useCallback } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface Props {
  initialCode: string;
  language: string;
  onRun?: (code: string) => void;
}

interface ExecutionResult {
  success: boolean;
  output: string;
  error: string | null;
  execution_time_ms: number;
  language: string;
}

interface ExecutionHistory {
  id: number;
  timestamp: Date;
  success: boolean;
  output: string;
  executionTime: number;
}

// API base URL - adjust for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CodePlayground: React.FC<Props> = ({ initialCode, language }) => {
  const [code, setCode] = useState(initialCode || '# Write your code here\nprint("Hello, World!")');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [history, setHistory] = useState<ExecutionHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const editorRef = useRef<any>(null);

  // Map language names for Monaco and API
  const getMonacoLanguage = (lang: string): string => {
    const langMap: Record<string, string> = {
      'python': 'python',
      'py': 'python',
      'javascript': 'javascript',
      'js': 'javascript',
      'sql': 'sql',
      'java': 'java'
    };
    return langMap[lang.toLowerCase()] || 'plaintext';
  };

  const getApiLanguage = (lang: string): string => {
    const langMap: Record<string, string> = {
      'python': 'python',
      'py': 'python',
      'javascript': 'javascript',
      'js': 'javascript',
      'sql': 'sql'
    };
    return langMap[lang.toLowerCase()] || 'python';
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const executeCode = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter some code to execute');
      return;
    }

    setIsRunning(true);
    setOutput('');
    setError('');
    setExecutionTime(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/execute/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          language: getApiLanguage(language)
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result: ExecutionResult = await response.json();

      setExecutionTime(result.execution_time_ms);

      if (result.success) {
        setOutput(result.output || '✅ Code executed successfully (no output)');
        setError(result.error || '');
      } else {
        setOutput(result.output || '');
        setError(result.error || 'Execution failed');
      }

      // Add to history
      setHistory(prev => [{
        id: Date.now(),
        timestamp: new Date(),
        success: result.success,
        output: result.output || result.error || '',
        executionTime: result.execution_time_ms
      }, ...prev.slice(0, 9)]); // Keep last 10 executions

    } catch (err: any) {
      console.error('Execution error:', err);
      setError(err.message || 'Failed to connect to execution service');
      setOutput('');
    } finally {
      setIsRunning(false);
    }
  }, [code, language]);

  const handleRun = () => {
    executeCode();
  };

  const handleClear = () => {
    setOutput('');
    setError('');
    setExecutionTime(null);
  };

  const handleReset = () => {
    setCode(initialCode || '# Write your code here\nprint("Hello, World!")');
    setOutput('');
    setError('');
    setExecutionTime(null);
  };

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };

  // Keyboard shortcut: Ctrl/Cmd + Enter to run
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  };

  return (
    <div
      className="rounded-xl overflow-hidden border border-gray-700 bg-[#0d1117] shadow-2xl mt-8"
      onKeyDown={handleKeyDown}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <button
              type="button"
              aria-label="Reset Code"
              className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161b22]"
              onClick={handleReset}
              title="Reset Code"
            ></button>
            <button
              type="button"
              aria-label="Clear Output"
              className="w-3 h-3 rounded-full bg-yellow-500/70 hover:bg-yellow-500 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161b22]"
              onClick={handleClear}
              title="Clear Output"
            ></button>
            <button
              type="button"
              aria-label="Run Code"
              className="w-3 h-3 rounded-full bg-green-500/70 hover:bg-green-500 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161b22]"
              onClick={handleRun}
              title="Run Code"
            ></button>
          </div>
          <span className="ml-3 text-xs font-mono text-gray-400 uppercase flex items-center gap-2">
            {language} Playground
            <span className="px-1.5 py-0.5 rounded bg-blue-900/30 text-blue-400 text-[10px] border border-blue-800/50">
              Docker Sandbox
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {executionTime !== null && (
            <span className="text-xs text-gray-500 font-mono">
              {executionTime}ms
            </span>
          )}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showHistory
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            title="Execution History"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
          >
            Reset
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${isRunning
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40'
              }`}
          >
            {isRunning ? (
              <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            )}
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[350px]">
        {/* Monaco Editor */}
        <div className="border-r border-gray-700 relative">
          <Editor
            height="350px"
            language={getMonacoLanguage(language)}
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'Fira Code', 'Consolas', monospace",
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              padding: { top: 16, bottom: 16 },
              renderLineHighlight: 'all',
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              tabSize: 4,
              insertSpaces: true,
              folding: true,
              bracketPairColorization: { enabled: true },
            }}
          />
        </div>

        {/* Console/Output */}
        <div className="bg-[#0a0d12] p-4 font-mono text-sm overflow-y-auto min-h-[350px] max-h-[350px] flex flex-col">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-3 border-b border-gray-800 pb-2">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
              {isRunning ? 'EXECUTING...' : 'TERMINAL'}
            </span>
            {(output || error) && (
              <button onClick={handleClear} className="text-gray-600 hover:text-gray-400 transition-colors">
                Clear
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {error && (
              <pre className="whitespace-pre-wrap text-red-400 mb-2">
                ❌ {error}
              </pre>
            )}
            {output && (
              <pre className={`whitespace-pre-wrap ${error ? 'text-gray-400' : 'text-green-400'}`}>
                {output}
              </pre>
            )}
            {!output && !error && !isRunning && (
              <div className="text-gray-600 italic flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Press <kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-xs mx-1">Ctrl+Enter</kbd> or click "Run Code"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History Panel */}
      {showHistory && history.length > 0 && (
        <div className="bg-[#0a0d12] border-t border-gray-800 p-4 max-h-40 overflow-y-auto">
          <div className="text-xs text-gray-500 mb-2 font-semibold">EXECUTION HISTORY</div>
          <div className="space-y-1">
            {history.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs p-2 rounded bg-gray-900/50 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.success ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-gray-400 font-mono">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="text-gray-500 truncate max-w-[200px]">
                    {item.output.split('\n')[0] || 'No output'}
                  </span>
                </div>
                <span className="text-gray-600 font-mono">
                  {item.executionTime}ms
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Tips */}
      <div className="bg-[#161b22] border-t border-gray-700 px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>💡 <kbd className="bg-gray-800 px-1 rounded">Ctrl+Enter</kbd> to run</span>
          <span>🟢 Dots: <span className="text-red-400">Reset</span> | <span className="text-yellow-400">Clear</span> | <span className="text-green-400">Run</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Powered by</span>
          <span className="flex items-center gap-1 text-blue-400">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.186.186 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.12a.186.186 0 00-.185.185v1.888c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z" />
            </svg>
            Docker
          </span>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
