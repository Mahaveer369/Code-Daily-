
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
import Sidebar from './components/Sidebar';
import { auth } from './services/firebase';
import { Tab } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    // Restore tab from localStorage on mount
    const savedTab = localStorage.getItem('cs_active_tab') as Tab;
    return savedTab || 'dashboard';
  });
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
      if (firebaseUser) {
        // User is logged in via Firebase, check if cached user is same
        const existingUsers = db.getUsers();
        let userProfile = existingUsers[firebaseUser.email || ''] || db.getCurrentUser();

        if (!userProfile || userProfile.email !== firebaseUser.email) {
          userProfile = {
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
        }
        setUser(userProfile);
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
    <div className="min-h-screen bg-[#0f172a] font-sans text-gray-100 flex overflow-hidden">

      {/* Sidebar Navigation */}
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

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
