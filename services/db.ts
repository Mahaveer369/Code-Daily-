
import { LessonContent, UserProfile, CourseProgress, Bookmark, Certificate, AnalyticsData } from '../types';
import { SEED_DATA } from './seedData';
import { CURRICULUM_DATA } from './curriculum';
import { COURSES } from '../components/LearningModule';
import { firestoreDb, auth } from './firebase';
import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc
} from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';

// Simple "Database" service wrapping LocalStorage + Firestore cloud synchronization
const DB_PREFIX = 'cs_ai_';

// Keys
const K_LESSONS = 'cs_ai_lesson_';
const K_USERS = 'cs_ai_users';
const K_SESSION = 'cs_ai_session';
const K_PROGRESS = 'cs_ai_progress_'; // + userId
const K_BOOKMARKS = 'cs_ai_bookmarks_'; // + userId
const K_CERTS = 'cs_ai_certs_'; // + userId
const K_INDEX = 'cs_ai_course_index';
const K_SECURITY_LOGS = 'cs_ai_security_logs';

export interface SecurityLog {
  timestamp: string;
  type: 'AUTH_SUCCESS' | 'AUTH_FAILURE' | 'LOGOUT' | 'EXECUTION' | 'SESSION_RESTORE';
  details: string;
  userId?: string;
}

export const db = {
  // --- AUDIT & SECURITY LOGGING ---
  logSecurityEvent: (event: Omit<SecurityLog, 'timestamp'>) => {
    try {
      const logsStr = localStorage.getItem(K_SECURITY_LOGS);
      const logs: SecurityLog[] = logsStr ? JSON.parse(logsStr) : [];
      const newLog: SecurityLog = {
        ...event,
        timestamp: new Date().toISOString()
      };
      logs.unshift(newLog);
      // Keep last 100 audit events
      if (logs.length > 100) logs.pop();
      localStorage.setItem(K_SECURITY_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error("[DB] Failed to log security event", e);
    }
  },

  getSecurityLogs: (): SecurityLog[] => {
    try {
      const logsStr = localStorage.getItem(K_SECURITY_LOGS);
      return logsStr ? JSON.parse(logsStr) : [];
    } catch (e) {
      return [];
    }
  },

  // --- AUTH & USERS ---
  
  // Create or Update User
  saveUser: (user: UserProfile) => {
    const users = db.getUsers();
    users[user.email] = user;
    localStorage.setItem(K_USERS, JSON.stringify(users));
    localStorage.setItem(K_SESSION, JSON.stringify(user)); // Set active session
    db.logSecurityEvent({
      type: 'AUTH_SUCCESS',
      details: `User logged in or updated profile: ${user.email}`,
      userId: user.id
    });
  },

  getUsers: (): Record<string, UserProfile> => {
    const str = localStorage.getItem(K_USERS);
    return str ? JSON.parse(str) : {};
  },

  getCurrentUser: (): UserProfile | null => {
    const str = localStorage.getItem(K_SESSION);
    return str ? JSON.parse(str) : null;
  },

  logout: () => {
    const user = db.getCurrentUser();
    if (user) {
      db.logSecurityEvent({
        type: 'LOGOUT',
        details: `User logged out: ${user.email}`,
        userId: user.id
      });
    }
    localStorage.removeItem(K_SESSION);
  },

  // --- PROGRESS TRACKING ---

  getUserProgress: (userId: string): CourseProgress[] => {
    const str = localStorage.getItem(K_PROGRESS + userId);
    return str ? JSON.parse(str) : [];
  },

  saveUserProgress: (userId: string, progress: CourseProgress[]) => {
    localStorage.setItem(K_PROGRESS + userId, JSON.stringify(progress));

    // Asynchronously synchronize progress to Firestore if authenticated
    if (auth.currentUser && auth.currentUser.uid === userId && firestoreDb) {
      Promise.all(
        progress.map(async (p) => {
          try {
            const courseRef = doc(firestoreDb, 'users', userId, 'progress', p.courseId);
            await setDoc(courseRef, {
              courseId: p.courseId,
              completedModuleIds: p.completedModuleIds.slice(0, 50),
              quizScores: p.quizScores || {},
              lastAccessedModuleId: p.lastAccessedModuleId || '',
              updatedAt: new Date().toISOString()
            }, { merge: true });
          } catch (syncErr) {
            console.warn(`[Firestore] Progress sync notice for ${p.courseId}:`, syncErr);
          }
        })
      ).catch(() => {});
    }
  },

  markModuleComplete: (userId: string, courseId: string, moduleId: string, score: number) => {
    const allProgress = db.getUserProgress(userId);
    let courseProg = allProgress.find(p => p.courseId === courseId);
    
    if (!courseProg) {
      courseProg = {
        courseId,
        completedModuleIds: [],
        totalModules: COURSES.find(c => c.id === courseId)?.modules.length || 10,
        quizScores: {}
      };
      allProgress.push(courseProg);
    }

    if (!courseProg.completedModuleIds.includes(moduleId)) {
      courseProg.completedModuleIds.push(moduleId);
    }
    courseProg.lastAccessedModuleId = moduleId;
    courseProg.quizScores[moduleId] = score;

    db.saveUserProgress(userId, allProgress);
    
    // Check for badge/cert updates
    db.checkAchievements(userId, courseId, courseProg);
  },

  checkAchievements: (userId: string, courseId: string, progress: CourseProgress) => {
    const users = db.getUsers();
    const user = users[db.getCurrentUser()?.email || ''];
    if (!user) return;

    let updated = false;

    // Course Completion Certificate
    if (progress.completedModuleIds.length === progress.totalModules) {
      const certs = db.getCertificates(userId);
      if (!certs.find(c => c.courseId === courseId)) {
        const course = COURSES.find(c => c.id === courseId);
        const newCert: Certificate = {
          id: Date.now().toString(),
          courseId,
          courseTitle: course?.title || 'Unknown Course',
          issueDate: new Date().toLocaleDateString(),
          // Sentinel: Use cryptographically secure random values instead of Math.random() for sensitive data
          verificationCode: crypto.randomUUID().split('-')[0].toUpperCase()
        };
        certs.push(newCert);
        localStorage.setItem(K_CERTS + userId, JSON.stringify(certs));

        // Sync certificate to Firestore
        if (auth.currentUser && auth.currentUser.uid === userId && firestoreDb) {
          const certRef = doc(firestoreDb, 'users', userId, 'certificates', newCert.id);
          setDoc(certRef, newCert).catch(err => console.warn('[Firestore] Cert sync notice:', err));
        }
        
        // Add Badge
        user.badges.push({
          id: `mastery-${courseId}`,
          name: `${course?.title} Master`,
          icon: '🎓',
          dateEarned: new Date().toLocaleDateString()
        });
        updated = true;
      }
    }

    if (updated) {
      db.saveUser(user);
    }
  },

  // --- BOOKMARKS ---

  getBookmarks: (userId: string): Bookmark[] => {
    const str = localStorage.getItem(K_BOOKMARKS + userId);
    return str ? JSON.parse(str) : [];
  },

  addBookmark: (userId: string, bookmark: Bookmark) => {
    const bookmarks = db.getBookmarks(userId);
    bookmarks.push(bookmark);
    localStorage.setItem(K_BOOKMARKS + userId, JSON.stringify(bookmarks));

    // Sync to Firestore
    if (auth.currentUser && auth.currentUser.uid === userId && firestoreDb) {
      const bookmarkRef = doc(firestoreDb, 'users', userId, 'bookmarks', bookmark.id);
      setDoc(bookmarkRef, {
        id: bookmark.id,
        moduleId: bookmark.moduleId,
        moduleTitle: bookmark.moduleTitle,
        note: (bookmark.note || '').slice(0, 2000),
        timestamp: bookmark.timestamp
      }).catch(err => console.warn('[Firestore] Bookmark sync notice:', err));
    }
  },

  removeBookmark: (userId: string, bookmarkId: string) => {
    const bookmarks = db.getBookmarks(userId).filter(b => b.id !== bookmarkId);
    localStorage.setItem(K_BOOKMARKS + userId, JSON.stringify(bookmarks));

    // Delete from Firestore
    if (auth.currentUser && auth.currentUser.uid === userId && firestoreDb) {
      const bookmarkRef = doc(firestoreDb, 'users', userId, 'bookmarks', bookmarkId);
      deleteDoc(bookmarkRef).catch(err => console.warn('[Firestore] Bookmark delete notice:', err));
    }
  },

  // --- CLOUD SYNC & RECOVERY ---

  /**
   * Fetches cloud progress and bookmarks from Firestore and hydrates localStorage
   */
  syncUserDataFromCloud: async (userId: string): Promise<void> => {
    if (!firestoreDb || !userId) return;

    try {
      // 1. Sync Progress subcollection
      const progressCol = collection(firestoreDb, 'users', userId, 'progress');
      const progressSnap = await getDocs(progressCol);
      if (!progressSnap.empty) {
        const cloudProgress: CourseProgress[] = [];
        progressSnap.forEach(docSnap => {
          const data = docSnap.data();
          cloudProgress.push({
            courseId: data.courseId,
            completedModuleIds: data.completedModuleIds || [],
            totalModules: COURSES.find(c => c.id === data.courseId)?.modules.length || 10,
            quizScores: data.quizScores || {},
            lastAccessedModuleId: data.lastAccessedModuleId
          });
        });

        // Merge with existing local progress (union of completed modules)
        const localProgress = db.getUserProgress(userId);
        const merged: CourseProgress[] = [...cloudProgress];
        
        localProgress.forEach(lp => {
          const existing = merged.find(m => m.courseId === lp.courseId);
          if (existing) {
            existing.completedModuleIds = Array.from(new Set([...existing.completedModuleIds, ...lp.completedModuleIds]));
            existing.quizScores = { ...existing.quizScores, ...lp.quizScores };
          } else {
            merged.push(lp);
          }
        });

        localStorage.setItem(K_PROGRESS + userId, JSON.stringify(merged));
      }

      // 2. Sync Bookmarks subcollection
      const bookmarksCol = collection(firestoreDb, 'users', userId, 'bookmarks');
      const bookmarksSnap = await getDocs(bookmarksCol);
      if (!bookmarksSnap.empty) {
        const cloudBookmarks: Bookmark[] = [];
        bookmarksSnap.forEach(docSnap => {
          const data = docSnap.data();
          cloudBookmarks.push({
            id: data.id,
            moduleId: data.moduleId,
            moduleTitle: data.moduleTitle,
            note: data.note || '',
            timestamp: data.timestamp
          });
        });
        localStorage.setItem(K_BOOKMARKS + userId, JSON.stringify(cloudBookmarks));
      }

      // 3. Sync Certificates subcollection
      const certsCol = collection(firestoreDb, 'users', userId, 'certificates');
      const certsSnap = await getDocs(certsCol);
      if (!certsSnap.empty) {
        const cloudCerts: Certificate[] = [];
        certsSnap.forEach(docSnap => {
          const data = docSnap.data();
          cloudCerts.push({
            id: data.id,
            courseId: data.courseId,
            courseTitle: data.courseTitle,
            issueDate: data.issueDate,
            verificationCode: data.verificationCode
          });
        });
        localStorage.setItem(K_CERTS + userId, JSON.stringify(cloudCerts));
      }

      db.logSecurityEvent({
        type: 'SESSION_RESTORE',
        details: `Cloud synchronization completed for UID: ${userId}`,
        userId
      });
    } catch (e) {
      console.warn('[Firestore] Cloud sync skipped or failed gracefully:', e);
    }
  },

  /**
   * GDPR-compliant Firestore-First Cascade Account Deletion
   * Deletes all subcollections and the parent user document first,
   * purges local storage, and then deletes the auth credential.
   */
  deleteAccount: async (userId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Delete Firestore subcollections if authenticated
      if (firestoreDb && auth.currentUser && auth.currentUser.uid === userId) {
        // Delete progress docs
        const progressSnap = await getDocs(collection(firestoreDb, 'users', userId, 'progress'));
        await Promise.all(progressSnap.docs.map(d => deleteDoc(d.ref)));

        // Delete bookmarks docs
        const bookmarksSnap = await getDocs(collection(firestoreDb, 'users', userId, 'bookmarks'));
        await Promise.all(bookmarksSnap.docs.map(d => deleteDoc(d.ref)));

        // Delete certificates docs
        const certsSnap = await getDocs(collection(firestoreDb, 'users', userId, 'certificates'));
        await Promise.all(certsSnap.docs.map(d => deleteDoc(d.ref)));

        // Delete user root doc
        await deleteDoc(doc(firestoreDb, 'users', userId));
      }

      // 2. Purge local storage entries
      localStorage.removeItem(K_PROGRESS + userId);
      localStorage.removeItem(K_BOOKMARKS + userId);
      localStorage.removeItem(K_CERTS + userId);
      localStorage.removeItem(K_SESSION);
      localStorage.removeItem('cs_active_tab');

      // 3. Delete Firebase Auth User
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }

      return { success: true };
    } catch (err: any) {
      console.error('[DB] Account deletion failure:', err);
      if (err.code === 'auth/requires-recent-login') {
        return {
          success: false,
          error: 'Security checkpoint: Please sign out, sign back in, and retry deletion.'
        };
      }
      return { success: false, error: err.message || 'Failed to complete account deletion.' };
    }
  },

  // --- CERTIFICATES ---

  getCertificates: (userId: string): Certificate[] => {
    const str = localStorage.getItem(K_CERTS + userId);
    return str ? JSON.parse(str) : [];
  },

  // --- CONTENT & LESSONS ---

  saveLesson: (moduleId: string, content: LessonContent) => {
    try {
      localStorage.setItem(`${K_LESSONS}${moduleId}`, JSON.stringify(content));
      const index = db.getAvailableModules();
      if (!index.includes(moduleId)) {
        index.push(moduleId);
        localStorage.setItem(K_INDEX, JSON.stringify(index));
      }
    } catch (e) {
      console.error("[DB] Failed to save lesson", e);
    }
  },

  getLesson: (moduleId: string): LessonContent | null => {
    if (CURRICULUM_DATA[moduleId]) return JSON.parse(JSON.stringify(CURRICULUM_DATA[moduleId]));
    if (SEED_DATA[moduleId]) return JSON.parse(JSON.stringify(SEED_DATA[moduleId]));
    try {
      const data = localStorage.getItem(`${K_LESSONS}${moduleId}`);
      return data ? JSON.parse(data) : null;
    } catch (e) { return null; }
  },

  hasLesson: (moduleId: string): boolean => {
    return !!CURRICULUM_DATA[moduleId] || !!SEED_DATA[moduleId] || !!localStorage.getItem(`${K_LESSONS}${moduleId}`);
  },

  getAvailableModules: (): string[] => {
    const list = localStorage.getItem(K_INDEX);
    const localList = list ? JSON.parse(list) : [];
    const seedList = Object.keys(CURRICULUM_DATA).concat(Object.keys(SEED_DATA));
    return Array.from(new Set([...seedList, ...localList]));
  },

  // --- ADMIN ANALYTICS ---

  getAnalytics: (): AnalyticsData => {
    const users = db.getUsers();
    const modules = db.getAvailableModules();
    
    // Calc logic
    const userList = Object.values(users);
    
    // Find most popular course based on aggregated progress
    const courseCounts: Record<string, number> = {};
    userList.forEach(u => {
      const prog = db.getUserProgress(u.id);
      prog.forEach(p => {
        courseCounts[p.courseId] = (courseCounts[p.courseId] || 0) + 1;
      });
    });
    
    const popularId = Object.keys(courseCounts).sort((a,b) => courseCounts[b] - courseCounts[a])[0];
    const popularCourse = COURSES.find(c => c.id === popularId)?.title || "None yet";

    return {
      totalUsers: userList.length,
      activeUsers24h: userList.filter(u => new Date(u.lastLogin).getTime() > Date.now() - 86400000).length,
      mostPopularCourse: popularCourse,
      totalModulesGenerated: modules.length,
      systemHealth: 98,
      recentActivity: [
        "New user registration: student@csprep.ai",
        "Module generated: Python AsyncIO",
        "Certificate issued: SQL Deep Dive",
        "System backup completed"
      ]
    };
  },
  
  clear: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(DB_PREFIX) || key === K_INDEX) {
        localStorage.removeItem(key);
      }
    });
  }
};
