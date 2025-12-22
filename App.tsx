
import React, { useState, useEffect } from 'react';
import { DailyPlan, UserProfile } from './types';
import { generateDailyPlan } from './services/gemini';
import { db } from './services/db';
import DailyCard from './components/DailyCard';
import ChatBot from './components/ChatBot';
import Dashboard from './components/Dashboard';
import LearningModule from './components/LearningModule';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/AdminPanel';
import { auth } from './services/firebase';

type Tab = 'dashboard' | 'daily' | 'learn' | 'admin';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [loadingDaily, setLoadingDaily] = useState(false);

  // Check for session and sync with Firebase
  useEffect(() => {
    // First check localStorage
    const cachedUser = db.getCurrentUser();
    if (cachedUser) {
      setUser(cachedUser);
      if (cachedUser.role === 'admin') setActiveTab('admin');
      else setActiveTab('dashboard');
      return;
    }

    // Also listen to Firebase auth state for Google login persistence
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser && !user) {
        // User is logged in via Firebase but not in our local state
        const userProfile: UserProfile = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          role: 'user',
          streak: 0,
          lastLogin: new Date().toISOString(),
          xp: 0,
          level: 1,
          badges: []
        };
        db.saveUser(userProfile);
        setUser(userProfile);
        setActiveTab('dashboard');
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

  const handleLogout = () => {
    db.logout();
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
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 flex overflow-hidden">

      {/* Sidebar Navigation */}
      <aside className="w-20 lg:w-72 bg-[#1e293b]/30 backdrop-blur-xl border-r border-gray-800 flex flex-col justify-between py-8 z-20 transition-all">
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
              <div className="w-9 h-9 rounded-full bg-gradient-to-b from-gray-700 to-gray-800 flex items-center justify-center text-sm font-bold ring-2 ring-gray-700 text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block overflow-hidden">
                <div className="text-sm font-bold text-white truncate">{user.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user.role} Account</div>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 flex items-center justify-center gap-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth bg-[#0f172a]">

        {/* Decorative BG */}
        <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 via-[#0f172a] to-[#0f172a] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 relative z-10">

          {/* Header */}
          <header className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                {activeTab === 'admin' ? 'System Administration' :
                  activeTab === 'daily' ? 'Daily Interview Mix' :
                    activeTab === 'learn' ? 'Learning Pathways' : 'Performance Dashboard'}
              </h2>
              <p className="text-gray-400 mt-1">
                {activeTab === 'dashboard' ? 'Track your progress and achievements' :
                  activeTab === 'learn' ? 'Master key concepts with interactive modules' :
                    'Manage your daily goals'}
              </p>
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
            <LearningModule onComplete={handleModuleComplete} />
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
      </main>

      <ChatBot />
    </div>
  );
};

export default App;
