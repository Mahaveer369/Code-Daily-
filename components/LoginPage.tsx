
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { db } from '../services/db';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup } from 'firebase/auth';

interface Props {
  onLogin: (user: UserProfile) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Firebase Google Sign-In
   * Uses popup flow for better UX
   */
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Get ID token to send to backend (optional, for backend verification)
      const idToken = await user.getIdToken();

      // Create user profile from Firebase user
      const userProfile: UserProfile = {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        role: 'user',
        streak: 0,
        lastLogin: new Date().toISOString(),
        xp: 0,
        level: 1,
        badges: []
      };

      // Optionally sync with backend
      try {
        await fetch('http://localhost:8000/auth/google/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_token: idToken,
            access_token: (result as any)._tokenResponse?.oauthAccessToken || '',
          }),
        });
      } catch (backendError) {
        console.warn('Backend sync failed, continuing with local auth:', backendError);
      }

      db.saveUser(userProfile);
      onLogin(userProfile);

    } catch (error: any) {
      console.error('Google login error:', error);
      alert('Google login failed: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const role: UserRole = activeTab === 'admin' ? 'admin' : 'user';

      if (role === 'admin' && email !== 'admin@csprep.ai') {
        alert("Invalid Admin Credentials. Use admin@csprep.ai");
        setLoading(false);
        return;
      }

      const existingUsers = db.getUsers();
      let user = existingUsers[email];

      if (!user) {
        user = {
          id: Date.now().toString(),
          name: email.split('@')[0],
          email,
          role,
          streak: 0,
          lastLogin: new Date().toISOString(),
          xp: 0,
          level: 1,
          badges: []
        };
      } else {
        user.lastLogin = new Date().toISOString();
      }

      db.saveUser(user);
      onLogin(user);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl relative z-10 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 transform rotate-3 hover:rotate-6 transition-transform">
            <span className="text-2xl font-bold text-white">AI</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">CS Prep Academy</h1>
          <p className="text-gray-400 mt-2">The AI-Powered Path to Mastery</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-900/50 p-1 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('student')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'student' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Student Login
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'admin' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Admin Portal
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-600"
              placeholder={activeTab === 'student' ? "student@csprep.ai" : "admin@csprep.ai"}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-600"
              placeholder="••••••••"
            />
            <div className="flex justify-end mt-2">
              <a href="#" className="text-xs text-blue-400 hover:text-blue-300">Forgot Password?</a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3.5 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white
              ${activeTab === 'student' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/20' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-600/20'}`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              `Sign In as ${activeTab === 'student' ? 'Student' : 'Admin'}`
            )}
          </button>
        </form>

        {activeTab === 'student' && (
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-[#161c2d] text-gray-500">Or continue with</span></div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-xl shadow-sm bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.05-.015-2.055-3.33 .72-4.035-1.605-4.035-1.605-.54-1.38-1.335-1.755-1.335-1.755-1.087-.75.075-.735.075-.735 1.2.09 1.83 1.245 1.83 1.245 1.08 1.86 2.805 1.32 3.495 1.005.105-.78.42-1.32.765-1.62-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.225 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.295-1.56 3.3-1.23 3.3-1.23.66 1.695.24 2.925.12 3.225.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z" /></svg>
              </button>
              <button
                type="button"
                onClick={loginWithGoogle}
                disabled={loading}
                className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-xl shadow-sm bg-gray-800/50 hover:bg-gray-800 transition-colors disabled:opacity-50">
                <span className="text-white font-bold flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
