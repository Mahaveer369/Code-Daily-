
import { LessonContent, UserProfile, CourseProgress, Bookmark, Certificate, AnalyticsData } from '../types';
import { SEED_DATA } from './seedData';
import { COURSES } from '../components/LearningModule';

// Simple "Database" service wrapping LocalStorage to simulate a backend persistence layer
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
        certs.push({
          id: Date.now().toString(),
          courseId,
          courseTitle: course?.title || 'Unknown Course',
          issueDate: new Date().toLocaleDateString(),
          verificationCode: Math.random().toString(36).substring(7).toUpperCase()
        });
        localStorage.setItem(K_CERTS + userId, JSON.stringify(certs));
        
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
  },

  removeBookmark: (userId: string, bookmarkId: string) => {
    const bookmarks = db.getBookmarks(userId).filter(b => b.id !== bookmarkId);
    localStorage.setItem(K_BOOKMARKS + userId, JSON.stringify(bookmarks));
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
    if (SEED_DATA[moduleId]) return JSON.parse(JSON.stringify(SEED_DATA[moduleId]));
    try {
      const data = localStorage.getItem(`${K_LESSONS}${moduleId}`);
      return data ? JSON.parse(data) : null;
    } catch (e) { return null; }
  },

  hasLesson: (moduleId: string): boolean => {
    return !!SEED_DATA[moduleId] || !!localStorage.getItem(`${K_LESSONS}${moduleId}`);
  },

  getAvailableModules: (): string[] => {
    const list = localStorage.getItem(K_INDEX);
    const localList = list ? JSON.parse(list) : [];
    const seedList = Object.keys(SEED_DATA);
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
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(K_PROGRESS)) {
        const progStr = localStorage.getItem(key);
        if (progStr) {
          try {
            const prog = JSON.parse(progStr) as CourseProgress[];
            for (let j = 0; j < prog.length; j++) {
              const cId = prog[j].courseId;
              courseCounts[cId] = (courseCounts[cId] || 0) + 1;
            }
          } catch (e) {
            // Ignore parse errors for corrupt data
          }
        }
      }
    }
    
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
