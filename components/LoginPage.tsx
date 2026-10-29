import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { db } from '../services/db';
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
  sendPasswordResetEmail
} from '../services/firebase';

interface Props {
  onLogin: (user: UserProfile) => void;
}

interface AuthErrorInfo {
  title: string;
  message: string;
  isFirebaseSetupNotice?: boolean;
}

// User-friendly Firebase error mapper with deep diagnostics
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
    rawMsg.includes('invalid-api-key')
  ) {
    return {
      title: 'Firebase Authentication Setup Required',
      message: 'Firebase project "authentication-d87db" has not had Authentication initialized in the Firebase Console yet (Identity Toolkit returned CONFIGURATION_NOT_FOUND).',
      isFirebaseSetupNotice: true
    };
  }

  if (code.includes('user-not-found')) {
    return {
      title: 'Account Not Found',
      message: 'No account found with this email. Switch to "Create Account" above to register.'
    };
  }
  if (code.includes('wrong-password') || code.includes('invalid-credential')) {
    return {
      title: 'Invalid Credentials',
      message: 'Incorrect email or password. Please verify credentials or reset your password.'
    };
  }
  if (code.includes('email-already-in-use')) {
    return {
      title: 'Email Already In Use',
      message: 'An account with this email already exists. Switch to "Sign In" to continue.'
    };
  }
  if (code.includes('weak-password')) {
    return {
      title: 'Weak Password',
      message: 'Password must be at least 6 characters with letters and numbers.'
    };
  }
  if (code.includes('invalid-email')) {
    return {
      title: 'Invalid Email',
      message: 'Please enter a valid email address format.'
    };
  }
  if (code.includes('too-many-requests')) {
    return {
      title: 'Rate Limit Reached',
      message: 'Too many failed sign-in attempts. Access is temporarily restricted. Please reset password or try again later.'
    };
  }
  if (code.includes('network-request-failed')) {
    return {
      title: 'Network Issue',
      message: 'Network connection issue. Please check your internet connectivity.'
    };
  }
  if (code.includes('account-exists-with-different-credential')) {
    return {
      title: 'Account Conflict',
      message: 'An account already exists with this email via Google. Please use Continue with Google.'
    };
  }
  if (code.includes('operation-not-supported-in-this-environment') || code.includes('popup-blocked')) {
    return {
      title: 'Browser Restriction',
      message: 'Popups or redirects are restricted in this browser frame. Please use Email and Password.'
    };
  }

  return {
    title: 'Authentication Notice',
    message: err?.message || 'Authentication failed. Please verify credentials and try again.'
  };
};

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

  // Helper to pre-apply persistence mode BEFORE any sign-in execution
  const applyPersistence = async () => {
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    } catch (e) {
      console.warn('[Auth] setPersistence notice:', e);
    }
  };

  /**
   * One-click local fallback login: enables instantaneous access to all courses
   * while Firebase Auth is being initialized in the console.
   */
  const handleContinueLocally = (customEmail?: string, customName?: string) => {
    const targetEmail = customEmail || email.trim() || 'alex.mercer@faangprep.io';
    const targetName = customName || displayName.trim() || targetEmail.split('@')[0] || 'Alex Mercer';

    const existingUsers = db.getUsers();
    let profile = existingUsers[targetEmail];

    if (!profile) {
      profile = {
        // Sentinel: Use cryptographically secure random values instead of Math.random() for sensitive data
        id: 'local_' + crypto.randomUUID().split('-')[0],
        name: targetName,
        email: targetEmail,
        role: targetEmail.includes('admin') ? 'admin' : 'user',
        streak: 3,
        lastLogin: new Date().toISOString(),
        xp: 150,
        level: 2,
        badges: []
      };
    } else {
      profile.lastLogin = new Date().toISOString();
    }

    db.saveUser(profile);
    onLogin(profile);
  };

  /**
   * Google Sign-In with automatic fallback to Redirect on popup blockers
   */
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorInfo(null);

    try {
      // Critical: set persistence BEFORE launching popup
      await applyPersistence();

      let result;
      try {
        result = await signInWithPopup(auth, googleProvider);
      } catch (popupErr: any) {
        if (popupErr.code === 'auth/popup-blocked') {
          console.warn('[Auth] Popup blocked, falling back to redirect flow');
          await signInWithRedirect(auth, googleProvider);
          return;
        }
        if (popupErr.code === 'auth/popup-closed-by-user') {
          // Benign user cancellation, do not surface as an error
          setLoading(false);
          return;
        }
        throw popupErr;
      }

      const firebaseUser = result.user;
      
      // Determine user role (admin if custom claims set, or check Firestore document)
      let role: UserRole = 'user';
      try {
        const tokenResult = await firebaseUser.getIdTokenResult();
        if (tokenResult.claims.admin) {
          role = 'admin';
        }
      } catch (tokenErr) {
        console.warn('[Auth] Token claims lookup notice:', tokenErr);
      }

      const profile: UserProfile = {
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

      await db.saveUser(profile);
      onLogin(profile);

    } catch (err: any) {
      console.error('[Auth] Google sign-in failure:', err);
      setErrorInfo(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Email and Password Sign-In / Account Creation
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorInfo(null);

    try {
      // 1. Enforce persistence setting strictly BEFORE calling auth APIs
      await applyPersistence();

      let firebaseUser;

      if (authMode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        firebaseUser = cred.user;
      } else {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        firebaseUser = cred.user;
      }

      // Check for admin role via Custom Claims
      let role: UserRole = 'user';
      try {
        const tokenResult = await firebaseUser.getIdTokenResult();
        if (tokenResult.claims.admin) {
          role = 'admin';
        }
      } catch (e) {
        // Default to user role
      }

      // Load existing profile from DB or initialize clean profile
      const existingUsers = db.getUsers();
      let profile = existingUsers[firebaseUser.email || ''] || null;

      if (!profile) {
        profile = {
          id: firebaseUser.uid,
          name: displayName.trim() || firebaseUser.displayName || email.split('@')[0],
          email: firebaseUser.email || email,
          role,
          streak: 1,
          lastLogin: new Date().toISOString(),
          xp: 100,
          level: 1,
          badges: []
        };
      } else {
        profile.lastLogin = new Date().toISOString();
        profile.id = firebaseUser.uid; // Guarantee UID alignment
      }

      await db.saveUser(profile);
      onLogin(profile);

    } catch (err: any) {
      console.error('[Auth] Email authentication failure:', err);
      setErrorInfo(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send Password Reset Email
   */
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
      console.error('[Auth] Password reset failure:', err);
      const parsed = parseAuthError(err);
      setResetError(parsed.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#131b2c]/90 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mx-auto mb-4 transform rotate-2">
            <span className="text-white font-bold text-2xl font-mono">V</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Code IIT Out</h1>
          <p className="text-xs text-slate-400 mt-1.5">FAANG SDE-2 Practical Engineering Academy</p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="flex p-1 bg-slate-900/80 rounded-xl mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setErrorInfo(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              authMode === 'signin'
                ? 'bg-blue-600 text-white shadow-md'
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
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              authMode === 'signup'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Diagnostic Error Banner */}
        {errorInfo && errorInfo.isFirebaseSetupNotice ? (
          <div className="mb-6 p-4 bg-amber-950/40 border border-amber-800/80 rounded-2xl text-xs text-amber-200 leading-relaxed animate-fadeIn space-y-3 shadow-lg">
            <div className="flex items-start gap-2.5">
              <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <div className="font-semibold text-amber-300 text-sm">{errorInfo.title}</div>
                <div className="text-[11px] text-amber-200/90 mt-1 leading-normal">
                  {errorInfo.message}
                </div>
              </div>
            </div>

            <div className="bg-[#0b0f19] p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
              <div className="font-semibold text-white">To activate in Firebase Console:</div>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-0.5">
                <li>
                  Open{' '}
                  <a
                    href="https://console.firebase.google.com/project/authentication-d87db/authentication"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 underline hover:text-blue-300 font-medium"
                  >
                    Firebase Console (authentication-d87db)
                  </a>
                </li>
                <li>Under <strong>Build → Authentication</strong>, click <strong>Get Started</strong></li>
                <li>In <strong>Sign-in method</strong>, enable <strong>Google</strong> & <strong>Email/Password</strong></li>
                <li>In <strong>Settings → Authorized domains</strong>, verify this app domain is listed</li>
              </ol>
            </div>

            <div className="pt-1 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleContinueLocally(email, displayName)}
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
              >
                <span>Continue in Local Session</span>
                <span className="text-[11px] opacity-80">(Instant Access)</span>
              </button>
            </div>
          </div>
        ) : errorInfo ? (
          <div className="mb-5 p-3.5 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 leading-relaxed flex items-start gap-2.5 animate-fadeIn">
            <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="font-semibold text-red-200">{errorInfo.title}</div>
              <div className="mt-0.5 text-red-300/90">{errorInfo.message}</div>
            </div>
          </div>
        ) : null}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="engineer@domain.com"
              className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
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
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer">
              Remember me on this browser
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : authMode === 'signin' ? (
              'Sign In to Dashboard'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-[#131b2c] text-slate-400">or continue with</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-3 disabled:opacity-60 hover:shadow-md"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Quick Demo Access Option */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={() => handleContinueLocally('alex.mercer@faangprep.io', 'Alex Mercer')}
            className="text-xs text-slate-400 hover:text-blue-400 transition-colors flex items-center justify-center gap-1.5 mx-auto py-1"
          >
            <span>Explore as Guest Engineer</span>
            <span className="text-[10px] text-slate-500 font-mono">· Demo Access</span>
          </button>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#161f30] w-full max-w-md rounded-2xl border border-slate-700 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1.5">Reset Your Password</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Enter your registered email address and we will send you a secure Firebase link to reset your credentials.
            </p>

            {resetSuccess ? (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300">
                  Password reset link sent! Please check your inbox and spam folder.
                </div>
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  Return to Sign In
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
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="engineer@domain.com"
                    className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-lg shadow-md disabled:opacity-60 flex items-center gap-2"
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
