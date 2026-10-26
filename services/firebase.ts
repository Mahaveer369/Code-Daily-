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

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC6JRK0s2xeVhe86q2lJEe6tl-OMuNPpuI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "authentication-d87db.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "authentication-d87db",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "authentication-d87db.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "2529239430",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:2529239430:web:f7d7fa6fe8d8a524884c07",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-E3Z8QDBLNW"
};

// Initialize or reuse Firebase App instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with modern multi-tab offline cache (Firebase v10+)
let firestoreDb;
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
