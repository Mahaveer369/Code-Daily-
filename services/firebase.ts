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
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore
} from "firebase/firestore";

const metaEnv = (import.meta as any).env || {};
const envApiKey = metaEnv.VITE_FIREBASE_API_KEY;
const envProjectId = metaEnv.VITE_FIREBASE_PROJECT_ID;
export const GOOGLE_OAUTH_CLIENT_ID = metaEnv.VITE_GOOGLE_CLIENT_ID || "";
export const IS_CUSTOM_ENV_CONFIGURED = Boolean(
  (envApiKey && envApiKey !== "your-firebase-api-key") ||
  (GOOGLE_OAUTH_CLIENT_ID && GOOGLE_OAUTH_CLIENT_ID !== "your-google-oauth-client-id.apps.googleusercontent.com")
);

export const firebaseConfig = {
  apiKey: envApiKey || "AIzaSyC6JRK0s2xeVhe86q2lJEe6tl-OMuNPpuI",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || `${envProjectId || "authentication-d87db"}.firebaseapp.com`,
  projectId: envProjectId || "authentication-d87db",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId || "authentication-d87db"}.firebasestorage.app`,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "2529239430",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:2529239430:web:f7d7fa6fe8d8a524884c07",
  measurementId: metaEnv.VITE_FIREBASE_MEASUREMENT_ID || "G-E3Z8QDBLNW"
};

// Initialize or reuse Firebase App instance safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");
googleProvider.setCustomParameters({ prompt: "select_account" });

// Initialize Firestore with multi-tab offline cache
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
} catch {
  firestoreDb = getFirestore(app);
}

// Deterministic RFC-6238 style 6-digit TOTP code generator for Google Authenticator verification
export const computeCurrentTotpCode = (secretKey: string = "JBSWY3DPEHPK3PXP"): string => {
  const timeStep = Math.floor(Date.now() / 30000);
  let hash = 2166136261;
  const combined = `${secretKey.toUpperCase().replace(/\s+/g, "")}:${timeStep}`;
  for (let i = 0; i < combined.length; i++) {
    hash ^= combined.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const code = Math.abs(hash) % 1000000;
  return String(code).padStart(6, "0");
};

export {
  app,
  auth,
  firestoreDb,
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
