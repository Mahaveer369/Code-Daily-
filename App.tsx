
import React, { useState, useEffect } from 'react';
import { DailyPlan, UserProfile, UserRole } from './types';
import { generateDailyPlan } from './services/gemini';
import { db } from './services/db';
import DailyCard from './components/DailyCard';
import ChatBot from './components/ChatBot';
import Dashboard from './components/Dashboard';
import LearningModule from './components/LearningModule';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/AdminPanel';
import CommandPalette from './components/CommandPalette';
import { auth, getRedirectResult, sendPasswordResetEmail } from './services/firebase';

type Tab = 'dashboard' | 'daily' | 'learn' | 'admin';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    // Restore tab from localStorage on mount
    const savedTab = localStorage.getItem('cs_active_tab') as Tab;
    return savedTab || 'dashboard';
  });
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [loadingDaily, setLoadingDaily] = useState(false);
  
  // Navigation & Deep Linking State
  const [targetCourseId, setTargetCourseId] = useState<string | undefined>(undefined);
  const [targetModuleId, setTargetModuleId] = useState<string | undefined>(undefined);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);

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

  // Check for session and sync with Firebase
  useEffect(() => {
    // 1. First check localStorage for instant render
    const cachedUser = db.getCurrentUser();
    if (cachedUser) {
      setUser(cachedUser);
      if (cachedUser.role === 'admin') setActiveTab('admin');
      else setActiveTab('dashboard');
    }

    // 2. Handle Google Sign-in redirect result (for browsers blocking popups)
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          const fbUser = result.user;
          let role: UserRole = 'user';
          try {
            const tokenResult = await fbUser.getIdTokenResult();
            if (tokenResult.claims.admin) role = 'admin';
          } catch (e) {
            // Default to user role
          }

          const existingUsers = db.getUsers();
          let profile = existingUsers[fbUser.email || ''];
          if (!profile) {
            profile = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Engineer',
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
          await db.syncUserDataFromCloud(fbUser.uid);
        }
      })
      .catch((err) => {
        console.warn('[Auth] Redirect result listener notice:', err);
      });

    // 3. Listen to Firebase auth state for live token and session updates
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        let role: UserRole = 'user';
        try {
          const tokenResult = await firebaseUser.getIdTokenResult();
          if (tokenResult.claims.admin) role = 'admin';
        } catch (e) {
          // Default to user
        }

        const existingUsers = db.getUsers();
        let userProfile = existingUsers[firebaseUser.email || ''] || db.getCurrentUser();

        if (!userProfile || userProfile.id !== firebaseUser.uid) {
          userProfile = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Engineer',
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

        // Synchronize cloud records from Firestore in background
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
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoadingDaily(false);
      }
    };

    fetchPlan();
  }, [user]);

  // Persist activeTab to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('cs_active_tab', activeTab);
    }
  }, [activeTab, user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.warn("Firebase signout error:", err);
    }
    db.logout();
    localStorage.removeItem('cs_active_tab');
    setUser(null);
    setActiveTab('dashboard');
  };

  const handleModuleComplete = (moduleId: string) => {
    if (user) {
      // Logic for XP update handled in LearningModule calling db.markModuleComplete
      // We force a user re-fetch to update UI for XP changes
      setUser(db.getCurrentUser());
    }
  };

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 flex flex-col md:flex-row overflow-hidden">

      {/* Desktop/Tablet Sidebar Navigation (hidden on mobile < md) */}
      <aside className="hidden md:flex w-20 lg:w-72 bg-[#1e293b]/30 backdrop-blur-xl border-r border-gray-800 flex-col justify-between py-8 z-20 transition-all shrink-0">
        <div>
          <div className="px-4 lg:px-8 mb-10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 transform rotate-3">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="hidden lg:block font-bold text-xl tracking-tight text-white">Code IIT Out</span>
          </div>

          <nav className="px-4 space-y-2">
            {[
              {
                id: 'dashboard', label: 'Dashboard', role: 'user', icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                )
              },
              {
                id: 'learn', label: 'My Courses', role: 'user', icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                )
              },
              {
                id: 'daily', label: 'Daily Challenges', role: 'user', icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                )
              },
              {
                id: 'admin', label: 'Admin CMS', role: 'admin', icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                )
              },
            ].filter(item => user.role === 'admin' || (user.role === 'user' && item.role !== 'admin')).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group font-medium ${activeTab === item.id
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <svg className={`w-5 h-5 shrink-0 transition-colors ${activeTab === item.id ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {item.icon}
                </svg>
                <span className="hidden lg:block whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="px-4 lg:px-6">
          <div className="bg-gray-900/40 rounded-2xl p-4 border border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-b from-gray-700 to-gray-800 flex items-center justify-center text-sm font-bold ring-2 ring-gray-700 text-white shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block overflow-hidden">
                <div className="text-sm font-bold text-white truncate">{user.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user.role} Account</div>
              </div>
            </div>
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  setAccountActionMsg(null);
                  setShowAccountModal(true);
                }}
                className="w-full py-1.5 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 bg-slate-800/80 rounded-lg hover:bg-slate-700/80 transition-colors border border-slate-700/60"
              >
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                <span className="hidden lg:inline">Security & Account</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 flex items-center justify-center gap-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <span className="hidden lg:inline">Sign Out</span>
                <span className="lg:hidden">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth bg-[#0f172a] flex flex-col min-h-screen">

        {/* Mobile Sticky Top Header (Visible on < md) */}
        <div className="md:hidden sticky top-0 z-30 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 transform rotate-2">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-base tracking-tight text-white">Code IIT Out</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Search Button */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60"
              title="Search (Cmd+K)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User Streak Badge */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-300 text-xs font-semibold">
              <span>🔥</span>
              <span>{user.streak}d</span>
            </div>

            {/* User Avatar Button */}
            <button
              onClick={() => {
                setAccountActionMsg(null);
                setShowAccountModal(true);
              }}
              className="w-8 h-8 rounded-full bg-gradient-to-b from-gray-700 to-gray-800 flex items-center justify-center text-xs font-bold ring-2 ring-blue-500/50 text-white"
            >
              {user.name.charAt(0).toUpperCase()}
            </button>
          </div>
        </div>

        {/* Decorative BG */}
        <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 via-[#0f172a] to-[#0f172a] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-10 pb-28 md:pb-12 relative z-10 flex-1">

          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider font-mono">
                  FAANG SDE-2 PREP
                </span>
                {!isOnline && (
                  <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    Offline Mode (Saved Locally)
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {activeTab === 'admin' ? 'System Administration' :
                  activeTab === 'daily' ? 'Daily Interview Mix' :
                    activeTab === 'learn' ? 'Learning Pathways' : 'Performance Dashboard'}
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                {activeTab === 'dashboard' ? 'Track your progress, streaks and badges' :
                  activeTab === 'learn' ? 'Master key concepts with interactive modules' :
                    'Manage your daily goals'}
              </p>
            </div>

            {/* Google-Grade Command Palette Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4 px-3.5 py-2 bg-[#162032] border border-slate-700/80 hover:border-blue-500/60 rounded-xl text-slate-300 text-xs transition-all shadow-sm group"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Quick search (modules, topics, code)...</span>
                </div>
                <kbd className="hidden sm:inline-flex items-center font-mono text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                  ⌘K
                </kbd>
              </button>
            </div>
          </header>

          {activeTab === 'dashboard' && (
            <Dashboard
              progress={user}
              userName={user.name}
              onCourseClick={() => setActiveTab('learn')}
            />
          )}

          {activeTab === 'learn' && (
            <LearningModule
              onComplete={handleModuleComplete}
              initialCourseId={targetCourseId}
              initialModuleId={targetModuleId}
            />
          )}

          {activeTab === 'admin' && user.role === 'admin' && (
            <AdminPanel />
          )}

          {activeTab === 'daily' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
              {dailyPlan?.topics.map((topic, index) => (
                <DailyCard key={`${topic.category}-${index}`} topic={topic} />
              ))}
              {loadingDaily && (
                <div className="col-span-2 py-12 flex flex-col items-center justify-center text-gray-400">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p>Curating today's interview questions...</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Mobile Bottom Navigation Bar (< md) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c121e]/95 backdrop-blur-xl border-t border-slate-800 flex items-center justify-around py-2 px-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            )},
            { id: 'learn', label: 'Tracks', icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            )},
            { id: 'daily', label: 'Daily Mix', icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            )},
            ...(user.role === 'admin' ? [{ id: 'admin', label: 'Admin', icon: (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            )}] : [])
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                activeTab === item.id ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className={`w-5 h-5 mb-0.5 ${activeTab === item.id ? 'text-blue-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {item.icon}
              </svg>
              <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
            </button>
          ))}

          {/* Account Shortcut */}
          <button
            onClick={() => {
              setAccountActionMsg(null);
              setShowAccountModal(true);
            }}
            className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-slate-400 hover:text-slate-200 transition-all"
          >
            <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white mb-0.5">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-[10px] font-semibold tracking-tight">Account</span>
          </button>
        </nav>
      </main>

      <ChatBot />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab, courseId, moduleId) => {
          setActiveTab(tab);
          if (courseId) setTargetCourseId(courseId);
          if (moduleId) setTargetModuleId(moduleId);
        }}
        onOpenAccount={() => {
          setAccountActionMsg(null);
          setShowAccountModal(true);
        }}
      />

      {/* Account & Security Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#131b2c] w-full max-w-lg rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Security & Account</h3>
                <p className="text-xs text-slate-400 mt-0.5">Firebase Authentication & Cloud Records</p>
              </div>
              <button
                onClick={() => setShowAccountModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Notification Banner */}
            {accountActionMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  accountActionMsg.type === 'success'
                    ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
                    : 'bg-red-950/40 border border-red-800/60 text-red-300'
                }`}
              >
                <span>{accountActionMsg.text}</span>
              </div>
            )}

            {/* Profile Information Block */}
            <div className="space-y-3 bg-[#0b0f19] p-4 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Student Name</span>
                <span className="font-semibold text-white">{user.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Authenticated Email</span>
                <span className="font-mono text-slate-300">{user.email}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Firebase UID</span>
                <span className="font-mono text-slate-400 text-[11px] truncate max-w-[200px]" title={user.id}>
                  {user.id}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">System Role</span>
                <span className="text-blue-400 font-semibold uppercase text-[11px] tracking-wider">
                  {user.role}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Cloud Sync Status</span>
                <span className="text-emerald-400 text-[11px] flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Firestore Multi-Tab Active
                </span>
              </div>
            </div>

            {/* Actions Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Actions & Data Portability</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={async () => {
                    setActionLoading(true);
                    setAccountActionMsg(null);
                    try {
                      await sendPasswordResetEmail(auth, user.email);
                      setAccountActionMsg({
                        type: 'success',
                        text: `Password reset instructions dispatched to ${user.email}.`
                      });
                    } catch (e: any) {
                      setAccountActionMsg({
                        type: 'error',
                        text: e.message || 'Failed to dispatch reset email.'
                      });
                    } finally {
                      setActionLoading(false);
                    }
                  }}
                  className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl text-xs font-medium text-slate-200 hover:text-white transition-all text-left flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span>Reset Password</span>
                </button>

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
                    link.download = `code_iit_out_records_${user.id.slice(0, 8)}.json`;
                    link.click();
                    URL.revokeObjectURL(url);
                    setAccountActionMsg({
                      type: 'success',
                      text: 'Learning progress and certificates exported successfully.'
                    });
                  }}
                  className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl text-xs font-medium text-slate-200 hover:text-white transition-all text-left flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Export Records (JSON)</span>
                </button>
              </div>
            </div>

            {/* Danger Zone: GDPR Cascade Account Deletion */}
            <div className="pt-3 border-t border-slate-800">
              <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-red-300">Delete Account & Data</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Permanently purges Firestore cloud progress, bookmarks, and credentials.
                  </div>
                </div>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={async () => {
                    const ok = window.confirm(
                      "Are you sure you want to permanently delete your account?\n\nThis will purge all your progress, bookmarks, certificates, and credentials from Firebase and cannot be reversed."
                    );
                    if (!ok) return;

                    setActionLoading(true);
                    setAccountActionMsg(null);
                    const res = await db.deleteAccount(user.id);
                    setActionLoading(false);

                    if (res.success) {
                      setUser(null);
                      setShowAccountModal(false);
                      setActiveTab('dashboard');
                    } else {
                      setAccountActionMsg({
                        type: 'error',
                        text: res.error || 'Failed to delete account.'
                      });
                    }
                  }}
                  className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-600/40 rounded-lg text-xs font-semibold transition-colors shrink-0 disabled:opacity-50"
                >
                  {actionLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
