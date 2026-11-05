import React, { useState, useEffect } from 'react';
import { DailyPlan, UserProfile, UserRole } from './types';
import { generateDailyPlan } from './services/gemini';
import { db } from './services/db';
import DailyCard from './components/DailyCard';
import ChatBot from './components/ChatBot';
import Dashboard from './components/Dashboard';
import LearningModule, { COURSES, TOTAL_MODULES_COUNT } from './components/LearningModule';
import PracticeArena from './components/PracticeArena';
import ConceptVisualizer from './components/ConceptVisualizer';
import CheatSheetsView from './components/CheatSheetsView';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/AdminPanel';
import CommandPalette from './components/CommandPalette';
import { auth, getRedirectResult, sendPasswordResetEmail } from './services/firebase';

export type AppTab = 'dashboard' | 'learn' | 'practice' | 'visualizer' | 'cheatsheets' | 'daily' | 'admin';

const DEFAULT_STUDENT_PROFILE: UserProfile = {
  id: 'student_default_01',
  name: 'Alex Mercer',
  email: 'alex.mercer@faangprep.io',
  role: 'user',
  streak: 5,
  lastLogin: new Date().toISOString(),
  xp: 250,
  level: 1,
  badges: [
    { id: 'fast-starter', name: 'Fast Starter', icon: '🚀', dateEarned: new Date().toLocaleDateString() }
  ],
  solvedProblemIds: []
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = db.getCurrentUser();
    if (cached) return cached;
    // Automatically provision student profile so learners can explore tutorials & sandboxes immediately
    db.saveUser(DEFAULT_STUDENT_PROFILE);
    return DEFAULT_STUDENT_PROFILE;
  });

  const [showAuthScreen, setShowAuthScreen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AppTab>(() => {
    const savedTab = localStorage.getItem('cs_active_tab') as AppTab;
    return savedTab || 'dashboard';
  });

  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [loadingDaily, setLoadingDaily] = useState(false);

  // Deep Linking State for Courses & Chapters
  const [targetCourseId, setTargetCourseId] = useState<string | undefined>(undefined);
  const [targetModuleId, setTargetModuleId] = useState<string | undefined>(undefined);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Account & Security Modal State
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountActionMsg, setAccountActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Global Command Palette Shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Online / Offline sync monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check for Firebase session and sync
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          const fbUser = result.user;
          let role: UserRole = 'user';
          try {
            const tokenResult = await fbUser.getIdTokenResult();
            if (tokenResult.claims.admin) role = 'admin';
          } catch {
            // Default role
          }

          const existingUsers = db.getUsers();
          let profile = existingUsers[fbUser.email || ''];
          if (!profile) {
            profile = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Student',
              email: fbUser.email || '',
              role,
              streak: 1,
              lastLogin: new Date().toISOString(),
              xp: 100,
              level: 1,
              badges: []
            };
          } else {
            profile.id = fbUser.uid;
            profile.lastLogin = new Date().toISOString();
          }

          db.saveUser(profile);
          setUser(profile);
          setShowAuthScreen(false);
          await db.syncUserDataFromCloud(fbUser.uid);
        }
      })
      .catch(() => {});

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        let role: UserRole = 'user';
        try {
          const tokenResult = await firebaseUser.getIdTokenResult();
          if (tokenResult.claims.admin) role = 'admin';
        } catch {
          // Default to user
        }

        const existingUsers = db.getUsers();
        let userProfile = existingUsers[firebaseUser.email || ''] || db.getCurrentUser();

        if (!userProfile || userProfile.id !== firebaseUser.uid) {
          userProfile = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Student',
            email: firebaseUser.email || '',
            role,
            streak: 1,
            lastLogin: new Date().toISOString(),
            xp: 100,
            level: 1,
            badges: []
          };
          db.saveUser(userProfile);
        } else {
          userProfile.id = firebaseUser.uid;
          userProfile.role = role;
          db.saveUser(userProfile);
        }

        setUser(userProfile);
        setShowAuthScreen(false);
        db.syncUserDataFromCloud(firebaseUser.uid).catch(() => {});
      }
    });

    return () => unsubscribe();
  }, []);

  // Load Daily Plan
  useEffect(() => {
    if (!user) return;

    const fetchPlan = async () => {
      setLoadingDaily(true);
      try {
        const stored = localStorage.getItem('cs_daily_plan');
        if (stored) {
          const parsed: DailyPlan = JSON.parse(stored);
          const todayStr = new Date().toISOString().split('T')[0];
          if (parsed.date === todayStr || parsed.date.includes(new Date().getFullYear().toString())) {
            setDailyPlan(parsed);
            setLoadingDaily(false);
            return;
          }
        }

        const plan = await generateDailyPlan();
        setDailyPlan(plan);
        localStorage.setItem('cs_daily_plan', JSON.stringify(plan));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDaily(false);
      }
    };

    fetchPlan();
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('cs_active_tab', activeTab);
    }
  }, [activeTab, user]);

  const handleLogoutToAuth = async () => {
    try {
      await auth.signOut();
    } catch {
      // Ignore
    }
    db.logout();
    setShowAccountModal(false);
    setShowAuthScreen(true);
  };

  const handleRefreshUser = () => {
    const updated = db.getCurrentUser();
    if (updated) setUser({ ...updated });
  };

  const handleOpenCourseModule = (courseId: string, moduleId?: string) => {
    setTargetCourseId(courseId);
    setTargetModuleId(moduleId);
    setActiveTab('learn');
  };

  if (showAuthScreen || !user) {
    return (
      <LoginPage
        onLogin={(loggedInUser) => {
          setUser(loggedInUser);
          setShowAuthScreen(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0b101b] font-sans text-slate-100 flex flex-col overflow-x-hidden">
      {/* Zone 1-3 Top Navigation Bar (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-40 bg-[#0b101b]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single text element Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('dashboard');
          }}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          Code It Out
        </a>

        {/* Zone 2: 5 Concise Single-Line Navigation Links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-6 text-sm font-medium">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'learn', label: `Tutorials (${TOTAL_MODULES_COUNT})` },
            { id: 'practice', label: 'Practice Arena' },
            { id: 'visualizer', label: 'Visualizers' },
            { id: 'cheatsheets', label: 'Cheat Sheets' },
          ].map((navItem) => (
            <button
              key={navItem.id}
              type="button"
              onClick={() => {
                if (navItem.id === 'learn') {
                  setTargetCourseId(undefined);
                  setTargetModuleId(undefined);
                }
                setActiveTab(navItem.id as AppTab);
              }}
              className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === navItem.id
                  ? 'text-emerald-400 border-b-2 border-emerald-500 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {navItem.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#131c2e] hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap shrink-0"
          >
            Search {TOTAL_MODULES_COUNT} Topics (⌘K)
          </button>
        </div>
      </header>

      {/* Quick-Access Subject Track Ribbon (All 14 Tracks · 25 Modules Each) */}
      <div className="bg-[#101726] border-b border-slate-800/90 px-3 sm:px-6 xl:px-8 py-1.5 overflow-x-auto">
        <div className="max-w-[1880px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            {COURSES.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => handleOpenCourseModule(course.id, course.modules[0]?.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'learn' && targetCourseId === course.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                {course.shortTag || course.title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('daily')}
              className={`text-xs font-semibold whitespace-nowrap ${
                activeTab === 'daily' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Daily Q&amp;A
            </button>
            <button
              type="button"
              onClick={() => {
                setAccountActionMsg(null);
                setShowAccountModal(true);
              }}
              className="text-xs font-semibold text-slate-300 hover:text-white whitespace-nowrap"
            >
              {user.name} ({user.xp} XP)
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container (Full-bleed responsive desktop workspace) */}
      <main className="flex-1 max-w-[1880px] w-full mx-auto px-3 sm:px-6 xl:px-8 py-4 sm:py-6 pb-24 md:pb-10">
        {!isOnline && (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200">
            Offline Mode Active — All tutorials, visualizers, and code sandboxes remain fully functional locally.
          </div>
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            progress={user}
            userName={user.name}
            onCourseClick={(courseId, moduleId) => handleOpenCourseModule(courseId, moduleId)}
            onOpenAllTutorials={() => {
              setTargetCourseId(undefined);
              setTargetModuleId(undefined);
              setActiveTab('learn');
            }}
            onOpenPractice={() => setActiveTab('practice')}
            onOpenVisualizer={() => setActiveTab('visualizer')}
            onOpenCheatSheets={() => setActiveTab('cheatsheets')}
          />
        )}

        {activeTab === 'learn' && (
          <LearningModule
            onComplete={() => handleRefreshUser()}
            initialCourseId={targetCourseId}
            initialModuleId={targetModuleId}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeArena onProblemSolved={() => handleRefreshUser()} />
        )}

        {activeTab === 'visualizer' && <ConceptVisualizer />}

        {activeTab === 'cheatsheets' && (
          <CheatSheetsView
            onNavigateToModule={(courseId, moduleId) => handleOpenCourseModule(courseId, moduleId)}
          />
        )}

        {activeTab === 'admin' && user.role === 'admin' && <AdminPanel />}

        {activeTab === 'daily' && (
          <div className="space-y-6">
            <div>
              <div className="text-xs font-semibold text-blue-400">
                Daily Revision Cards · Rapid Concept Check
              </div>
              <h2 className="text-2xl font-bold text-white mt-0.5">
                Daily Interview &amp; Exam Question Mix
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dailyPlan?.topics.map((topic, index) => (
                <DailyCard key={`${topic.category}-${index}`} topic={topic} />
              ))}
              {loadingDaily && (
                <div className="col-span-2 py-12 text-center text-slate-400 text-sm">
                  Loading today&apos;s curated questions...
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation (< md) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b101b]/95 backdrop-blur-xl border-t border-slate-800 flex items-center justify-around py-2 px-2"
      >
        {[
          { id: 'dashboard', label: 'Home' },
          { id: 'learn', label: 'Tutorials' },
          { id: 'practice', label: 'Practice' },
          { id: 'visualizer', label: 'Visualizer' },
          { id: 'cheatsheets', label: 'Sheets' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id as AppTab)}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === item.id ? 'text-blue-400 bg-blue-600/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <ChatBot />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab, courseId, moduleId) => {
          setActiveTab(tab as AppTab);
          if (courseId) setTargetCourseId(courseId);
          if (moduleId) setTargetModuleId(moduleId);
        }}
        onOpenAccount={() => {
          setAccountActionMsg(null);
          setShowAccountModal(true);
        }}
      />

      {/* Account & Cloud Sync Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#131b2c] w-full max-w-lg rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Student Profile &amp; Cloud Sync</h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage progress, export JSON records, or switch accounts</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAccountModal(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>

            {accountActionMsg && (
              <div
                className={`p-3 rounded-xl text-xs ${
                  accountActionMsg.type === 'success'
                    ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
                    : 'bg-red-950/40 border border-red-800/60 text-red-300'
                }`}
              >
                {accountActionMsg.text}
              </div>
            )}

            <div className="space-y-2.5 bg-[#0b0f19] p-4 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Student Name</span>
                <span className="font-semibold text-white">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email</span>
                <span className="font-mono text-slate-300">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total XP &amp; Level</span>
                <span className="font-mono text-emerald-400 font-bold">{user.xp} XP · Level {user.level}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const exportBlob = {
                    profile: user,
                    progress: db.getUserProgress(user.id),
                    bookmarks: db.getBookmarks(user.id),
                    certificates: db.getCertificates(user.id),
                    exportedAt: new Date().toISOString()
                  };
                  const blob = new Blob([JSON.stringify(exportBlob, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `student_progress_${user.id.slice(0, 8)}.json`;
                  link.click();
                  URL.revokeObjectURL(url);
                  setAccountActionMsg({
                    type: 'success',
                    text: 'Student progress and certificates exported as JSON.'
                  });
                }}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-white transition-colors"
              >
                Export Progress (JSON)
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={async () => {
                  setActionLoading(true);
                  try {
                    await sendPasswordResetEmail(auth, user.email);
                    setAccountActionMsg({
                      type: 'success',
                      text: `Password reset email sent to ${user.email}.`
                    });
                  } catch (e: any) {
                    setAccountActionMsg({
                      type: 'error',
                      text: e.message || 'Sign in with Firebase email first to reset password.'
                    });
                  } finally {
                    setActionLoading(false);
                  }
                }}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-white transition-colors"
              >
                Reset Password
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleLogoutToAuth}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Sign In / Switch Account
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={async () => {
                  setActionLoading(true);
                  const res = await db.deleteAccount(user.id);
                  setActionLoading(false);
                  if (res.success) {
                    setShowAccountModal(false);
                    setShowAuthScreen(true);
                  } else {
                    setAccountActionMsg({ type: 'error', text: res.error || 'Could not delete account.' });
                  }
                }}
                className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-xl text-xs font-semibold transition-colors"
              >
                Reset Local &amp; Cloud Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
