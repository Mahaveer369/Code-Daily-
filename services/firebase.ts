import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  deleteUser
} from "firebase/auth";
import appletFirebaseConfig from "../firebase-applet-config.json";

/**
 * FIREBASE AUTHENTICATION ONLY MODULE
 * ----------------------------------------------------------------------------
 * Per system architecture:
 * - Identity & Authentication (Google OAuth 2.0, Email/Password, Session JWTs)
 *   are handled exclusively by Firebase Authentication.
 * - Relational Database Persistence (Users, Course Progress, Module Milestones,
 *   Global Leaderboard, Bookmarks, Certificates, Audit Logs) is handled 100%
 *   by Supabase PostgreSQL (`services/supabase.ts`).
 */

const metaEnv = (import.meta as any).env || {};
const envApiKey = metaEnv.VITE_FIREBASE_API_KEY;
const envProjectId = metaEnv.VITE_FIREBASE_PROJECT_ID;
export const GOOGLE_OAUTH_CLIENT_ID =
  metaEnv.VITE_GOOGLE_CLIENT_ID || appletFirebaseConfig.oAuthClientId || "";

export const IS_CUSTOM_ENV_CONFIGURED = Boolean(
  (envApiKey && envApiKey !== "your-firebase-api-key") ||
  (GOOGLE_OAUTH_CLIENT_ID &&
    GOOGLE_OAUTH_CLIENT_ID !== "your-google-oauth-client-id.apps.googleusercontent.com")
);

export const firebaseConfig = {
  apiKey: envApiKey || appletFirebaseConfig.apiKey,
  authDomain:
    metaEnv.VITE_FIREBASE_AUTH_DOMAIN ||
    appletFirebaseConfig.authDomain ||
    `${envProjectId || appletFirebaseConfig.projectId}.firebaseapp.com`,
  projectId: envProjectId || appletFirebaseConfig.projectId,
  storageBucket:
    metaEnv.VITE_FIREBASE_STORAGE_BUCKET ||
    appletFirebaseConfig.storageBucket ||
    `${envProjectId || appletFirebaseConfig.projectId}.firebasestorage.app`,
  messagingSenderId:
    metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || appletFirebaseConfig.messagingSenderId,
  appId: metaEnv.VITE_FIREBASE_APP_ID || appletFirebaseConfig.appId,
  measurementId: metaEnv.VITE_FIREBASE_MEASUREMENT_ID || appletFirebaseConfig.measurementId || ""
};

// Initialize or reuse Firebase App instance safely for Authentication only
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");
googleProvider.setCustomParameters({ prompt: "select_account" });

/**
 * Retrieves the signed Firebase ID Token (JWT) to authenticate relational
 * queries against Supabase Row-Level Security (RLS) policies.
 */
export const getFirebaseAuthJwt = async (): Promise<string | null> => {
  try {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  } catch {
    return null;
  }
};

export {
  app,
  auth,
  googleProvider,
  GoogleAuthProvider,
  signInWithCredential,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  deleteUser
};
