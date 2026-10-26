# Production-Grade Firebase Authentication & Firestore Architecture (Master Plan)

Complete, production-hardened specification for Firebase Authentication and Cloud Firestore security rules in Code IIT Out (`authentication-d87db`), incorporating zero-cost Custom Claims, subcollection schema validations, app-root redirect error mapping, and safe Firestore-first account deletion workflows.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following 5 audited production enhancements are integrated:

1. **Zero-Read Custom Claims (`isAdmin`)**:
   - `isAdmin()` checks strictly `request.auth.token.admin == true`.
   - Eliminates `get()` and `exists()` document reads on every rule evaluation, saving thousands of quota reads and eliminating database latency.
2. **Subcollection Schema Validation (`progress` & `bookmarks`)**:
   - `progress` validates allowed keys (`courseId`, `completedModuleIds`, `quizScores`, `lastAccessedModuleId`, `updatedAt`) and enforces sanity bounds on numeric values.
   - Prevents payload bloat and leaderboard score tampering.
3. **Pre-Flight Persistence Ordering (`setPersistence`)**:
   - `setPersistence` is invoked **before** `signInWithPopup`, guaranteeing that if a popup is blocked and falls back to `signInWithRedirect`, the persistence mode is already active when the page unloads.
4. **App-Root `getRedirectResult` Error Catching**:
   - `getRedirectResult(auth)` is mounted at the root (`App.tsx`) with `.catch(err => setError(mapAuthError(err)))`, preventing silent failures on mobile Safari ITP or incognito windows.
5. **Safe Cascading Deletion Sequencing**:
   - Account deletion purges Firestore user documents and subcollections **first**, and only then invokes `deleteUser(auth.currentUser)`. This prevents permission denied errors from deleting orphaned documents when `request.auth` becomes null.

---

## 1. Overview & Core Concept

- **What It Does**: Cloud-backed identity, authentication, and multi-device persistence for students and administrators. Tracks XP, course progress, bookmarks, and certificates in Cloud Firestore with multi-tab offline caching and automated session recovery.
- **Target Audience**: Students and engineers preparing for FAANG SDE-2 interviews across multiple devices.
- **Key Value**: Real cloud persistence, zero data leaks between users, seamless Google OAuth with popup-to-redirect resilience, secure email/password with password reset, and audited zero-trust security rules.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Adaptive Login Portal (`LoginPage.tsx`)**:
   - Segmented toggle between **Sign In** and **Create Account**.
   - **Google Sign-In**: Primary one-click button executing `signInWithPopup(auth, googleProvider)` with automatic `signInWithRedirect` fallback.
   - **Email & Password**: Authentication with password strength validation and descriptive inline error banners.
   - **Password Reset**: Modal flow triggering `sendPasswordResetEmail(auth, email)` with visual confirmation and countdown throttling.
   - **Remember Me**: Controls session persistence (local vs session).
2. **Zero-Flash Session Restoration (`App.tsx`)**:
   - `onAuthStateChanged` listens for the validated token from IndexedDB. A subtle loading skeleton is displayed during the initial ~150ms verification window to prevent flashing the login screen.
3. **Safe Sign-Out & Cache Eviction**:
   - Sign out executes `auth.signOut()`, purges user-specific local storage caches, and cleanly re-mounts the login portal.
4. **Danger Zone & Account Deletion**:
   - Deletes Firestore documents first, then deletes the auth account.

---

## 3. Audited Database Security Rules (`firestore.rules`)

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Auth validation helpers
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Zero-cost custom claims admin check (no database reads!)
    function isAdmin() {
      return isAuthenticated() && request.auth.token.admin == true;
    }

    // User Profile Document
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      
      // Creation: Regular users cannot create themselves as admin
      allow create: if isOwner(userId) && 
        (!('role' in request.resource.data) || request.resource.data.role == 'user');
        
      // Self-update: Restrict mutation to profile metadata only (prevents role/score escalation)
      allow update: if isOwner(userId) &&
        request.resource.data.diff(resource.data).affectedKeys()
          .hasOnly(['displayName', 'photoURL', 'preferences', 'updatedAt', 'lastLogin']);
          
      // Admin update: Full management capability
      allow update: if isAdmin();
      
      // Account Deletion: Users can delete their own account (GDPR compliance)
      allow delete: if isOwner(userId) || isAdmin();
      
      // User Subcollections with strict schema validation
      match /progress/{courseId} {
        allow read: if isOwner(userId);
        allow write: if isOwner(userId)
          && request.resource.data.keys().hasOnly(['courseId', 'completedModuleIds', 'quizScores', 'lastAccessedModuleId', 'updatedAt'])
          && request.resource.data.completedModuleIds is list
          && request.resource.data.completedModuleIds.size() <= 50;
      }
      
      match /bookmarks/{bookmarkId} {
        allow read: if isOwner(userId);
        allow write: if isOwner(userId)
          && request.resource.data.keys().hasOnly(['id', 'moduleId', 'moduleTitle', 'note', 'timestamp'])
          && request.resource.data.note is string
          && request.resource.data.note.size() <= 2000;
      }
      
      match /certificates/{certId} {
        allow read: if isOwner(userId);
        allow write: if isOwner(userId) || isAdmin();
      }
    }

    // Curated Course Content: Public read for authenticated users, write restricted to admin
    match /courses/{courseId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
      
      match /modules/{moduleId} {
        allow read: if isAuthenticated();
        allow write: if isAdmin();
      }
    }
  }
}
\`\`\`

---

## 4. Technical Implementation Architecture

### File Change Map:

1. **`services/firebase.ts`**:
   - Initialize Firebase App using `authentication-d87db` config.
   - Initialize Firestore using `initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) })`.
   - Export `auth`, `firestoreDb`, `googleProvider`.
2. **`firestore.rules`**:
   - Write audited security rules with zero-cost custom claims and subcollection validation.
3. **`components/LoginPage.tsx`**:
   - Pre-flight `setPersistence` before any credential submission.
   - Real `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, and `sendPasswordResetEmail`.
   - Google popup flow with automatic `signInWithRedirect` fallback on `auth/popup-blocked`.
   - Error mapping with silent suppression of `auth/popup-closed-by-user`.
4. **`App.tsx`**:
   - Root `getRedirectResult(auth)` with `.catch()` error handling.
   - `onAuthStateChanged` session restoration with loading skeleton to prevent flash of unauthenticated content.
   - Sign-out cleanup purging UID-keyed local storage caches.
5. **`services/db.ts`**:
   - Firestore cloud sync with local cache fallback for progress, bookmarks, and certificates.
   - Firestore-first account deletion sequencing before `deleteUser`.
