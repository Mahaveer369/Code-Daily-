
import { LessonContent } from '../types';

export const SEED_DATA: Record<string, LessonContent> = {
  // --- PYTHON MODULE 1 ---
  'py-1': {
    id: 'py-1',
    title: 'Intro & History',
    estimatedReadingTime: '15 mins',
    contentMarkdown: `
# Python: The Serpent that Swallowed the World

## 1. History & Context
Python was conceived in the late 1980s by **Guido van Rossum** at CWI in the Netherlands. Its core philosophy is summarized in *The Zen of Python* (\`import this\`). It bridges the gap between Shell scripts and C, prioritizing developer productivity.

## 2. Core Concepts
- **Dynamic Typing**: Types are checked at runtime.
- **Indentation**: Whitespace defines blocks.
- **Bytecode**: Source (\`.py\`) -> Bytecode (\`.pyc\`) -> PVM execution.

## 3. The GIL (Global Interpreter Lock)
CPython has a mutex that prevents multiple native threads from executing Python bytecodes simultaneously. This affects CPU-bound multi-threaded programs.
    `,
    diagramSvg: `<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" class="w-full h-full bg-[#0f172a]"><rect width="800" height="400" fill="#0f172a" /><rect x="50" y="150" width="100" height="120" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2" /><text x="100" y="200" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="14">Source</text><path d="M160 210 H220" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)" /><rect x="230" y="150" width="120" height="120" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="2" /><text x="290" y="200" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="14">Bytecode</text><path d="M360 210 H420" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)" /><rect x="430" y="100" width="300" height="220" rx="16" fill="#1e293b" stroke="#f59e0b" stroke-width="2" stroke-dasharray="8 4" /><text x="580" y="130" text-anchor="middle" fill="#f59e0b" font-weight="bold">PVM</text><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#64748b" /></marker></defs></svg>`,
    quizzes: [
      {
        id: 'q1',
        question: "Which component actually executes the code on the CPU?",
        options: ["Compiler", "Python Virtual Machine (PVM)", "Source Code", "IDE"],
        correctAnswerIndex: 1,
        explanation: "The PVM iterates over the bytecode instructions and executes them."
      },
      {
        id: 'q2',
        question: "What does the GIL prevent?",
        options: ["Memory leaks", "Multiple processes", "Parallel execution of native threads in one process", "Network requests"],
        correctAnswerIndex: 2,
        explanation: "The Global Interpreter Lock ensures only one thread holds the control of the Python interpreter."
      }
    ],
    codingChallenge: {
      title: "Hello World & Variables",
      description: "Define a variable named `message` with the value 'Hello Vibe Coding' and print it.",
      language: "python",
      starterCode: "# Your code here\n\nprint(message)",
      solutionCode: "message = 'Hello Vibe Coding'\nprint(message)",
      hint: "Use the assignment operator (=)."
    },
    resources: [
      { title: "Inside The Python Virtual Machine", type: "Book", authorOrSource: "Obi Ike-Nwosu", url: "https://www.google.com/search?q=Inside+The+Python+Virtual+Machine" }
    ],
    interviewQuestions: []
  },

  // --- DSA MODULE 1 ---
  'ds-1': {
    id: 'ds-1',
    title: 'Complexity Analysis',
    estimatedReadingTime: '12 mins',
    contentMarkdown: `
# Time & Space Complexity

## 1. Big O Notation
Upper bound on growth rate.
- **O(1)**: Constant
- **O(N)**: Linear
- **O(N^2)**: Quadratic

## 2. RAM Model
We assume simple operations take constant time.
    `,
    diagramSvg: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" class="w-full h-full bg-[#0f172a]"><path d="M50 340 H550" stroke="#10b981" stroke-width="3" fill="none" /><text x="500" y="330" fill="#10b981" font-weight="bold">O(1)</text><line x1="50" y1="350" x2="550" y2="100" stroke="#f59e0b" stroke-width="3" /><text x="500" y="130" fill="#f59e0b" font-weight="bold">O(N)</text></svg>`,
    quizzes: [
      {
        id: 'q1',
        question: "If an algorithm's time doubles when input doubles, what is it?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
        correctAnswerIndex: 2,
        explanation: "Linear growth (O(N)) means time scales directly with input."
      }
    ],
    codingChallenge: {
      title: "Analyze Loops",
      description: "Write a loop that prints numbers 0 to 4. What is the complexity?",
      language: "javascript",
      starterCode: "for (let i = 0; i < 5; i++) {\n  console.log(i);\n}",
      solutionCode: "for (let i = 0; i < 5; i++) {\n  console.log(i);\n}",
      hint: "It's a simple for loop."
    },
    resources: [],
    interviewQuestions: []
  }
};
