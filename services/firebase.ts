import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
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

// SECURITY: Sentinel - Removed hardcoded Firebase API keys and secrets.
// Configuration must strictly rely on environment variables to prevent secrets leakage.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize or reuse Firebase App instance only if config is present
const isConfigured = !!firebaseConfig.apiKey;
const app = getApps().length > 0 ? getApp() : (isConfigured ? initializeApp(firebaseConfig) : null as any);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

let auth: any = null;
let firestoreDb: any = null;

if (app) {
  // Initialize Auth
  auth = getAuth(app);

  // Initialize Firestore with modern multi-tab offline cache (Firebase v10+)
  try {
    firestoreDb = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
  } catch {
    // If already initialized in HMR environment, retrieve existing instance
    firestoreDb = getFirestore(app);
  }
} else {
  console.warn("Firebase configuration is missing. Authentication and database services will be disabled.");
  // Provide dummy mocks to avoid test suite crashes and runtime errors
  auth = {} as any;
  firestoreDb = {} as any;
}

export {
  app,
  auth,
  firestoreDb,
  googleProvider,
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
