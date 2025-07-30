import type { 
  User, 
  Session, 
  Quiz, 
  Material, 
  Attendance, 
  SessionFeedback, 
  Certificate,
  DashboardStats,
  Notification
} from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@raipur.gov.in',
    role: 'doctor',
    department: 'General Medicine',
    registrationNumber: 'CG/MED/2019/001',
    joinedDate: '2019-01-15',
    lastLogin: '2024-01-20T10:30:00Z',
    isActive: true,
    profileImage: 'https://via.placeholder.com/150'
  },
  {
    id: '2',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@raipur.gov.in',
    role: 'doctor',
    department: 'Pediatrics',
    registrationNumber: 'CG/MED/2020/045',
    joinedDate: '2020-03-10',
    lastLogin: '2024-01-19T15:45:00Z',
    isActive: true,
    profileImage: 'https://via.placeholder.com/150'
  },
  {
    id: '3',
    name: 'Dr. Amit Verma',
    email: 'amit.verma@cmho.raipur.gov.in',
    role: 'admin',
    department: 'Administration',
    registrationNumber: 'CG/ADMIN/2018/005',
    joinedDate: '2018-07-20',
    lastLogin: '2024-01-20T09:15:00Z',
    isActive: true,
    profileImage: 'https://via.placeholder.com/150'
  }
];

// Mock Sessions
export const mockSessions: Session[] = [
  {
    id: '1',
    title: 'Anemia Prevention and Management',
    description: 'Comprehensive training on anemia detection, prevention strategies, and management protocols for government healthcare facilities.',
    topic: 'Hematology',
    expertName: 'Dr. Sunita Patel',
    expertBio: 'Senior Consultant Hematologist with 15+ years experience',
    scheduledDate: '2024-01-25T14:00:00Z',
    duration: 90,
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    status: 'scheduled',
    maxParticipants: 100,
    currentParticipants: 45,
    department: 'General Medicine',
    level: 'intermediate',
    tags: ['anemia', 'prevention', 'management', 'nutrition'],
    materials: [],
    thumbnail: 'https://via.placeholder.com/400x200',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    title: 'Chronic Disease Management in Rural Settings',
    description: 'Best practices for managing diabetes, hypertension, and other chronic diseases in rural healthcare centers.',
    topic: 'Chronic Diseases',
    expertName: 'Dr. Ravi Gupta',
    expertBio: 'Public Health Specialist with rural healthcare expertise',
    scheduledDate: '2024-01-30T15:30:00Z',
    duration: 120,
    meetingLink: 'https://zoom.us/j/123456789',
    status: 'scheduled',
    maxParticipants: 80,
    currentParticipants: 32,
    department: 'Internal Medicine',
    level: 'advanced',
    tags: ['diabetes', 'hypertension', 'rural health', 'chronic care'],
    materials: [],
    thumbnail: 'https://via.placeholder.com/400x200',
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  {
    id: '3',
    title: 'Pediatric Nutrition Guidelines',
    description: 'Updated guidelines on pediatric nutrition, growth monitoring, and malnutrition management.',
    topic: 'Pediatrics',
    expertName: 'Dr. Meera Joshi',
    expertBio: 'Pediatric Nutrition Specialist, AIIMS Delhi',
    scheduledDate: '2024-01-20T10:00:00Z',
    duration: 75,
    status: 'completed',
    maxParticipants: 60,
    currentParticipants: 58,
    department: 'Pediatrics',
    level: 'beginner',
    tags: ['pediatrics', 'nutrition', 'growth', 'malnutrition'],
    materials: [],
    thumbnail: 'https://via.placeholder.com/400x200',
    recordingUrl: 'https://recordings.example.com/session-3',
    createdAt: '2024-01-05T09:00:00Z',
    updatedAt: '2024-01-20T11:30:00Z'
  }
];

// Mock Materials
export const mockMaterials: Material[] = [
  {
    id: '1',
    title: 'Anemia Management Protocol',
    type: 'pdf',
    url: 'https://files.example.com/anemia-protocol.pdf',
    description: 'Comprehensive protocol for anemia diagnosis and treatment',
    fileSize: 2048000,
    uploadedBy: 'Dr. Sunita Patel',
    uploadedAt: '2024-01-15T10:00:00Z',
    downloadCount: 245
  },
  {
    id: '2',
    title: 'Pediatric Growth Charts',
    type: 'pdf',
    url: 'https://files.example.com/growth-charts.pdf',
    description: 'WHO pediatric growth charts and interpretation guide',
    fileSize: 1536000,
    uploadedBy: 'Dr. Meera Joshi',
    uploadedAt: '2024-01-12T14:30:00Z',
    downloadCount: 189
  },
  {
    id: '3',
    title: 'Diabetes Management Video Tutorial',
    type: 'video',
    url: 'https://videos.example.com/diabetes-management.mp4',
    description: 'Step-by-step diabetes management demonstration',
    fileSize: 52428800,
    uploadedBy: 'Dr. Ravi Gupta',
    uploadedAt: '2024-01-18T16:00:00Z',
    downloadCount: 156
  }
];

// Mock Quizzes
export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    sessionId: '1',
    title: 'Anemia Knowledge Assessment',
    description: 'Pre-session assessment on anemia basics',
    type: 'pre_assessment',
    questions: [
      {
        id: '1',
        question: 'What is the normal hemoglobin level for adult females?',
        type: 'multiple_choice',
        options: ['10-12 g/dL', '12-15 g/dL', '15-18 g/dL', '18-20 g/dL'],
        correctAnswer: '12-15 g/dL',
        explanation: 'Normal hemoglobin levels for adult females range from 12-15 g/dL',
        points: 10
      },
      {
        id: '2',
        question: 'Iron deficiency anemia is the most common type of anemia worldwide.',
        type: 'true_false',
        correctAnswer: 'true',
        explanation: 'Iron deficiency anemia affects approximately 2 billion people globally',
        points: 5
      }
    ],
    timeLimit: 30,
    passingScore: 70,
    isActive: true,
    createdAt: '2024-01-10T10:00:00Z'
  }
];

// Mock Attendance
export const mockAttendance: Attendance[] = [
  {
    id: '1',
    sessionId: '3',
    userId: '1',
    joinedAt: '2024-01-20T10:05:00Z',
    leftAt: '2024-01-20T11:10:00Z',
    duration: 65,
    status: 'present'
  },
  {
    id: '2',
    sessionId: '3',
    userId: '2',
    joinedAt: '2024-01-20T10:02:00Z',
    leftAt: '2024-01-20T11:15:00Z',
    duration: 73,
    status: 'present'
  }
];

// Mock Feedback
export const mockFeedback: SessionFeedback[] = [
  {
    id: '1',
    sessionId: '3',
    userId: '1',
    rating: 5,
    content: 'Excellent session with practical insights. Very helpful for daily practice.',
    suggestions: 'More case studies would be beneficial',
    wouldRecommend: true,
    submittedAt: '2024-01-20T11:30:00Z'
  },
  {
    id: '2',
    sessionId: '3',
    userId: '2',
    rating: 4,
    content: 'Good content but could use more interactive elements.',
    suggestions: 'Include live Q&A sessions',
    wouldRecommend: true,
    submittedAt: '2024-01-20T12:00:00Z'
  }
];

// Mock Certificates
export const mockCertificates: Certificate[] = [
  {
    id: '1',
    userId: '1',
    sessionId: '3',
    title: 'Pediatric Nutrition Guidelines Completion Certificate',
    description: 'Successfully completed the pediatric nutrition training session',
    issuedAt: '2024-01-20T12:00:00Z',
    certificateUrl: 'https://certificates.example.com/cert-1.pdf',
    verificationCode: 'CGMED2024001'
  }
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalSessions: 15,
  completedSessions: 8,
  upcomingSessions: 7,
  totalParticipants: 245,
  averageAttendance: 78.5,
  totalQuizzes: 24,
  averageQuizScore: 82.3,
  certificatesIssued: 156,
  topPerformers: mockUsers.slice(0, 3),
  recentActivities: [
    {
      id: '1',
      type: 'session_completed',
      description: 'Completed Pediatric Nutrition Guidelines session',
      userId: '1',
      userName: 'Dr. Rajesh Kumar',
      timestamp: '2024-01-20T11:30:00Z'
    },
    {
      id: '2',
      type: 'quiz_taken',
      description: 'Completed Anemia Knowledge Assessment',
      userId: '2',
      userName: 'Dr. Priya Sharma',
      timestamp: '2024-01-19T16:45:00Z'
    }
  ]
};

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Session Reminder',
    message: 'Anemia Prevention and Management session starts in 30 minutes',
    type: 'session_reminder',
    userId: '1',
    isRead: false,
    createdAt: '2024-01-25T13:30:00Z',
    actionUrl: '/sessions/1'
  },
  {
    id: '2',
    title: 'New Quiz Available',
    message: 'Pre-assessment quiz for upcoming chronic disease session is now available',
    type: 'quiz_available',
    userId: '1',
    isRead: true,
    createdAt: '2024-01-24T10:00:00Z',
    actionUrl: '/quizzes/2'
  },
  {
    id: '3',
    title: 'Certificate Ready',
    message: 'Your certificate for Pediatric Nutrition Guidelines is ready for download',
    type: 'certificate_ready',
    userId: '1',
    isRead: false,
    createdAt: '2024-01-20T12:00:00Z',
    actionUrl: '/certificates'
  }
];

// Department options
export const departments = [
  'General Medicine',
  'Pediatrics',
  'Internal Medicine',
  'Surgery',
  'Gynecology & Obstetrics',
  'Orthopedics',
  'Cardiology',
  'Dermatology',
  'Psychiatry',
  'Ophthalmology',
  'ENT',
  'Emergency Medicine',
  'Community Medicine',
  'Administration'
];

// Mock functions for API simulation
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiCall = async <T>(data: T, delayMs: number = 1000): Promise<T> => {
  await delay(delayMs);
  return data;
};

export const mockLogin = async (email: string, _password?: string, _otp?: string) => {
  await delay(1500);
  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    throw new Error('User not found');
  }
  
  return {
    ...user,
    token: 'mock-jwt-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now()
  };
};

export const mockGetSessions = async (_filters?: any) => {
  await delay(800);
  return mockSessions;
};

export const mockGetSession = async (id: string) => {
  await delay(500);
  const session = mockSessions.find(s => s.id === id);
  if (!session) {
    throw new Error('Session not found');
  }
  return session;
};

export const mockGetMaterials = async (sessionId?: string) => {
  await delay(600);
  return sessionId ? 
    mockMaterials.filter(m => m.id === sessionId) : 
    mockMaterials;
};

export const mockGetQuizzes = async (sessionId?: string) => {
  await delay(500);
  return sessionId ? 
    mockQuizzes.filter(q => q.sessionId === sessionId) : 
    mockQuizzes;
};

export const mockGetDashboardStats = async () => {
  await delay(1000);
  return mockDashboardStats;
};

export const mockGetNotifications = async (userId: string) => {
  await delay(400);
  return mockNotifications.filter(n => n.userId === userId);
};
