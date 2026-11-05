import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { db } from '../services/db';
import { TOTAL_MODULES_COUNT, COURSES } from './LearningModule';
import {
  auth,
  googleProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from '../services/firebase';

interface Props {
  onLogin: (user: UserProfile) => void;
}

interface AuthErrorInfo {
  title: string;
  message: string;
  isFirebaseSetupNotice?: boolean;
}

const parseAuthError = (err: any): AuthErrorInfo => {
  const code = (err?.code || '').toLowerCase();
  const rawMsg = (err?.message || '').toLowerCase();

  if (
    code.includes('api-key-not-valid') ||
    rawMsg.includes('api-key-not-valid') ||
    code.includes('configuration-not-found') ||
    rawMsg.includes('configuration_not_found') ||
    rawMsg.includes('configuration-not-found') ||
    code.includes('invalid-api-key') ||
    rawMsg.includes('invalid-api-key') ||
    code.includes('unauthorized-domain')
  ) {
    return {
      title: 'Cloud OAuth Domain Notice',
      message:
        'Google Sign-In requires this domain to be listed under Firebase Authentication → Settings → Authorized domains, or you can continue immediately in your local workspace below.',
      isFirebaseSetupNotice: true,
    };
  }

  if (code.includes('user-not-found')) {
    return {
      title: 'Account Not Found',
      message: 'No account found with this email. Switch to "Create Account" to register.',
    };
  }
  if (code.includes('wrong-password') || code.includes('invalid-credential')) {
    return {
      title: 'Invalid Credentials',
      message: 'Incorrect email or password. Please verify your credentials or reset your password.',
    };
  }
  if (code.includes('email-already-in-use')) {
    return {
      title: 'Email Already Registered',
      message: 'An account with this email already exists. Switch to "Sign In" to continue.',
    };
  }
  if (code.includes('weak-password')) {
    return {
      title: 'Password Too Short',
      message: 'Password must be at least 6 characters long.',
    };
  }
  if (code.includes('invalid-email')) {
    return {
      title: 'Invalid Email Format',
      message: 'Please enter a valid email address.',
    };
  }

  return {
    title: 'Authentication Notice',
    message: err?.message || 'Unable to complete sign-in. Please verify your credentials and try again.',
  };
};

const FEATURE_PILLARS = [
  {
    title: '19 Start-to-End Engineering Tracks',
    detail: '25 deep chapters per track across C++20/23, Java 21 LTS, DSA, System Design, Python, SQL, React 19, Docker/K8s & Terraform.',
  },
  {
    title: 'Course-Suited Popup IDE & CLI Sandbox',
    detail: 'Execute C++20, Java 21 HotSpot, Python 3.12, SQL, HTML/CSS DOM, and Git/Kubernetes/Terraform CLI commands in real time.',
  },
  {
    title: '25-Node Learning Path & Global Leaderboard',
    detail: 'Earn +50 XP per chapter and +100–250 XP per coding problem to advance from Novice to Distinguished Architect.',
  },
];

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<AuthErrorInfo | null>(null);

  // Password reset modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const applyPersistence = async () => {
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    } catch {
      // Ignore persistence restriction in private browsing
    }
  };

  const handleContinueLocally = (customEmail?: string, customName?: string) => {
    const targetEmail = customEmail || email.trim() || 'alex.mercer@codeitout.io';
    const targetName =
      customName || displayName.trim() || targetEmail.split('@')[0] || 'Alex Mercer';

    const existingUsers = db.getUsers();
    let profile = existingUsers[targetEmail];

    if (!profile) {
      profile = {
        id: 'local_' + Math.random().toString(36).substring(2, 9),
        name: targetName,
        email: targetEmail,
        role: targetEmail.includes('admin') ? 'admin' : 'user',
        tier: 'Novice',
        streak: 5,
        lastLogin: new Date().toISOString(),
        xp: 250,
        level: 1,
        badges: [],
      };
    } else {
      profile.lastLogin = new Date().toISOString();
    }

    db.saveUser(profile);
    onLogin(profile);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorInfo(null);

    try {
      await applyPersistence();

      let result;
      try {
        result = await signInWithPopup(auth, googleProvider);
      } catch (popupErr: any) {
        if (popupErr.code === 'auth/popup-blocked') {
          await signInWithRedirect(auth, googleProvider);
          return;
        }
        if (popupErr.code === 'auth/popup-closed-by-user') {
          setLoading(false);
          return;
        }
        throw popupErr;
      }

      const firebaseUser = result.user;
      let role: UserRole = 'user';
      try {
        const tokenResult = await firebaseUser.getIdTokenResult();
        if (tokenResult.claims.admin) role = 'admin';
      } catch {
        // Default user role
      }

      const profile: UserProfile = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Engineer',
        email: firebaseUser.email || '',
        role,
        tier: 'Novice',
        streak: 1,
        lastLogin: new Date().toISOString(),
        xp: 100,
        level: 1,
        badges: [],
      };

      db.saveUser(profile);
      onLogin(profile);
    } catch (err: any) {
      setErrorInfo(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorInfo(null);

    try {
      await applyPersistence();

      let firebaseUser;
      if (authMode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        firebaseUser = cred.user;
      } else {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        firebaseUser = cred.user;
      }

      let role: UserRole = 'user';
      try {
        const tokenResult = await firebaseUser.getIdTokenResult();
        if (tokenResult.claims.admin) role = 'admin';
      } catch {
        // Default user role
      }

      const existingUsers = db.getUsers();
      let profile = existingUsers[firebaseUser.email || ''] || null;

      if (!profile) {
        profile = {
          id: firebaseUser.uid,
          name: displayName.trim() || firebaseUser.displayName || email.split('@')[0],
          email: firebaseUser.email || email,
          role,
          tier: 'Novice',
          streak: 1,
          lastLogin: new Date().toISOString(),
          xp: 100,
          level: 1,
          badges: [],
        };
      } else {
        profile.lastLogin = new Date().toISOString();
        profile.id = firebaseUser.uid;
      }

      db.saveUser(profile);
      onLogin(profile);
    } catch (err: any) {
      setErrorInfo(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setResetError('Please enter your registered email address.');
      return;
    }

    setResetLoading(true);
    setResetError(null);
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setResetSuccess(true);
    } catch (err: any) {
      const parsed = parseAuthError(err);
      setResetError(parsed.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-10 relative overflow-x-hidden">
      {/* Subtle Architectural Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      >
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column (Desktop Showcase Panel): Curriculum & Architecture Value Proposition */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between space-y-8 pr-4">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 text-emerald-400 text-xs font-mono font-semibold">
              <span>{COURSES.length} Engineering Tracks</span>
              <span aria-hidden="true">·</span>
              <span>{TOTAL_MODULES_COUNT} Interactive Modules</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Master Systems, Languages &amp; Distributed Architecture by Writing Real Code.
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              From low-latency C++20/23 and Java 21 Virtual Threads to System Design, Kubernetes,
              Terraform CI/CD, and Agentic Harnesses—every chapter pairs architectural blueprints
              with a live interactive execution sandbox.
            </p>
          </div>

          {/* 3 Architectural Pillars */}
          <div className="space-y-3.5">
            {FEATURE_PILLARS.map((pillar, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#0e1628]/90 border border-slate-800/90 flex items-start gap-3.5"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  0{idx + 1}
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">{pillar.title}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{pillar.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Track Preview Matrix */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-xs font-semibold text-slate-400 mb-2">
              Included 25-Chapter Engineering Tracks
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {COURSES.map((c) => c.shortTag || c.title).join(' · ')}
            </p>
          </div>
        </div>

        {/* Right Column: Clean, High-Craft SaaS Authentication Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="bg-[#111827] border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Brand Header */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shrink-0">
                <svg
                  className="w-6 h-6 text-slate-950"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-white tracking-tight">Code It Out</h2>
                <p className="text-xs text-slate-400 truncate">
                  {COURSES.length} Tracks · {TOTAL_MODULES_COUNT} Interactive Modules
                </p>
              </div>
            </div>

            {/* Primary 1-Click OAuth Action */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full min-h-[46px] py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-3 shadow-sm disabled:opacity-60 whitespace-nowrap"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Clean Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[11px]">
                <span className="px-3 bg-[#111827] text-slate-400 font-medium">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Segmented Mode Selector (Sign In / Create Account only — no exposed 2FA keys) */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0b101b] rounded-xl border border-slate-800/90">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorInfo(null);
                }}
                className={`min-h-[38px] px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  authMode === 'signin'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorInfo(null);
                }}
                className={`min-h-[38px] px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  authMode === 'signup'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error / Fallback Notice */}
            {errorInfo && errorInfo.isFirebaseSetupNotice ? (
              <div className="p-3.5 bg-amber-950/40 border border-amber-800/70 rounded-xl text-xs text-amber-200 leading-relaxed space-y-2.5">
                <div>
                  <div className="font-semibold text-amber-300">{errorInfo.title}</div>
                  <div className="text-[11px] text-amber-200/90 mt-0.5">{errorInfo.message}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleContinueLocally(email, displayName)}
                  className="w-full min-h-[40px] py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition-colors"
                >
                  Continue to Workspace Immediately →
                </button>
              </div>
            ) : errorInfo ? (
              <div className="p-3.5 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 leading-relaxed">
                <div className="font-semibold text-red-200">{errorInfo.title}</div>
                <div className="mt-0.5 text-red-300/90">{errorInfo.message}</div>
              </div>
            ) : null}

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label
                    htmlFor="signup-name"
                    className="block text-xs font-semibold text-slate-300 mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Alex Mercer"
                    className="w-full min-h-[42px] bg-[#0b101b] border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="auth-email"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="w-full min-h-[42px] bg-[#0b101b] border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="auth-password" className="text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  {authMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(email);
                        setResetSuccess(false);
                        setResetError(null);
                        setShowResetModal(true);
                      }}
                      className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  id="auth-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full min-h-[42px] bg-[#0b101b] border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <label
                  htmlFor="remember"
                  className="inline-flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none"
                >
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[46px] py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
              >
                {loading
                  ? 'Signing in...'
                  : authMode === 'signin'
                  ? 'Sign In to Workspace'
                  : 'Create Engineer Account'}
              </button>
            </form>

            {/* Instant Guest Engineer Access Button (Clean Single-Row Full-Width Button) */}
            <div className="pt-4 border-t border-slate-800/80">
              <button
                type="button"
                data-testid="guest-login-btn"
                onClick={() => handleContinueLocally('alex.mercer@codeitout.io', 'Alex Mercer')}
                className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#0b101b] hover:bg-slate-800/80 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center justify-between gap-2 whitespace-nowrap"
              >
                <span>Continue as Guest</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {TOTAL_MODULES_COUNT} Modules →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#131b2c] w-full max-w-md rounded-2xl border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1.5">Reset Your Password</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Enter your registered email address and we will send a password reset link to your inbox.
            </p>

            {resetSuccess ? (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300">
                  Password reset link sent. Please check your email inbox.
                </div>
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="w-full min-h-[42px] py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                {resetError && (
                  <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300">
                    {resetError}
                  </div>
                )}
                <div>
                  <label
                    htmlFor="reset-email"
                    className="block text-xs font-semibold text-slate-300 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="engineer@company.com"
                    className="w-full min-h-[42px] bg-[#0b101b] border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="min-h-[40px] px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="min-h-[40px] px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-lg disabled:opacity-60"
                  >
                    {resetLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
