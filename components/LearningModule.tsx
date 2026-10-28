import React, { useState, useEffect } from 'react';
import { Course, CourseModule, LessonContent, Category } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { db } from '../services/db';
import { getCurriculumLesson } from '../services/curriculum';
import CodePlayground from './CodePlayground';
import QuizComponent from './QuizComponent';

export const COURSES: Course[] = [
  {
    id: 'c6',
    title: 'System Design & Distributed Systems',
    category: Category.SYSTEM_DESIGN,
    icon: 'cloud',
    modules: [
      { id: 'sd-1', title: 'Scalability Basics', description: 'Vertical vs Horizontal Scaling, QPS Math & SPOF', difficulty: 'Beginner', isLocked: false },
      { id: 'sd-2', title: 'Load Balancing & Consistent Hashing', description: 'L4 vs L7, Maglev, Virtual Nodes & Direct Server Return', difficulty: 'Intermediate', isLocked: false },
      { id: 'sd-3', title: 'Caching Strategies', description: 'Cache-Aside, Write-Through, LRU, Bloom Filters & Stampedes', difficulty: 'Intermediate', isLocked: false },
      { id: 'sd-4', title: 'Database Sharding', description: 'Partition Keys, Scatter-Gather & 2-Phase Commit', difficulty: 'Advanced', isLocked: false },
      { id: 'sd-5', title: 'Message Queues & Events', description: 'Kafka vs RabbitMQ, Partition Ordering & Idempotency', difficulty: 'Advanced', isLocked: false },
      { id: 'sd-6', title: 'Microservices & Service Mesh', description: 'Envoy, Circuit Breakers, Bulkheads & Distributed Tracing', difficulty: 'Advanced', isLocked: false },
      { id: 'sd-7', title: 'CAP & PACELC Theorem', description: 'Linearizability, Quorums (W+R>N) & Spanner TrueTime', difficulty: 'Expert', isLocked: false },
      { id: 'sd-8', title: 'Design URL Shortener', description: 'Base62 Encoding, Token Range Allocation & 301 vs 302', difficulty: 'Expert', isLocked: false },
      { id: 'sd-9', title: 'Design Twitter News Feed', description: 'Fan-out on Write vs Pull, Redis Lists & Celebrity Hybrid', difficulty: 'Expert', isLocked: false },
    ]
  },
  {
    id: 'c5',
    title: 'Distributed DBMS Internals',
    category: Category.DBMS,
    icon: 'database',
    modules: [
      { id: 'db-1', title: 'Storage Engines & Row vs Columnar', description: 'Buffer Pool, Volcano Iterator & OLTP vs OLAP', difficulty: 'Beginner', isLocked: false },
      { id: 'db-2', title: 'Schema Modeling at Scale', description: 'Cardinality, Junction Tables & Why FAANG Bans DB FKs', difficulty: 'Beginner', isLocked: false },
      { id: 'db-3', title: 'Relational Model & Keys', description: 'Surrogate Keys, UUIDv7 vs v4 & Clustering Indexes', difficulty: 'Beginner', isLocked: false },
      { id: 'db-4', title: 'Normalization & De-normalization', description: '1NF to BCNF & Intentional De-normalization for High Read', difficulty: 'Intermediate', isLocked: false },
      { id: 'db-5', title: 'SQL Deep Dive & Query Plans', description: 'Window Functions, CTEs, Index Scans & Covering Indexes', difficulty: 'Intermediate', isLocked: false },
      { id: 'db-6', title: 'Transactions & ACID (WAL)', description: 'Write-Ahead Logging, ARIES, fsync & Checkpointing', difficulty: 'Advanced', isLocked: false },
      { id: 'db-7', title: 'Indexing: B+ Trees vs LSM Trees', description: 'Page Splits, SSTables, Write Amplification & RocksDB', difficulty: 'Advanced', isLocked: false },
      { id: 'db-8', title: 'Concurrency: MVCC & 2PL', description: 'Snapshot Isolation, xmin/xmax, Write Skew & Phantoms', difficulty: 'Expert', isLocked: false },
    ]
  },
  {
    id: 'c3',
    title: 'Operating Systems & Concurrency',
    category: Category.OOPS,
    icon: 'os',
    modules: [
      { id: 'os-1', title: 'Process vs Thread Internals', description: 'Virtual Memory Map, PCB, TLB Flush & Context Switch Cost', difficulty: 'Beginner', isLocked: false },
      { id: 'os-2', title: 'CPU Scheduling & Linux CFS', description: 'vruntime Red-Black Tree, Quantum & K8s CFS Throttling', difficulty: 'Intermediate', isLocked: false },
      { id: 'os-3', title: 'Virtual Memory & Paging', description: '4-Level Page Tables, CR3, Page Faults & THP Caveats', difficulty: 'Intermediate', isLocked: false },
      { id: 'os-4', title: 'Deadlocks & Coffman Conditions', description: 'Strict Lock Ordering, Cycle Detection & Priority Inversion', difficulty: 'Advanced', isLocked: false },
      { id: 'os-5', title: 'File Systems & Inodes', description: 'Hard Links vs Soft Links, Inode Tables & Ext4 Block Maps', difficulty: 'Intermediate', isLocked: false },
      { id: 'os-6', title: 'Synchronization: Mutex & Futex', description: 'Atomic CAS, Futex Fast-Path, Semaphores & ABA Problem', difficulty: 'Advanced', isLocked: false },
    ]
  },
  {
    id: 'c4',
    title: 'Advanced Data Structures & Algorithms',
    category: Category.DSA,
    icon: 'code',
    modules: [
      { id: 'ds-1', title: 'Complexity & Amortization', description: 'Amortized Array Doubling Proof & Master Theorem', difficulty: 'Beginner', isLocked: false },
      { id: 'ds-2', title: 'Arrays & Two Pointers', description: 'Cache Line Locality, Opposite Pointers & Sliding Window', difficulty: 'Beginner', isLocked: false },
      { id: 'ds-3', title: 'Linked Lists & Floyd Cycle', description: 'Pointer Reversals, Sentinel Nodes & Tortoise and Hare', difficulty: 'Intermediate', isLocked: false },
      { id: 'ds-4', title: 'Monotonic Stacks & Deques', description: 'Next Greater Element, Daily Temperatures & Sliding Max', difficulty: 'Intermediate', isLocked: false },
      { id: 'ds-5', title: 'Trees & Balanced BSTs', description: 'In-Order Invariants, Lowest Common Ancestor & Serialization', difficulty: 'Intermediate', isLocked: false },
      { id: 'ds-6', title: 'Graphs: BFS, DFS & Dijkstra', description: 'Topological Sort (Kahn), Shortest Path & Contraction', difficulty: 'Advanced', isLocked: false },
      { id: 'ds-7', title: 'Dynamic Programming Patterns', description: '0/1 Knapsack, Space Optimization & Longest Subsequence', difficulty: 'Expert', isLocked: false },
    ]
  },
  {
    id: 'c7',
    title: 'Computer Networks & Distributed Protocols',
    category: Category.NETWORKS,
    icon: 'network',
    modules: [
      { id: 'cn-1', title: 'OSI 7-Layer Encapsulation', description: 'PDUs, Ethernet Frames, IP Packets & ARP Protocol', difficulty: 'Beginner', isLocked: false },
      { id: 'cn-2', title: 'TCP 3-Way Handshake & BBR', description: 'SYN Cookies, Flow Control, TIME_WAIT & Congestion', difficulty: 'Beginner', isLocked: false },
      { id: 'cn-3', title: 'HTTP/1.1 vs HTTP/2 vs HTTP/3', description: 'Binary Framing, Head-of-Line Blocking, QUIC & UDP', difficulty: 'Intermediate', isLocked: false },
      { id: 'cn-4', title: 'DNS Resolution & BGP Anycast', description: 'Recursive Hierarchy, Authoritative Servers & TTL Caching', difficulty: 'Intermediate', isLocked: false },
      { id: 'cn-5', title: 'WebSockets & Socket Scaling', description: 'HTTP Upgrade Handshake, Linux Epoll & ulimit Tuning', difficulty: 'Intermediate', isLocked: false },
      { id: 'cn-6', title: 'Network Security: TLS, CORS & XSS', description: 'TLS 1.3 0-RTT, HttpOnly Cookies, CSRF & Origin Rules', difficulty: 'Advanced', isLocked: false },
      { id: 'cn-7', title: 'Proxies & Load Balancing', description: 'Nginx, HAProxy, Envoy xDS & Direct Server Return', difficulty: 'Advanced', isLocked: false },
      { id: 'cn-8', title: 'CDNs & Edge Caching', description: 'Cache-Control Directives, Origin Shields & Tag Purges', difficulty: 'Advanced', isLocked: false },
      { id: 'cn-9', title: 'REST vs GraphQL vs gRPC', description: 'Protocol Buffers, HTTP/2 Multiplexing & IDL Schemas', difficulty: 'Advanced', isLocked: false },
      { id: 'cn-10', title: 'Network Diagnostics & tcpdump', description: 'tcpdump, ss, mtr, traceroute TTL & CLOSE_WAIT Bugs', difficulty: 'Expert', isLocked: false },
      { id: 'cn-11', title: 'FAANG Interview: Design a CDN', description: 'Global Edge PoPs, Consistent Hashing & Cache Shields', difficulty: 'Expert', isLocked: false },
      { id: 'cn-12', title: 'FAANG Interview: Video Streaming', description: 'Netflix/YouTube Chunking, HLS/DASH & Adaptive Bitrate', difficulty: 'Expert', isLocked: false },
    ]
  },
  {
    id: 'c1',
    title: 'Python Internals & Execution Model',
    category: Category.PYTHON,
    icon: 'python',
    modules: [
      { id: 'py-1', title: 'CPython & Global Interpreter Lock', description: 'ceval.c Opcode Loop, PyObject & CPU-bound Concurrency', difficulty: 'Beginner', isLocked: false },
      { id: 'py-2', title: 'Memory & Generational GC', description: 'Reference Counting, Cycles, Small Int Cache & Copy-On-Write', difficulty: 'Beginner', isLocked: false },
      { id: 'py-3', title: 'Bytecode & PVM Stack Machine', description: 'dis Module, Opcode Evaluation & Comprehension Speedups', difficulty: 'Beginner', isLocked: false },
      { id: 'py-4', title: 'Scoping (LEGB) & Closures', description: 'Lexical Cells, nonlocal, Decorators & Default Mutability', difficulty: 'Intermediate', isLocked: false },
      { id: 'py-5', title: 'Lists vs Tuples: Memory Layout', description: 'Dynamic Array Resizing Formula, __slots__ & Immutability', difficulty: 'Intermediate', isLocked: false },
    ]
  },
  {
    id: 'c2',
    title: 'Computer Science Fundamentals',
    category: Category.CS_CORE,
    icon: 'cpu',
    modules: [
      { id: 'cs-1', title: 'Number Systems & Floating Point', description: "Two's Complement & IEEE 754 Float Precision Traps", difficulty: 'Beginner', isLocked: false },
      { id: 'cs-2', title: 'Boolean Logic & Bitwise Tricks', description: 'Bitmasks, Power of Two, Brian Kernighan & Single Number', difficulty: 'Beginner', isLocked: false },
      { id: 'cs-3', title: 'Hardware Architecture & Caching', description: 'L1/L2/L3 Latencies, 64B Cache Lines & False Sharing', difficulty: 'Intermediate', isLocked: false },
      { id: 'cs-4', title: 'Compilers, Interpreters & JIT', description: 'Lexing, AST, SSA Intermediate Form & V8 JIT Profiling', difficulty: 'Advanced', isLocked: false },
      { id: 'cs-5', title: 'Networking Basics & Epoll', description: 'I/O Multiplexing, C10K Problem & select vs epoll', difficulty: 'Intermediate', isLocked: false },
    ]
  }
];

interface Props {
  onComplete: (moduleId: string) => void;
  initialCourseId?: string;
  initialModuleId?: string;
}

type DeckTab = 'code' | 'quiz' | 'interview' | 'resources';

const LearningModule: React.FC<Props> = ({ onComplete, initialCourseId, initialModuleId }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState<CourseModule | null>(null);
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [activeDeckTab, setActiveDeckTab] = useState<DeckTab>('code');
  const [mobileZone, setMobileZone] = useState<'theory' | 'deck'>('theory');
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Sync initialCourseId / initialModuleId from deep links or command palette
  useEffect(() => {
    if (initialCourseId) {
      const foundCourse = COURSES.find(c => c.id === initialCourseId);
      if (foundCourse) {
        setSelectedCourse(foundCourse);
        if (initialModuleId) {
          const foundMod = foundCourse.modules.find(m => m.id === initialModuleId);
          if (foundMod) {
            setActiveModule(foundMod);
            setMobileZone('theory');
          }
        }
      }
    }
  }, [initialCourseId, initialModuleId]);

  // Sync lesson content synchronously from in-memory curriculum
  useEffect(() => {
    if (!activeModule) {
      setLessonContent(null);
      return;
    }

    // Resolve immediately with zero latency
    const content = getCurriculumLesson(activeModule.id) || db.getLesson(activeModule.id);
    if (content) {
      setLessonContent(content);
    } else {
      // Fallback
      setLessonContent({
        id: activeModule.id,
        title: activeModule.title,
        estimatedReadingTime: '15 mins',
        contentMarkdown: `# ${activeModule.title}\n\n${activeModule.description}\n\n*Reviewing curriculum materials.*`,
        quizzes: [],
        interviewQuestions: [],
        resources: []
      });
    }

    // Check if bookmarked
    const user = db.getCurrentUser();
    if (user) {
      const bookmarks = db.getBookmarks(user.id);
      setIsBookmarked(bookmarks.some(b => b.moduleId === activeModule.id));
    }
  }, [activeModule]);

  const handleNextModule = () => {
    if (!selectedCourse || !activeModule) return;
    const currentIndex = selectedCourse.modules.findIndex(m => m.id === activeModule.id);
    if (currentIndex >= 0 && currentIndex < selectedCourse.modules.length - 1) {
      setActiveModule(selectedCourse.modules[currentIndex + 1]);
    } else {
      setActiveModule(null);
    }
  };

  const handlePreviousModule = () => {
    if (!selectedCourse || !activeModule) return;
    const currentIndex = selectedCourse.modules.findIndex(m => m.id === activeModule.id);
    if (currentIndex > 0) {
      setActiveModule(selectedCourse.modules[currentIndex - 1]);
    }
  };

  const handleBookmarkToggle = () => {
    if (!activeModule) return;
    const user = db.getCurrentUser();
    if (!user) return;

    if (isBookmarked) {
      const bookmarks = db.getBookmarks(user.id);
      const match = bookmarks.find(b => b.moduleId === activeModule.id);
      if (match) {
        db.removeBookmark(user.id, match.id);
        setIsBookmarked(false);
      }
    } else {
      setShowBookmarkModal(true);
    }
  };

  const handleSaveBookmark = () => {
    if (!activeModule) return;
    const user = db.getCurrentUser();
    if (user) {
      db.addBookmark(user.id, {
        id: Date.now().toString(),
        moduleId: activeModule.id,
        moduleTitle: activeModule.title,
        note: bookmarkNote || `Saved bookmark for ${activeModule.title}`,
        timestamp: Date.now()
      });
      setIsBookmarked(true);
      setShowBookmarkModal(false);
      setBookmarkNote('');
    }
  };

  // Filter courses by category tab
  const filteredCourses = selectedCategory === 'all'
    ? COURSES
    : COURSES.filter(c => c.category === selectedCategory);

  // VIEW 1: Pathways & Tracks Browser
  if (!selectedCourse) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-semibold tracking-wider uppercase text-blue-400 mb-2">
            Engineering Academy · FAANG SDE-2 Curriculum
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Computer Science & Systems Mastery
          </h1>
          <p className="text-slate-400 mt-2 max-w-3xl text-sm leading-relaxed">
            Zero synthetic filler. In-depth practical systems architecture, low-level OS internals, high-scale database mechanisms, and algorithmic trade-offs benchmarked for senior technical interviews.
          </p>
        </div>

        {/* Interactive Segmented Filter Controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900/80 rounded-xl border border-slate-800 mb-8 max-w-fit">
          {[
            { id: 'all', label: 'All Tracks' },
            { id: Category.SYSTEM_DESIGN, label: 'System Design' },
            { id: Category.DBMS, label: 'Distributed DBMS' },
            { id: Category.OOPS, label: 'Operating Systems' },
            { id: Category.DSA, label: 'Algorithms & DSA' },
            { id: Category.NETWORKS, label: 'Networks & Protocols' },
            { id: Category.PYTHON, label: 'Python Internals' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(() => {
            const currentUser = db.getCurrentUser();
          const userProgress = currentUser ? db.getUserProgress(currentUser.id) : [];

          // ⚡ Bolt: Replaced expensive O(N) .find() and sync localStorage reads inside map loop with O(1) hash map lookup
          // Expected Impact: Eliminates N+1 localStorage access overhead and reduces O(N*M) course rendering to O(N+M).
          // Calculated directly in render to avoid stale closures with non-reactive external db service.
          const progressMap = new Map();
          userProgress.forEach(p => progressMap.set(p.courseId, p));

          return filteredCourses.map(course => {
            const progress = progressMap.get(course.id) || null;
            const completedCount = progress?.completedModuleIds.length || 0;
            const pct = Math.round((completedCount / course.modules.length) * 100);

            return (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="group bg-[#161f30]/80 hover:bg-[#1a253a] border border-slate-800 hover:border-blue-500/40 rounded-2xl p-6 cursor-pointer transition-all duration-200 flex flex-col justify-between hover:shadow-xl hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                      <span className="text-xl">
                        {course.icon === 'cloud' ? '☁️' :
                         course.icon === 'database' ? '🗄️' :
                         course.icon === 'os' ? '🖥️' :
                         course.icon === 'code' ? '⚡' :
                         course.icon === 'network' ? '🌐' :
                         course.icon === 'python' ? '🐍' : '💻'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {course.modules.length} Modules
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors mb-2">
                    {course.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
                    <span>SDE-2 Practical</span>
                    <span aria-hidden="true">·</span>
                    <span>Runnable Sandboxes</span>
                    <span aria-hidden="true">·</span>
                    <span>ASCII Maps</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-2 font-mono">
                    <span>Progress</span>
                    <span>{completedCount} / {course.modules.length} completed ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          });
        })()}
        </div>
      </div>
    );
  }

  // VIEW 2: Modules Roadmap for Selected Course
  if (!activeModule) {
    const currentUser = db.getCurrentUser();
    const progress = currentUser ? db.getUserProgress(currentUser.id).find(p => p.courseId === selectedCourse.id) : null;
    const completedSet = new Set(progress?.completedModuleIds || []);

    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => setSelectedCourse(null)}
          className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Tracks
        </button>

        <div className="mb-8">
          <div className="text-xs font-semibold uppercase text-blue-400 tracking-wider mb-2">
            Track Roadmap · FAANG SDE-2
          </div>
          <h2 className="text-3xl font-bold text-white">{selectedCourse.title}</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            Step-by-step master roadmap covering production architectural trade-offs, internal algorithms, and coding sandboxes.
          </p>
        </div>

        <div className="space-y-3">
          {selectedCourse.modules.map((module, idx) => {
            const isCompleted = completedSet.has(module.id);
            return (
              <div
                key={module.id}
                onClick={() => setActiveModule(module)}
                className="bg-[#141b2a] border border-slate-800 hover:border-slate-600 p-5 rounded-xl transition-all cursor-pointer flex items-center justify-between group hover:bg-[#182133]"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-white text-base group-hover:text-blue-300 transition-colors">
                        {module.title}
                      </h4>
                      {isCompleted && (
                        <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{module.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    {module.difficulty}
                  </span>
                  <svg className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // VIEW 3: Interactive Two-Zone Workspace (Left Stage + Right Concept Deck)
  const currentIndex = selectedCourse.modules.findIndex(m => m.id === activeModule.id);
  const nextModule = selectedCourse.modules[currentIndex + 1];
  const prevModule = selectedCourse.modules[currentIndex - 1];

  return (
    <div className="min-h-full flex flex-col bg-[#0b0f19]">
      {/* Top Workspace Bar */}
      <div className="border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur-md px-4 py-3 sticky top-0 z-30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setActiveModule(null)}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">{selectedCourse.title}</span>
          </button>
          <span className="text-slate-600">/</span>
          <h2 className="text-sm font-bold text-white truncate">
            {activeModule.title}
          </h2>
          <span className="text-xs text-slate-400 hidden md:inline font-mono">
            · {lessonContent?.estimatedReadingTime || '15 mins'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark this Lesson"}
          >
            <svg className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>

          {prevModule && (
            <button
              onClick={handlePreviousModule}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition-colors"
            >
              Prev
            </button>
          )}

          {nextModule ? (
            <button
              onClick={handleNextModule}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1"
            >
              <span>Next</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => {
                const user = db.getCurrentUser();
                if (user && activeModule) {
                  db.markModuleComplete(user.id, selectedCourse.id, activeModule.id, 100);
                  onComplete(activeModule.id);
                }
                setActiveModule(null);
              }}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded-lg transition-colors"
            >
              Finish Track 🎉
            </button>
          )}
        </div>
      </div>

      {/* Mobile Surface Segmented Zone Switcher (< lg) */}
      <div className="lg:hidden flex bg-[#0d1320] border-b border-slate-800 p-1.5 gap-1.5 sticky top-[49px] z-20">
        <button
          onClick={() => setMobileZone('theory')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileZone === 'theory'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <span>📖 Concept & Trade-offs</span>
        </button>
        <button
          onClick={() => setMobileZone('deck')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileZone === 'deck'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <span>⚡ Lab & Sandbox</span>
          {lessonContent?.quizzes?.length ? (
            <span className="text-[10px] px-1.5 py-0.2 bg-blue-500/30 text-blue-200 rounded-full font-mono">
              Quiz
            </span>
          ) : null}
        </button>
      </div>

      {/* Main Two-Zone Two-Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
        {/* Left Zone: Deep-Dive Technical Stage (60% width on desktop, full on mobile when active) */}
        <div className={`lg:col-span-7 p-4 sm:p-6 lg:p-8 overflow-y-auto border-r border-slate-800/80 space-y-6 ${
          mobileZone === 'theory' ? 'block' : 'hidden lg:block'
        }`}>
          {lessonContent && (
            <div className="prose prose-invert max-w-none">
              <MarkdownRenderer content={lessonContent.contentMarkdown} />
            </div>
          )}

          {/* Quick jump to lab button on mobile */}
          <div className="lg:hidden pt-4 pb-6 border-t border-slate-800/60">
            <button
              onClick={() => setMobileZone('deck')}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
            >
              <span>Switch to Code Playground & Quiz</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Zone: Interactive Concept Deck (40% width on desktop, full on mobile when active) */}
        <div className={`lg:col-span-5 flex-col bg-[#0e1422] overflow-y-auto ${
          mobileZone === 'deck' ? 'flex' : 'hidden lg:flex'
        }`}>
          {/* Deck Tab Selector */}
          <div className="border-b border-slate-800 p-2 flex items-center gap-1 bg-slate-900/60 sticky top-0 z-20">
            {[
              { id: 'code', label: 'Code Sandbox' },
              { id: 'quiz', label: 'Scenario Quiz' },
              { id: 'interview', label: 'FAANG Questions' },
              { id: 'resources', label: 'Docs & Papers' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveDeckTab(tab.id as DeckTab)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap text-center ${
                  activeDeckTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Deck Body */}
          <div className="p-4 lg:p-6 flex-1 space-y-6">
            {/* TAB 1: Code Sandbox */}
            {activeDeckTab === 'code' && (
              <div>
                {lessonContent?.codingChallenge ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">
                        {lessonContent.codingChallenge.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {lessonContent.codingChallenge.description}
                      </p>
                    </div>

                    <div className="border border-slate-800 rounded-xl overflow-hidden shadow-lg bg-[#141b2b]">
                      <CodePlayground
                        initialCode={lessonContent.codingChallenge.starterCode}
                        language={lessonContent.codingChallenge.language}
                      />
                    </div>

                    {lessonContent.codingChallenge.hint && (
                      <div className="bg-blue-950/20 border border-blue-900/40 rounded-lg p-3 text-xs text-blue-300">
                        <span className="font-semibold text-blue-200">Engineering Hint: </span>
                        {lessonContent.codingChallenge.hint}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No coding challenge for this theoretical overview module.
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Scenario Quiz */}
            {activeDeckTab === 'quiz' && (
              <div>
                {lessonContent?.quizzes && lessonContent.quizzes.length > 0 ? (
                  <QuizComponent
                    questions={lessonContent.quizzes}
                    onComplete={(score) => {
                      const user = db.getCurrentUser();
                      if (user && activeModule) {
                        db.markModuleComplete(user.id, selectedCourse.id, activeModule.id, score);
                        onComplete(activeModule.id);
                      }
                    }}
                  />
                ) : (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No quiz questions available for this module.
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: FAANG Questions */}
            {activeDeckTab === 'interview' && (
              <div className="space-y-4">
                <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  Verified SDE-2 Interview Questions
                </div>
                {lessonContent?.interviewQuestions && lessonContent.interviewQuestions.length > 0 ? (
                  lessonContent.interviewQuestions.map((q, idx) => (
                    <div key={idx} className="bg-[#141b2a] border border-slate-800 rounded-xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-blue-400 font-mono">
                          {q.companyTag || 'FAANG'} Question
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-white leading-snug">
                        {q.question}
                      </div>
                      <div className="text-xs text-slate-400 bg-slate-900/80 p-3 rounded-lg leading-relaxed border border-slate-800/60 font-mono">
                        {q.answer}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No specific company interview records for this module.
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Resources */}
            {activeDeckTab === 'resources' && (
              <div className="space-y-4">
                <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  Authoritative Papers & Engineering Handbooks
                </div>
                {lessonContent?.resources && lessonContent.resources.length > 0 ? (
                  lessonContent.resources.map((res, idx) => (
                    <div key={idx} className="bg-[#141b2a] border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-bold text-white mb-1">{res.title}</div>
                        <div className="text-xs text-slate-400 font-mono">
                          {res.authorOrSource} · {res.type}
                        </div>
                      </div>
                      <span className="text-xs text-blue-400 font-medium shrink-0">Verified</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    Core curriculum is fully self-contained.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bookmark Modal */}
      {showBookmarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#161f30] w-full max-w-md rounded-2xl border border-slate-700 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Bookmark Module</h3>
            <p className="text-xs text-slate-400 mb-4">Add a personal engineering note to this topic for quick review later.</p>
            <textarea
              value={bookmarkNote}
              onChange={(e) => setBookmarkNote(e.target.value)}
              className="w-full bg-[#0b0f19] p-3 rounded-xl text-white text-sm mb-4 h-28 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 border border-slate-800 font-mono"
              placeholder="e.g. Remember to review virtual nodes consistent hashing ring math before interview..."
            />
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowBookmarkModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBookmark}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-lg shadow-md"
              >
                Save Bookmark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningModule;
