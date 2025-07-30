// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  registrationNumber?: string;
  joinedDate: string;
  lastLogin?: string;
  isActive: boolean;
  profileImage?: string;
}

export type UserRole = 'doctor' | 'admin';

export interface AuthUser extends User {
  token: string;
  refreshToken?: string;
}

// Session Types
export interface Session {
  id: string;
  title: string;
  description: string;
  topic: string;
  expertName: string;
  expertBio?: string;
  scheduledDate: string;
  duration: number; // in minutes
  meetingLink?: string;
  status: SessionStatus;
  maxParticipants?: number;
  currentParticipants: number;
  department: string;
  level: SessionLevel;
  tags: string[];
  materials: Material[];
  thumbnail?: string;
  recordingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type SessionStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';
export type SessionLevel = 'beginner' | 'intermediate' | 'advanced' | 'all';

// Material Types
export interface Material {
  id: string;
  title: string;
  type: MaterialType;
  url: string;
  description?: string;
  fileSize?: number;
  uploadedBy: string;
  uploadedAt: string;
  downloadCount: number;
}

export type MaterialType = 'pdf' | 'video' | 'presentation' | 'document' | 'image' | 'link';

// Attendance Types
export interface Attendance {
  id: string;
  sessionId: string;
  userId: string;
  joinedAt: string;
  leftAt?: string;
  duration: number; // in minutes
  status: AttendanceStatus;
  feedback?: SessionFeedback;
}

export type AttendanceStatus = 'present' | 'absent' | 'partial';

// Quiz Types
export interface Quiz {
  id: string;
  sessionId: string;
  title: string;
  description?: string;
  type: QuizType;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore: number;
  isActive: boolean;
  createdAt: string;
}

export type QuizType = 'pre_assessment' | 'post_assessment' | 'knowledge_check';

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: QuizAnswer[];
  score: number;
  totalPoints: number;
  percentage: number;
  startedAt: string;
  completedAt?: string;
  timeSpent: number; // in minutes
  passed: boolean;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  points: number;
}

// Feedback Types
export interface SessionFeedback {
  id: string;
  sessionId: string;
  userId: string;
  rating: number; // 1-5
  content: string;
  suggestions?: string;
  wouldRecommend: boolean;
  submittedAt: string;
}

// Certificate Types
export interface Certificate {
  id: string;
  userId: string;
  sessionId?: string;
  quizId?: string;
  title: string;
  description: string;
  issuedAt: string;
  certificateUrl: string;
  verificationCode: string;
}

// Dashboard Types
export interface DashboardStats {
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  totalParticipants: number;
  averageAttendance: number;
  totalQuizzes: number;
  averageQuizScore: number;
  certificatesIssued: number;
  topPerformers: User[];
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export type ActivityType = 
  | 'session_joined' 
  | 'session_completed' 
  | 'quiz_taken' 
  | 'material_downloaded' 
  | 'feedback_submitted'
  | 'certificate_earned';

// Form Types
export interface LoginForm {
  email: string;
  password?: string;
  otp?: string;
  rememberMe: boolean;
}

export interface RegistrationForm {
  name: string;
  email: string;
  department: string;
  registrationNumber: string;
  role: UserRole;
  password?: string;
}

export interface SessionForm {
  title: string;
  description: string;
  topic: string;
  expertName: string;
  expertBio?: string;
  scheduledDate: string;
  duration: number;
  meetingLink?: string;
  department: string;
  level: SessionLevel;
  tags: string[];
  maxParticipants?: number;
}

export interface FeedbackForm {
  rating: number;
  content: string;
  suggestions?: string;
  wouldRecommend: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Filter and Search Types
export interface SessionFilters {
  status?: SessionStatus[];
  department?: string[];
  level?: SessionLevel[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  expertName?: string;
}

export interface UserFilters {
  role?: UserRole[];
  department?: string[];
  isActive?: boolean;
  search?: string;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  userId: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export type NotificationType = 
  | 'session_reminder' 
  | 'session_update' 
  | 'quiz_available' 
  | 'certificate_ready'
  | 'system_announcement';

// Theme and UI Types
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  fontFamily: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: string | number;
  children?: SidebarItem[];
  roles?: UserRole[];
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  resource?: Session;
}

// Report Types
export interface ReportData {
  title: string;
  description: string;
  generatedAt: string;
  period: ReportPeriod;
  data: any;
  charts?: ChartData[];
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
  }[];
}

export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

// Error Types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  timestamp: string;
  path?: string;
}
