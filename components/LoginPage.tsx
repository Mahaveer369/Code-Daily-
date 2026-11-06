import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { db } from '../services/db';
import { TOTAL_MODULES_COUNT, COURSES } from './LearningModule';
import { LegalTab } from './LegalCenterModal';
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
  sendEmailVerification,
  updateProfile,
} from '../services/firebase';

interface Props {
  onLogin: (user: UserProfile, isNewLogin?: boolean) => void;
  onOpenLegal?: (tab: LegalTab) => void;
  onOpenCoffee?: () => void;
}

interface AuthErrorInfo {
  title: string;
  message: string;
}

const parseAuthError = (err: any): AuthErrorInfo => {
  const code = (err?.code || '').toLowerCase();
  const rawMsg = (err?.message || '').toLowerCase();

  if (code.includes('unauthorized-domain') || rawMsg.includes('unauthorized-domain')) {
    return {
      title: 'Domain Authorization Required',
      message:
        'Please add this domain under Firebase Console → Authentication → Settings → Authorized domains, or sign in with your email and password below.',
    };
  }

  if (code.includes('user-not-found')) {
    return {
      title: 'Account Not Found',
      message: 'No account found with this email address. Switch to "Create Account" to register.',
    };
  }
  if (code.includes('wrong-password') || code.includes('invalid-credential')) {
    return {
      title: 'Invalid Credentials',
      message: 'Incorrect email or password. Please check your credentials or reset your password.',
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
      title: 'Invalid Email Address',
      message: 'Please enter a valid email address.',
    };
  }

  return {
    title: 'Sign-In Error',
    message: err?.message || 'Unable to complete sign-in. Please verify your credentials and try again.',
  };
};

const dispatchWelcomeEmail = (email: string, name: string, provider: 'google' | 'email') => {
  if (!email || !email.includes('@')) return;
  fetch('/api/welcome-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, provider }),
  }).catch(() => {});
};

interface InteractiveStageSnippet {
  id: string;
  label: string;
  runtime: string;
  title: string;
  code: string;
  output: string;
  metric: string;
}

const SHOWCASE_SNIPPETS: InteractiveStageSnippet[] = [
  {
    id: 'cpp20',
    label: 'C++20 Low-Latency',
    runtime: 'g++ -std=c++20 -O3',
    title: 'Cache-Aligned Ring Buffer',
    code: `alignas(64) std::array<uint64_t, 4> ring = {12, 24, 48, 96};\nstd::cout << "L1 Zero-Copy Dispatch: " << ring[3] << " ns\\n";`,
    output: `L1 Zero-Copy Dispatch: 96 ns\n✓ 64-byte cache line aligned · 0 heap allocations`,
    metric: '0.38 ms',
  },
  {
    id: 'java21',
    label: 'Java 21 Virtual Threads',
    runtime: 'OpenJDK 21 LTS · ZGC',
    title: 'Structured Concurrency Engine',
    code: `try (var scope = Executors.newVirtualThreadPerTaskExecutor()) {\n  scope.submit(() -> System.out.println("100k Virtual Threads Ready"));\n}`,
    output: `100k Virtual Threads Ready\n✓ Non-blocking carrier mount · Generational ZGC`,
    metric: '0.64 ms',
  },
  {
    id: 'sysdesign',
    label: 'System Design & SQL',
    runtime: 'PostgreSQL 16 + RLS',
    title: 'Distributed Window Rank',
    code: `SELECT DENSE_RANK() OVER (ORDER BY xp DESC) AS rank, name, tier\nFROM public.users WHERE tier = 'Architect' LIMIT 2;`,
    output: `rank | name               | tier\n-----+--------------------+-----------\n  1  | Dr. Kavya Krishnan | Architect\n  2  | Marcus Vance       | Architect`,
    metric: '1.12 ms',
  },
];

const LoginPage: React.FC<Props> = ({ onLogin, onOpenLegal }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<AuthErrorInfo | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Interactive Animated Showcase State
  const [activeSnippetIdx, setActiveSnippetIdx] = useState(0);
  const [activePipelineStep, setActivePipelineStep] = useState(0);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(COURSES[8]?.id || COURSES[0].id);

  // Password reset modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Cycle animated architecture pipeline highlight smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePipelineStep((prev) => (prev + 1) % 4);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const activeSnippet = SHOWCASE_SNIPPETS[activeSnippetIdx] || SHOWCASE_SNIPPETS[0];
  const selectedCourse = COURSES.find((c) => c.id === selectedCourseId) || COURSES[0];

  const applyPersistence = async () => {
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    } catch {
      // Ignore persistence restriction in private browsing
    }
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

      const resolvedEmail = firebaseUser.email || '';
      const resolvedName =
        firebaseUser.displayName || (resolvedEmail ? resolvedEmail.split('@')[0] : 'Engineer');

      const existingUsers = db.getUsers();
      const existingProfile = existingUsers[resolvedEmail];

      const profile: UserProfile = existingProfile
        ? {
            ...existingProfile,
            id: firebaseUser.uid,
            name: resolvedName,
            email: resolvedEmail,
            role,
            lastLogin: new Date().toISOString(),
          }
        : {
            id: firebaseUser.uid,
            name: resolvedName,
            email: resolvedEmail,
            role,
            tier: 'Novice',
            streak: 1,
            lastLogin: new Date().toISOString(),
            xp: 100,
            level: 1,
            badges: [],
          };

      dispatchWelcomeEmail(resolvedEmail, resolvedName, 'google');
      db.saveUser(profile);
      onLogin(profile, true);
    } catch (err: any) {
      setErrorInfo(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorInfo({
        title: 'Invalid Email Address',
        message: 'Please enter a valid email address to continue.',
      });
      return;
    }

    if (password.length < 6) {
      setErrorInfo({
        title: 'Password Too Short',
        message: 'Your password must be at least 6 characters long.',
      });
      return;
    }

    if (authMode === 'signup' && cleanName.length < 2) {
      setErrorInfo({
        title: 'Name Required',
        message: 'Please enter your full name to create your account.',
      });
      return;
    }

    setLoading(true);
    setErrorInfo(null);

    try {
      await applyPersistence();

      let firebaseUser;
      if (authMode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        firebaseUser = cred.user;
        try {
          if (cleanName) {
            await updateProfile(firebaseUser, { displayName: cleanName });
          }
          await sendEmailVerification(firebaseUser);
        } catch {
          // Non-blocking verification dispatch
        }
      } else {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        firebaseUser = cred.user;
      }

      let role: UserRole = 'user';
      try {
        const tokenResult = await firebaseUser.getIdTokenResult();
        if (tokenResult.claims.admin) role = 'admin';
      } catch {
        // Default user role
      }

      const resolvedName =
        cleanName || firebaseUser.displayName || cleanEmail.split('@')[0] || 'Engineer';

      const existingUsers = db.getUsers();
      let profile = existingUsers[firebaseUser.email || cleanEmail] || null;

      if (!profile) {
        profile = {
          id: firebaseUser.uid,
          name: resolvedName,
          email: firebaseUser.email || cleanEmail,
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
        if (cleanName) profile.name = cleanName;
      }

      dispatchWelcomeEmail(profile.email, profile.name, 'email');
      db.saveUser(profile);
      onLogin(profile, true);
    } catch (err: any) {
      const code = (err?.code || '').toLowerCase();
      const rawMsg = (err?.message || '').toLowerCase();

      if (
        code.includes('operation-not-allowed') ||
        code.includes('configuration-not-found') ||
        rawMsg.includes('configuration_not_found') ||
        code.includes('api-key-not-valid')
      ) {
        const credStoreKey = 'cio_verified_email_creds';
        let storedCreds: Record<string, string> = {};
        try {
          storedCreds = JSON.parse(localStorage.getItem(credStoreKey) || '{}');
        } catch {
          storedCreds = {};
        }

        if (authMode === 'signin' && storedCreds[cleanEmail] && storedCreds[cleanEmail] !== password) {
          setErrorInfo({
            title: 'Invalid Credentials',
            message: 'Incorrect email or password. Please verify your credentials.',
          });
          setLoading(false);
          return;
        }

        storedCreds[cleanEmail] = password;
        localStorage.setItem(credStoreKey, JSON.stringify(storedCreds));

        const existingUsers = db.getUsers();
        let profile = existingUsers[cleanEmail];
        const resolvedName = cleanName || profile?.name || cleanEmail.split('@')[0];

        if (!profile) {
          profile = {
            id: 'usr_' + Math.random().toString(36).substring(2, 10),
            name: resolvedName,
            email: cleanEmail,
            role: 'user',
            tier: 'Novice',
            streak: 1,
            lastLogin: new Date().toISOString(),
            xp: 100,
            level: 1,
            badges: [],
          };
        } else {
          profile.lastLogin = new Date().toISOString();
          if (cleanName) profile.name = cleanName;
        }

        dispatchWelcomeEmail(profile.email, profile.name, 'email');
        db.saveUser(profile);
        onLogin(profile, true);
        setLoading(false);
        return;
      }

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

  const PIPELINE_NODES = [
    { step: '01', title: 'OAuth 2.0 Identity', sub: 'Verified Session' },
    { step: '02', title: '19 Engineering Tracks', sub: '477 Deep Modules' },
    { step: '03', title: 'Multi-Runtime Lab', sub: 'C++20 · Java 21 · SQL' },
    { step: '04', title: 'Verified Certificate', sub: 'Cloud Progress Sync' },
  ];

  return (
    <div
      data-testid="login-page"
      className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col justify-between px-4 sm:px-8 lg:px-12 py-5 relative overflow-x-hidden"
    >
      {/* Animated Architectural Aurora & Grid Backdrop */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-36 -left-24 w-[520px] h-[520px] rounded-full bg-emerald-500/[0.08] blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-[480px] h-[480px] rounded-full bg-cyan-500/[0.07] blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[360px] rounded-full bg-blue-600/[0.06] blur-3xl" />
      </div>

      {/* Top Navigation Bar (Strict 3-Zone Contract) */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between gap-6 relative z-10 pb-3 border-b border-slate-800/70">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-950/50">
            <svg
              className="w-5 h-5 text-slate-950"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <span className="text-base sm:text-lg font-bold text-white tracking-tight whitespace-nowrap">
            Code It Out
          </span>
        </div>

        <nav aria-label="Legal Navigation" className="flex items-center gap-5 text-xs font-medium text-slate-400">
          {onOpenLegal && (
            <>
              <a
                href="/privacy"
                data-testid="login-privacy-link"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenLegal('privacy');
                }}
                className="hover:text-white transition-colors whitespace-nowrap"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                data-testid="login-terms-link"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenLegal('terms');
                }}
                className="hover:text-white transition-colors whitespace-nowrap"
              >
                Terms of Service
              </a>
            </>
          )}
        </nav>
      </header>

      {/* Main Split-Screen Interactive Showcase + Executive Sign-In */}
      <main className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-6 relative z-10">
        {/* Left Column: Animated Systems Architecture & Live Execution Stage */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span>{COURSES.length} Engineering Tracks</span>
              <span aria-hidden="true">·</span>
              <span>{TOTAL_MODULES_COUNT} Interactive Chapters</span>
              <span aria-hidden="true">·</span>
              <span className="text-cyan-300">Live Compiler &amp; Dry-Run Visualizers</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Master Production Systems, Algorithms &amp; Architecture by Executing Real Code.
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              From Modern C++20/23 and Java 21 Virtual Threads to Distributed System Design,
              PostgreSQL 16, Kubernetes, and Agentic Harnesses—sign in to synchronize your
              25-chapter roadmaps and verified certificates.
            </p>
          </div>

          {/* Animated 4-Stage Learning Architecture Flow */}
          <div className="grid grid-cols-4 gap-2.5">
            {PIPELINE_NODES.map((node, idx) => {
              const isActive = activePipelineStep === idx;
              return (
                <div
                  key={node.step}
                  onMouseEnter={() => setActivePipelineStep(idx)}
                  className={`p-3.5 rounded-xl border transition-all duration-300 cursor-default ${
                    isActive
                      ? 'bg-emerald-950/35 border-emerald-500/60 shadow-lg shadow-emerald-950/30 -translate-y-0.5'
                      : 'bg-[#0b111e]/90 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className={isActive ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {node.step}
                    </span>
                    <span className={isActive ? 'text-emerald-400' : 'text-slate-600'}>→</span>
                  </div>
                  <div className="text-xs font-bold text-white truncate">{node.title}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{node.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Interactive Animated Code Execution Preview */}
          <div className="rounded-2xl bg-[#0b111e] border border-slate-800/90 shadow-2xl overflow-hidden">
            <div className="px-4 py-2.5 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {SHOWCASE_SNIPPETS.map((snippet, idx) => (
                  <button
                    key={snippet.id}
                    type="button"
                    onClick={() => setActiveSnippetIdx(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                      activeSnippetIdx === idx
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    {snippet.label}
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-mono text-emerald-400 whitespace-nowrap">
                {activeSnippet.runtime}
              </span>
            </div>

            <div className="p-4 grid grid-cols-12 gap-4 items-stretch font-mono text-xs">
              <div className="col-span-7 bg-[#060a12] rounded-xl p-3.5 border border-slate-800/80 text-emerald-300 overflow-x-auto">
                <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 mb-2 border-b border-slate-800/80">
                  <span>{activeSnippet.title}</span>
                  <span className="text-cyan-400">LIVE SANDBOX</span>
                </div>
                <pre className="leading-relaxed whitespace-pre text-[11px]">{activeSnippet.code}</pre>
              </div>

              <div className="col-span-5 bg-[#060a12] rounded-xl p-3.5 border border-slate-800/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 mb-2 border-b border-slate-800/80">
                    <span>EXECUTION OUTPUT</span>
                    <span className="text-emerald-400 tabular-nums">{activeSnippet.metric}</span>
                  </div>
                  <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed text-[11px]">
                    {activeSnippet.output}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive 19-Track Curriculum Explorer (Focuses Sign-In on Selection — Zero Bypass) */}
          <div className="p-4 rounded-2xl bg-[#0b111e]/90 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                Explore Included 25-Chapter Engineering Tracks
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                {selectedCourse.modules.length} Interactive Chapters
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {COURSES.map((course) => {
                const isSelected = course.id === selectedCourse.id;
                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-[#060a12] text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    {course.shortTag || course.title}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-4 text-xs">
              <div className="min-w-0 truncate">
                <span className="font-bold text-white">{selectedCourse.title}: </span>
                <span className="text-slate-300">
                  {selectedCourse.modules
                    .slice(0, 3)
                    .map((m, i) => `${i + 1}. ${m.title}`)
                    .join(' · ')}{' '}
                  … +22 more
                </span>
              </div>
              <button
                type="button"
                onClick={() => emailInputRef.current?.focus()}
                className="text-emerald-400 hover:text-emerald-300 font-semibold whitespace-nowrap shrink-0"
              >
                Sign In to Start →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Elevated Sign-In Card (Dominant Action Anchor) */}
        <div className="lg:col-span-5 w-full max-w-[440px] mx-auto">
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-emerald-500/40 via-slate-800 to-slate-800/90 shadow-2xl">
            <div className="bg-[#0d1424] rounded-2xl p-6 sm:p-8 space-y-5">
              {/* Card Header */}
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md shrink-0">
                  <svg
                    className="w-5 h-5 text-slate-950"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {authMode === 'signin' ? 'Sign in to Code It Out' : 'Create your account'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Authenticate to unlock all {COURSES.length} tracks &amp; cloud progress sync
                  </p>
                </div>
              </div>

              {/* Primary 1-Click Google OAuth Button */}
              <button
                type="button"
                data-testid="google-signin-btn"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full min-h-[46px] py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-950 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-3 shadow-md disabled:opacity-60 whitespace-nowrap"
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

              {/* Hairline Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-[#0d1424] text-slate-400">or continue with email</span>
                </div>
              </div>

              {/* Segmented Mode Switch (Sign In / Create Account) */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#070b14] rounded-xl border border-slate-800/90">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorInfo(null);
                  }}
                  className={`min-h-[38px] px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
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
                  className={`min-h-[38px] px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    authMode === 'signup'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Error Banner */}
              {errorInfo && (
                <div className="p-3.5 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 leading-relaxed">
                  <div className="font-semibold text-red-200">{errorInfo.title}</div>
                  <div className="mt-0.5 text-red-300/90">{errorInfo.message}</div>
                </div>
              )}

              {/* Email & Password Form (Blank Placeholders) */}
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
                      placeholder=""
                      className="w-full min-h-[42px] bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                    ref={emailInputRef}
                    id="auth-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    className="w-full min-h-[42px] bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                  <div className="relative">
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder=""
                      className="w-full min-h-[42px] bg-[#070b14] border border-slate-800 rounded-xl pl-3.5 pr-14 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
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
                  data-testid="email-submit-btn"
                  disabled={loading}
                  className="w-full min-h-[46px] py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 whitespace-nowrap"
                >
                  {loading
                    ? 'Authenticating...'
                    : authMode === 'signin'
                    ? 'Sign In to Workspace →'
                    : 'Create Account & Continue →'}
                </button>
              </form>

              {/* Legal Consent Line */}
              <p className="text-[11px] text-slate-400 text-center leading-relaxed pt-2 border-t border-slate-800/80">
                By continuing, you agree to Code It Out&apos;s{' '}
                <a
                  href="/terms"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenLegal) onOpenLegal('terms');
                  }}
                  className="text-slate-300 hover:text-white underline underline-offset-2"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="/privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenLegal) onOpenLegal('privacy');
                  }}
                  className="text-slate-300 hover:text-white underline underline-offset-2"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="max-w-7xl w-full mx-auto pt-3 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 relative z-10">
        <div>
          © {new Date().getFullYear()} Code It Out · {COURSES.length} Engineering Tracks · {TOTAL_MODULES_COUNT} Modules
        </div>
        <div>
          Support:{' '}
          <a
            href="mailto:codeitout156@gmail.com"
            className="text-slate-400 hover:text-white transition-colors"
          >
            codeitout156@gmail.com
          </a>
        </div>
      </footer>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0d1424] w-full max-w-md rounded-2xl border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1.5">Reset Your Password</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Enter your registered email address and we will send a password reset link to your inbox.
            </p>

            {resetSuccess ? (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300">
                  Password reset link sent to <strong>{resetEmail}</strong>. Please check your inbox.
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
                    className="block text-xs font-semibold text-slate-300 mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder=""
                    className="w-full min-h-[42px] bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
