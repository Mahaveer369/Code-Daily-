export enum Category {
  WEB_DEV = 'HTML5 Tutorial',
  CSS = 'CSS3 Tutorial',
  JAVASCRIPT = 'JavaScript Tutorial',
  TYPESCRIPT = 'TypeScript Tutorial',
  REACT = 'React 19 Tutorial',
  PYTHON = 'Python Tutorial',
  SQL = 'SQL & DBMS Tutorial',
  DSA = 'DSA A-to-Z',
  CPP_JAVA = 'Modern C++20/23 Systems',
  JAVA = 'Java 21 & JVM Engineering',
  OOPS = 'OS & Linux Tutorial',
  NETWORKS = 'Computer Networks',
  SYSTEM_DESIGN = 'System Design',
  CS_CORE = 'CS Fundamentals',
  AI_ML = 'AI, ML & GenAI',
  AGENTIC_HARNESS = 'Agentic Harness Engineering',
  DBMS = 'DBMS',
  NOSQL = 'NoSQL & Distributed Data',
  GIT_LINUX = 'Git, Linux & DevOps',
  DOCKER_K8S = 'Docker & Kubernetes',
  TERRAFORM_CICD = 'Terraform & CI/CD'
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

export type UserRole = 'admin' | 'user';

export type UserTier = 'Novice' | 'Practitioner' | 'Specialist' | 'Master' | 'Architect';

export interface TierMetadata {
  tier: UserTier;
  minXp: number;
  maxXp: number | null;
  nextTier: UserTier | null;
  xpToNextTier: number;
  tierProgressPercent: number;
  tagline: string;
  accentColor: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tier: UserTier;
  streak: number;
  lastLogin: string;
  xp: number;
  level: number;
  badges: Badge[];
  solvedProblemIds?: string[];
  primaryTrack?: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  email?: string;
  tier: UserTier;
  xp: number;
  level: number;
  streak: number;
  completedModules: number;
  solvedProblems: number;
  primaryTrack: string;
  isCurrentUser?: boolean;
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
  quizScores: Record<string, number>;
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
  sectionGroup?: string;
  isLocked: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: Category;
  icon: string;
  shortTag?: string;
  levelTag?: string;
  modules: CourseModule[];
}

export interface LessonResource {
  title: string;
  type: 'Book' | 'Research Paper' | 'Documentation' | 'Whitepaper' | 'RFC' | 'Engineering Blog';
  authorOrSource: string;
  url?: string;
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
  language: 'python' | 'javascript' | 'sql' | 'java' | 'html' | 'cpp' | 'bash';
  starterCode: string;
  solutionCode: string;
  hint: string;
}

export interface FillBlankExercise {
  prompt: string;
  codeBefore: string;
  answer: string;
  codeAfter: string;
  hint: string;
}

export interface MustSolveExercise {
  id: string;
  title: string;
  difficulty: 'Essential' | 'Core Practice' | 'Mastery Challenge';
  scenario: string;
  codeBefore: string;
  answer: string;
  acceptedAnswers?: string[];
  codeAfter: string;
  hint: string;
  explanation: string;
  xp: number;
}

export interface LessonContent {
  id: string;
  title: string;
  estimatedReadingTime: string;
  beginnerSummary?: string;
  realWorldAnalogy?: string;
  keyTakeaways?: string[];
  syntaxCheatTable?: {
    syntax: string;
    description: string;
    example: string;
  }[];
  complexityTable?: {
    operation: string;
    timeComplexity: string;
    spaceComplexity: string;
    notes: string;
  }[];
  fillBlankExercise?: FillBlankExercise;
  mustSolveExercises?: MustSolveExercise[];
  contentMarkdown: string;
  diagramSvg?: string;
  quizzes: QuizQuestion[];
  codingChallenge?: CodingChallenge;
  interviewQuestions?: {
    question: string;
    companyTag?: string;
    answer: string;
  }[];
  homeResearchHighlights?: {
    title: string;
    organizationOrPaper: string;
    year: string;
    breakthroughSummary: string;
    productionImpact: string;
  }[];
  realWorldUseCases?: {
    company: string;
    scenario: string;
    impactMetric: string;
    architectureNote: string;
    codeSnippet?: string;
    codeLanguage?: string;
  }[];
  practicalProject?: {
    title: string;
    description: string;
    starterCode: string;
  };
  resources: LessonResource[];
}

export interface ProblemTestCase {
  id: string;
  inputDisplay: string;
  args: any[];
  expectedOutput: any;
  explanation?: string;
  isHidden?: boolean;
}

export interface PracticeProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  points: number;
  companies: string[];
  tags: string[];
  isProblemOfTheDay?: boolean;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  expectedTimeComplexity: string;
  expectedSpaceComplexity: string;
  functionName: string;
  starterCode: {
    javascript: string;
    python: string;
  };
  solutionCode: {
    javascript: string;
    python: string;
  };
  hints: string[];
  testCases: ProblemTestCase[];
}

export interface CheatSheetSection {
  heading: string;
  description: string;
  code?: string;
  language?: string;
  rows?: { term: string; syntax: string; meaning: string }[];
}

export interface CheatSheet {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  sections: CheatSheetSection[];
}

export interface AnalyticsData {
  totalUsers: number;
  activeUsers24h: number;
  mostPopularCourse: string;
  totalModulesGenerated: number;
  systemHealth: number;
  recentActivity: string[];
}
