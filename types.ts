
export enum Category {
  CS_CORE = 'CS Fundamentals',
  DBMS = 'DBMS',
  SYSTEM_DESIGN = 'System Design',
  DSA = 'DSA',
  OOPS = 'Object Oriented Programming',
  SQL = 'SQL Deep Dive',
  NOSQL = 'NoSQL & Distributed Data',
  PYTHON = 'Python Mastery'
}

export interface DailyTopic {
  category: Category;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  shortAnswer: string;
  detailedExplanation: string;
  tags: string[];
}

export interface DailyPlan {
  date: string;
  topics: DailyTopic[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
  timestamp: number;
}

// --- New Types for Learning Platform ---

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  streak: number;
  lastLogin: string;
  xp: number;
  level: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  dateEarned: string;
}

export interface CourseProgress {
  courseId: string;
  completedModuleIds: string[];
  totalModules: number;
  lastAccessedModuleId?: string;
  quizScores: Record<string, number>; // moduleId -> score
}

export interface Bookmark {
  id: string;
  moduleId: string;
  moduleTitle: string;
  note: string;
  timestamp: number;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  verificationCode: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  isLocked: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: Category;
  icon: string;
  modules: CourseModule[];
}

export interface LessonResource {
  title: string;
  type: 'Book' | 'Research Paper' | 'Documentation';
  authorOrSource: string;
  url?: string; // Generated URL
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface CodingChallenge {
  title: string;
  description: string;
  language: 'python' | 'javascript' | 'sql' | 'java';
  starterCode: string;
  solutionCode: string;
  hint: string;
}

export interface LessonContent {
  id: string; // Matches module ID for DB storage
  title: string;
  estimatedReadingTime: string; // e.g. "25 mins"
  contentMarkdown: string; // The main explanation
  diagramSvg?: string; // AI generated SVG code
  quizzes: QuizQuestion[];
  codingChallenge?: CodingChallenge;
  interviewQuestions?: {
    question: string;
    companyTag?: string; // e.g. "Google", "Amazon"
    answer: string;
  }[];
  practicalProject?: {
    title: string;
    description: string;
    starterCode: string;
  };
  resources: LessonResource[]; // Recommended reading
}

export interface AnalyticsData {
  totalUsers: number;
  activeUsers24h: number;
  mostPopularCourse: string;
  totalModulesGenerated: number;
  systemHealth: number; // 0-100
  recentActivity: string[];
}
