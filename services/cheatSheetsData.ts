import { CheatSheet } from '../types';

export interface CareerRoadmap {
  id: string;
  title: string;
  duration: string;
  targetRole: string;
  steps: {
    stepNumber: number;
    title: string;
    topics: string[];
    courseId: string;
    moduleId?: string;
  }[];
}

export const CHEAT_SHEETS: CheatSheet[] = [
  {
    id: 'cs-dsa-bigo',
    title: 'DSA Big-O Time & Space Complexity Sheet',
    category: 'DSA & Algorithms',
    readTime: '4 min ref',
    summary: 'Complete reference of worst-case and average-case complexities for arrays, trees, heaps, graphs, and sorting algorithms.',
    sections: [
      {
        heading: 'Data Structure Operations',
        description: 'Time complexity for core operations across primary data structures.',
        rows: [
          { term: 'Dynamic Array (List / Vector)', syntax: 'Access: O(1) · Search: O(N)', meaning: 'Append is O(1) amortized; middle insert/delete is O(N).' },
          { term: 'Singly / Doubly Linked List', syntax: 'Access: O(N) · Insert Head: O(1)', meaning: 'O(1) splicing when pointer is known; poor CPU cache locality.' },
          { term: 'Hash Table (dict / Map)', syntax: 'Lookup / Insert / Delete: O(1) avg', meaning: 'O(N) worst case on hash collision; load factor ~0.75.' },
          { term: 'Balanced BST (AVL / Red-Black)', syntax: 'Lookup / Insert / Delete: O(log N)', meaning: 'Maintains sorted keys and supports range queries.' },
          { term: 'Binary Heap (Priority Queue)', syntax: 'Peek Min/Max: O(1) · Push/Pop: O(log N)', meaning: 'Heapify from array takes O(N) linear time.' }
        ]
      },
      {
        heading: 'Sorting Algorithms Comparison',
        description: 'Time, auxiliary space, and stability guarantees.',
        rows: [
          { term: 'Merge Sort', syntax: 'Time: O(N log N) · Space: O(N)', meaning: 'Stable sort; deterministic worst-case guarantee.' },
          { term: 'Quick Sort', syntax: 'Time: O(N log N) avg · Space: O(log N)', meaning: 'In-place, cache-friendly, unstable; O(N^2) worst pivot.' },
          { term: 'Heap Sort', syntax: 'Time: O(N log N) · Space: O(1)', meaning: 'In-place, not stable, slower cache locality than QuickSort.' },
          { term: 'TimSort (Python / Java default)', syntax: 'Time: O(N log N) · Best: O(N)', meaning: 'Hybrid Merge + Insertion sort optimized for real-world runs.' }
        ]
      }
    ]
  },
  {
    id: 'cs-python-syntax',
    title: 'Python 3 Quick Syntax & Built-ins Reference',
    category: 'Python Mastery',
    readTime: '5 min ref',
    summary: 'Essential Python slices, comprehensions, collections, and interview idioms.',
    sections: [
      {
        heading: 'List, Dict & Set Idioms',
        description: 'Fast one-liners used in coding rounds and data processing.',
        code: `# List comprehension with filter
squares = [x * x for x in range(10) if x % 2 == 0]
print("Even squares:", squares)

# Reverse list or string in O(N)
word = "codeitout"
print("Reversed:", word[::-1])

# Frequency counter dictionary
freq = {}
for ch in "abracadabra":
    freq[ch] = freq.get(ch, 0) + 1
print("Frequencies:", freq)`,
        language: 'python',
        rows: [
          { term: 'List Slicing', syntax: 'arr[start:stop:step]', meaning: 'arr[::-1] reverses; arr[:k] takes first k elements.' },
          { term: 'Sorting with Custom Key', syntax: 'arr.sort(key=lambda x: (x[1], -x[0]))', meaning: 'Sorts in-place using TimSort in O(N log N).' },
          { term: 'Deque (O(1) Queue)', syntax: 'from collections import deque', meaning: 'popleft() and appendleft() in O(1) vs list.pop(0) O(N).' },
          { term: 'Heapq (Min-Heap)', syntax: 'heapq.heappush(h, val)', meaning: 'Push -val to simulate a Max-Heap in Python.' }
        ]
      }
    ]
  },
  {
    id: 'cs-sql-queries',
    title: 'SQL Queries, Joins & Window Functions Sheet',
    category: 'SQL & DBMS',
    readTime: '5 min ref',
    summary: 'Execution order, JOIN semantics, aggregations, and RANK/DENSE_RANK window queries.',
    sections: [
      {
        heading: 'SQL Execution Order vs Lexical Order',
        description: 'The database query optimizer executes clauses in this exact order:',
        rows: [
          { term: '1. FROM & JOIN', syntax: 'FROM employees e JOIN departments d ON ...', meaning: 'Builds Cartesian product and filters by ON predicates.' },
          { term: '2. WHERE', syntax: 'WHERE e.salary > 100000', meaning: 'Filters individual rows before grouping (cannot use aliases).' },
          { term: '3. GROUP BY & HAVING', syntax: 'GROUP BY department HAVING COUNT(*) > 2', meaning: 'Aggregates buckets and filters aggregated groups.' },
          { term: '4. SELECT & Window Functions', syntax: 'SELECT name, DENSE_RANK() OVER (...)', meaning: 'Computes projections and window frames.' },
          { term: '5. ORDER BY & LIMIT', syntax: 'ORDER BY salary DESC LIMIT 5', meaning: 'Sorts final projection and truncates output rows.' }
        ]
      },
      {
        heading: 'Interactive Nth Highest Salary Query',
        description: 'Try running this query directly in the SQL Sandbox:',
        code: `-- Find top earners in Engineering sorted by salary
SELECT * FROM employees
WHERE salary > 120000
ORDER BY salary DESC
LIMIT 3;`,
        language: 'sql'
      }
    ]
  },
  {
    id: 'cs-html-css-js',
    title: 'HTML5, Modern CSS Grid/Flexbox & ES6+ Sheet',
    category: 'Web Development',
    readTime: '5 min ref',
    summary: 'Semantic HTML5 elements, Flexbox/Grid centering patterns, and JavaScript async/await & array methods.',
    sections: [
      {
        heading: 'Modern Layout & DOM Essentials',
        description: 'Core patterns every frontend and full-stack student needs by heart.',
        rows: [
          { term: 'Flexbox Centering', syntax: 'display: flex; align-items: center; justify-content: center;', meaning: 'Centers children along both main and cross axes.' },
          { term: 'Responsive CSS Grid', syntax: 'grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));', meaning: 'Auto-wrapping responsive columns without media queries.' },
          { term: 'Array Map / Filter / Reduce', syntax: 'arr.filter(x => x > 0).map(x => x * 2)', meaning: 'Immutable functional data transformations in ES6.' },
          { term: 'Promise.all vs allSettled', syntax: 'await Promise.all([fetchA(), fetchB()])', meaning: 'Runs async I/O in parallel; rejects fast if any promise fails.' }
        ]
      },
      {
        heading: 'Live HTML/CSS Card Snippet',
        description: 'Click "Try it Yourself" to render this responsive card in the live browser preview:',
        code: `<div style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #334155; max-width: 420px;">
  <div style="font-size: 12px; color: #34d399; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">Code It Out Live Sandbox</div>
  <h2 style="margin: 8px 0; font-size: 22px;">Interactive Flexbox Card</h2>
  <p style="color: #94a3b8; font-size: 14px; line-height: 1.5;">Edit this HTML & CSS in the playground to see instant visual updates.</p>
  <button style="margin-top: 12px; background: #2563eb; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600;">Explore Component</button>
</div>`,
        language: 'html'
      }
    ]
  },
  {
    id: 'cs-git-linux',
    title: 'Git Workflow & Linux Terminal Commands Sheet',
    category: 'Git & Linux',
    readTime: '4 min ref',
    summary: 'Daily developer commands for branching, rebasing, process inspection, and permissions.',
    sections: [
      {
        heading: 'Essential Git Commands',
        description: 'Safe version control habits for students and production teams.',
        rows: [
          { term: 'Create & Switch Branch', syntax: 'git switch -c feat/login-flow', meaning: 'Creates a new branch from HEAD and switches to it.' },
          { term: 'Interactive Rebase', syntax: 'git rebase -i HEAD~3', meaning: 'Squash, reword, or reorder the last 3 local commits cleanly.' },
          { term: 'Stash Uncommitted Work', syntax: 'git stash push -m "wip" && git stash pop', meaning: 'Temporarily shelves dirty working tree changes.' },
          { term: 'Undo Last Commit (Keep Changes)', syntax: 'git reset --soft HEAD~1', meaning: 'Moves HEAD back one commit while keeping files staged.' }
        ]
      }
    ]
  }
];

export const CAREER_ROADMAPS: CareerRoadmap[] = [
  {
    id: 'rm-fullstack',
    title: 'Full-Stack Web Developer (Zero to Production)',
    duration: '12 Weeks Guided Path',
    targetRole: 'Full-Stack Engineer',
    steps: [
      { stepNumber: 1, title: 'HTML5 Semantics, CSS Flexbox & Grid', topics: ['Semantic DOM', 'Flexbox & Grid', 'Responsive Breakpoints'], courseId: 'c8', moduleId: 'web-1' },
      { stepNumber: 2, title: 'JavaScript ES6+, Closures & Event Loop', topics: ['Execution Context', 'Promises & Async/Await', 'TypeScript Types'], courseId: 'c9', moduleId: 'js-1' },
      { stepNumber: 3, title: 'React 19 Hooks, State & Performance', topics: ['Virtual DOM Reconciliation', 'useEffect & useMemo', 'Custom Hooks'], courseId: 'c10', moduleId: 'react-1' },
      { stepNumber: 4, title: 'Relational SQL, Indexing & API Design', topics: ['JOINs & Window Functions', 'B+ Tree Indexes', 'REST vs GraphQL'], courseId: 'c5', moduleId: 'db-5' },
      { stepNumber: 5, title: 'System Design, Caching & Deployment', topics: ['Redis Caching', 'Load Balancers', 'Docker & CI/CD'], courseId: 'c6', moduleId: 'sd-1' }
    ]
  },
  {
    id: 'rm-faang-sde',
    title: 'FAANG / Product SDE-1 & SDE-2 Mastery Sheet',
    duration: '16 Weeks Guided Path',
    targetRole: 'SDE-1 / SDE-2 (Google, Amazon, Microsoft)',
    steps: [
      { stepNumber: 1, title: 'CS Core & Programming Language Internals', topics: ['Memory Layout', 'Bit Manipulation', 'Python / C++ / Java'], courseId: 'c2', moduleId: 'cs-1' },
      { stepNumber: 2, title: 'Data Structures & Algorithms (A-to-Z)', topics: ['Two Pointers & Sliding Window', 'Trees & Graphs', 'Dynamic Programming'], courseId: 'c4', moduleId: 'ds-1' },
      { stepNumber: 3, title: 'Operating Systems & Linux Concurrency', topics: ['Processes vs Threads', 'Virtual Memory & Paging', 'Mutex & Deadlocks'], courseId: 'c3', moduleId: 'os-1' },
      { stepNumber: 4, title: 'Distributed DBMS & High-Scale SQL', topics: ['WAL & ACID', 'B+ Trees vs LSM Trees', 'MVCC Concurrency'], courseId: 'c5', moduleId: 'db-1' },
      { stepNumber: 5, title: 'High-Level & Distributed System Design', topics: ['Consistent Hashing', 'Kafka Event Driven', 'CAP & Sharding'], courseId: 'c6', moduleId: 'sd-2' }
    ]
  }
];
