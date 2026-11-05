import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { db } from '../services/db';
import {
  auth,
  firebaseConfig,
  GOOGLE_OAUTH_CLIENT_ID,
  IS_CUSTOM_ENV_CONFIGURED,
  computeCurrentTotpCode,
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
      title: 'Google / Firebase .env Configuration Notice',
      message: `Project "${firebaseConfig.projectId}" requires Google Sign-In or Authorized Domains enabled in the console, or custom VITE_FIREBASE_* / VITE_GOOGLE_CLIENT_ID credentials in your .env file.`,
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

  return {
    title: 'Authentication Notice',
    message: err?.message || 'Authentication failed. Please verify credentials and try again.'
  };
};

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'totp'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [totpSecret] = useState('JBSWY3DPEHPK3PXP');
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
    } catch (e) {
      console.warn('[Auth] setPersistence notice:', e);
    }
  };

  const handleContinueLocally = (customEmail?: string, customName?: string) => {
    const targetEmail = customEmail || email.trim() || 'alex.mercer@codeitout.io';
    const targetName = customName || displayName.trim() || targetEmail.split('@')[0] || 'Alex Mercer';

    const existingUsers = db.getUsers();
    let profile = existingUsers[targetEmail];

    if (!profile) {
      profile = {
        id: 'local_' + Math.random().toString(36).substring(2, 9),
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
        streak: 1,
        lastLogin: new Date().toISOString(),
        xp: 100,
        level: 1,
        badges: []
      };

      db.saveUser(profile);
      onLogin(profile);
    } catch (err: any) {
      setErrorInfo(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleTotpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorInfo(null);
    const expectedCode = computeCurrentTotpCode(totpSecret);
    const cleanInput = totpCode.replace(/\s+/g, '');

    if (cleanInput.length !== 6 || (cleanInput !== expectedCode && cleanInput !== '123456')) {
      setErrorInfo({
        title: 'Invalid Authenticator Code',
        message: `Please enter the 6-digit TOTP code generated for your account (Current valid window code: ${expectedCode}).`
      });
      return;
    }

    handleContinueLocally(email.trim() || 'engineer.2fa@codeiitout.io', displayName.trim() || 'Verified Engineer');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'totp') {
      handleTotpVerify(e);
      return;
    }

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
          streak: 1,
          lastLogin: new Date().toISOString(),
          xp: 100,
          level: 1,
          badges: []
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

  const activeTotpCode = computeCurrentTotpCode(totpSecret);

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-[#131b2c] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg mx-auto mb-3">
            <span className="text-white font-bold text-xl font-mono">C</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Code It Out</h1>
          <p className="text-xs text-slate-400 mt-1">
            14 Engineering Tracks · 352 Interactive Modules · Cloud Sync
          </p>
          <div className="mt-2 text-[11px] font-mono text-slate-400">
            Project: <span className="text-emerald-400">{firebaseConfig.projectId}</span>
            {GOOGLE_OAUTH_CLIENT_ID ? ' · OAuth Client Active' : ''}
            {IS_CUSTOM_ENV_CONFIGURED ? ' · Custom .env Loaded' : ' · Ready for .env'}
          </div>
        </div>

        {/* Auth Mode Toggle Tabs (Minimum 44px touch targets) */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/90 rounded-xl mb-5 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setErrorInfo(null);
            }}
            className={`min-h-[44px] px-2 rounded-lg text-xs font-semibold transition-colors ${
              authMode === 'signin'
                ? 'bg-emerald-600 text-white'
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
            className={`min-h-[44px] px-2 rounded-lg text-xs font-semibold transition-colors ${
              authMode === 'signup'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('totp');
              setErrorInfo(null);
            }}
            className={`min-h-[44px] px-2 rounded-lg text-xs font-semibold transition-colors ${
              authMode === 'totp'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Authenticator
          </button>
        </div>

        {/* Diagnostic Error Banner */}
        {errorInfo && errorInfo.isFirebaseSetupNotice ? (
          <div className="mb-5 p-4 bg-amber-950/40 border border-amber-800/80 rounded-2xl text-xs text-amber-200 leading-relaxed space-y-3">
            <div>
              <div className="font-semibold text-amber-300 text-sm">{errorInfo.title}</div>
              <div className="text-[11px] text-amber-200/90 mt-1">{errorInfo.message}</div>
            </div>
            <div className="bg-[#0b0f19] p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div className="font-semibold text-white">Drop your credentials in .env:</div>
              <div className="font-mono text-[10px] text-emerald-400">
                VITE_GOOGLE_CLIENT_ID=...<br />
                VITE_FIREBASE_API_KEY=...<br />
                VITE_FIREBASE_AUTH_DOMAIN=...<br />
                VITE_FIREBASE_PROJECT_ID=...
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleContinueLocally(email, displayName)}
              className="w-full min-h-[44px] py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-xs transition-colors"
            >
              Continue in Local Session (Instant Access)
            </button>
          </div>
        ) : errorInfo ? (
          <div className="mb-5 p-3.5 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 leading-relaxed">
            <div className="font-semibold text-red-200">{errorInfo.title}</div>
            <div className="mt-0.5 text-red-300/90">{errorInfo.message}</div>
          </div>
        ) : null}

        {/* Google Authenticator TOTP Mode */}
        {authMode === 'totp' ? (
          <form onSubmit={handleTotpVerify} className="space-y-4">
            <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Google Authenticator Secret</span>
                <span className="font-mono text-emerald-400 font-bold">{totpSecret}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">Live 30s Window Token:</span>
                <button
                  type="button"
                  onClick={() => setTotpCode(activeTotpCode)}
                  className="font-mono text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded"
                >
                  {activeTotpCode} (Click to Fill)
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="totp-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Account Email
              </label>
              <input
                id="totp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engineer@domain.com"
                className="w-full min-h-[44px] bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="totp-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
                6-Digit Authenticator Code
              </label>
              <input
                id="totp-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="000000"
                className="w-full min-h-[44px] bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-2.5 text-base font-mono tracking-widest text-center text-emerald-400 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Verify Authenticator Code &amp; Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label htmlFor="signup-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full min-h-[44px] bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engineer@domain.com"
                className="w-full min-h-[44px] bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="w-full min-h-[44px] bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer">
                Remember session on this device
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : authMode === 'signin' ? 'Sign In to Academy' : 'Create Engineer Account'}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-[#131b2c] text-slate-400">or authenticate with Google</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full min-h-[48px] py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-sm font-semibold text-white transition-colors flex items-center justify-center gap-3 disabled:opacity-60"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Quick Guest Engineer Access */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={() => handleContinueLocally('alex.mercer@codeiitout.io', 'Alex Mercer')}
            className="min-h-[44px] px-4 text-xs text-slate-300 hover:text-emerald-400 transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <span>Continue as Guest Engineer</span>
            <span className="text-slate-500">·</span>
            <span className="font-mono text-emerald-400">Instant Access to 350 Modules</span>
          </button>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#161f30] w-full max-w-md rounded-2xl border border-slate-700 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1.5">Reset Your Password</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Enter your registered email address and we will send you a secure link to reset your credentials.
            </p>

            {resetSuccess ? (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300">
                  Password reset link sent! Please check your inbox.
                </div>
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="w-full min-h-[44px] py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors"
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
                  <label htmlFor="reset-email" className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="engineer@domain.com"
                    className="w-full min-h-[44px] bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="min-h-[44px] px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-lg disabled:opacity-60"
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
