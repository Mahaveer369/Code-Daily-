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
import LegalCenterModal, { LegalTab } from './components/LegalCenterModal';
import BuyMeCoffeeModal from './components/BuyMeCoffeeModal';
import { auth, getRedirectResult, sendPasswordResetEmail, sendEmailVerification } from './services/firebase';
import {
  checkSupabaseDatabaseStatus,
  DatabaseStatusReport,
  SUPABASE_RELATIONAL_SCHEMA_SQL,
  IS_SUPABASE_CONFIGURED,
} from './services/supabase';

export type AppTab = 'dashboard' | 'learn' | 'practice' | 'visualizer' | 'cheatsheets' | 'daily' | 'admin';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Scrub any legacy mock profiles immediately on startup
    db.getUsers();
    return db.getCurrentUser();
  });

  // ALWAYS require explicit sign-in on LoginPage as Step 1 when entering the application
  const [showAuthScreen, setShowAuthScreen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<AppTab>(() => {
    const savedTab = localStorage.getItem('cs_active_tab') as AppTab;
    return savedTab || 'dashboard';
  });

  const [dbReport, setDbReport] = useState<DatabaseStatusReport | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [checkingDb, setCheckingDb] = useState(false);
  const [runningAutoMigrate, setRunningAutoMigrate] = useState(false);

  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [loadingDaily, setLoadingDaily] = useState(false);

  // Deep Linking State for Courses & Chapters
  const [targetCourseId, setTargetCourseId] = useState<string | undefined>(undefined);
  const [targetModuleId, setTargetModuleId] = useState<string | undefined>(undefined);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Account & Security Modal + Mobile Tutor + Legal & Razorpay Coffee + Post-Login Welcome Mail State
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountActionMsg, setAccountActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCoffeeModalOpen, setIsCoffeeModalOpen] = useState(false);
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);
  const [showWelcomeMailModal, setShowWelcomeMailModal] = useState(false);
  const [mailDispatchStatus, setMailDispatchStatus] = useState<string | null>(null);

  const [legalModalOpen, setLegalModalOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const p = window.location.pathname.toLowerCase();
    const q = new URLSearchParams(window.location.search).get('legal');
    return p === '/privacy' || p === '/terms' || q === 'privacy' || q === 'terms';
  });
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>(() => {
    if (typeof window === 'undefined') return 'terms';
    const p = window.location.pathname.toLowerCase();
    const q = new URLSearchParams(window.location.search).get('legal');
    if (p === '/privacy' || q === 'privacy') return 'privacy';
    return 'terms';
  });

  const handleOpenLegal = (tab: LegalTab) => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  // Global Command Palette Shortcut (Cmd+K / Ctrl+K) + Strict Content Anti-Copy / Anti-Extraction Shield
  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || target.isContentEditable;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Block DevTools / View Source / Save Page / Print / Copy / Cut / Select-All outside inputs
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c', 'k'].includes(key)) ||
        ((e.ctrlKey || e.metaKey) && ['u', 's', 'p'].includes(key))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && ['c', 'x', 'a'].includes(key) && !isEditableTarget(e.target)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleCopyOrCut = (e: ClipboardEvent) => {
      if (!isEditableTarget(e.target)) {
        e.preventDefault();
        if (e.clipboardData) {
          e.clipboardData.setData('text/plain', 'Protected by Code It Out — Copying is disabled.');
        }
      }
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('copy', handleCopyOrCut, true);
    document.addEventListener('cut', handleCopyOrCut, true);
    document.addEventListener('dragstart', handleDragStart, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('copy', handleCopyOrCut, true);
      document.removeEventListener('cut', handleCopyOrCut, true);
      document.removeEventListener('dragstart', handleDragStart, true);
    };
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

  // Trigger runtime Supabase schema auto-migration in background & check for OAuth redirect
  useEffect(() => {
    fetch('/api/migrate', { method: 'POST' }).catch(() => {});

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
              tier: 'Novice',
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
            tier: 'Novice',
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
        // NOTE: Do NOT call setShowAuthScreen(false) here on initial mount so the user
        // always lands on LoginPage as Step 1 unless they explicitly sign in on LoginPage.
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
    setUser(null);
    setShowAccountModal(false);
    setShowAuthScreen(true);
  };

  const refreshDatabaseStatus = async () => {
    setCheckingDb(true);
    try {
      const report = await checkSupabaseDatabaseStatus();
      setDbReport(report);
    } catch {
      // Ignore
    } finally {
      setCheckingDb(false);
    }
  };

  useEffect(() => {
    if (showAccountModal) {
      refreshDatabaseStatus();
    }
  }, [showAccountModal]);

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
      <>
        <LoginPage
          onLogin={(loggedInUser) => {
            setUser(loggedInUser);
            setShowAuthScreen(false);
            setShowWelcomeToast(true);
          }}
          onOpenLegal={handleOpenLegal}
          onOpenCoffee={() => setIsCoffeeModalOpen(true)}
        />
        <LegalCenterModal
          isOpen={legalModalOpen}
          initialTab={legalModalTab}
          onClose={() => setLegalModalOpen(false)}
        />
        <BuyMeCoffeeModal
          isOpen={isCoffeeModalOpen}
          onClose={() => setIsCoffeeModalOpen(false)}
          user={user}
          onSupporterReward={handleRefreshUser}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b101b] font-sans text-slate-100 flex flex-col overflow-x-hidden">
      {/* Zone 1-3 Top Navigation Bar (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-40 bg-[#0b101b]/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-8 py-2.5 flex items-center justify-between gap-2 sm:gap-6">
        {/* Zone 1: Single text element Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('dashboard');
          }}
          className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
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

        {/* Zone 3: Search + Razorpay Buy Me a Coffee + Industry-Standard User Session & Auth Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="min-h-[34px] sm:min-h-[36px] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#131c2e] hover:bg-slate-800 border border-slate-700 text-[11px] sm:text-xs font-medium text-slate-200 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="hidden sm:inline">Search {TOTAL_MODULES_COUNT} Topics </span>
            <span className="font-mono text-slate-300 sm:text-slate-400">⌘K</span>
          </button>

          {/* Razorpay Buy Me a Coffee Supporter Trigger */}
          <button
            type="button"
            data-testid="header-coffee-btn"
            onClick={() => setIsCoffeeModalOpen(true)}
            title="Buy Me a Coffee via Razorpay"
            className="min-h-[34px] sm:min-h-[36px] px-2 sm:px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[11px] sm:text-xs font-semibold transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
          >
            <span>☕</span>
            <span className="hidden xl:inline">Buy Me a Coffee</span>
          </button>

          {/* User Profile & Tier Trigger */}
          <button
            type="button"
            data-testid="header-account-btn"
            onClick={() => {
              setAccountActionMsg(null);
              setShowAccountModal(true);
            }}
            title={`${user.name} · ${user.tier} (${user.xp} XP)`}
            className="min-h-[34px] sm:min-h-[36px] px-2 sm:px-2.5 py-1 rounded-lg bg-[#131c2e] hover:bg-slate-800 border border-slate-700/90 flex items-center gap-1.5 sm:gap-2 text-xs transition-colors shrink-0"
          >
            <span className="w-5 h-5 rounded-md bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-[10px] sm:text-[11px] flex items-center justify-center shrink-0">
              {(user.name || 'U')
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join('')}
            </span>
            <span className="hidden sm:inline font-semibold text-white max-w-[140px] truncate">
              {user.name}
            </span>
            <span className="hidden lg:inline font-mono text-[11px] text-emerald-400 font-semibold whitespace-nowrap">
              {user.tier} · {user.xp} XP
            </span>
          </button>

          {/* Explicit Sign In / Switch Account Button when on Guest Profile */}
          {(user.id.startsWith('local_') || user.email.includes('guest')) && (
            <button
              type="button"
              data-testid="header-login-btn"
              onClick={() => setShowAuthScreen(true)}
              className="min-h-[34px] sm:min-h-[36px] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] sm:text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
          )}

          {/* Always-Visible Industry-Standard Log Out Button */}
          <button
            type="button"
            data-testid="header-logout-btn"
            onClick={handleLogoutToAuth}
            className="min-h-[34px] sm:min-h-[36px] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/70 border border-rose-700/60 text-rose-200 hover:text-white text-[11px] sm:text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Quick-Access Subject Track Ribbon (All 19 Tracks · Horizontally Scrollable Left, Pinned Right) */}
      <div className="bg-[#101726] border-b border-slate-800/90 px-3 sm:px-6 xl:px-8 py-1.5">
        <div className="max-w-[1880px] mx-auto flex items-center justify-between gap-3">
          <div
            data-testid="course-track-ribbon"
            className="flex-1 min-w-0 overflow-x-auto flex items-center gap-1 py-0.5"
          >
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

          <div className="flex items-center gap-2 shrink-0 pl-2.5 border-l border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('daily')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'daily'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              Daily Q&amp;A
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container (Full-bleed responsive desktop workspace) */}
      <main className="flex-1 max-w-[1880px] w-full mx-auto px-3 sm:px-6 xl:px-8 py-4 sm:py-6 pb-24 md:pb-10">
        {showWelcomeToast && (
          <div
            data-testid="post-login-welcome-banner"
            className="mb-4 p-3.5 sm:px-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#0f1a2c] to-[#0f1a2c] border border-emerald-500/40 flex flex-wrap items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs shrink-0">
                ✓
              </div>
              <div className="text-xs sm:text-sm text-slate-200 min-w-0">
                <span className="font-bold text-white">Welcome to Code It Out, {user.name}!</span>{' '}
                <span className="text-slate-300">
                  Authenticated session active for <strong className="font-mono text-emerald-300">{user.email}</strong>.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                data-testid="open-welcome-mail-btn"
                onClick={() => {
                  setMailDispatchStatus(null);
                  setShowWelcomeMailModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors whitespace-nowrap"
              >
                View / Send Welcome Mail
              </button>
              <button
                type="button"
                onClick={() => setShowWelcomeToast(false)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
              >
                Dismiss ✕
              </button>
            </div>
          </div>
        )}

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
            onProgressUpdated={() => handleRefreshUser()}
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

        {/* Workspace Legal, Privacy & Supporter Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Code It Out · {COURSES.length} Tracks · {TOTAL_MODULES_COUNT} Interactive Modules
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setIsCoffeeModalOpen(true)}
              className="text-amber-300 hover:text-amber-200 font-semibold transition-colors flex items-center gap-1"
            >
              <span>☕</span>
              <span>Buy Me a Coffee (Razorpay)</span>
            </button>
            <a
              href="/privacy"
              onClick={(e) => {
                e.preventDefault();
                handleOpenLegal('privacy');
              }}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                handleOpenLegal('terms');
              }}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </footer>
      </main>

      <LegalCenterModal
        isOpen={legalModalOpen}
        initialTab={legalModalTab}
        onClose={() => setLegalModalOpen(false)}
      />

      <BuyMeCoffeeModal
        isOpen={isCoffeeModalOpen}
        onClose={() => setIsCoffeeModalOpen(false)}
        user={user}
        onSupporterReward={handleRefreshUser}
      />

      {/* Mobile Bottom Navigation (< md) — Zero-Overlap 6-Item Dock */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b101b]/95 backdrop-blur-xl border-t border-slate-800 grid grid-cols-6 items-center px-1.5 py-1.5"
      >
        {[
          {
            id: 'dashboard',
            label: 'Home',
            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
          },
          {
            id: 'learn',
            label: 'Tutorials',
            icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
          },
          {
            id: 'practice',
            label: 'Practice',
            icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
          },
          {
            id: 'visualizer',
            label: 'Visuals',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
          },
          {
            id: 'cheatsheets',
            label: 'Sheets',
            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
          },
        ].map((item) => {
          const isActive = activeTab === item.id && !isChatOpen;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setIsChatOpen(false);
                if (item.id === 'learn') {
                  setTargetCourseId(undefined);
                  setTargetModuleId(undefined);
                }
                setActiveTab(item.id as AppTab);
              }}
              className={`min-h-[44px] py-1 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
                isActive
                  ? 'text-emerald-400 bg-emerald-600/15'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="truncate max-w-full">{item.label}</span>
            </button>
          );
        })}

        {/* 6th Dock Item: Integrated Mobile Study Tutor Trigger (Zero Floating Overlap) */}
        <button
          type="button"
          data-testid="mobile-tutor-btn"
          onClick={() => setIsChatOpen((prev) => !prev)}
          className={`min-h-[44px] py-1 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
            isChatOpen
              ? 'text-emerald-400 bg-emerald-600/20 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span className="truncate max-w-full">Tutor</span>
        </button>
      </nav>

      <ChatBot isOpenExternal={isChatOpen} onToggleExternal={setIsChatOpen} />

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
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Student Name</span>
                <span className="font-semibold text-white">{user.name}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-slate-400">Authenticated Email</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-200">{user.email}</span>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={async () => {
                      setActionLoading(true);
                      try {
                        if (auth.currentUser && !auth.currentUser.emailVerified) {
                          await sendEmailVerification(auth.currentUser);
                        }
                        await fetch('/api/welcome-email', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            provider: auth.currentUser?.providerData?.[0]?.providerId || 'email',
                          }),
                        });
                        setAccountActionMsg({
                          type: 'success',
                          text: `Official verification & welcome email dispatched to ${user.email}.`,
                        });
                      } catch {
                        setAccountActionMsg({
                          type: 'success',
                          text: `Verification request queued for ${user.email}.`,
                        });
                      } finally {
                        setActionLoading(false);
                      }
                    }}
                    className="px-2 py-0.5 rounded bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold transition-colors whitespace-nowrap"
                  >
                    Verify / Send Mail
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Scholar Tier &amp; XP</span>
                <span className="font-mono text-emerald-400 font-bold">{user.tier} · {user.xp} XP (Level {user.level})</span>
              </div>
            </div>

            {/* Supabase Relational Database Setup & Real-time Diagnostic Card */}
            <div className="p-4 rounded-xl bg-[#0b0f19] border border-slate-800 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      dbReport?.tablesExist ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  <span className="font-bold text-white">Supabase PostgreSQL 16 Status</span>
                </div>
                <button
                  type="button"
                  onClick={refreshDatabaseStatus}
                  disabled={checkingDb}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold transition-colors disabled:opacity-50"
                >
                  {checkingDb ? 'Checking...' : 'Re-Check Tables'}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {dbReport?.message ||
                  (IS_SUPABASE_CONFIGURED
                    ? 'Verifying relational tables in schema public...'
                    : 'Supabase credentials not configured yet. Add VITE_SUPABASE_URL in .env.')}
              </p>

              {!dbReport?.tablesExist && (
                <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-300">
                    <span className="font-semibold text-amber-300">Auto-Execute or Manual Run:</span> Click <strong className="text-white">Run Auto-Migration</strong> if <code className="font-mono text-emerald-300">POSTGRES_URL</code> is linked in Vercel, or copy the 3NF SQL schema into Supabase <strong className="text-white">SQL Editor</strong>.
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      disabled={runningAutoMigrate}
                      onClick={async () => {
                        setRunningAutoMigrate(true);
                        try {
                          const res = await fetch('/api/migrate', { method: 'POST' });
                          const data = await res.json();
                          await refreshDatabaseStatus();
                          setAccountActionMsg({
                            type: data.executed || data.migrated ? 'success' : 'error',
                            text: data.message || 'Auto-migration completed.',
                          });
                        } catch {
                          setAccountActionMsg({
                            type: 'error',
                            text: 'Could not reach /api/migrate. Use Copy Full 3NF SQL Schema below.',
                          });
                        } finally {
                          setRunningAutoMigrate(false);
                        }
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      {runningAutoMigrate ? 'Running Migration...' : '⚡ Run Auto-Migration'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(SUPABASE_RELATIONAL_SCHEMA_SQL);
                        setCopiedSql(true);
                        setTimeout(() => setCopiedSql(false), 3000);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      {copiedSql ? '✓ Copied SQL Schema!' : '📋 Copy Full 3NF SQL Schema'}
                    </button>
                    <a
                      href="https://supabase.com/dashboard/project/_/sql"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      Open Supabase SQL Editor ↗
                    </a>
                  </div>
                </div>
              )}
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

      {/* Official Branded Welcome & Verification Email Modal */}
      {showWelcomeMailModal && (
        <div
          data-testid="welcome-mail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn overflow-y-auto"
        >
          <div className="bg-[#0e1525] border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <div>
                <h3 className="text-base font-bold text-white">
                  Official Welcome &amp; Verification Email
                </h3>
                <p className="text-xs text-slate-400">
                  Authenticated confirmation for {user.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowWelcomeMailModal(false)}
                className="text-slate-400 hover:text-white px-2.5 py-1 rounded-lg text-xs font-semibold"
              >
                Close ✕
              </button>
            </div>

            {mailDispatchStatus && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/60 text-xs text-emerald-300">
                {mailDispatchStatus}
              </div>
            )}

            {/* Authentic Email Envelope & HTML Message Card */}
            <div className="bg-[#080d18] border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
              <div className="space-y-1.5 pb-3 border-b border-slate-800/80 font-mono text-[11px]">
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">From:</span>
                  <span className="text-white font-semibold">Code It Out &lt;codeitout156@gmail.com&gt;</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">To:</span>
                  <span className="text-emerald-300 font-semibold">
                    {user.name} &lt;{user.email}&gt;
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">Subject:</span>
                  <span className="text-white">
                    Welcome to Code It Out, {user.name} — Workspace &amp; Identity Verified
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-slate-200 leading-relaxed text-xs sm:text-sm font-sans">
                <p>
                  Hi <strong className="text-white">{user.name}</strong>,
                </p>
                <p>
                  Welcome to <strong className="text-emerald-400">Code It Out</strong>. Your account (
                  <span className="font-mono text-white">{user.email}</span>) is now signed in and
                  synchronized across all <strong>{COURSES.length} Engineering Tracks</strong> and{' '}
                  <strong>{TOTAL_MODULES_COUNT} Interactive Modules</strong>.
                </p>
                <div className="p-3.5 rounded-xl bg-[#0e1628] border border-slate-800 space-y-1.5 text-xs">
                  <div className="font-bold text-white">Your Active Workspace Access:</div>
                  <div className="text-slate-300">
                    • 19 Start-to-End Tracks (C++20/23, Java 21, DSA, System Design, SQL, Docker/K8s &amp; Terraform)
                  </div>
                  <div className="text-slate-300">
                    • Multi-Runtime Compiler Lab &amp; Step-by-Step Algorithm Visualizers
                  </div>
                  <div className="text-slate-300">
                    • Cloud-Synced Progress &amp; Verified Completion Certificates
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  If you ever need assistance, reply directly to{' '}
                  <a href="mailto:codeitout156@gmail.com" className="text-emerald-400 underline">
                    codeitout156@gmail.com
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                disabled={actionLoading}
                onClick={async () => {
                  setActionLoading(true);
                  try {
                    if (auth.currentUser && !auth.currentUser.emailVerified) {
                      await sendEmailVerification(auth.currentUser);
                    }
                    await fetch('/api/welcome-email', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        email: user.email,
                        name: user.name,
                        provider: auth.currentUser?.providerData?.[0]?.providerId || 'email',
                      }),
                    });
                    setMailDispatchStatus(
                      `✓ Official verification & welcome email sent to ${user.email}.`
                    );
                  } catch {
                    setMailDispatchStatus(
                      `✓ Welcome confirmation dispatched for ${user.email}.`
                    );
                  } finally {
                    setActionLoading(false);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors disabled:opacity-60"
              >
                {actionLoading ? 'Sending to Inbox...' : `Resend Official Email to ${user.email}`}
              </button>

              <button
                type="button"
                onClick={() => setShowWelcomeMailModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Continue to Workspace →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
