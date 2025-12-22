
import React, { useState, useEffect } from 'react';
import { Course, CourseModule, LessonContent, Category } from '../types';
import { generateLessonContent } from '../services/gemini';
import MarkdownRenderer from './MarkdownRenderer';
import { db } from '../services/db';
import CodePlayground from './CodePlayground';
import QuizComponent from './QuizComponent';

export const COURSES: Course[] = [
  {
    id: 'c1', title: 'Python Mastery', category: Category.PYTHON, icon: 'python',
    modules: [
      { id: 'py-1', title: 'Intro & History', description: 'Origins, Zen of Python, and Interpreter', difficulty: 'Beginner', isLocked: false },
      { id: 'py-2', title: 'Variables & Memory', description: 'Stack, Heap, and Object References', difficulty: 'Beginner', isLocked: false },
      { id: 'py-3', title: 'Control Flow', description: 'Conditionals, Loops, and Bytecode', difficulty: 'Beginner', isLocked: false },
      { id: 'py-4', title: 'Functions & Scope', description: 'LEGB Rule, Closures, and First-class citizens', difficulty: 'Intermediate', isLocked: false },
      { id: 'py-5', title: 'Lists & Tuples', description: 'Dynamic Arrays vs Immutability', difficulty: 'Intermediate', isLocked: false },
    ]
  },
  {
    id: 'c2', title: 'CS Fundamentals', category: Category.CS_CORE, icon: 'cpu',
    modules: [
      { id: 'cs-1', title: 'Number Systems', description: 'Binary, Octal, Hexadecimal Conversions', difficulty: 'Beginner', isLocked: false },
      { id: 'cs-2', title: 'Boolean Logic', description: 'AND, OR, NOT, XOR Gates', difficulty: 'Beginner', isLocked: false },
      { id: 'cs-3', title: 'Computer Architecture', description: 'CPU, ALU, Registers, Memory Hierarchy', difficulty: 'Intermediate', isLocked: false },
      { id: 'cs-4', title: 'Compilers & Interpreters', description: 'Lexing, Parsing, Code Generation', difficulty: 'Advanced', isLocked: false },
      { id: 'cs-5', title: 'Networking Basics', description: 'OSI Model, TCP/IP, HTTP', difficulty: 'Intermediate', isLocked: false },
    ]
  },
  {
    id: 'c3', title: 'Operating Systems', category: Category.OOPS, icon: 'os',
    modules: [
      { id: 'os-1', title: 'Process Management', description: 'Process vs Thread, PCB, States', difficulty: 'Beginner', isLocked: false },
      { id: 'os-2', title: 'CPU Scheduling', description: 'FCFS, SJF, Round Robin, Priority', difficulty: 'Intermediate', isLocked: false },
      { id: 'os-3', title: 'Memory Management', description: 'Paging, Segmentation, Virtual Memory', difficulty: 'Intermediate', isLocked: false },
      { id: 'os-4', title: 'Deadlocks', description: 'Detection, Prevention, Avoidance', difficulty: 'Advanced', isLocked: false },
      { id: 'os-5', title: 'File Systems', description: 'Inodes, FAT, NTFS, ext4', difficulty: 'Intermediate', isLocked: false },
      { id: 'os-6', title: 'Synchronization', description: 'Mutex, Semaphore, Monitors', difficulty: 'Advanced', isLocked: false },
    ]
  },
  {
    id: 'c4', title: 'Algorithms (DSA)', category: Category.DSA, icon: 'code',
    modules: [
      { id: 'ds-1', title: 'Complexity Analysis', description: 'Big O, Omega, Theta', difficulty: 'Beginner', isLocked: false },
      { id: 'ds-2', title: 'Arrays', description: 'Contiguous memory & Resizing', difficulty: 'Beginner', isLocked: false },
      { id: 'ds-3', title: 'Linked Lists', description: 'Pointers & Nodes', difficulty: 'Intermediate', isLocked: false },
      { id: 'ds-4', title: 'Stacks & Queues', description: 'LIFO, FIFO, Deque', difficulty: 'Intermediate', isLocked: false },
      { id: 'ds-5', title: 'Trees & BST', description: 'Binary Trees, Traversals, BST Operations', difficulty: 'Intermediate', isLocked: false },
      { id: 'ds-6', title: 'Graphs', description: 'BFS, DFS, Shortest Path', difficulty: 'Advanced', isLocked: false },
      { id: 'ds-7', title: 'Dynamic Programming', description: 'Memoization, Tabulation, Classic Problems', difficulty: 'Expert', isLocked: false },
    ]
  },
  {
    id: 'c5', title: 'DBMS', category: Category.DBMS, icon: 'database',
    modules: [
      { id: 'db-1', title: 'Introduction to DBMS', description: 'File System vs DBMS, Types of Databases', difficulty: 'Beginner', isLocked: false },
      { id: 'db-2', title: 'ER Model', description: 'Entities, Relationships, ER Diagrams', difficulty: 'Beginner', isLocked: false },
      { id: 'db-3', title: 'Relational Model', description: 'Tables, Keys, Constraints', difficulty: 'Beginner', isLocked: false },
      { id: 'db-4', title: 'Normalization', description: '1NF, 2NF, 3NF, BCNF', difficulty: 'Intermediate', isLocked: false },
      { id: 'db-5', title: 'SQL Deep Dive', description: 'Joins, Subqueries, Window Functions', difficulty: 'Intermediate', isLocked: false },
      { id: 'db-6', title: 'Transactions & ACID', description: 'Atomicity, Consistency, Isolation, Durability', difficulty: 'Advanced', isLocked: false },
      { id: 'db-7', title: 'Indexing', description: 'B-Trees, Hash Indexes, Query Optimization', difficulty: 'Advanced', isLocked: false },
      { id: 'db-8', title: 'Concurrency Control', description: 'Locks, 2PL, MVCC', difficulty: 'Expert', isLocked: false },
    ]
  },
  {
    id: 'c6', title: 'System Design', category: Category.SYSTEM_DESIGN, icon: 'cloud',
    modules: [
      { id: 'sd-1', title: 'Scalability Basics', description: 'Horizontal vs Vertical Scaling', difficulty: 'Beginner', isLocked: false },
      { id: 'sd-2', title: 'Load Balancing', description: 'Round Robin, Consistent Hashing', difficulty: 'Intermediate', isLocked: false },
      { id: 'sd-3', title: 'Caching', description: 'Redis, Memcached, CDN', difficulty: 'Intermediate', isLocked: false },
      { id: 'sd-4', title: 'Database Sharding', description: 'Partitioning Strategies, Replication', difficulty: 'Advanced', isLocked: false },
      { id: 'sd-5', title: 'Message Queues', description: 'Kafka, RabbitMQ, Event-Driven Architecture', difficulty: 'Advanced', isLocked: false },
      { id: 'sd-6', title: 'Microservices', description: 'Service Discovery, API Gateway', difficulty: 'Advanced', isLocked: false },
      { id: 'sd-7', title: 'CAP Theorem', description: 'Consistency, Availability, Partition Tolerance', difficulty: 'Expert', isLocked: false },
      { id: 'sd-8', title: 'Design URL Shortener', description: 'End-to-End System Design', difficulty: 'Expert', isLocked: false },
      { id: 'sd-9', title: 'Design Twitter', description: 'Feed Generation, Fan-out', difficulty: 'Expert', isLocked: false },
    ]
  },
];

interface Props {
  onComplete: (moduleId: string) => void;
}

const LearningModule: React.FC<Props> = ({ onComplete }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState<CourseModule | null>(null);
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState('');

  // --- PREFETCHING ENGINE ---
  useEffect(() => {
    if (!activeModule || !selectedCourse) return;

    const loadCurrentAndPrefetchNext = async () => {
      setLoading(true);
      setError(null);
      setLessonContent(null);
      // Don't scroll to top - let user stay at current position
      // Scroll will happen after content loads

      try {
        const content = await generateLessonContent(activeModule.id, activeModule.title, selectedCourse.category);
        setLessonContent(content);
        setLoading(false);

        const currentIndex = selectedCourse.modules.findIndex(m => m.id === activeModule.id);
        const nextModule = selectedCourse.modules[currentIndex + 1];

        if (nextModule && !db.hasLesson(nextModule.id)) {
          generateLessonContent(nextModule.id, nextModule.title, selectedCourse.category)
            .catch(e => console.warn(`[Prefetch] Failed for ${nextModule.id}`, e));
        }

      } catch (err: any) {
        setError(err.message || "Failed to load lesson.");
        setLoading(false);
      }
    };

    loadCurrentAndPrefetchNext();
  }, [activeModule, selectedCourse]);

  const handleNextModule = () => {
    if (!selectedCourse || !activeModule) return;
    const currentIndex = selectedCourse.modules.findIndex(m => m.id === activeModule.id);
    if (currentIndex >= 0 && currentIndex < selectedCourse.modules.length - 1) {
      setActiveModule(selectedCourse.modules[currentIndex + 1]);
    } else {
      setActiveModule(null); // Course Done
    }
  };

  const handleBookmark = () => {
    if (!activeModule) return;
    const user = db.getCurrentUser();
    if (user) {
      db.addBookmark(user.id, {
        id: Date.now().toString(),
        moduleId: activeModule.id,
        moduleTitle: activeModule.title,
        note: bookmarkNote || "Quick bookmark",
        timestamp: Date.now()
      });
      setShowBookmarkModal(false);
    }
  };

  // 1. Course Selection View
  if (!selectedCourse) {
    return (
      <div className="animate-fadeIn">
        <h2 className="text-3xl font-bold text-white mb-2">Code IIT Out Pathways</h2>
        <p className="text-gray-400 mb-8">Select a track to start mastering concepts.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map(course => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="group relative bg-[#161b22] border border-gray-800 hover:border-blue-500/50 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-white group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <span className="text-2xl">{
                    course.icon === 'python' ? '🐍' :
                      course.icon === 'database' ? '🗄️' :
                        course.icon === 'cloud' ? '☁️' :
                          course.icon === 'cpu' ? '💻' :
                            course.icon === 'os' ? '🖥️' :
                              course.icon === 'code' ? '⚡' : '📚'
                  }</span>
                </div>
                <div className="px-2 py-1 rounded bg-gray-800 text-xs text-gray-400 font-mono">
                  {course.modules.length} modules
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
              <p className="text-gray-400 text-sm mb-4">Zero to Hero curriculum.</p>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-1/4 h-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Module List View
  if (!activeModule) {
    return (
      <div className="animate-fadeIn">
        <button onClick={() => setSelectedCourse(null)} className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors text-sm font-medium">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Pathways
        </button>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{selectedCourse.title}</h2>
          <p className="text-gray-400 max-w-2xl">Complete curriculum designed for modern engineering interviews and production systems.</p>
        </div>
        <div className="space-y-4 max-w-4xl">
          {selectedCourse.modules.map((module, idx) => {
            const isCached = db.hasLesson(module.id);
            return (
              <div key={module.id} onClick={() => setActiveModule(module)} className="bg-[#161b22] border border-gray-800 p-5 rounded-xl hover:border-gray-600 transition-all cursor-pointer flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-colors ${isCached ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-500'}`}>{idx + 1}</div>
                  <div>
                    <h4 className="font-bold text-white text-lg flex items-center gap-3">
                      {module.title}
                      {isCached && <span className="text-[10px] uppercase bg-green-900/20 text-green-400 px-2 py-0.5 rounded border border-green-900/50 font-bold tracking-wide">Ready</span>}
                    </h4>
                    <p className="text-sm text-gray-500">{module.description}</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            )
          })}
        </div>
      </div>
    );
  }

  // 3. Lesson Content View
  const nextModule = selectedCourse.modules[selectedCourse.modules.findIndex(m => m.id === activeModule.id) + 1];

  return (
    <div className="animate-fadeIn pb-24 relative">
      <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4 sticky top-0 bg-[#0f172a]/95 backdrop-blur z-30 py-4 px-4 -mx-4 shadow-xl">
        <button onClick={() => setActiveModule(null)} className="flex items-center text-gray-400 hover:text-white transition-colors text-sm font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          {selectedCourse.title}
        </button>
        <h2 className="text-lg font-bold text-white hidden md:block">{activeModule.title}</h2>
        <button onClick={() => setShowBookmarkModal(true)} className="text-gray-400 hover:text-yellow-400 p-2 transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h3 className="text-xl font-bold text-white mb-2">Generating Lesson...</h3>
          <p className="text-gray-500">Retrieving SVG diagrams and deep-dive content</p>
        </div>
      ) : lessonContent ? (
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Main Content */}
          <section>
            <MarkdownRenderer content={lessonContent.contentMarkdown} svg={lessonContent.diagramSvg} />
          </section>

          {/* Code Playground */}
          {lessonContent.codingChallenge && (
            <section className="mt-12">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-yellow-400">&lt;/&gt;</span> Code Playground
              </h3>
              <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-2">{lessonContent.codingChallenge.title}</h4>
                <p className="text-gray-400 text-sm mb-4">{lessonContent.codingChallenge.description}</p>

                <CodePlayground
                  initialCode={lessonContent.codingChallenge.starterCode}
                  language={lessonContent.codingChallenge.language}
                />

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-xs text-gray-500">Hint: {lessonContent.codingChallenge.hint}</div>
                </div>
              </div>
            </section>
          )}

          {/* Interview Questions */}
          {lessonContent.interviewQuestions && lessonContent.interviewQuestions.length > 0 && (
            <section className="bg-gradient-to-r from-purple-900/10 to-blue-900/10 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">🎯 Interview Prep</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {lessonContent.interviewQuestions.map((q, i) => (
                  <div key={i} className="bg-[#0d1117] p-4 rounded-lg border border-gray-800">
                    <div className="text-sm font-medium text-gray-200 mb-3">{q.question}</div>
                    <div className="text-xs text-gray-500 bg-black/20 p-3 rounded leading-relaxed">{q.answer}</div>
                    {q.companyTag && <div className="mt-2 inline-block px-2 py-0.5 text-[10px] font-bold bg-white/10 text-gray-300 rounded-full">{q.companyTag}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quiz Component */}
          {lessonContent.quizzes && lessonContent.quizzes.length > 0 && (
            <QuizComponent
              questions={lessonContent.quizzes}
              onComplete={(score) => {
                if (activeModule) onComplete(activeModule.id);
              }}
            />
          )}

          {/* Navigation Footer */}
          <div className="flex justify-end pt-8 border-t border-gray-800">
            {nextModule ? (
              <button onClick={handleNextModule} className="flex items-center gap-4 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/20 transition-all transform hover:-translate-y-1">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-blue-200 uppercase tracking-wide font-semibold">Next Lesson</div>
                  <div className="text-sm">{nextModule.title}</div>
                </div>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            ) : (
              <button onClick={() => setActiveModule(null)} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg">
                <span>Complete Course</span>
                <span className="text-2xl">🎉</span>
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* Bookmark Modal */}
      {showBookmarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-gray-700 p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Add Note</h3>
            <textarea
              value={bookmarkNote}
              onChange={(e) => setBookmarkNote(e.target.value)}
              className="w-full bg-[#0f172a] p-4 rounded-xl text-white mb-6 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
              placeholder="What's important about this topic?"
            ></textarea>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowBookmarkModal(false)} className="px-4 py-2 text-gray-400 hover:text-white font-medium">Cancel</button>
              <button onClick={handleBookmark} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningModule;
