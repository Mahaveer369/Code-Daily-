import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    // 🛡️ Sentinel: Prevented hardcoded secret in client code
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "subhanisstudent.firebaseapp.com",
    projectId: "subhanisstudent",
    storageBucket: "subhanisstudent.firebasestorage.app",
    messagingSenderId: "495507046470",
    appId: "1:495507046470:web:651c4ff15b860e4d0d8a47",
    measurementId: "G-0KT2Q44B2G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
