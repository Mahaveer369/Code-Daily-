import { Category, Course, LessonContent } from '../../types';

export const W3_COURSES: Course[] = [
  {
    id: 'c-html',
    title: 'HTML5 Complete Tutorial',
    shortTag: 'HTML5',
    levelTag: '10 Chapters · Beginner to Pro',
    category: Category.WEB_DEV,
    icon: 'html',
    modules: [
      { id: 'html-1', title: 'HTML HOME & Introduction', description: 'What is HTML? Document structure, <!DOCTYPE html>, <html>, <head> & <body>', difficulty: 'Beginner', sectionGroup: 'HTML Basics', isLocked: false },
      { id: 'html-2', title: 'HTML Elements, Attributes & Headings', description: 'Tags, attributes (href, src, alt, style) & <h1> to <h6> hierarchy', difficulty: 'Beginner', sectionGroup: 'HTML Basics', isLocked: false },
      { id: 'html-3', title: 'HTML Paragraphs, Formatting & Colors', description: '<strong>, <em>, <mark>, <code>, <pre>, inline styles & color codes', difficulty: 'Beginner', sectionGroup: 'HTML Basics', isLocked: false },
      { id: 'html-4', title: 'HTML Links, Bookmarks & Navigation', description: 'Anchor tags <a href>, target="_blank", mailto: & page bookmarks', difficulty: 'Beginner', sectionGroup: 'HTML Content', isLocked: false },
      { id: 'html-5', title: 'HTML Images, Audio & Video Media', description: 'Responsive <img>, alt text, <figure>, <video controls> & <audio>', difficulty: 'Beginner', sectionGroup: 'HTML Content', isLocked: false },
      { id: 'html-6', title: 'HTML Tables & Data Grids', description: '<table>, <thead>, <tbody>, <tr>, <th>, <td>, colspan & rowspan', difficulty: 'Beginner', sectionGroup: 'HTML Content', isLocked: false },
      { id: 'html-7', title: 'HTML Lists (Ordered, Unordered & Nested)', description: '<ul>, <ol>, <li>, description lists <dl> & navigation menus', difficulty: 'Beginner', sectionGroup: 'HTML Content', isLocked: false },
      { id: 'html-8', title: 'HTML Forms, Inputs & Validation', description: '<form>, <input> types, <label>, <select>, <textarea>, required & pattern', difficulty: 'Intermediate', sectionGroup: 'HTML Forms & APIs', isLocked: false },
      { id: 'html-9', title: 'web-1' === 'web-1' ? 'HTML5 Semantic Elements & Accessibility' : '', description: '<header>, <nav>, <main>, <article>, <section>, <footer> & ARIA', difficulty: 'Intermediate', sectionGroup: 'HTML Forms & APIs', isLocked: false },
      { id: 'html-10', title: 'HTML5 Canvas, SVG & Web Storage', description: 'Drawing with <canvas>, scalable <svg> vectors & localStorage API', difficulty: 'Intermediate', sectionGroup: 'HTML Forms & APIs', isLocked: false },
    ]
  },
  {
    id: 'c-css',
    title: 'CSS3 & Responsive Design Tutorial',
    shortTag: 'CSS3',
    levelTag: '10 Chapters · Beginner to Pro',
    category: Category.CSS,
    icon: 'css',
    modules: [
      { id: 'css-1', title: 'CSS HOME, Syntax & Selectors', description: 'Element, .class, #id, attribute, pseudo-class (:hover) & specificity rules', difficulty: 'Beginner', sectionGroup: 'CSS Basics', isLocked: false },
      { id: 'css-2', title: 'CSS Colors, Backgrounds & Gradients', description: 'HEX, RGB, HSL, background-image, linear-gradient & radial-gradient', difficulty: 'Beginner', sectionGroup: 'CSS Basics', isLocked: false },
      { id: 'css-3', title: 'CSS Box Model, Margin, Border & Padding', description: 'Content, Padding, Border, Margin & box-sizing: border-box explained', difficulty: 'Beginner', sectionGroup: 'CSS Basics', isLocked: false },
      { id: 'css-4', title: 'CSS Typography, Fonts & Units (px, rem, vh)', description: 'font-family, font-weight, line-height, text-align & responsive units', difficulty: 'Beginner', sectionGroup: 'CSS Layout', isLocked: false },
      { id: 'css-5', title: 'CSS Display, Position & Z-Index', description: 'block vs inline-block, relative, absolute, fixed, sticky & stacking', difficulty: 'Intermediate', sectionGroup: 'CSS Layout', isLocked: false },
      { id: 'css-6', title: 'CSS Flexbox Complete Guide', description: 'display: flex, justify-content, align-items, flex-direction & flex-wrap', difficulty: 'Intermediate', sectionGroup: 'CSS Layout', isLocked: false },
      { id: 'css-7', title: 'CSS Grid Layout Complete Guide', description: 'display: grid, grid-template-columns, fr unit, gap & auto-fit minmax()', difficulty: 'Intermediate', sectionGroup: 'CSS Layout', isLocked: false },
      { id: 'css-8', title: 'CSS Responsive Media Queries', description: 'Mobile-first design, @media breakpoints, clamp() & fluid layouts', difficulty: 'Intermediate', sectionGroup: 'CSS Advanced', isLocked: false },
      { id: 'css-9', title: 'CSS Transitions, Transforms & Animations', description: 'transition, transform (scale, rotate, translate) & @keyframes', difficulty: 'Intermediate', sectionGroup: 'CSS Advanced', isLocked: false },
      { id: 'css-10', title: 'CSS Variables (Custom Properties) & Dark Mode', description: ':root variables, var(--color), calc() & dynamic theme switching', difficulty: 'Advanced', sectionGroup: 'CSS Advanced', isLocked: false },
    ]
  },
  {
    id: 'c-js',
    title: 'JavaScript (ES6+) Complete Tutorial',
    shortTag: 'JavaScript',
    levelTag: '10 Chapters · Beginner to Expert',
    category: Category.JAVASCRIPT,
    icon: 'js',
    modules: [
      { id: 'js-intro', title: 'JS HOME, Output & Statements', description: 'console.log(), script tags, expressions, comments & how JS runs', difficulty: 'Beginner', sectionGroup: 'JS Fundamentals', isLocked: false },
      { id: 'js-vars', title: 'JS Variables (let, const, var) & Data Types', description: 'Block scope, primitives (String, Number, Boolean) & typeof operator', difficulty: 'Beginner', sectionGroup: 'JS Fundamentals', isLocked: false },
      { id: 'js-cond', title: 'JS Operators, If...Else & Switch', description: 'Strict equality (===), logical operators (&&, ||, ??) & ternary ? :', difficulty: 'Beginner', sectionGroup: 'JS Fundamentals', isLocked: false },
      { id: 'js-loops', title: 'JS Loops (for, for...of, while) & Iteration', description: 'Classic for loops, array iteration with for...of, break & continue', difficulty: 'Beginner', sectionGroup: 'JS Fundamentals', isLocked: false },
      { id: 'js-funcs', title: 'JS Functions, Arrow Syntax & Parameters', description: 'Function declarations, arrow functions () =>, default & rest params', difficulty: 'Beginner', sectionGroup: 'JS Objects & Arrays', isLocked: false },
      { id: 'js-arrays', title: 'JS Arrays & Map, Filter, Reduce', description: 'push/pop, slice/splice, map(), filter(), reduce(), find() & spread ...', difficulty: 'Intermediate', sectionGroup: 'JS Objects & Arrays', isLocked: false },
      { id: 'js-objects', title: 'JS Objects, Destructuring, JSON & Classes', description: 'Object literals, destructuring, JSON.stringify/parse & ES6 classes', difficulty: 'Intermediate', sectionGroup: 'JS Objects & Arrays', isLocked: false },
      { id: 'js-dom', title: 'JS HTML DOM Manipulation & Events', description: 'querySelector, addEventListener, classList, Event Bubbling & Delegation', difficulty: 'Intermediate', sectionGroup: 'JS Async & Internals', isLocked: false },
      { id: 'js-1', title: 'JS Closures, Hoisting & The Event Loop', description: 'Execution Context, Lexical Closures, Call Stack & Microtask Queue', difficulty: 'Advanced', sectionGroup: 'JS Async & Internals', isLocked: false },
      { id: 'js-async', title: 'JS Promises, Async/Await & Fetch API', description: 'Promisestates, async/await syntax, try/catch error handling & Promise.all', difficulty: 'Advanced', sectionGroup: 'JS Async & Internals', isLocked: false },
    ]
  },
  {
    id: 'c-ts',
    title: 'TypeScript Tutorial',
    shortTag: 'TypeScript',
    levelTag: '8 Chapters · Beginner to Advanced',
    category: Category.TYPESCRIPT,
    icon: 'ts',
    modules: [
      { id: 'ts-1', title: 'TS HOME & Simple Types', description: 'string, number, boolean, explicit annotations vs type inference', difficulty: 'Beginner', sectionGroup: 'TS Basics', isLocked: false },
      { id: 'ts-2', title: 'TS Arrays, Tuples & Enums', description: 'Typed arrays number[], readonly arrays, fixed-length tuples & enums', difficulty: 'Beginner', sectionGroup: 'TS Basics', isLocked: false },
      { id: 'ts-3', title: 'TS Object Types, Interfaces & Type Aliases', description: 'interface vs type, optional ? properties, readonly & extending types', difficulty: 'Beginner', sectionGroup: 'TS Basics', isLocked: false },
      { id: 'ts-4', title: 'TS Union Types & Type Narrowing', description: 'string | number, typeof guards, in operator & Discriminated Unions', difficulty: 'Intermediate', sectionGroup: 'TS Intermediate', isLocked: false },
      { id: 'ts-5', title: 'TS Functions, Optional Params & Void/Never', description: 'Parameter types, return types, function signatures & rest parameters', difficulty: 'Intermediate', sectionGroup: 'TS Intermediate', isLocked: false },
      { id: 'ts-6', title: 'TS Classes & Access Modifiers', description: 'public, private, protected, readonly fields & implements interface', difficulty: 'Intermediate', sectionGroup: 'TS Intermediate', isLocked: false },
      { id: 'js-2', title: 'TS Generics & Reusable Components', description: 'Generic functions <T>, generic interfaces & extends constraints', difficulty: 'Advanced', sectionGroup: 'TS Advanced', isLocked: false },
      { id: 'ts-8', title: 'TS Utility Types & Keyof / Mapped Types', description: 'Partial<T>, Pick<T, K>, Omit<T, K>, Record<K, V> & ReturnType<T>', difficulty: 'Advanced', sectionGroup: 'TS Advanced', isLocked: false },
    ]
  },
  {
    id: 'c-react',
    title: 'React 19 Tutorial',
    shortTag: 'React 19',
    levelTag: '8 Chapters · Beginner to Pro',
    category: Category.REACT,
    icon: 'react',
    modules: [
      { id: 'react-home', title: 'React HOME, JSX & Components', description: 'What is React? Writing JSX markup & creating functional components', difficulty: 'Beginner', sectionGroup: 'React Basics', isLocked: false },
      { id: 'react-props', title: 'React Props & Conditional Rendering', description: 'Passing data down with props, destructuring & ternary rendering', difficulty: 'Beginner', sectionGroup: 'React Basics', isLocked: false },
      { id: 'react-lists', title: 'React Lists, Keys & Event Handling', description: 'Rendering lists with .map(), why stable keys matter & onClick events', difficulty: 'Beginner', sectionGroup: 'React Basics', isLocked: false },
      { id: 'react-state', title: 'React useState Hook & State Updates', description: 'Adding component memory, immutable updates & prev => prev + 1', difficulty: 'Beginner', sectionGroup: 'React Hooks', isLocked: false },
      { id: 'react-forms', title: 'React Forms & Controlled Inputs', description: 'Two-way input binding, handling form submit, checkboxes & selects', difficulty: 'Intermediate', sectionGroup: 'React Hooks', isLocked: false },
      { id: 'react-effect', title: 'React useEffect Hook & Data Fetching', description: 'Synchronizing with external APIs, dependency arrays & cleanup functions', difficulty: 'Intermediate', sectionGroup: 'React Hooks', isLocked: false },
      { id: 'react-perf', title: 'React useRef, useMemo, useCallback & Custom Hooks', description: 'DOM refs, caching expensive calculations & extracting custom hooks', difficulty: 'Intermediate', sectionGroup: 'React Advanced', isLocked: false },
      { id: 'react-1', title: 'React Context API & Fiber Internals', description: 'Avoiding prop drilling with useContext & how React Fiber reconciles UI', difficulty: 'Advanced', sectionGroup: 'React Advanced', isLocked: false },
    ]
  },
  {
    id: 'c1',
    title: 'Python 3 Tutorial (Zero to Internals)',
    shortTag: 'Python',
    levelTag: '10 Chapters · Beginner to Expert',
    category: Category.PYTHON,
    icon: 'python',
    modules: [
      { id: 'py-home', title: 'Python HOME, Syntax & Variables', description: 'print(), indentation rules, dynamic variables & tuple unpacking', difficulty: 'Beginner', sectionGroup: 'Python Basics', isLocked: false },
      { id: 'py-strings', title: 'Python Strings, Slicing & Formatting', description: 'String indexing [start:stop:step], f-strings & built-in string methods', difficulty: 'Beginner', sectionGroup: 'Python Basics', isLocked: false },
      { id: 'py-lists', title: 'Python Lists, Tuples, Sets & Dictionaries', description: 'Core collections, O(1) dict hash lookups, set operations & slicing', difficulty: 'Beginner', sectionGroup: 'Python Basics', isLocked: false },
      { id: 'py-loops', title: 'Python If...Else, For/While Loops & Comprehensions', description: 'Control flow, range(), enumerate(), zip() & list comprehensions', difficulty: 'Beginner', sectionGroup: 'Python Functions & OOP', isLocked: false },
      { id: 'py-funcs', title: 'Python Functions, *args, **kwargs & Lambda', description: 'Def functions, default arguments, flexible args & anonymous lambdas', difficulty: 'Intermediate', sectionGroup: 'Python Functions & OOP', isLocked: false },
      { id: 'py-oop', title: 'Python Classes, Objects, Inheritance & Dunder Methods', description: '__init__, self, inheritance, super() & __str__ / __repr__', difficulty: 'Intermediate', sectionGroup: 'Python Functions & OOP', isLocked: false },
      { id: 'py-1', title: 'CPython Internals & Global Interpreter Lock (GIL)', description: 'How Python compiles to bytecode, PyObject & multi-threading rules', difficulty: 'Advanced', sectionGroup: 'Python Internals', isLocked: false },
      { id: 'py-2', title: 'Python Memory Management & Garbage Collection', description: 'Reference counting, cyclic garbage collector & small integer caching', difficulty: 'Advanced', sectionGroup: 'Python Internals', isLocked: false },
      { id: 'py-3', title: 'Python Bytecode & PVM Stack Machine', description: 'Inspecting bytecode with dis module & why comprehensions are faster', difficulty: 'Advanced', sectionGroup: 'Python Internals', isLocked: false },
      { id: 'py-4', title: 'Python Closures, LEGB Scope & Decorators', description: 'Lexical scoping rules, @decorator wrappers & generators (yield)', difficulty: 'Advanced', sectionGroup: 'Python Internals', isLocked: false },
    ]
  },
  {
    id: 'c5',
    title: 'SQL & Relational Database Tutorial',
    shortTag: 'SQL & DBMS',
    levelTag: '10 Chapters · Beginner to Expert',
    category: Category.SQL,
    icon: 'database',
    modules: [
      { id: 'sql-select', title: 'SQL HOME, Intro & SELECT Statement', description: 'Querying tables with SELECT, SELECT DISTINCT & column aliases (AS)', difficulty: 'Beginner', sectionGroup: 'SQL Query Basics', isLocked: false },
      { id: 'sql-where', title: 'SQL WHERE, AND, OR, IN, BETWEEN & LIKE', description: 'Filtering rows with conditions, wildcards (%) & pattern matching', difficulty: 'Beginner', sectionGroup: 'SQL Query Basics', isLocked: false },
      { id: 'sql-order', title: 'SQL ORDER BY, LIMIT & NULL Handling', description: 'Sorting results ASC/DESC, top-N pagination & IS NULL / COALESCE', difficulty: 'Beginner', sectionGroup: 'SQL Query Basics', isLocked: false },
      { id: 'sql-group', title: 'SQL COUNT, SUM, AVG, GROUP BY & HAVING', description: 'Aggregating rows by department/category & filtering groups with HAVING', difficulty: 'Beginner', sectionGroup: 'SQL Joins & Analytics', isLocked: false },
      { id: 'db-5', title: 'SQL Joins (INNER, LEFT, RIGHT, FULL) & Window Functions', description: 'Combining relational tables, ROW_NUMBER(), RANK() & CTEs', difficulty: 'Intermediate', sectionGroup: 'SQL Joins & Analytics', isLocked: false },
      { id: 'db-1', title: 'DBMS Storage Engines: Row vs Columnar', description: 'How databases store pages on disk, Buffer Pool & OLTP vs OLAP', difficulty: 'Intermediate', sectionGroup: 'DBMS Architecture', isLocked: false },
      { id: 'db-2', title: 'Database Schema Design & Relationships', description: '1:1, 1:N, M:N relations, Foreign Keys & Junction Tables', difficulty: 'Intermediate', sectionGroup: 'DBMS Architecture', isLocked: false },
      { id: 'db-4', title: 'Database Normalization (1NF, 2NF, 3NF, BCNF)', description: 'Eliminating data redundancy and update/insert/delete anomalies', difficulty: 'Intermediate', sectionGroup: 'DBMS Architecture', isLocked: false },
      { id: 'db-6', title: 'ACID Transactions & Write-Ahead Logging (WAL)', description: 'Atomicity, Consistency, Isolation, Durability & crash recovery', difficulty: 'Advanced', sectionGroup: 'DBMS Internals', isLocked: false },
      { id: 'db-7', title: 'Database Indexing: B+ Trees vs LSM Trees & MVCC', description: 'Why indexes make queries O(log N) & how concurrent reads/writes work', difficulty: 'Advanced', sectionGroup: 'DBMS Internals', isLocked: false },
    ]
  },
  {
    id: 'c4',
    title: 'Data Structures & Algorithms (Code It Out Track)',
    shortTag: 'DSA A-to-Z',
    levelTag: '10 Chapters · Beginner to Expert',
    category: Category.DSA,
    icon: 'code',
    modules: [
      { id: 'ds-1', title: 'Big-O Time & Space Complexity Analysis', description: 'How to count operations: O(1), O(log N), O(N), O(N log N) & O(N²)', difficulty: 'Beginner', sectionGroup: 'DSA Foundations', isLocked: false },
      { id: 'ds-2', title: 'Arrays, Two Pointers & Sliding Window', description: 'Contiguous memory, opposite pointers, prefix sums & subarray windows', difficulty: 'Beginner', sectionGroup: 'DSA Foundations', isLocked: false },
      { id: 'ds-search', title: 'Binary Search & Sorting Algorithms', description: 'Binary Search on sorted arrays, Merge Sort, Quick Sort & Bubble Sort', difficulty: 'Beginner', sectionGroup: 'DSA Foundations', isLocked: false },
      { id: 'ds-hash', title: 'Hashing, Hash Maps & Frequency Counters', description: 'O(1) lookups, Two Sum pattern, anagrams & collision resolution', difficulty: 'Beginner', sectionGroup: 'Linear Structures', isLocked: false },
      { id: 'ds-3', title: 'Linked Lists & Fast/Slow Pointers', description: 'Singly & Doubly Linked Lists, in-place reversal & Floyd cycle detection', difficulty: 'Intermediate', sectionGroup: 'Linear Structures', isLocked: false },
      { id: 'ds-4', title: 'Stacks, Queues & Monotonic Stack', description: 'LIFO vs FIFO, Valid Parentheses, Next Greater Element & Sliding Max', difficulty: 'Intermediate', sectionGroup: 'Linear Structures', isLocked: false },
      { id: 'ds-recursion', title: 'Recursion, Backtracking & Subsets', description: 'Base cases, recursion tree dry-runs, generating subsets & permutations', difficulty: 'Intermediate', sectionGroup: 'Trees, Graphs & DP', isLocked: false },
      { id: 'ds-5', title: 'Binary Trees, BSTs & Tree Traversals', description: 'Inorder, Preorder, Postorder, Level-Order BFS & Lowest Common Ancestor', difficulty: 'Intermediate', sectionGroup: 'Trees, Graphs & DP', isLocked: false },
      { id: 'ds-6', title: 'Graphs: BFS, DFS, Dijkstra & Topological Sort', description: 'Adjacency lists, shortest paths, cycle detection & course schedule', difficulty: 'Advanced', sectionGroup: 'Trees, Graphs & DP', isLocked: false },
      { id: 'ds-7', title: 'Dynamic Programming (Memoization & Tabulation)', description: 'Overlapping subproblems, Climbing Stairs, 0/1 Knapsack & LCS', difficulty: 'Advanced', sectionGroup: 'Trees, Graphs & DP', isLocked: false },
    ]
  },
  {
    id: 'c11',
    title: 'Modern C++20/23 & Low-Latency Systems Engineering',
    shortTag: 'C++',
    levelTag: '25 Chapters · Beginner to Low-Latency HFT',
    category: Category.CPP_JAVA,
    icon: 'cpp',
    modules: [
      { id: 'cpp-basics', title: 'C++ HOME, Compilation Pipeline (Preprocessor/Linker) & Types', description: 'g++/clang++ compilation stages, fixed-width types (int64_t), fast I/O & namespaces', difficulty: 'Beginner', sectionGroup: 'C++ Foundations & Memory', isLocked: false },
      { id: 'cpp-pointers', title: 'Pointers, References, Stack vs Heap & Const-Correctness', description: 'Memory addresses (&), dereferencing (*), lvalue references (&) & zero-copy const refs', difficulty: 'Beginner', sectionGroup: 'C++ Foundations & Memory', isLocked: false },
      { id: 'cpp-classes', title: 'Classes, Structs, Member Initializer Lists & Encapsulation', description: 'Zero-overhead structs/classes, constructor initializer lists, explicit & access specifiers', difficulty: 'Beginner', sectionGroup: 'OOP & RAII Lifetimes', isLocked: false },
      { id: 'cpp-inherit', title: 'Inheritance, Pure Virtual Interfaces & Composition vs Inheritance', description: 'Public inheritance, abstract base classes (= 0), override/final & avoiding diamond inheritance', difficulty: 'Intermediate', sectionGroup: 'OOP & RAII Lifetimes', isLocked: false },
      { id: 'cpp-1', title: 'Runtime Polymorphism, Virtual Functions & vtable/vptr Memory Layout', description: 'Dynamic dispatch via vptr/vtable, virtual destructors & devirtualization with final', difficulty: 'Intermediate', sectionGroup: 'OOP & RAII Lifetimes', isLocked: false },
      { id: 'cpp-stl', title: 'C++ STL Containers: std::vector, unordered_map, map & priority_queue', description: 'Contiguous vector capacity growth, O(1) hash tables, Red-Black trees & binary heaps', difficulty: 'Intermediate', sectionGroup: 'STL & Generic Programming', isLocked: false },
      { id: 'cpp-templates-stl', title: 'STL Iterators, std::sort (IntroSort) & <algorithm> Mastery', description: 'Iterator categories, std::sort, lower_bound/upper_bound binary search & erase-remove idiom', difficulty: 'Intermediate', sectionGroup: 'STL & Generic Programming', isLocked: false },
      { id: 'cpp-smart-pointers', title: 'Deterministic Memory: Stack Unwinding, unique_ptr & shared_ptr', description: 'Replacing raw new/delete with std::make_unique, std::make_shared & weak_ptr cycle breaking', difficulty: 'Advanced', sectionGroup: 'STL & Generic Programming', isLocked: false },
    ]
  },
  {
    id: 'c3',
    title: 'Operating Systems & Linux Tutorial',
    shortTag: 'OS & Linux',
    levelTag: '8 Chapters · Beginner to Advanced',
    category: Category.OOPS,
    icon: 'os',
    modules: [
      { id: 'os-intro', title: 'OS HOME, Kernel Mode vs User Mode & Syscalls', description: 'What does an OS do? System calls (fork, exec, read) & interrupts', difficulty: 'Beginner', sectionGroup: 'OS Foundations', isLocked: false },
      { id: 'os-1', title: 'Processes vs Threads & Context Switching', description: 'PCB, process memory layout, thread shared heap & IPC mechanisms', difficulty: 'Beginner', sectionGroup: 'OS Foundations', isLocked: false },
      { id: 'os-2', title: 'CPU Scheduling (FCFS, SJF, Round Robin, CFS)', description: 'Turnaround time, waiting time, time quantum & Linux Fair Scheduler', difficulty: 'Intermediate', sectionGroup: 'Process & Memory', isLocked: false },
      { id: 'os-6', title: 'Process Synchronization: Mutex, Semaphores & Locks', description: 'Race conditions, critical sections, atomic CAS & Producer-Consumer', difficulty: 'Intermediate', sectionGroup: 'Process & Memory', isLocked: false },
      { id: 'os-4', title: 'Deadlocks: 4 Coffman Conditions & Prevention', description: 'Mutual exclusion, hold & wait, circular wait & lock ordering fix', difficulty: 'Intermediate', sectionGroup: 'Process & Memory', isLocked: false },
      { id: 'os-3', title: 'Virtual Memory, Paging, TLB & Page Faults', description: 'Translating virtual addresses to RAM frames, TLB cache & LRU paging', difficulty: 'Advanced', sectionGroup: 'Storage & Linux', isLocked: false },
      { id: 'os-5', title: 'File Systems, Inodes & Hard vs Soft Links', description: 'How files are stored on disk, inode metadata tables & permissions', difficulty: 'Intermediate', sectionGroup: 'Storage & Linux', isLocked: false },
      { id: 'linux-git', title: 'Linux Terminal Commands & Git Essentials', description: 'ls, grep, awk, chmod, ps, top, ssh & Git branching/merging workflow', difficulty: 'Beginner', sectionGroup: 'Storage & Linux', isLocked: false },
    ]
  },
  {
    id: 'c7',
    title: 'Computer Networks & Web Protocols',
    shortTag: 'Networks',
    levelTag: '9 Chapters · Beginner to Expert',
    category: Category.NETWORKS,
    icon: 'network',
    modules: [
      { id: 'cn-1', title: 'OSI 7-Layer & TCP/IP Model Explained Simply', description: 'How data travels from browser to server: Packets, Frames & Headers', difficulty: 'Beginner', sectionGroup: 'Network Basics', isLocked: false },
      { id: 'cn-4', title: 'DNS Resolution: How Domain Names Become IPs', description: 'Browser cache -> Recursive Resolver -> Root -> TLD -> Authoritative', difficulty: 'Beginner', sectionGroup: 'Network Basics', isLocked: false },
      { id: 'cn-2', title: 'TCP vs UDP & The 3-Way Handshake', description: 'SYN, SYN-ACK, ACK, reliable delivery, congestion control vs fast UDP', difficulty: 'Beginner', sectionGroup: 'Transport & Web', isLocked: false },
      { id: 'cn-3', title: 'HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC) & Status Codes', description: 'GET/POST methods, status codes (200, 301, 401, 404, 500) & multiplexing', difficulty: 'Intermediate', sectionGroup: 'Transport & Web', isLocked: false },
      { id: 'cn-9', title: 'REST APIs vs GraphQL vs gRPC', description: 'Designing clean JSON endpoints, GraphQL queries & binary Protobufs', difficulty: 'Intermediate', sectionGroup: 'Transport & Web', isLocked: false },
      { id: 'cn-5', title: 'WebSockets & Real-Time Full-Duplex Apps', description: 'Persistent bi-directional connections for live chat and notifications', difficulty: 'Intermediate', sectionGroup: 'Transport & Web', isLocked: false },
      { id: 'cn-6', title: 'Web Security: HTTPS/TLS, CORS, JWT, XSS & CSRF', description: 'How TLS encryption works, Same-Origin Policy & securing web tokens', difficulty: 'Advanced', sectionGroup: 'Security & Scale', isLocked: false },
      { id: 'cn-7', title: 'Reverse Proxies & Load Balancers (Nginx / Envoy)', description: 'L4 vs L7 load balancing, health checks & SSL termination', difficulty: 'Advanced', sectionGroup: 'Security & Scale', isLocked: false },
      { id: 'cn-8', title: 'CDNs (Content Delivery Networks) & Edge Caching', description: 'Serving static assets from the closest geographic PoP with Cache-Control', difficulty: 'Advanced', sectionGroup: 'Security & Scale', isLocked: false },
    ]
  },
  {
    id: 'c6',
    title: 'System Design (Beginner to FAANG)',
    shortTag: 'System Design',
    levelTag: '9 Chapters · Intermediate to Expert',
    category: Category.SYSTEM_DESIGN,
    icon: 'cloud',
    modules: [
      { id: 'sd-1', title: 'System Design HOME: Scaling 1 to 10 Million Users', description: 'Vertical vs Horizontal scaling, stateless servers & QPS capacity math', difficulty: 'Beginner', sectionGroup: 'Building Blocks', isLocked: false },
      { id: 'sd-2', title: 'Load Balancing & Consistent Hashing', description: 'Distributing traffic evenly and minimizing cache re-hashing on scale', difficulty: 'Intermediate', sectionGroup: 'Building Blocks', isLocked: false },
      { id: 'sd-3', title: 'Caching with Redis (Cache-Aside & Write-Through)', description: 'Speeding up reads 100x, TTL expiration, LRU eviction & cache stampedes', difficulty: 'Intermediate', sectionGroup: 'Building Blocks', isLocked: false },
      { id: 'sd-4', title: 'Database Replication & Horizontal Sharding', description: 'Leader-Follower read replicas, shard keys & handling hot partitions', difficulty: 'Intermediate', sectionGroup: 'Distributed Data', isLocked: false },
      { id: 'sd-5', title: 'Message Queues (Kafka vs RabbitMQ) & Async Workers', description: 'Decoupling slow tasks, pub/sub event streaming & retry dead-letter queues', difficulty: 'Advanced', sectionGroup: 'Distributed Data', isLocked: false },
      { id: 'sd-7', title: 'CAP Theorem, Quorum Consensus & Rate Limiting', description: 'Consistency vs Availability, Token Bucket rate limiters & idempotency', difficulty: 'Advanced', sectionGroup: 'Distributed Data', isLocked: false },
      { id: 'sd-6', title: 'Microservices, API Gateway & Circuit Breakers', description: 'Service discovery, preventing cascading failures & distributed tracing', difficulty: 'Advanced', sectionGroup: 'Real Case Studies', isLocked: false },
      { id: 'sd-8', title: 'Case Study: Design URL Shortener (TinyURL)', description: 'Base62 encoding, read-heavy Redis caching & database schema design', difficulty: 'Expert', sectionGroup: 'Real Case Studies', isLocked: false },
      { id: 'sd-9', title: 'Case Study: Design Instagram / Twitter News Feed', description: 'Fan-out on write vs fan-out on read hybrid architecture for celebrities', difficulty: 'Expert', sectionGroup: 'Real Case Studies', isLocked: false },
    ]
  },
  {
    id: 'c2',
    title: 'CS Core & Computer Architecture',
    shortTag: 'CS Core',
    levelTag: '6 Chapters · Beginner to Advanced',
    category: Category.CS_CORE,
    icon: 'cpu',
    modules: [
      { id: 'cs-1', title: 'Number Systems (Binary, Hex) & Two\'s Complement', description: 'How computers store integers, negative numbers & hexadecimal colors', difficulty: 'Beginner', sectionGroup: 'Digital Logic', isLocked: false },
      { id: 'cs-float', title: 'IEEE 754 Floating Point (Why 0.1 + 0.2 !== 0.3)', description: 'Sign bit, exponent, mantissa & why financial apps use integer cents', difficulty: 'Beginner', sectionGroup: 'Digital Logic', isLocked: false },
      { id: 'cs-2', title: 'Boolean Logic Gates & Bitwise Manipulation Tricks', description: 'AND, OR, XOR, bit shifts (<<, >>), checking even/odd & power of 2', difficulty: 'Beginner', sectionGroup: 'Digital Logic', isLocked: false },
      { id: 'cs-3', title: 'CPU Architecture & L1/L2/L3 Cache Hierarchy', description: 'Registers, ALU, 64-byte cache lines & why row-major traversal is fast', difficulty: 'Intermediate', sectionGroup: 'Hardware & Compilers', isLocked: false },
      { id: 'cs-4', title: 'Compilers, Interpreters, ASTs & JIT Compilation', description: 'How source code becomes machine code: Lexing, Parsing & Hot-Loop JIT', difficulty: 'Intermediate', sectionGroup: 'Hardware & Compilers', isLocked: false },
      { id: 'cs-5', title: 'Non-Blocking I/O & Event Multiplexing (epoll)', description: 'How a single thread handles 10,000+ concurrent network connections', difficulty: 'Advanced', sectionGroup: 'Hardware & Compilers', isLocked: false },
    ]
  },
  {
    id: 'c12',
    title: 'AI, Machine Learning & GenAI Tutorial',
    shortTag: 'AI & GenAI',
    levelTag: '6 Chapters · Beginner to Advanced',
    category: Category.AI_ML,
    icon: 'ai',
    modules: [
      { id: 'ai-home', title: 'AI & ML HOME: Supervised vs Unsupervised Learning', description: 'Classification vs Regression, Clustering, Training vs Test split', difficulty: 'Beginner', sectionGroup: 'Machine Learning Basics', isLocked: false },
      { id: 'ai-grad', title: 'Linear Regression, Loss Functions & Gradient Descent', description: 'How models learn by minimizing Mean Squared Error step-by-step', difficulty: 'Beginner', sectionGroup: 'Machine Learning Basics', isLocked: false },
      { id: 'ai-nn', title: 'Neural Networks, ReLU, Softmax & Backpropagation', description: 'Weights, biases, non-linear activation functions & chain rule updates', difficulty: 'Intermediate', sectionGroup: 'Deep Learning & LLMs', isLocked: false },
      { id: 'ai-trans', title: 'Transformers, Tokenization & Self-Attention', description: 'How GPT & Gemini understand context using Query, Key & Value vectors', difficulty: 'Intermediate', sectionGroup: 'Deep Learning & LLMs', isLocked: false },
      { id: 'ai-1', title: 'Vector Embeddings, Cosine Similarity & RAG', description: 'Semantic vector search, grounding LLMs with documents & preventing hallucinations', difficulty: 'Intermediate', sectionGroup: 'Deep Learning & LLMs', isLocked: false },
      { id: 'ai-prompt', title: 'Prompt Engineering, Tool Calling & AI Agents', description: 'System instructions, Few-Shot prompting, JSON schemas & ReAct loops', difficulty: 'Advanced', sectionGroup: 'Deep Learning & LLMs', isLocked: false },
    ]
  }
];

// Fix html-9 title cleanly
W3_COURSES[0].modules[8].title = 'HTML5 Semantic Elements & Accessibility';

interface Blueprint {
  id: string;
  title: string;
  readTime: string;
  summary: string;
  analogy: string;
  takeaways: string[];
  syntaxRows: { syntax: string; description: string; example: string }[];
  exampleLang: 'html' | 'javascript' | 'python' | 'sql' | 'cpp';
  exampleTitle: string;
  exampleCode: string;
  extraNotes: string;
  fillBlank: {
    prompt: string;
    codeBefore: string;
    answer: string;
    codeAfter: string;
    hint: string;
  };
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  interview: {
    company: string;
    question: string;
    answer: string;
  };
}

const LESSON_BLUEPRINTS: Blueprint[] = [
  // ==================== HTML5 ====================
  {
    id: 'html-1',
    title: 'HTML HOME & Introduction',
    readTime: '6 mins',
    summary: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a page using elements represented by tags.',
    analogy: 'Think of HTML as the wooden frame and walls of a house, CSS as the paint and interior design, and JavaScript as the electricity and smart appliances.',
    takeaways: [
      '<!DOCTYPE html> tells the browser this document uses modern HTML5.',
      '<html> is the root element of every HTML page.',
      '<head> contains metadata (like <title>), while <body> contains everything visible on screen.'
    ],
    syntaxRows: [
      { syntax: '<!DOCTYPE html>', description: 'Declares HTML5 document type', example: '<!DOCTYPE html>' },
      { syntax: '<html>...</html>', description: 'Root element of the webpage', example: '<html lang="en">' },
      { syntax: '<head>...</head>', description: 'Container for page title & meta tags', example: '<head><title>My Page</title></head>' },
      { syntax: '<body>...</body>', description: 'Visible page content (headings, text, buttons)', example: '<body><h1>Hello!</h1></body>' },
    ],
    exampleLang: 'html',
    exampleTitle: 'Your First HTML5 Document',
    exampleCode: `<div style="font-family: system-ui, sans-serif; padding: 20px; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #334155;">
  <div style="font-size: 11px; color: #34d399; font-weight: 700; letter-spacing: 0.06em;">CODE IT OUT HTML5 LAB</div>
  <h1 style="color: #ffffff; margin: 6px 0 8px; font-size: 22px;">My First Heading</h1>
  <p style="color: #cbd5e1; font-size: 14px; margin: 0;">My first paragraph in HTML5! Edit this text and click Run Code.</p>
</div>`,
    extraNotes: 'HTML tags are not case-sensitive, but HTML5 standards recommend always using lowercase tags like `<h1>` and `<p>`.',
    fillBlank: {
      prompt: 'Add the correct HTML tag to make "Hello World" the largest main heading:',
      codeBefore: '<',
      answer: 'h1',
      codeAfter: '>Hello World</h1>',
      hint: 'Headings range from h1 (largest) to h6 (smallest).'
    },
    quiz: {
      question: 'What does HTML stand for?',
      options: ['HyperText Markup Language', 'HighTech Modern Language', 'Hyperlinks and Text Markup Language', 'Home Tool Markup Language'],
      correct: 0,
      explanation: 'HTML stands for HyperText Markup Language.'
    },
    interview: {
      company: 'Code It Out / Frontend',
      question: 'What happens if you omit <!DOCTYPE html> at the top of an HTML file?',
      answer: 'The browser enters "Quirks Mode", emulating legacy 1990s browser bugs in box-model sizing and table layout instead of modern HTML5 Standards Mode.'
    }
  },
  {
    id: 'html-2',
    title: 'HTML Elements, Attributes & Headings',
    readTime: '7 mins',
    summary: 'An HTML element consists of a start tag, content, and an end tag. Attributes provide extra information about elements (like href for links or src for images) and are always written inside the start tag.',
    analogy: 'If an HTML tag like <button> is a noun, an attribute like disabled or style="color:red" is an adjective describing that noun.',
    takeaways: [
      'Attributes always come in name="value" pairs inside the opening tag.',
      '<h1> defines the most important page title; <h6> defines the least important heading.',
      'Some elements like <br>, <hr>, and <img> are "empty/void elements" and have no closing tag.'
    ],
    syntaxRows: [
      { syntax: '<h1> to <h6>', description: '6 levels of section headings', example: '<h1>Main Title</h1>' },
      { syntax: 'href="url"', description: 'Specifies the destination URL of a link', example: '<a href="https://example.com">Link</a>' },
      { syntax: 'src="path"', description: 'Specifies the image or script file source', example: '<img src="logo.png" alt="Logo">' },
      { syntax: 'title="text"', description: 'Shows a tooltip when hovering over the element', example: '<p title="Tooltip!">Hover me</p>' },
    ],
    exampleLang: 'html',
    exampleTitle: 'HTML Headings h1 through h4 & Attributes',
    exampleCode: `<div style="font-family: sans-serif; padding: 18px; background: #0f172a; color: #f8fafc; border-radius: 10px;">
  <h1 style="margin: 4px 0; color: #38bdf8;">Heading 1 (Main Page Title)</h1>
  <h2 style="margin: 4px 0; color: #60a5fa;">Heading 2 (Major Section)</h2>
  <h3 style="margin: 4px 0; color: #93c5fd;">Heading 3 (Sub-section)</h3>
  <p title="Secret tooltip!" style="color: #cbd5e1; margin-top: 12px;">Hover over this paragraph or edit the headings!</p>
</div>`,
    extraNotes: 'Search engines use your `<h1>` through `<h3>` headings to index the structure and topic of your web pages.',
    fillBlank: {
      prompt: 'Fill in the missing attribute name to specify the destination URL of the link:',
      codeBefore: '<a ',
      answer: 'href',
      codeAfter: '="https://codeitout.dev">Visit Tutorial</a>',
      hint: 'It stands for Hypertext Reference.'
    },
    quiz: {
      question: 'Where should HTML attributes always be specified?',
      options: ['In the end tag', 'In the start tag', 'Inside the <head> only', 'After the element'],
      correct: 1,
      explanation: 'Attributes are always specified in the start (opening) tag in name="value" format.'
    },
    interview: {
      company: 'Amazon',
      question: 'Why should every page have only one <h1> element?',
      answer: 'Screen readers and search engine crawlers rely on a single <h1> to identify the primary subject of the page, followed by a hierarchical outline of <h2> and <h3> subheadings.'
    }
  },
  {
    id: 'html-3',
    title: 'HTML Paragraphs, Formatting & Colors',
    readTime: '7 mins',
    summary: 'HTML provides special formatting elements to give text semantic importance: <strong> for important bold text, <em> for emphasized italic text, <mark> for highlighted text, and <code> for computer code.',
    analogy: 'Using <strong> instead of <b> is like using a highlighter on a textbook key term—screen readers actually change their voice tone for <strong> and <em>!',
    takeaways: [
      'Use <strong> for strong importance and <em> for stressed emphasis.',
      'Browsers automatically collapse multiple spaces and newlines inside a <p> tag unless you use <pre>.',
      'Use <sub > for subscript (H₂O) and <sup> for superscript (x²).'
    ],
    syntaxRows: [
      { syntax: '<strong>', description: 'Important bold text', example: '<strong>Warning!</strong>' },
      { syntax: '<em>', description: 'Emphasized italic text', example: '<em>Must read</em>' },
      { syntax: '<mark>', description: 'Highlighted yellow text', example: '<mark>Search match</mark>' },
      { syntax: '<pre>', description: 'Preformatted text preserving spaces & line breaks', example: '<pre>Line 1\n  Line 2</pre>' },
    ],
    exampleLang: 'html',
    exampleTitle: 'Text Formatting Tags in Action',
    exampleCode: `<div style="font-family: sans-serif; padding: 18px; background: #0f172a; color: white; border-radius: 10px; line-height: 1.7;">
  <p>This text is <strong>strongly important</strong> and this is <em>emphasized</em>.</p>
  <p>We can <mark style="background: #facc15; color: #000; padding: 2px 6px; border-radius: 4px;">highlight key notes</mark> for revision.</p>
  <p>Chemical formula: H<sub>2</sub>O | Complexity: O(N<sup>2</sup>)</p>
</div>`,
    extraNotes: 'Use `<hr>` to create a thematic horizontal divider between sections and `<br>` for a single line break.',
    fillBlank: {
      prompt: 'Use the semantic HTML tag to highlight the word "Important" with a marked background:',
      codeBefore: '<p>Do not forget to read the <',
      answer: 'mark',
      codeAfter: '>Important</mark> instructions.</p>',
      hint: 'Think of a yellow marker pen.'
    },
    quiz: {
      question: 'Which HTML element preserves both spaces and line breaks exactly as written in the source file?',
      options: ['<p>', '<pre>', '<br>', '<code>'],
      correct: 1,
      explanation: '<pre> defines preformatted text and displays spaces and line breaks without collapsing them.'
    },
    interview: {
      company: 'Adobe',
      question: 'What is the difference between <b> vs <strong> and <i> vs <em>?',
      answer: '<b> and <i> are purely visual styling tags with no semantic meaning. <strong> and <em> convey semantic urgency and stress to assistive screen readers.'
    }
  },
  {
    id: 'html-4',
    title: 'HTML Links, Bookmarks & Navigation',
    readTime: '7 mins',
    summary: 'HTML links (hyperlinks) allow users to click their way from page to page using the <a> (anchor) tag. Links can point to external websites, relative pages, email addresses, or specific #id sections on the same page.',
    analogy: 'An <a> tag is a portal doorway; the href attribute is the exact street address where that doorway takes you.',
    takeaways: [
      'Use target="_blank" with rel="noopener noreferrer" to safely open links in a new browser tab.',
      'Link to an element with id="top" on the same page using <a href="#top">Jump to Top</a>.',
      'Use href="mailto:help@example.com" to launch the user\'s email client.'
    ],
    syntaxRows: [
      { syntax: '<a href="url">', description: 'Standard hyperlink', example: '<a href="/tutorials">Tutorials</a>' },
      { syntax: 'target="_blank"', description: 'Opens link in a new tab', example: '<a href="https://..." target="_blank">' },
      { syntax: 'href="#section2"', description: 'Smooth-jumps to element with id="section2"', example: '<a href="#quiz">Go to Quiz</a>' },
      { syntax: 'href="mailto:..."', description: 'Creates an email link', example: '<a href="mailto:student@edu.org">Email</a>' },
    ],
    exampleLang: 'html',
    exampleTitle: 'Interactive Navigation Bar & Anchor Links',
    exampleCode: `<nav style="display: flex; gap: 12px; background: #1e293b; padding: 14px; border-radius: 10px; font-family: sans-serif;">
  <a href="#home" style="color: #34d399; text-decoration: none; font-weight: bold;">Home</a>
  <a href="#courses" style="color: #e2e8f0; text-decoration: none;">Courses</a>
  <a href="mailto:mentor@codeiit.io" style="color: #38bdf8; text-decoration: none;">Contact Mentor ✉</a>
</nav>`,
    extraNotes: 'Always provide descriptive link text (like "Read the SQL Tutorial") instead of vague "Click here" so screen-reader users know where the link leads.',
    fillBlank: {
      prompt: 'Add the attribute value that opens a link in a brand new browser tab:',
      codeBefore: '<a href="https://example.com" target="',
      answer: '_blank',
      codeAfter: '">Open New Tab</a>',
      hint: 'Starts with an underscore followed by blank.'
    },
    quiz: {
      question: 'How do you create a link that jumps to an element with id="footer" on the same page?',
      options: ['<a href="footer">', '<a href="#footer">', '<a id="footer">', '<a target="#footer">'],
      correct: 1,
      explanation: 'Prefixing the id with # in href="#footer" creates an in-page bookmark link.'
    },
    interview: {
      company: 'Google',
      question: 'Why was rel="noopener" historically required when using target="_blank"?',
      answer: 'Without noopener, the newly opened tab gained access to window.opener of your original page, allowing malicious sites to redirect your tab to a phishing URL.'
    }
  },
  {
    id: 'html-5',
    title: 'HTML Images, Audio & Video Media',
    readTime: '8 mins',
    summary: 'Web pages come alive with images (<img>), audio (<audio>), and video (<video>). Modern HTML5 plays video and audio natively without external plugins.',
    analogy: 'The alt attribute on an <img> is like closed captions on a movie—if the picture fails to load or a visually impaired user visits, the alt text describes the image.',
    takeaways: [
      'Always include alt="description" and explicit width/height on <img> to prevent Cumulative Layout Shift (CLS).',
      'Use loading="lazy" on below-the-fold images to speed up initial page load.',
      'Wrap images with captions inside semantic <figure> and <figcaption> tags.'
    ],
    syntaxRows: [
      { syntax: '<img src="..." alt="...">', description: 'Embeds an image in the page', example: '<img src="chart.svg" alt="Big O Chart">' },
      { syntax: '<figure> & <figcaption>', description: 'Groups media with a visible caption', example: '<figure><img ...><figcaption>Fig 1</figcaption></figure>' },
      { syntax: '<video controls>', description: 'Embeds an HTML5 video player', example: '<video src="demo.mp4" controls width="320"></video>' },
      { syntax: 'loading="lazy"', description: 'Defers loading image until user scrolls near it', example: '<img src="pic.jpg" loading="lazy" alt="Pic">' },
    ],
    exampleLang: 'html',
    exampleTitle: 'Semantic Figure Card with SVG Graphic',
    exampleCode: `<figure style="margin: 0; background: #1e293b; padding: 16px; border-radius: 12px; color: white; font-family: sans-serif; text-align: center;">
  <svg width="180" height="70" viewBox="0 0 180 70">
    <rect x="10" y="10" width="160" height="50" rx="10" fill="#059669" />
    <text x="90" y="40" fill="white" text-anchor="middle" font-weight="bold" font-size="14">HTML5 Media Card</text>
  </svg>
  <figcaption style="font-size: 13px; color: #94a3b8; margin-top: 8px;">Figure 1: Native SVG & Media in HTML5</figcaption>
</figure>`,
    extraNotes: 'Use modern image formats like **WebP** or **AVIF** inside `<picture>` tags to reduce image file sizes by 40-60%.',
    fillBlank: {
      prompt: 'Add the required accessibility attribute that describes an image if it cannot be displayed:',
      codeBefore: '<img src="diagram.png" ',
      answer: 'alt',
      codeAfter: '="System Architecture Diagram">',
      hint: 'Short for alternative text.'
    },
    quiz: {
      question: 'Why should you specify width and height attributes on <img> elements?',
      options: ['To compress the file size', 'So the browser reserves the exact aspect-ratio space before the image loads, preventing layout shift', 'To make the image clickable', 'It is required for CSS Grid'],
      correct: 1,
      explanation: 'Setting width and height lets the browser reserve space immediately, preventing the page from jumping (Cumulative Layout Shift) when the image downloads.'
    },
    interview: {
      company: 'Shopify',
      question: 'When should you NOT use loading="lazy" on an image?',
      answer: 'Never put loading="lazy" on your top hero/LCP (Largest Contentful Paint) image above the fold, because lazy loading delays fetching until layout completes, hurting initial render speed.'
    }
  },
  {
    id: 'html-6',
    title: 'HTML Tables & Data Grids',
    readTime: '7 mins',
    summary: 'HTML tables arrange data into rows (<tr>) and columns (<th> for headers, <td> for data cells). Group your header rows inside <thead> and body rows inside <tbody>.',
    analogy: 'An HTML table is just like an Excel or Google Sheets spreadsheet built directly into your webpage.',
    takeaways: [
      '<tr> defines a Table Row, <th> defines a bold/centered Table Header cell, and <td> defines a Table Data cell.',
      'Use colspan="2" to make a cell span across 2 columns, or rowspan="2" to span down 2 rows.',
      'Never use HTML tables for page layout—use CSS Flexbox and CSS Grid for layouts!'
    ],
    syntaxRows: [
      { syntax: '<table>', description: 'Wraps the entire table', example: '<table>...</table>' },
      { syntax: '<tr>', description: 'Table Row', example: '<tr><td>Cell</td></tr>' },
      { syntax: '<th>', description: 'Table Header cell (bold by default)', example: '<th scope="col">Name</th>' },
      { syntax: '<td>', description: 'Table Data cell', example: '<td>98%</td>' },
    ],
    exampleLang: 'html',
    exampleTitle: 'Student Gradebook HTML Table',
    exampleCode: `<table style="width: 100%; border-collapse: collapse; font-family: sans-serif; color: #f8fafc; background: #0f172a;">
  <thead>
    <tr style="background: #059669; text-align: left;">
      <th style="padding: 10px;">Student</th>
      <th style="padding: 10px;">Track</th>
      <th style="padding: 10px;">Score</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #334155;">
      <td style="padding: 10px;">Aarav</td>
      <td style="padding: 10px;">Full-Stack Web</td>
      <td style="padding: 10px; color: #34d399; font-weight: bold;">96%</td>
    </tr>
    <tr>
      <td style="padding: 10px;">Meera</td>
      <td style="padding: 10px;">DSA & SQL</td>
      <td style="padding: 10px; color: #34d399; font-weight: bold;">99%</td>
    </tr>
  </tbody>
</table>`,
    extraNotes: 'Add `border-collapse: collapse;` in CSS so adjacent table cells share a single clean border instead of double borders.',
    fillBlank: {
      prompt: 'Complete the tag used to define a Table Header cell:',
      codeBefore: '<tr><',
      answer: 'th',
      codeAfter: '>Student Name</th></tr>',
      hint: 'Short for Table Header.'
    },
    quiz: {
      question: 'Which attribute makes a table cell span across multiple columns horizontally?',
      options: ['rowspan', 'colspan', 'column-width', 'span'],
      correct: 1,
      explanation: 'colspan specifies how many columns a <td> or <th> element should span across.'
    },
    interview: {
      company: 'Microsoft',
      question: 'How do you make HTML tables accessible for screen readers?',
      answer: 'Include a <caption> element describing the table, group rows with <thead>/<tbody>, and add scope="col" or scope="row" to every <th> element.'
    }
  },
  {
    id: 'html-7',
    title: 'HTML Lists (Ordered, Unordered & Nested)',
    readTime: '6 mins',
    summary: 'HTML offers three types of lists: Unordered lists (<ul>) with bullet points, Ordered lists (<ol>) with numbers or letters, and Description lists (<dl>) for term-definition pairs.',
    analogy: 'Use <ul> for a grocery list where order does not matter, and <ol> for a cooking recipe where Step 1 must happen before Step 2.',
    takeaways: [
      'Every item inside a <ul> or <ol> must be wrapped in an <li> (List Item) tag.',
      'Navigation bars on modern websites are almost always built using a <nav> containing a <ul> of links.',
      '<dl> uses <dt> for the Term title and <dd> for the Definition description.'
    ],
    syntaxRows: [
      { syntax: '<ul>', description: 'Unordered (bulleted) list', example: '<ul><li>Item</li></ul>' },
      { syntax: '<ol>', description: 'Ordered (numbered) list', example: '<ol><li>First</li></ol>' },
      { syntax: '<li>', description: 'Individual List Item', example: '<li>Learn HTML</li>' },
      { syntax: '<dl>, <dt>, <dd>', description: 'Description list, term, and definition', example: '<dl><dt>HTML</dt><dd>Markup</dd></dl>' },
    ],
    exampleLang: 'html',
    exampleTitle: 'Ordered & Unordered Lists in HTML',
    exampleCode: `<div style="font-family: sans-serif; background: #0f172a; color: white; padding: 16px; border-radius: 10px;">
  <h3 style="margin: 0 0 8px 0; color: #34d399;">3 Steps to Master Coding:</h3>
  <ol style="margin: 0 0 14px 0; color: #e2e8f0;">
    <li>Read the concept summary</li>
    <li>Click "Try it Yourself"</li>
    <li>Solve the exercise below</li>
  </ol>
</div>`,
    extraNotes: 'You can change the starting number of an `<ol>` using the `start="5"` attribute or reverse it with `reversed`.',
    fillBlank: {
      prompt: 'Add the tag for an individual List Item inside the unordered list:',
      codeBefore: '<ul>\n  <',
      answer: 'li',
      codeAfter: '>Coffee</li>\n</ul>',
      hint: 'Short for List Item.'
    },
    quiz: {
      question: 'Which HTML tag creates a numbered list?',
      options: ['<ul>', '<ol>', '<dl>', '<list>'],
      correct: 1,
      explanation: '<ol> stands for Ordered List and numbers each <li> automatically.'
    },
    interview: {
      company: 'Atlassian',
      question: 'Why do developers wrap navigation links inside a <ul><li> structure inside <nav>?',
      answer: 'Screen readers announce the total number of items in a list ("List of 5 items"), helping visually impaired users immediately understand the size and hierarchy of the menu.'
    }
  },
  {
    id: 'html-8',
    title: 'HTML Forms, Inputs & Validation',
    readTime: '9 mins',
    summary: 'HTML <form> elements collect user input like text, emails, passwords, checkboxes, and dropdown selections. HTML5 includes built-in validation attributes like required, min, max, and type="email".',
    analogy: 'A <form> is like an official application form: each <label> tells you what to write, each <input> is the box you write in, and <button type="submit"> hands it in.',
    takeaways: [
      'Always connect every <label for="id"> to its matching <input id="id">—clicking the label focuses the input!',
      'Every input needs a name="..." attribute so its value is included when the form is submitted.',
      'Use type="email", type="number", type="date", and required for instant browser validation.'
    ],
    syntaxRows: [
      { syntax: '<form>', description: 'Container for user inputs', example: '<form action="/login" method="POST">' },
      { syntax: '<label for="x">', description: 'Accessible caption for input with id="x"', example: '<label for="email">Email</label>' },
      { syntax: '<input type="...">', description: 'Text, password, email, checkbox, radio, date', example: '<input id="email" type="email" required>' },
      { syntax: '<select> & <option>', description: 'Dropdown menu selector', example: '<select><option>Python</option></select>' },
    ],
    exampleLang: 'html',
    exampleTitle: 'Interactive Student Registration Form',
    exampleCode: `<form onsubmit="event.preventDefault(); alert('Form Validated & Submitted!');" style="font-family: sans-serif; background: #0f172a; color: white; padding: 18px; border-radius: 12px; display: grid; gap: 10px;">
  <label style="font-size: 13px; color: #94a3b8;">Student Email (Required):</label>
  <input type="email" placeholder="you@university.edu" required style="padding: 8px 12px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: white;" />
  <button type="submit" style="padding: 10px; background: #059669; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
    Register Now »
  </button>
</form>`,
    extraNotes: 'Never rely solely on client-side HTML validation for security—always validate data on the backend server as well.',
    fillBlank: {
      prompt: 'Add the HTML5 attribute that prevents a user from submitting an empty input field:',
      codeBefore: '<input type="text" name="username" ',
      answer: 'required',
      codeAfter: '>',
      hint: 'An 8-letter word meaning mandatory.'
    },
    quiz: {
      question: 'Which attribute links a <label> element to a specific <input> element?',
      options: ['name', 'for (matching the input\'s id)', 'target', 'value'],
      correct: 1,
      explanation: 'The "for" attribute of <label> must match the "id" attribute of the <input> element.'
    },
    interview: {
      company: 'Stripe',
      question: 'What is the difference between GET and POST methods on an HTML <form>?',
      answer: 'GET appends form data to the URL query string (?key=val) and is used for idempotent searches/filters. POST sends data inside the HTTP request body and is used for creating/modifying data or sending sensitive credentials.'
    }
  },
  {
    id: 'html-10',
    title: 'HTML5 Canvas, SVG & Web Storage',
    readTime: '9 mins',
    summary: 'HTML5 introduced <canvas> for pixel-based 2D/3D JavaScript drawing, <svg> for resolution-independent vector graphics, and localStorage/sessionStorage for storing key-value data in the browser.',
    analogy: 'SVG is like mathematical geometry shapes that stay sharp at any zoom level, while Canvas is like a digital oil painting where pixels are drawn once.',
    takeaways: [
      'localStorage persists data even after the browser is closed (~5MB limit per origin).',
      'sessionStorage clears automatically as soon as the browser tab is closed.',
      'Use SVG for icons, logos, and interactive diagrams; use Canvas for high-FPS games and particle effects.'
    ],
    syntaxRows: [
      { syntax: 'localStorage.setItem(k, v)', description: 'Saves a string key-value pair persistently', example: 'localStorage.setItem("theme", "dark")' },
      { syntax: 'localStorage.getItem(k)', description: 'Reads a saved value by key', example: 'const t = localStorage.getItem("theme")' },
      { syntax: '<svg viewBox="...">', description: 'Scalable Vector Graphics container', example: '<svg width="100" height="100"><circle .../></svg>' },
      { syntax: '<canvas id="c">', description: 'Bitmap drawing surface controlled via JS', example: 'canvas.getContext("2d")' },
    ],
    exampleLang: 'html',
    exampleTitle: 'Interactive SVG Badge Graphic',
    exampleCode: `<div style="background: #0f172a; padding: 20px; border-radius: 12px; text-align: center; color: white; font-family: sans-serif;">
  <svg width="120" height="120" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="50" fill="#065f46" stroke="#10b981" stroke-width="4" />
    <text x="60" y="65" fill="white" font-size="16" font-weight="bold" text-anchor="middle">HTML5 Pro</text>
  </svg>
  <p style="font-size: 13px; color: #94a3b8; margin: 8px 0 0;">Try changing the circle radius r="50" or stroke color!</p>
</div>`,
    extraNotes: 'Unlike cookies, `localStorage` data is never automatically sent to the server with every HTTP request.',
    fillBlank: {
      prompt: 'Complete the JavaScript method to save a username in browser localStorage:',
      codeBefore: 'localStorage.',
      answer: 'setItem',
      codeAfter: '("user", "Alex");',
      hint: 'Starts with set and ends with Item.'
    },
    quiz: {
      question: 'What is the main difference between localStorage and sessionStorage?',
      options: ['localStorage has no expiration; sessionStorage is cleared when the page tab closes', 'sessionStorage is sent to the server on every request', 'localStorage can store 100GB', 'There is no difference'],
      correct: 0,
      explanation: 'localStorage persists across browser restarts, whereas sessionStorage only lasts for the duration of the current tab session.'
    },
    interview: {
      company: 'Figma',
      question: 'When would you choose HTML5 <canvas> over <svg> for a data visualization dashboard?',
      answer: 'When rendering 10,000+ data points or real-time 60fps animations. SVG creates a DOM node for every shape (which slows down the browser DOM above a few thousand nodes), whereas Canvas draws pixels directly to a single bitmap buffer.'
    }
  },

  // ==================== CSS3 ====================
  {
    id: 'css-1',
    title: 'CSS HOME, Syntax & Selectors',
    readTime: '7 mins',
    summary: 'CSS (Cascading Style Sheets) controls how HTML elements look on screen. A CSS rule consists of a selector (like h1, .card, or #header) and a declaration block { property: value; }.',
    analogy: 'If HTML is a plain text document, CSS is the style template that sets the fonts, colors, spacing, and multi-column layout.',
    takeaways: [
      'Element selectors (p) match tags; Class selectors (.btn) match class="btn"; ID selectors (#nav) match id="nav".',
      'CSS Specificity hierarchy from lowest to highest: Element (0,0,1) < Class (0,1,0) < ID (1,0,0) < Inline Style.',
      'Use reusable .class selectors rather than #id selectors for styling components.'
    ],
    syntaxRows: [
      { syntax: 'p { color: blue; }', description: 'Element selector (targets all <p>)', example: 'h1 { font-size: 24px; }' },
      { syntax: '.card { ... }', description: 'Class selector (targets class="card")', example: '.btn { background: green; }' },
      { syntax: '#hero { ... }', description: 'ID selector (targets id="hero")', example: '#main-nav { height: 60px; }' },
      { syntax: '.btn:hover { ... }', description: 'Pseudo-class triggered on mouse hover', example: 'a:hover { color: #10b981; }' },
    ],
    exampleLang: 'html',
    exampleTitle: 'CSS Selectors & Hover States',
    exampleCode: `<style>
  .cio-card { background: #1e293b; color: white; padding: 18px; border-radius: 10px; font-family: sans-serif; border: 1px solid #10b981; }
  .cio-badge { background: #059669; color: white; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: bold; }
</style>
<div class="cio-card">
  <span class="cio-badge">CSS3 Class Selector</span>
  <h3 style="margin: 10px 0 4px;">Styled with .cio-card</h3>
  <p style="margin: 0; color: #cbd5e1; font-size: 14px;">Change the border color above and click Run Code!</p>
</div>`,
    extraNotes: 'Avoid using `!important` in CSS because it breaks the natural cascade and makes debugging styles difficult.',
    fillBlank: {
      prompt: 'Write the correct CSS selector prefix to target an element with class="alert":',
      codeBefore: '',
      answer: '.alert',
      codeAfter: ' {\n  color: red;\n}',
      hint: 'Class selectors always start with a dot (.).'
    },
    quiz: {
      question: 'Which CSS selector has the highest specificity among the following?',
      options: ['div p', '.container .card', '#main-header', 'h1'],
      correct: 2,
      explanation: 'An ID selector (#main-header) has specificity (1,0,0), which outweighs any number of class (0,1,0) or element (0,0,1) selectors.'
    },
    interview: {
      company: 'Meta',
      question: 'How is CSS specificity calculated when two rules conflict?',
      answer: 'Browsers score selectors as a 3-tuple (IDs, Classes/Pseudo-classes/Attributes, Elements). Higher left-most numbers win; if tied, the rule that appears later in the stylesheet wins.'
    }
  },
  {
    id: 'css-2',
    title: 'CSS Colors, Backgrounds & Gradients',
    readTime: '6 mins',
    summary: 'CSS supports colors via named colors, HEX (#10b981), RGB/RGBA (rgb(16, 185, 129)), and HSL (hsl(160, 84%, 39%)). You can also create smooth color transitions using linear-gradient().',
    analogy: 'HEX and RGB mix Red, Green, and Blue light on your screen, whereas HSL lets you pick a color wheel Hue, Saturation intensity, and Lightness.',
    takeaways: [
      'Use rgba(r, g, b, alpha) or 8-digit hex for semi-transparent backgrounds.',
      'linear-gradient(135deg, #059669, #2563eb) creates a smooth diagonal gradient without downloading an image.',
      'Always maintain at least a 4.5:1 contrast ratio between text color and background-color for readability.'
    ],
    syntaxRows: [
      { syntax: 'color: #10b981;', description: 'Sets text color using HEX code', example: 'color: #ffffff;' },
      { syntax: 'background-color', description: 'Sets solid background color', example: 'background-color: #0f172a;' },
      { syntax: 'linear-gradient(...)', description: 'Creates a directional color gradient', example: 'background: linear-gradient(to right, #10b981, #3b82f6);' },
      { syntax: 'opacity: 0.8;', description: 'Sets transparency of the entire element (0 to 1)', example: 'opacity: 0.5;' },
    ],
    exampleLang: 'html',
    exampleTitle: 'CSS Linear Gradient Hero Banner',
    exampleCode: `<div style="background: linear-gradient(135deg, #047857 0%, #1d4ed8 100%); color: white; padding: 24px; border-radius: 12px; font-family: sans-serif;">
  <h2 style="margin: 0 0 6px 0;">CSS3 Linear Gradient</h2>
  <p style="margin: 0; font-size: 14px; opacity: 0.9;">Try changing the angle from 135deg to 90deg or swapping the hex colors!</p>
</div>`,
    extraNotes: 'HSL (`hsl(210, 90%, 50%)`) is super handy for creating hover states—just increase or decrease the Lightness percentage by 10%!',
    fillBlank: {
      prompt: 'Set the CSS property that changes the background color of a page:',
      codeBefore: 'body {\n  ',
      answer: 'background-color',
      codeAfter: ': #0f172a;\n}',
      hint: 'Two words joined by a hyphen: background and color.'
    },
    quiz: {
      question: 'What does the "a" in rgba(255, 0, 0, 0.5) control?',
      options: ['Animation speed', 'Alpha channel (opacity/transparency from 0.0 to 1.0)', 'Alignment', 'Aspect ratio'],
      correct: 1,
      explanation: 'Alpha controls opacity, where 0.0 is completely transparent and 1.0 is completely opaque.'
    },
    interview: {
      company: 'Canva',
      question: 'What is the difference between setting opacity: 0.5 on a parent div versus setting background: rgba(0,0,0,0.5)?',
      answer: 'opacity: 0.5 makes the parent AND all its child text/buttons semi-transparent. rgba() only makes the background semi-transparent while keeping child text 100% crisp.'
    }
  },
  {
    id: 'css-3',
    title: 'CSS Box Model, Margin, Border & Padding',
    readTime: '8 mins',
    summary: 'Every HTML element is a rectangular box made of 4 layers from inside out: Content -> Padding (inner breathing room) -> Border -> Margin (outer space between elements).',
    analogy: 'Think of a framed painting on a wall: the painting is Content, the white mat around it is Padding, the wooden frame is Border, and the distance to the next painting is Margin.',
    takeaways: [
      'Padding is space INSIDE the border (shows the element\'s background color).',
      'Margin is transparent space OUTSIDE the border separating neighbor elements.',
      'Always set box-sizing: border-box so width: 300px includes padding and border instead of overflowing!'
    ],
    syntaxRows: [
      { syntax: 'padding: 16px;', description: 'Inner space between content and border', example: 'padding: 12px 24px;' },
      { syntax: 'border: 2px solid #10b981;', description: 'Width, style, and color of the border', example: 'border-radius: 8px;' },
      { syntax: 'margin: 20px auto;', description: 'Outer space; "auto" horizontally centers a block', example: 'margin-bottom: 16px;' },
      { syntax: 'box-sizing: border-box;', description: 'Includes padding & border inside total width', example: '* { box-sizing: border-box; }' },
    ],
    exampleLang: 'html',
    exampleTitle: 'Visualizing the 4 Layers of the CSS Box Model',
    exampleCode: `<div style="background: #1e293b; padding: 20px; font-family: sans-serif; color: white; border-radius: 12px;">
  <div style="margin: 12px; border: 3px dashed #10b981; padding: 20px; background: #0f172a; border-radius: 8px;">
    <strong>Content Box</strong> (Inside 20px Padding &amp; 3px Green Border)
  </div>
</div>`,
    extraNotes: 'Vertical margins between two stacked block elements **collapse** into the larger of the two margins (e.g. `20px` bottom + `30px` top = `30px` gap, not `50px`).',
    fillBlank: {
      prompt: 'Add the CSS property value that includes padding and border inside an element\'s declared width:',
      codeBefore: '* {\n  box-sizing: ',
      answer: 'border-box',
      codeAfter: ';\n}',
      hint: 'Starts with border- and ends with box.'
    },
    quiz: {
      question: 'If a div has width: 200px, padding: 20px, border: 5px solid, and box-sizing: content-box (default), what is its total rendered width?',
      options: ['200px', '225px', '250px', '240px'],
      correct: 2,
      explanation: '200px content + 20px left padding + 20px right padding + 5px left border + 5px right border = 250px.'
    },
    interview: {
      company: 'Google',
      question: 'Why do virtually all modern CSS resets include *, *::before, *::after { box-sizing: border-box; }?',
      answer: 'With border-box, setting width: 50% plus padding: 16px keeps the element at exactly 50% width instead of overflowing its parent container.'
    }
  },
  {
    id: 'css-4',
    title: 'CSS Typography, Fonts & Units (px, rem, vh)',
    readTime: '6 mins',
    summary: 'Good typography is the foundation of web readability. Use rem for font sizes so your site scales smoothly with user accessibility settings, and keep line-height around 1.5 to 1.7 for body text.',
    analogy: 'px is an absolute ruler measurement, while rem is proportional to the root <html> font size (1rem = 16px by default).',
    takeaways: [
      '1rem equals the font-size of the root <html> element (usually 16px).',
      'vw and vh represent 1% of the browser viewport width and height (100vh = full screen height).',
      'Always provide fallback fonts in font-family: "Inter", system-ui, sans-serif;.'
    ],
    syntaxRows: [
      { syntax: 'font-size: 1.25rem;', description: 'Scales relative to root font size (20px)', example: 'font-size: 1rem;' },
      { syntax: 'font-weight: 700;', description: 'Controls text boldness (400 normal, 700 bold)', example: 'font-weight: 600;' },
      { syntax: 'line-height: 1.6;', description: 'Vertical spacing between lines of text', example: 'line-height: 1.5;' },
      { syntax: 'min-height: 100vh;', description: '100% of the visible screen height', example: 'width: 100%;' },
    ],
    exampleLang: 'html',
    exampleTitle: 'Typography Hierarchy & Rem Sizing',
    exampleCode: `<div style="font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 20px; border-radius: 10px;">
  <p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: #34d399; margin: 0;">Chapter 04 · Typography</p>
  <h2 style="font-size: 1.5rem; font-weight: 800; margin: 6px 0;">Clean, Scannable Web Typography</h2>
  <p style="font-size: 0.95rem; line-height: 1.65; color: #cbd5e1; margin: 0;">Notice how generous line-height (1.65) and contrast make paragraphs effortless to read.</p>
</div>`,
    extraNotes: 'Prefer `rem` over `em` for font sizes because `em` compounds when elements are nested inside each other.',
    fillBlank: {
      prompt: 'Use the CSS property that makes text bold:',
      codeBefore: 'h1 {\n  ',
      answer: 'font-weight',
      codeAfter: ': bold;\n}',
      hint: 'Starts with font- and describes how heavy the letters are.'
    },
    quiz: {
      question: 'If the root <html> font-size is 16px, how many pixels is 2rem?',
      options: ['18px', '20px', '32px', '64px'],
      correct: 2,
      explanation: '1rem = 16px, so 2rem = 2 * 16px = 32px.'
    },
    interview: {
      company: 'Airbnb',
      question: 'Why is rem preferred over px for font-size in accessible web applications?',
      answer: 'Users with low vision often increase their browser default font size from 16px to 20px or 24px. Hardcoded px values ignore user preferences, while rem scales automatically.'
    }
  },
  {
    id: 'css-5',
    title: 'CSS Display, Position & Z-Index',
    readTime: '8 mins',
    summary: 'The position property specifies how an element is positioned in the document: static (default), relative, absolute (positioned relative to its nearest positioned ancestor), fixed (pinned to viewport), or sticky.',
    analogy: 'position: absolute is like a sticky note placed at exact (top, right) coordinates inside a folder, as long as that folder has position: relative!',
    takeaways: [
      'Always put position: relative on the parent container when using position: absolute on a child badge!',
      'position: sticky keeps a navbar or table header in normal flow until it hits a scroll threshold (like top: 0).',
      'z-index only works on positioned elements (relative, absolute, fixed, sticky) or flex/grid children.'
    ],
    syntaxRows: [
      { syntax: 'position: relative;', description: 'Offsets element from normal spot; anchors absolute children', example: 'position: relative;' },
      { syntax: 'position: absolute;', description: 'Positions relative to nearest non-static ancestor', example: 'top: 8px; right: 8px;' },
      { syntax: 'position: sticky;', description: 'Sticks to top when scrolling past', example: 'position: sticky; top: 0;' },
      { syntax: 'z-index: 10;', description: 'Controls front-to-back stacking order', example: 'z-index: 50;' },
    ],
    exampleLang: 'html',
    exampleTitle: 'Relative Parent with Absolute Notification Badge',
    exampleCode: `<div style="position: relative; background: #1e293b; color: white; padding: 22px; border-radius: 12px; font-family: sans-serif; margin-top: 10px;">
  <span style="position: absolute; top: 10px; right: 12px; background: #10b981; color: #052e16; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 99px;">
    NEW
  </span>
  <h3 style="margin: 0 0 6px 0;">Card with Absolute Corner Badge</h3>
  <p style="margin: 0; font-size: 13px; color: #cbd5e1;">The parent has position: relative; the badge has position: absolute; top: 10px; right: 12px;</p>
</div>`,
    extraNotes: '`display: inline` elements (like `<span>`) ignore `width`, `height`, and vertical `margin`. Use `display: inline-block` or `flex` if you need dimensions.',
    fillBlank: {
      prompt: 'Set the parent position property so an absolute child stays anchored inside it:',
      codeBefore: '.parent-card {\n  position: ',
      answer: 'relative',
      codeAfter: ';\n}',
      hint: 'Starts with rel...'
    },
    quiz: {
      question: 'An element with position: absolute is positioned relative to what?',
      options: ['Always the <body> tag', 'Its nearest ancestor that has position other than static (e.g. relative), or the document body if none exists', 'Its previous sibling', 'The screen cursor'],
      correct: 1,
      explanation: 'Absolute elements look up the DOM tree for the closest ancestor with position: relative, absolute, fixed, or sticky.'
    },
    interview: {
      company: 'Netflix',
      question: 'Why might z-index: 9999 on a child element still appear behind another element with z-index: 2?',
      answer: 'Because of Stacking Contexts! If the child\'s parent has z-index: 1 (or opacity < 1 / transform), the child is trapped inside its parent\'s stacking context and cannot rise above an outside sibling with z-index: 2.'
    }
  },
  {
    id: 'css-6',
    title: 'CSS Flexbox Complete Guide',
    readTime: '9 mins',
    summary: 'Flexbox (Flexible Box Layout) is a 1-dimensional layout method for arranging items in rows or columns. Set display: flex on a parent container to align, space, and center children with ease.',
    analogy: 'Flexbox is like stringing beads onto a wire: justify-content slides the beads along the wire, and align-items centers them vertically on the wire.',
    takeaways: [
      'display: flex turns direct children into flex items along the Main Axis (row by default).',
      'justify-content aligns items along the Main Axis (center, space-between, flex-end).',
      'align-items aligns items along the Cross Axis (center, stretch, flex-start).'
    ],
    syntaxRows: [
      { syntax: 'display: flex;', description: 'Enables Flexbox on the parent container', example: 'display: flex; gap: 12px;' },
      { syntax: 'justify-content', description: 'Main-axis alignment (flex-start, center, space-between)', example: 'justify-content: space-between;' },
      { syntax: 'align-items', description: 'Cross-axis alignment (center, stretch)', example: 'align-items: center;' },
      { syntax: 'flex: 1;', description: 'Allows a child item to grow and fill available space', example: 'flex: 1;' },
    ],
    exampleLang: 'html',
    exampleTitle: 'Flexbox Navbar & Centered Cards',
    exampleCode: `<div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; background: #0f172a; padding: 16px; border-radius: 10px; color: white; font-family: sans-serif;">
  <div style="font-weight: bold; color: #34d399;">BrandLogo</div>
  <div style="display: flex; gap: 10px;">
    <span style="background: #1e293b; padding: 6px 12px; border-radius: 6px; font-size: 13px;">Tutorials</span>
    <span style="background: #059669; padding: 6px 12px; border-radius: 6px; font-size: 13px;">Practice</span>
  </div>
</div>`,
    extraNotes: 'To perfectly center any element horizontally and vertically inside a box, use `display: flex; justify-content: center; align-items: center;`.',
    fillBlank: {
      prompt: 'Complete the Flexbox property to spread items evenly with space between them:',
      codeBefore: '.navbar {\n  display: flex;\n  ',
      answer: 'justify-content',
      codeAfter: ': space-between;\n}',
      hint: 'Controls alignment along the main axis (justify-...).'
    },
    quiz: {
      question: 'Which Flexbox property controls spacing between flex items without needing margin on each child?',
      options: ['space-between', 'gap', 'margin-collapse', 'flex-space'],
      correct: 1,
      explanation: 'The gap property (e.g., gap: 16px) sets clean gutter spacing between rows and columns in both Flexbox and CSS Grid.'
    },
    interview: {
      company: 'Uber',
      question: 'What does flex: 1 actually expand to in CSS shorthand?',
      answer: 'flex: 1 is shorthand for flex-grow: 1; flex-shrink: 1; flex-basis: 0%; — meaning the item grows to fill available space equally and shrinks if needed.'
    }
  },
  {
    id: 'css-7',
    title: 'CSS Grid Layout Complete Guide',
    readTime: '9 mins',
    summary: 'CSS Grid is a 2-dimensional layout system that handles both rows and columns simultaneously. Use fractional units (1fr) and repeat(auto-fit, minmax(200px, 1fr)) to build responsive dashboards.',
    analogy: 'While Flexbox is a single row of seats, CSS Grid is an entire movie theater floor plan with numbered rows and columns.',
    takeaways: [
      '1fr represents 1 fraction of the remaining free space in the grid container.',
      'grid-template-columns: repeat(3, 1fr) creates 3 equal-width columns.',
      'repeat(auto-fit, minmax(180px, 1fr)) automatically wraps columns on mobile without media queries!'
    ],
    syntaxRows: [
      { syntax: 'display: grid;', description: 'Turns container into a 2D CSS Grid', example: 'display: grid; gap: 16px;' },
      { syntax: 'grid-template-columns', description: 'Defines column widths', example: 'grid-template-columns: 240px 1fr;' },
      { syntax: 'grid-column: span 2;', description: 'Makes a grid item span across 2 columns', example: 'grid-column: span 2;' },
      { syntax: 'repeat(auto-fit, minmax(...))', description: 'Auto-responsive fluid columns', example: 'repeat(auto-fit, minmax(150px, 1fr))' },
    ],
    exampleLang: 'html',
    exampleTitle: '2D Bento Dashboard with CSS Grid',
    exampleCode: `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: #0f172a; padding: 14px; border-radius: 12px; color: white; font-family: sans-serif; font-size: 13px;">
  <div style="grid-column: span 2; background: #065f46; padding: 16px; border-radius: 8px; font-weight: bold;">Wide Feature Box (grid-column: span 2)</div>
  <div style="background: #1e293b; padding: 16px; border-radius: 8px;">Stat 1 (1fr)</div>
  <div style="background: #1e293b; padding: 16px; border-radius: 8px;">Stat 2 (1fr)</div>
  <div style="grid-column: span 2; background: #1e3a8a; padding: 16px; border-radius: 8px;">Analytics Panel (span 2)</div>
</div>`,
    extraNotes: 'Combine **CSS Grid** for your macro page layout and **Flexbox** for aligning buttons and icons inside each card.',
    fillBlank: {
      prompt: 'Complete the CSS property to create 3 equal-width columns in a Grid container:',
      codeBefore: '.grid {\n  display: grid;\n  ',
      answer: 'grid-template-columns',
      codeAfter: ': repeat(3, 1fr);\n}',
      hint: 'Starts with grid-template-...'
    },
    quiz: {
      question: 'What does the CSS Grid unit "1fr" stand for?',
      options: ['1 fixed ratio', '1 fraction of the available space in the grid container', '1 frame per second', '1 full row'],
      correct: 1,
      explanation: 'fr stands for fractional unit, distributing free space proportionally.'
    },
    interview: {
      company: 'Linear / Vercel',
      question: 'What is the difference between auto-fill and auto-fit in repeat(auto-fit, minmax(200px, 1fr))?',
      answer: 'When there are fewer items than fit in a row, auto-fill keeps empty invisible column tracks, while auto-fit collapses empty tracks to 0px so existing items stretch to fill the entire row.'
    }
  },
  {
    id: 'css-8',
    title: 'CSS Responsive Media Queries',
    readTime: '7 mins',
    summary: 'Responsive Web Design ensures your web app looks great on phones (375px), tablets (768px), and desktops (1440px) using @media queries and fluid clamp() sizing.',
    analogy: 'Media queries are like water taking the shape of its container—pouring the same content into a narrow glass (phone) or wide bowl (monitor).',
    takeaways: [
      'Always include <meta name="viewport" content="width=device-width, initial-scale=1.0"> in HTML <head>.',
      'Mobile-First CSS writes base styles for mobile screens and adds @media (min-width: 768px) for larger screens.',
      'clamp(1.2rem, 2.5vw, 2.2rem) scales font sizes smoothly between a minimum and maximum size.'
    ],
    syntaxRows: [
      { syntax: '@media (min-width: 768px)', description: 'Applies styles when screen is 768px or wider', example: '@media (min-width: 768px) { ... }' },
      { syntax: 'max-width: 100%;', description: 'Prevents images/containers from overflowing mobile screens', example: 'img { max-width: 100%; height: auto; }' },
      { syntax: 'clamp(min, val, max)', description: 'Fluid value clamped between min and max', example: 'font-size: clamp(1rem, 2vw, 1.5rem);' },
    ],
    exampleLang: 'html',
    exampleTitle: 'Responsive Fluid Card with clamp()',
    exampleCode: `<div style="background: #0f172a; color: white; padding: 20px; border-radius: 12px; font-family: sans-serif;">
  <h2 style="font-size: clamp(1.1rem, 3vw, 1.75rem); color: #34d399; margin: 0 0 8px 0;">Fluid Responsive Heading</h2>
  <p style="margin: 0; font-size: 14px; color: #cbd5e1;">This heading uses clamp(1.1rem, 3vw, 1.75rem) to scale automatically across mobile and desktop screens.</p>
</div>`,
    extraNotes: 'Standard Tailwind & industry breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.',
    fillBlank: {
      prompt: 'Write the CSS rule keyword used to apply styles conditionally based on screen width:',
      codeBefore: '',
      answer: '@media',
      codeAfter: ' (min-width: 768px) {\n  .sidebar { display: block; }\n}',
      hint: 'Starts with @ followed by media.'
    },
    quiz: {
      question: 'In a Mobile-First responsive stylesheet, which media query condition is used to add tablet and desktop styles?',
      options: ['max-width', 'min-width', 'device-height', 'screen-only'],
      correct: 1,
      explanation: 'Mobile-First styles target small screens by default and progressively enhance layout using @media (min-width: ...).'
    },
    interview: {
      company: 'Apple',
      question: 'What are CSS Container Queries (@container) and how do they differ from @media queries?',
      answer: '@media queries respond to the entire browser viewport width, whereas @container queries let a component adapt its layout based on the width of its immediate parent container.'
    }
  },
  {
    id: 'css-9',
    title: 'CSS Transitions, Transforms & Animations',
    readTime: '7 mins',
    summary: 'CSS transitions smoothly animate property changes over time (like hover effects), while @keyframes animations run multi-step sequences automatically.',
    analogy: 'A transition is a door smoothly swinging open when pushed (triggered by hover); a @keyframes animation is a ceiling fan spinning continuously on its own.',
    takeaways: [
      'Always animate GPU-accelerated properties (transform and opacity) for silky 60fps performance.',
      'transition: transform 0.2s ease, background-color 0.2s ease; goes on the base element, not just :hover.',
      'Respect user accessibility preferences with @media (prefers-reduced-motion: reduce).'
    ],
    syntaxRows: [
      { syntax: 'transition: all 0.2s ease;', description: 'Smoothly interpolates property changes', example: 'transition: transform 0.2s ease;' },
      { syntax: 'transform: scale(1.05);', description: 'Scales, rotates, or translates an element on GPU', example: 'transform: translateY(-2px);' },
      { syntax: '@keyframes pulse { ... }', description: 'Defines multi-stage animation steps (0% to 100%)', example: 'animation: pulse 2s infinite;' },
    ],
    exampleLang: 'html',
    exampleTitle: 'Interactive Hover Button with GPU Transform',
    exampleCode: `<style>
  .anim-btn { background: #10b981; color: #052e16; padding: 12px 20px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: transform 0.2s ease, background 0.2s ease; }
  .anim-btn:hover { transform: translateY(-3px) scale(1.03); background: #34d399; }
</style>
<div style="background: #0f172a; padding: 24px; border-radius: 12px; text-align: center; font-family: sans-serif;">
  <button class="anim-btn">Hover Over Me in Preview!</button>
</div>`,
    extraNotes: 'Animating `width`, `height`, `top`, or `left` triggers expensive browser **Layout (Reflow)** on every frame—use `transform: translate()` and `scale()` instead!',
    fillBlank: {
      prompt: 'Add the CSS property that smoothly animates changes over 0.3 seconds:',
      codeBefore: '.button {\n  ',
      answer: 'transition',
      codeAfter: ': transform 0.3s ease;\n}',
      hint: 'Starts with trans... and ends with ...ition.'
    },
    quiz: {
      question: 'Which two CSS properties are cheapest to animate at 60fps because they run on the GPU compositor thread?',
      options: ['width and height', 'margin and padding', 'transform and opacity', 'top and left'],
      correct: 2,
      explanation: 'transform and opacity skip Layout and Paint, running directly on the GPU compositor.'
    },
    interview: {
      company: 'Stripe',
      question: 'Why should transition be declared on the base selector (.btn) instead of only on .btn:hover?',
      answer: 'If transition is only on :hover, the element animates smoothly when the mouse enters, but snaps back abruptly in 0ms as soon as the mouse leaves.'
    }
  },
  {
    id: 'css-10',
    title: 'CSS Variables (Custom Properties) & Dark Mode',
    readTime: '7 mins',
    summary: 'CSS Custom Properties (--primary-color) let you store reusable design tokens in :root and reference them anywhere using var(--primary-color). Updating one variable updates the entire theme instantly.',
    analogy: 'CSS Variables are like a master color switchboard—flip one switch at the top and every room in the building changes color at once.',
    takeaways: [
      'Declare global variables inside :root { --brand: #10b981; }.',
      'Read variables with var(--brand, #fallback).',
      'Unlike SASS variables, CSS Custom Properties are live in the browser DOM and can be updated with JavaScript!'
    ],
    syntaxRows: [
      { syntax: '--main-color: #10b981;', description: 'Declares a custom property (starts with --)', example: ':root { --bg: #0f172a; }' },
      { syntax: 'var(--main-color)', description: 'Reads the custom property value', example: 'color: var(--main-color);' },
      { syntax: 'calc(100% - 2rem)', description: 'Performs live math mixing units', example: 'width: calc(100% - 40px);' },
    ],
    exampleLang: 'html',
    exampleTitle: 'Theming with CSS Custom Properties',
    exampleCode: `<style>
  .theme-box {
    --accent: #10b981;
    --surface: #0f172a;
    background: var(--surface);
    color: white;
    padding: 18px;
    border-radius: 10px;
    border: 2px solid var(--accent);
    font-family: sans-serif;
  }
</style>
<div class="theme-box">
  <h3 style="color: var(--accent); margin: 0 0 6px 0;">Powered by var(--accent)</h3>
  <p style="margin: 0; font-size: 13px; color: #cbd5e1;">Change --accent: #10b981 to #38bdf8 above and click Run Code!</p>
</div>`,
    extraNotes: 'You can provide a fallback value inside `var(--missing-var, #10b981)` in case the variable is not defined.',
    fillBlank: {
      prompt: 'Use the CSS function to read the value of custom property --primary-color:',
      codeBefore: '.header {\n  color: ',
      answer: 'var',
      codeAfter: '(--primary-color);\n}',
      hint: 'A 3-letter keyword short for variable.'
    },
    quiz: {
      question: 'How must all CSS Custom Property names begin?',
      options: ['With $', 'With @', 'With two dashes (--)', 'With var-'],
      correct: 2,
      explanation: 'CSS custom properties always start with two dashes, like --theme-color.'
    },
    interview: {
      company: 'GitHub',
      question: 'How do CSS Custom Properties make Dark Mode implementation cleaner than duplicating class rules?',
      answer: 'You define semantic tokens like --bg-surface and --text-primary in :root, and simply override those variables inside [data-theme="dark"] without touching a single component selector.'
    }
  },

  // ==================== JAVASCRIPT ====================
  {
    id: 'js-intro',
    title: 'JS HOME, Output & Statements',
    readTime: '6 mins',
    summary: 'JavaScript is the programming language of the Web. It makes web pages interactive, handles user events, fetches data from servers, and powers full-stack Node.js backends.',
    analogy: 'HTML builds the car body, CSS paints it metallic green, and JavaScript is the engine under the hood that makes it drive when you press the pedal.',
    takeaways: [
      'Use console.log() to print values and debug code in the developer console.',
      'JavaScript statements are executed line by line from top to bottom.',
      'Single-line comments start with // and multi-line comments use /* ... */.'
    ],
    syntaxRows: [
      { syntax: 'console.log(val)', description: 'Prints output to the console', example: 'console.log("Hello JS!");' },
      { syntax: 'document.getElementById(id)', description: 'Finds an HTML element by its id', example: 'document.getElementById("demo")' },
      { syntax: '// comment', description: 'Single-line comment ignored by JS engine', example: '// Calculate total' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Your First JavaScript Program',
    exampleCode: `const student = "Alex";
const modulesTotal = 122;
console.log("Welcome to JavaScript,", student + "!");
console.log("Total interactive chapters available:", modulesTotal);`,
    extraNotes: 'JavaScript and Java are completely different languages with different designs—the name was a 1995 marketing partnership!',
    fillBlank: {
      prompt: 'Complete the JavaScript statement to print "Hello World" to the console:',
      codeBefore: 'console.',
      answer: 'log',
      codeAfter: '("Hello World");',
      hint: 'A 3-letter method on the console object.'
    },
    quiz: {
      question: 'Which HTML tag is used to put JavaScript code inside an HTML file?',
      options: ['<js>', '<javascript>', '<script>', '<code>'],
      correct: 2,
      explanation: 'JavaScript code is placed inside <script>...</script> tags.'
    },
    interview: {
      company: 'Mozilla',
      question: 'Where should <script> tags be placed in HTML for best page load speed?',
      answer: 'Either in the <head> with the "defer" attribute (<script src="app.js" defer></script>) or right before the closing </body> tag so HTML parsing is not blocked.'
    }
  },
  {
    id: 'js-vars',
    title: 'JS Variables (let, const, var) & Data Types',
    readTime: '7 mins',
    summary: 'Variables store data values. Modern JavaScript uses const for values that won\'t be reassigned and let for variables that change (like loop counters). JavaScript has 7 primitive types plus Objects.',
    analogy: 'const is a permanent Sharpie label on a box, while let is a erasable whiteboard label you can update later.',
    takeaways: [
      'Default to const; only use let when you know you need to reassign the variable.',
      'Avoid legacy var because it is function-scoped and prone to hoisting bugs.',
      'Template literals (`Hello ${name}`) let you embed variables directly inside strings using backticks.'
    ],
    syntaxRows: [
      { syntax: 'const PI = 3.14;', description: 'Block-scoped constant reference', example: 'const MAX = 100;' },
      { syntax: 'let score = 0;', description: 'Block-scoped reassignable variable', example: 'score += 10;' },
      { syntax: 'typeof x', description: 'Returns data type string ("number", "string", etc.)', example: 'typeof 42 // "number"' },
      { syntax: '`Hi ${name}`', description: 'Template literal string interpolation', example: '`Score: ${score}`' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Variables, Template Literals & typeof',
    exampleCode: `const course = "JavaScript ES6+";
let xp = 100;
xp += 50;

console.log(\`Studying \${course} — Current XP: \${xp}\`);
console.log("Type of course:", typeof course);
console.log("Type of xp:", typeof xp);`,
    extraNotes: 'Note a famous JavaScript quirk: `typeof null` returns `"object"` due to a historic bug from the very first version of JS in 1995!',
    fillBlank: {
      prompt: 'Declare a constant variable named MAX_USERS that cannot be reassigned:',
      codeBefore: '',
      answer: 'const',
      codeAfter: ' MAX_USERS = 500;',
      hint: 'A 5-letter ES6 keyword for constants.'
    },
    quiz: {
      question: 'What happens if you declare const user = { name: "Sam" } and then run user.name = "Alex"?',
      options: ['It throws a TypeError', 'It succeeds! const prevents reassigning the variable reference, but object properties can still be mutated', 'It creates a new variable', 'It deletes the object'],
      correct: 1,
      explanation: 'const locks the variable binding (you cannot do user = {}), but the properties inside the object remain mutable unless Object.freeze() is used.'
    },
    interview: {
      company: 'Amazon',
      question: 'What are the 7 primitive data types in JavaScript?',
      answer: 'string, number, bigint, boolean, undefined, symbol, and null.'
    }
  },
  {
    id: 'js-cond',
    title: 'JS Operators, If...Else & Switch',
    readTime: '7 mins',
    summary: 'Conditional statements execute different actions based on boolean conditions. Always use strict equality (===) instead of loose equality (==) to avoid unexpected type coercion.',
    analogy: 'Loose equality (==) says the string "5" and number 5 are "close enough", while strict equality (===) checks that both the value AND the data type match.',
    takeaways: [
      'Always use === and !== instead of == and !=.',
      'The Nullish Coalescing operator (a ?? "default") only falls back when a is null or undefined (unlike || which also triggers on 0 or "").',
      'Optional Chaining (user?.address?.city) safely returns undefined instead of crashing if a property is null.'
    ],
    syntaxRows: [
      { syntax: 'a === b', description: 'Strict equality (checks value AND type)', example: '5 === "5" // false' },
      { syntax: 'cond ? val1 : val2', description: 'Ternary operator (inline if-else)', example: 'score >= 50 ? "Pass" : "Retry"' },
      { syntax: 'val ?? fallback', description: 'Nullish coalescing (only if null/undefined)', example: 'count ?? 0' },
      { syntax: 'obj?.prop', description: 'Optional chaining (safe property access)', example: 'user?.profile?.email' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Strict Equality, Ternary & Nullish Coalescing',
    exampleCode: `const score = 85;
const badge = score >= 80 ? "Gold Scholar" : "Keep Practicing";

console.log("5 == '5' (Loose):", 5 == '5');
console.log("5 === '5' (Strict):", 5 === '5');
console.log("Earned Badge:", badge);

const userCount = 0;
console.log("Using ?? with 0:", userCount ?? 10);`,
    extraNotes: 'In JavaScript, there are exactly 6 common **falsy** values: `false`, `0`, `""` (empty string), `null`, `undefined`, and `NaN`. Everything else (including `[]` and `{}`) is truthy!',
    fillBlank: {
      prompt: 'Use the strict equality operator to check if x is equal to 10 in both value and type:',
      codeBefore: 'if (x ',
      answer: '===',
      codeAfter: ' 10) {\n  console.log("Exact match!");\n}',
      hint: 'Three equals signs.'
    },
    quiz: {
      question: 'What does 0 || 42 evaluate to versus 0 ?? 42 in JavaScript?',
      options: ['Both return 0', 'Both return 42', '0 || 42 returns 42 (because 0 is falsy), while 0 ?? 42 returns 0 (because 0 is not null or undefined)', 'It throws a SyntaxError'],
      correct: 2,
      explanation: '|| checks for any falsy value (including 0 and ""), whereas ?? only falls back on null or undefined.'
    },
    interview: {
      company: 'Meta',
      question: 'Why does [] == ![] evaluate to true in JavaScript?',
      answer: '![] is false (since arrays are truthy). Then [] == false coerces both sides to numbers: Number([]) is 0 and Number(false) is 0, so 0 == 0 is true! Always use ===.'
    }
  },
  {
    id: 'js-loops',
    title: 'JS Loops (for, for...of, while) & Iteration',
    readTime: '6 mins',
    summary: 'Loops repeat a block of code cleanly. Use classic for (let i = 0; ...) when you need the index, for (const item of array) to iterate values directly, and while when the number of iterations isn\'t known upfront.',
    analogy: 'A loop is like a music playlist on repeat—it steps through each song one by one until the playlist ends or you hit stop (break).',
    takeaways: [
      'Use for (const item of arr) for arrays and strings; use Object.entries(obj) for objects.',
      'break exits the loop immediately; continue skips the rest of the current iteration and jumps to the next.',
      'Be careful not to confuse for...of (values of an iterable) with for...in (keys of an object).'
    ],
    syntaxRows: [
      { syntax: 'for (let i=0; i<n; i++)', description: 'Standard index counter loop', example: 'for (let i = 0; i < 5; i++)' },
      { syntax: 'for (const x of arr)', description: 'Iterates directly over array/string values', example: 'for (const tag of tags)' },
      { syntax: 'break / continue', description: 'Exits loop early / skips current step', example: 'if (x < 0) continue;' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Looping Over Arrays with for...of',
    exampleCode: `const topics = ["HTML5", "CSS3", "JavaScript", "React 19", "SQL"];
let totalChars = 0;

for (const topic of topics) {
  totalChars += topic.length;
  console.log("Track:", topic, "(Length:", topic.length + ")");
}
console.log("Total characters:", totalChars);`,
    extraNotes: 'Need both the index and value in a `for...of` loop? Use `for (const [index, value] of array.entries())`!',
    fillBlank: {
      prompt: 'Complete the loop keyword to iterate over each value in the colors array:',
      codeBefore: 'for (const color ',
      answer: 'of',
      codeAfter: ' colors) {\n  console.log(color);\n}',
      hint: 'A 2-letter word: for...of iterates values.'
    },
    quiz: {
      question: 'What is the difference between for...of and for...in in JavaScript?',
      options: ['for...of iterates over values of an iterable (like an Array); for...in iterates over enumerable property keys of an object', 'They are identical', 'for...in is faster for arrays', 'for...of only works on numbers'],
      correct: 0,
      explanation: 'Always use for...of for arrays (values) and for...in or Object.keys() for object keys.'
    },
    interview: {
      company: 'PayPal',
      question: 'Can you use break or return to exit a .forEach() callback early?',
      answer: 'No! Returning inside .forEach() only exits the current callback iteration (like continue). If you need early termination, use a standard for...of loop or .some() / .find().'
    }
  },
  {
    id: 'js-funcs',
    title: 'JS Functions, Arrow Syntax & Parameters',
    readTime: '7 mins',
    summary: 'Functions are reusable blocks of code that take inputs (parameters), perform logic, and return an output. ES6 Arrow Functions ((a, b) => a + b) provide a concise syntax and lexical "this" binding.',
    analogy: 'A function is like a coffee machine: you pass in coffee beans and water (parameters), it brews inside, and it hands you a cup of espresso (return value).',
    takeaways: [
      'Function declarations (function add() {}) are hoisted; arrow functions (const add = () => {}) are not.',
      'Default parameters (function greet(name = "Student")) prevent undefined values.',
      'Rest parameters (...nums) gather any number of arguments into a real Array.'
    ],
    syntaxRows: [
      { syntax: 'function fn(a, b) { return a+b; }', description: 'Standard function declaration', example: 'function square(x) { return x * x; }' },
      { syntax: 'const fn = (a, b) => a + b;', description: 'Concise ES6 arrow function with implicit return', example: 'const double = x => x * 2;' },
      { syntax: 'function fn(x = 10)', description: 'Default parameter value if x is undefined', example: 'function connect(port = 3000)' },
      { syntax: 'function sum(...nums)', description: 'Rest parameter collects remaining args into array', example: 'sum(1, 2, 3, 4)' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Arrow Functions, Default & Rest Parameters',
    exampleCode: `const calculateTotal = (taxRate = 0.1, ...prices) => {
  const subtotal = prices.reduce((sum, p) => sum + p, 0);
  return subtotal + subtotal * taxRate;
};

console.log("Order 1 Total:", calculateTotal(0.1, 100, 200, 50));
console.log("Order 2 (Default 10% tax):", calculateTotal(undefined, 80, 20));`,
    extraNotes: 'If an arrow function returns an object literal implicitly, wrap it in parentheses: `const makeUser = name => ({ name, active: true });`.',
    fillBlank: {
      prompt: 'Complete the ES6 arrow function syntax that doubles a number x:',
      codeBefore: 'const double = (x) ',
      answer: '=>',
      codeAfter: ' x * 2;',
      hint: 'An equals sign followed by a greater-than sign.'
    },
    quiz: {
      question: 'How do Arrow Functions handle the "this" keyword differently from regular functions?',
      options: ['Arrow functions do not have their own "this"; they inherit "this" lexically from the surrounding scope', 'Arrow functions bind "this" to window always', 'Arrow functions cannot access variables', 'There is no difference'],
      correct: 0,
      explanation: 'Arrow functions capture "this" from the enclosing lexical context where they are defined.'
    },
    interview: {
      company: 'Atlassian',
      question: 'What is the difference between a Function Declaration and a Function Expression regarding hoisting?',
      answer: 'Function declarations (function foo(){}) are hoisted completely so they can be called before their definition line. Function expressions (const foo = () => {}) are not initialized until execution reaches that line.'
    }
  },
  {
    id: 'js-arrays',
    title: 'JS Arrays & Map, Filter, Reduce',
    readTime: '8 mins',
    summary: 'JavaScript arrays come with powerful functional methods: .map() transforms every element into a new array, .filter() keeps elements matching a condition, and .reduce() combines all elements into a single value.',
    analogy: '.map() is an assembly line that paints every car; .filter() is a quality inspector that only lets passing cars through; .reduce() crushes all items into one summary total.',
    takeaways: [
      'map(), filter(), and slice() are non-mutating—they return a brand new array without modifying the original!',
      'push(), pop(), sort(), and splice() mutate the original array in place.',
      'Use the spread operator [...arr, newItem] to copy or append to arrays immutably (critical for React state!).'
    ],
    syntaxRows: [
      { syntax: 'arr.map(x => x * 2)', description: 'Transforms each item into a new array of same length', example: '[1,2,3].map(n => n * 10)' },
      { syntax: 'arr.filter(x => x > 5)', description: 'Returns new array with items passing test', example: 'scores.filter(s => s >= 60)' },
      { syntax: 'arr.reduce((acc, x) => acc+x, 0)', description: 'Accumulates array into a single value', example: 'nums.reduce((a, b) => a + b, 0)' },
      { syntax: 'arr.find(x => x.id === 1)', description: 'Returns the FIRST matching element (or undefined)', example: 'users.find(u => u.active)' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Chaining Filter, Map & Reduce on Student Data',
    exampleCode: `const students = [
  { name: "Aarav", score: 92 },
  { name: "Diya", score: 58 },
  { name: "Kabir", score: 88 },
  { name: "Zoya", score: 95 }
];

const honorRollNames = students
  .filter(s => s.score >= 85)
  .map(s => s.name.toUpperCase());

const averageScore = students.reduce((sum, s) => sum + s.score, 0) / students.length;

console.log("Honor Roll (>=85):", honorRollNames);
console.log("Class Average:", averageScore);`,
    extraNotes: 'Watch out for `[10, 2, 5].sort()` in JS! By default, `.sort()` converts numbers to strings and sorts alphabetically (`[10, 2, 5]`). Always pass a comparator: `arr.sort((a, b) => a - b)`.',
    fillBlank: {
      prompt: 'Use the array method that creates a new array containing only numbers greater than 10:',
      codeBefore: 'const bigNums = nums.',
      answer: 'filter',
      codeAfter: '(n => n > 10);',
      hint: 'A 6-letter method that keeps matching items.'
    },
    quiz: {
      question: 'Why does [10, 5, 20].sort() return [10, 20, 5] in JavaScript if no callback is passed?',
      options: ['Because JavaScript sorts in descending order', 'Because Array.prototype.sort() converts elements to UTF-16 strings by default ("10" comes before "20" which comes before "5")', 'It is a random shuffle', 'Arrays cannot store numbers'],
      correct: 1,
      explanation: 'Default .sort() compares strings lexicographically. Always use .sort((a, b) => a - b) for numeric sorting.'
    },
    interview: {
      company: 'Flipkart / Walmart',
      question: 'What happens if you call .reduce() on an empty array [] without providing an initialValue?',
      answer: 'JavaScript throws a TypeError: Reduce of empty array with no initial value. Always pass an initial accumulator (like 0 or {}) as the second argument to .reduce().'
    }
  },
  {
    id: 'js-objects',
    title: 'JS Objects, Destructuring, JSON & Classes',
    readTime: '8 mins',
    summary: 'Objects store collections of key-value properties. ES6 Destructuring (const { name, role } = user) extracts properties cleanly, and JSON (JavaScript Object Notation) is the universal format for sending data over APIs.',
    analogy: 'An Object is a digital ID card with labeled fields (name, email, level); JSON.stringify() packs that card into a flat text envelope to send over the internet.',
    takeaways: [
      'Use destructuring const { id, title } = course; to extract object fields in one line.',
      'JSON.stringify(obj) converts a JS object into a JSON string; JSON.parse(str) converts it back.',
      'Object.keys(obj), Object.values(obj), and Object.entries(obj) return arrays for easy looping.'
    ],
    syntaxRows: [
      { syntax: 'const { a, b } = obj;', description: 'Object destructuring assignment', example: 'const { name, xp } = user;' },
      { syntax: '{ ...obj, xp: 200 }', description: 'Object spread (shallow copy + override)', example: 'const updated = { ...user, level: 2 };' },
      { syntax: 'JSON.stringify(obj)', description: 'Serializes JS object to JSON string', example: 'JSON.stringify({ ok: true })' },
      { syntax: 'JSON.parse(jsonStr)', description: 'Parses JSON string back to JS object', example: 'JSON.parse(\'{"ok":true}\')' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Object Destructuring, Spread & JSON Serialization',
    exampleCode: `const developer = {
  name: "Priya",
  role: "SDE-1",
  skills: ["TypeScript", "React", "SQL"]
};

const { name, role } = developer;
const promoted = { ...developer, role: "SDE-2", xp: 1500 };

console.log(\`\${name} started as \${role}\`);
console.log("Promoted JSON:", JSON.stringify(promoted, null, 2));`,
    extraNotes: 'Need a deep clone of a nested object in modern JS? Use the built-in `structuredClone(obj)` function!',
    fillBlank: {
      prompt: 'Convert a JSON string response back into a JavaScript object:',
      codeBefore: 'const data = JSON.',
      answer: 'parse',
      codeAfter: '(jsonString);',
      hint: 'Opposite of stringify (5 letters).'
    },
    quiz: {
      question: 'Does the object spread syntax { ...original } perform a shallow copy or a deep copy?',
      options: ['Deep copy of all nested objects', 'Shallow copy (top-level properties are copied, but nested objects still share memory references)', 'It mutates the original object', 'It converts the object to a string'],
      correct: 1,
      explanation: 'Spread {...obj} and Object.assign() only copy top-level keys shallowly. Use structuredClone(obj) for deep copying nested objects.'
    },
    interview: {
      company: 'Microsoft',
      question: 'What values are silently omitted or changed when you pass an object to JSON.stringify()?',
      answer: 'Properties with values of undefined, Functions, and Symbols are completely omitted from the JSON output, and Date objects are converted into ISO strings.'
    }
  },
  {
    id: 'js-dom',
    title: 'JS HTML DOM Manipulation & Events',
    readTime: '8 mins',
    summary: 'The HTML DOM (Document Object Model) is a tree of objects created by the browser. JavaScript can select elements with querySelector(), change text/styles dynamically, and listen for clicks or keyboard events.',
    analogy: 'Event Bubbling is like dropping a pebble in a pond—clicking a <button> triggers the click on the button first, then ripples upward to its parent <div>, <main>, and <body>.',
    takeaways: [
      'document.querySelector(".card") selects the first match using any CSS selector.',
      'element.addEventListener("click", handler) attaches an event listener without overwriting existing handlers.',
      'Event Delegation attaches ONE listener on a parent <ul> to handle clicks on 1,000 child <li> items via event.target!'
    ],
    syntaxRows: [
      { syntax: 'document.querySelector(sel)', description: 'Selects first matching element via CSS selector', example: 'document.querySelector("#submit-btn")' },
      { syntax: 'el.textContent = "Hi"', description: 'Safely updates text (prevents XSS injection)', example: 'titleEl.textContent = "Updated!";' },
      { syntax: 'el.classList.toggle("open")', description: 'Adds or removes a CSS class', example: 'modal.classList.add("visible")' },
      { syntax: 'el.addEventListener("click", fn)', description: 'Registers an event callback', example: 'btn.addEventListener("click", onRun)' },
    ],
    exampleLang: 'html',
    exampleTitle: 'Interactive DOM Counter in HTML + JS',
    exampleCode: `<div style="font-family: sans-serif; background: #0f172a; color: white; padding: 20px; border-radius: 12px; text-align: center;">
  <h3 id="count-display" style="margin: 0 0 12px 0; color: #34d399; font-size: 22px;">Clicks: 0</h3>
  <button onclick="const el = document.getElementById('count-display'); const n = parseInt(el.textContent.split(': ')[1]) + 1; el.textContent = 'Clicks: ' + n;" style="padding: 10px 18px; background: #059669; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
    Click Me (+1)
  </button>
</div>`,
    extraNotes: 'Always prefer `element.textContent = userText` over `element.innerHTML = userText` when displaying user input so attackers cannot inject `<script>` tags (XSS).',
    fillBlank: {
      prompt: 'Complete the DOM method used to attach a click handler to a button:',
      codeBefore: 'button.',
      answer: 'addEventListener',
      codeAfter: '("click", handleClick);',
      hint: 'Starts with addEvent...'
    },
    quiz: {
      question: 'What is "Event Delegation" in the DOM?',
      options: ['Attaching a separate listener to every single button on the page', 'Attaching a single event listener to a parent container and using event.target to handle events from child elements via event bubbling', 'Blocking all events with event.preventDefault()', 'Running events in a Web Worker'],
      correct: 1,
      explanation: 'Event Delegation leverages event bubbling so a single parent listener can efficiently manage hundreds of dynamic child elements.'
    },
    interview: {
      company: 'Google',
      question: 'What is the difference between event.preventDefault() and event.stopPropagation()?',
      answer: 'preventDefault() stops the browser\'s default action (like a form refreshing the page or a link navigating). stopPropagation() stops the event from bubbling up to parent DOM elements.'
    }
  },
  {
    id: 'js-async',
    title: 'JS Promises, Async/Await & Fetch API',
    readTime: '9 mins',
    summary: 'A Promise represents an asynchronous operation that is either Pending, Fulfilled (resolved), or Rejected. Modern async/await syntax lets you write Promise-based code that reads cleanly like synchronous code.',
    analogy: 'A Promise is like the buzzer you get at a busy restaurant: you hold the buzzer (Pending) while your table is free to chat, and when the food is ready it buzzes (Resolved)!',
    takeaways: [
      'An async function ALWAYS returns a Promise.',
      'await pauses execution inside the async function until the Promise resolves, without blocking the main browser thread.',
      'Use Promise.all([fetchA(), fetchB()]) to run independent API calls in parallel instead of waiting sequentially!'
    ],
    syntaxRows: [
      { syntax: 'async function load() { ... }', description: 'Declares an asynchronous function', example: 'const getData = async () => {}' },
      { syntax: 'const res = await fetch(url);', description: 'Waits for Promise to resolve', example: 'const json = await res.json();' },
      { syntax: 'try { ... } catch (err) { ... }', description: 'Catches rejected Promises in async/await', example: 'try { await api(); } catch (e) {}' },
      { syntax: 'Promise.all([p1, p2])', description: 'Runs multiple Promises concurrently in parallel', example: 'await Promise.all([req1, req2])' },
    ],
    exampleLang: 'javascript',
    exampleTitle: 'Simulating an Async API Request with Promises',
    exampleCode: `function simulateApiCall(endpoint, ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ endpoint, status: 200, items: 42 }), ms);
  });
}

simulateApiCall("/api/tutorials", 10).then(res => {
  console.log("Resolved API Response:", JSON.stringify(res));
});`,
    extraNotes: '`fetch()` only rejects its Promise on a network failure—it does NOT automatically throw on HTTP `404` or `500`. Always check `if (!response.ok) throw new Error(...)`!',
    fillBlank: {
      prompt: 'Add the keyword that pauses inside an async function until a Promise settles:',
      codeBefore: 'async function getUser() {\n  const response = ',
      answer: 'await',
      codeAfter: ' fetch("/api/user");\n}',
      hint: 'A 5-letter keyword paired with async.'
    },
    quiz: {
      question: 'If you have 3 independent API calls that each take 1 second, how long does await Promise.all([call1(), call2(), call3()]) take?',
      options: ['3 seconds', 'Approximately 1 second (because all 3 run concurrently in parallel)', '0 seconds', '6 seconds'],
      correct: 1,
      explanation: 'Promise.all fires all promises concurrently and resolves as soon as the slowest one finishes (~1 second total).'
    },
    interview: {
      company: 'Uber / Stripe',
      question: 'What is the difference between Promise.all() and Promise.allSettled()?',
      answer: 'Promise.all() short-circuits and rejects immediately if ANY single promise fails. Promise.allSettled() waits for all promises to finish regardless of success or failure and returns an array of { status: "fulfilled" | "rejected" } results.'
    }
  }
];

export const GENERATED_W3_LESSONS: Record<string, LessonContent> = {};

for (const bp of LESSON_BLUEPRINTS) {
  const tableMd = bp.syntaxRows
    .map(r => `- \`${r.syntax}\` — **${r.description}** (e.g., \`${r.example}\`)`)
    .join('\n');

  GENERATED_W3_LESSONS[bp.id] = {
    id: bp.id,
    title: bp.title,
    estimatedReadingTime: bp.readTime,
    beginnerSummary: bp.summary,
    realWorldAnalogy: bp.analogy,
    keyTakeaways: bp.takeaways,
    syntaxCheatTable: bp.syntaxRows,
    fillBlankExercise: bp.fillBlank,
    contentMarkdown: `# ${bp.title}

## 1. Concept Explained Simply
${bp.summary}

**Real-World Analogy:** ${bp.analogy}

## 2. Example: ${bp.exampleTitle}
Click **"Try it Yourself →"** on the code box below to run and modify this example immediately in the live playground:

\`\`\`${bp.exampleLang}
${bp.exampleCode}
\`\`\`

## 3. Quick Syntax & Reference Guide
${tableMd}

## 4. Pro Tip for Students & Interviews
${bp.extraNotes}`,
    quizzes: [
      {
        id: `${bp.id}-q1`,
        question: bp.quiz.question,
        options: bp.quiz.options,
        correctAnswerIndex: bp.quiz.correct,
        explanation: bp.quiz.explanation
      }
    ],
    codingChallenge: {
      title: `Try It Yourself: ${bp.exampleTitle}`,
      description: 'Edit the code below and click Run Code to see the live result immediately.',
      language: bp.exampleLang,
      starterCode: bp.exampleCode,
      solutionCode: bp.exampleCode,
      hint: bp.fillBlank.hint
    },
    interviewQuestions: [
      {
        companyTag: bp.interview.company,
        question: bp.interview.question,
        answer: bp.interview.answer
      }
    ],
    resources: [
      { title: `${bp.title} — Code It Out Official Engineering Reference`, type: 'Documentation', authorOrSource: 'Code It Out Academy' }
    ]
  };
}
