import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  FileText,
  UserCheck,
  ArrowLeft,
  Eye,
  Download,
  Search,
  BarChart3
} from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  category: string;
  instructor: string;
}

interface ParticipantScore {
  id: string;
  name: string;
  department: string;
  score: number;
  totalQuestions: number;
  timeTaken: string;
  status: 'completed' | 'pending' | 'absent';
}

interface AttendanceRecord {
  id: string;
  name: string;
  department: string;
  loginTime: string;
  logoutTime: string;
  duration: string;
  status: 'present' | 'absent' | 'late';
}

type StatisticsView = 'overview' | 'pretest' | 'posttest' | 'attendance';

const MeetingStatistics: React.FC = () => {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [activeView, setActiveView] = useState<StatisticsView>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock meetings data
  const meetings: Meeting[] = [
    {
      id: '1',
      title: 'Pediatric Emergency Care Workshop',
      date: '2025-01-15',
      time: '14:00',
      duration: '2 hours',
      location: 'Training Hall A, CMHO Office',
      attendees: 28,
      maxAttendees: 35,
      status: 'completed',
      category: 'Emergency Medicine',
      instructor: 'Dr. Rajesh Kumar'
    },
    {
      id: '2',
      title: 'Advanced Cardiology Update',
      date: '2025-01-18',
      time: '10:00',
      duration: '3 hours',
      location: 'Conference Room B, Medical College',
      attendees: 45,
      maxAttendees: 50,
      status: 'upcoming',
      category: 'Cardiology',
      instructor: 'Dr. Priya Sharma'
    },
    {
      id: '3',
      title: 'Mental Health Awareness Training',
      date: '2025-01-12',
      time: '09:00',
      duration: '4 hours',
      location: 'Auditorium, District Hospital',
      attendees: 32,
      maxAttendees: 40,
      status: 'completed',
      category: 'Mental Health',
      instructor: 'Dr. Anjali Verma'
    }
  ];

  // Mock pre-test data
  const getPreTestData = (meetingId: string): ParticipantScore[] => {
    const mockData: Record<string, ParticipantScore[]> = {
      '1': [
        { id: '1', name: 'Dr. Amit Sharma', department: 'Pediatrics', score: 18, totalQuestions: 20, timeTaken: '12 min', status: 'completed' },
        { id: '2', name: 'Dr. Priya Patel', department: 'Emergency', score: 16, totalQuestions: 20, timeTaken: '15 min', status: 'completed' },
        { id: '3', name: 'Dr. Rajesh Kumar', department: 'General Medicine', score: 19, totalQuestions: 20, timeTaken: '10 min', status: 'completed' },
        { id: '4', name: 'Dr. Sunita Verma', department: 'Pediatrics', score: 14, totalQuestions: 20, timeTaken: '18 min', status: 'completed' },
        { id: '5', name: 'Dr. Vikram Singh', department: 'Emergency', score: 0, totalQuestions: 20, timeTaken: '-', status: 'absent' }
      ],
      '3': [
        { id: '1', name: 'Dr. Meera Joshi', department: 'Psychiatry', score: 17, totalQuestions: 20, timeTaken: '14 min', status: 'completed' },
        { id: '2', name: 'Dr. Kiran Devi', department: 'General Medicine', score: 15, totalQuestions: 20, timeTaken: '16 min', status: 'completed' },
        { id: '3', name: 'Dr. Arjun Patel', department: 'Neurology', score: 19, totalQuestions: 20, timeTaken: '11 min', status: 'completed' }
      ]
    };
    return mockData[meetingId] || [];
  };

  // Mock post-test data
  const getPostTestData = (meetingId: string): ParticipantScore[] => {
    const mockData: Record<string, ParticipantScore[]> = {
      '1': [
        { id: '1', name: 'Dr. Amit Sharma', department: 'Pediatrics', score: 19, totalQuestions: 20, timeTaken: '11 min', status: 'completed' },
        { id: '2', name: 'Dr. Priya Patel', department: 'Emergency', score: 18, totalQuestions: 20, timeTaken: '13 min', status: 'completed' },
        { id: '3', name: 'Dr. Rajesh Kumar', department: 'General Medicine', score: 20, totalQuestions: 20, timeTaken: '9 min', status: 'completed' },
        { id: '4', name: 'Dr. Sunita Verma', department: 'Pediatrics', score: 17, totalQuestions: 20, timeTaken: '14 min', status: 'completed' }
      ],
      '3': [
        { id: '1', name: 'Dr. Meera Joshi', department: 'Psychiatry', score: 18, totalQuestions: 20, timeTaken: '12 min', status: 'completed' },
        { id: '2', name: 'Dr. Kiran Devi', department: 'General Medicine', score: 16, totalQuestions: 20, timeTaken: '15 min', status: 'completed' },
        { id: '3', name: 'Dr. Arjun Patel', department: 'Neurology', score: 20, totalQuestions: 20, timeTaken: '10 min', status: 'completed' }
      ]
    };
    return mockData[meetingId] || [];
  };

  // Mock attendance data
  const getAttendanceData = (meetingId: string): AttendanceRecord[] => {
    const mockData: Record<string, AttendanceRecord[]> = {
      '1': [
        { id: '1', name: 'Dr. Amit Sharma', department: 'Pediatrics', loginTime: '14:00', logoutTime: '16:00', duration: '2h 0m', status: 'present' },
        { id: '2', name: 'Dr. Priya Patel', department: 'Emergency', loginTime: '14:05', logoutTime: '16:00', duration: '1h 55m', status: 'late' },
        { id: '3', name: 'Dr. Rajesh Kumar', department: 'General Medicine', loginTime: '13:58', logoutTime: '16:02', duration: '2h 4m', status: 'present' },
        { id: '4', name: 'Dr. Sunita Verma', department: 'Pediatrics', loginTime: '14:00', logoutTime: '15:45', duration: '1h 45m', status: 'present' },
        { id: '5', name: 'Dr. Vikram Singh', department: 'Emergency', loginTime: '-', logoutTime: '-', duration: '-', status: 'absent' }
      ],
      '3': [
        { id: '1', name: 'Dr. Meera Joshi', department: 'Psychiatry', loginTime: '09:00', logoutTime: '13:00', duration: '4h 0m', status: 'present' },
        { id: '2', name: 'Dr. Kiran Devi', department: 'General Medicine', loginTime: '09:10', logoutTime: '13:00', duration: '3h 50m', status: 'late' },
        { id: '3', name: 'Dr. Arjun Patel', department: 'Neurology', loginTime: '08:55', logoutTime: '13:05', duration: '4h 10m', status: 'present' }
      ]
    };
    return mockData[meetingId] || [];
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'var(--success-600)';
    if (percentage >= 60) return 'var(--warning-600)';
    return 'var(--error-600)';
  };

  const calculateStats = (data: any[], type: 'score' | 'attendance') => {
    if (type === 'score') {
      const completed = data.filter(item => item.status === 'completed');
      const avgScore = completed.length > 0 
        ? completed.reduce((sum, item) => sum + (item.score / item.totalQuestions * 100), 0) / completed.length 
        : 0;
      return {
        total: data.length,
        completed: completed.length,
        pending: data.filter(item => item.status === 'pending').length,
        absent: data.filter(item => item.status === 'absent').length,
        average: avgScore.toFixed(1)
      };
    } else {
      return {
        total: data.length,
        present: data.filter(item => item.status === 'present').length,
        late: data.filter(item => item.status === 'late').length,
        absent: data.filter(item => item.status === 'absent').length,
        attendanceRate: ((data.filter(item => item.status !== 'absent').length / data.length) * 100).toFixed(1)
      };
    }
  };

  const renderOverview = () => {
    if (!selectedMeeting) return null;
    
    const preTestData = getPreTestData(selectedMeeting.id);
    const postTestData = getPostTestData(selectedMeeting.id);
    const attendanceData = getAttendanceData(selectedMeeting.id);
    
    const preTestStats = calculateStats(preTestData, 'score');
    const postTestStats = calculateStats(postTestData, 'score');
    const attendanceStats = calculateStats(attendanceData, 'attendance');

    return (
      <div className="row">
        <div className="col-4">
          <div className="card" style={{ textAlign: 'center', border: '1px solid var(--success-200)' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-md) auto',
              color: 'white'
            }}>
              <FileText size={30} />
            </div>
            <h3 style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: 'var(--font-lg)' }}>Pre-test Results</h3>
            <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
              {/* <div>Completed: {preTestStats.completed}/{preTestStats.total}</div> */}
              <div>Average Score: {preTestStats.average}%</div>
              {/* <div>Absent: {preTestStats.absent}</div> */}
            </div>
          </div>
        </div>
        
        <div className="col-4">
          <div className="card" style={{ textAlign: 'center', border: '1px solid var(--primary-200)' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-md) auto',
              color: 'white'
            }}>
              <UserCheck size={30} />
            </div>
            <h3 style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: 'var(--font-lg)' }}>Attendance</h3>
            <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
              {/* <div>Present: {attendanceStats.present}/{attendanceStats.total}</div> */}
              <div>Attendance Rate: {attendanceStats.attendanceRate}%</div>
              {/* <div>Late Arrivals: {attendanceStats.late}</div> */}
            </div>
          </div>
        </div>
        
        <div className="col-4">
          <div className="card" style={{ textAlign: 'center', border: '1px solid var(--warning-200)' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-md) auto',
              color: 'white'
            }}>
              <TrendingUp size={30} />
            </div>
            <h3 style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: 'var(--font-lg)' }}>Post-test Results</h3>
            <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
              {/* <div>Completed: {postTestStats.completed}/{postTestStats.total}</div> */}
              <div>Average Score: {postTestStats.average}%</div>
              {/* <div>Improvement: +{(parseFloat(postTestStats.average || '0') - parseFloat(preTestStats.average || '0')).toFixed(1)}%</div> */}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDetailedView = () => {
    if (!selectedMeeting) return null;

    let data: any[] = [];
    let title = '';
    let columns: string[] = [];

    switch (activeView) {
      case 'pretest':
        data = getPreTestData(selectedMeeting.id);
        title = 'Pre-test Results';
        columns = ['Name', 'Department', 'Score'];
        break;
      case 'posttest':
        data = getPostTestData(selectedMeeting.id);
        title = 'Post-test Results';
        columns = ['Name', 'Department', 'Score'];
        break;
      case 'attendance':
        data = getAttendanceData(selectedMeeting.id);
        title = 'Attendance Records';
        columns = ['Name', 'Department'];
        break;
    }

    const filteredData = data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="card">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 'var(--spacing-lg)' 
        }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-2xl)', fontWeight: '600' }}>
            {title}
          </h2>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search 
                size={16} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-secondary)' 
                }} 
              />
              <input
                type="text"
                placeholder="Search participants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) 40px',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-sm)',
                  width: '200px'
                }}
              />
            </div>
            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)' }}>
                {columns.map((column, index) => (
                  <th key={index} style={{
                    padding: 'var(--spacing-md)',
                    textAlign: 'left',
                    fontSize: 'var(--font-sm)',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    background: 'var(--background-soft)'
                  }}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} style={{ 
                  borderBottom: '1px solid var(--border-light)'
                }}>
                  <td style={{ padding: 'var(--spacing-md)', fontWeight: '500' }}>
                    {item.name}
                  </td>
                  <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>
                    {item.department}
                  </td>
                  {activeView !== 'attendance' && (
                    <td style={{ padding: 'var(--spacing-md)' }}>
                      <span style={{ 
                        fontWeight: '600',
                        color: item.status === 'completed' ? getScoreColor(item.score, item.totalQuestions) : 'var(--text-secondary)'
                      }}>
                        {item.status === 'completed' ? `${item.score}/${item.totalQuestions}` : '-'}
                      </span>
                      {item.status === 'completed' && (
                        <span style={{ 
                          marginLeft: 'var(--spacing-xs)', 
                          fontSize: 'var(--font-sm)', 
                          color: 'var(--text-secondary)' 
                        }}>
                          ({((item.score / item.totalQuestions) * 100).toFixed(0)}%)
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-2xl)', 
            color: 'var(--text-secondary)' 
          }}>
            <FileText size={48} style={{ opacity: 0.5, marginBottom: 'var(--spacing-md)' }} />
            <h3 style={{ margin: '0 0 var(--spacing-sm) 0' }}>No data found</h3>
            <p style={{ margin: 0 }}>No participants match your search criteria.</p>
          </div>
        )}
      </div>
    );
  };

  if (selectedMeeting) {
    return (
      <div style={{ padding: 'var(--spacing-lg)' }}>
        {/* Back Button */}
        <button 
          onClick={() => {
            setSelectedMeeting(null);
            setActiveView('overview');
            setSearchTerm('');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            background: 'transparent',
            border: 'none',
            color: 'var(--primary-600)',
            fontSize: 'var(--font-base)',
            cursor: 'pointer',
            marginBottom: 'var(--spacing-lg)',
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <ArrowLeft size={20} />
          Back to Meetings
        </button>

        {/* Meeting Header */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{
            background: 'var(--primary-gradient)',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
            padding: 'var(--spacing-xl)',
            color: 'white',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 'bold', margin: '0 0 var(--spacing-sm) 0' }}>
              {selectedMeeting.title} - Statistics
            </h1>
            <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap', fontSize: 'var(--font-sm)', opacity: 0.9 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                <Calendar size={16} />
                {new Date(selectedMeeting.date).toLocaleDateString('en-IN')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                <Clock size={16} />
                {selectedMeeting.time}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                <Users size={16} />
                {selectedMeeting.attendees} attendees
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ padding: '0 var(--spacing-xl) var(--spacing-lg)' }}>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-sm)', 
              borderBottom: '1px solid var(--border-light)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'pretest', label: 'Pre-test Results', icon: FileText },
                { id: 'attendance', label: 'Attendance', icon: UserCheck },
                { id: 'posttest', label: 'Post-test Results', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id as StatisticsView)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      padding: 'var(--spacing-md)',
                      border: 'none',
                      background: 'transparent',
                      color: activeView === tab.id ? 'var(--primary-600)' : 'var(--text-secondary)',
                      borderBottom: activeView === tab.id ? '2px solid var(--primary-600)' : '2px solid transparent',
                      cursor: 'pointer',
                      fontSize: 'var(--font-lg)',
                      fontWeight: activeView === tab.id ? '600' : '500',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content based on active view */}
        {activeView === 'overview' ? renderOverview() : renderDetailedView()}
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 style={{
          fontSize: 'var(--font-3xl)',
          fontWeight: 'bold',
          margin: '0 0 var(--spacing-sm) 0',
          color: 'var(--text-primary)'
        }}>
          Meeting Statistics
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          margin: 0,
          fontSize: 'var(--font-base)'
        }}>
          View detailed statistics and performance data for all training meetings
        </p>
      </div>

      {/* Meetings List */}
      <div style={{ display: 'grid', gap: 'var(--spacing-md)', gridTemplateColumns: '1fr' }}>
        {meetings.map((meeting) => (
          <div 
            key={meeting.id}
            className="card"
            style={{
              cursor: 'pointer',
              transition: 'all var(--transition-normal)',
              border: '1px solid var(--border-light)'
            }}
            onClick={() => setSelectedMeeting(meeting)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
          >
            <div className="row" style={{ alignItems: 'center' }}>
              <div className="col-8">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'var(--primary-gradient)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    <BarChart3 size={30} />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: 'var(--font-lg)',
                      fontWeight: '600',
                      margin: '0 0 var(--spacing-xs) 0',
                      color: 'var(--text-primary)'
                    }}>
                      {meeting.title}
                    </h3>
                    <div style={{
                      display: 'flex',
                      gap: 'var(--spacing-lg)',
                      marginBottom: 'var(--spacing-xs)',
                      fontSize: 'var(--font-sm)',
                      color: 'var(--text-secondary)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                        <Calendar size={18} />
                        {new Date(meeting.date).toLocaleDateString('en-IN')}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                        <Clock size={18} />
                        {meeting.time}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                        <Users size={20} />
                        {meeting.attendees} participants
                      </div>
                    </div>
                    <p style={{
                      color: 'var(--text-secondary)',
                      margin: 0,
                      fontSize: 'var(--font-sm)'
                    }}>
                      Topic: {meeting.category} | Instructor: {meeting.instructor}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-4" style={{ textAlign: 'right' }}>
                <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--font-xs)',
                    fontWeight: '600',
                    backgroundColor: meeting.status === 'completed' ? 'var(--success-100)' : 'var(--primary-100)',
                    color: meeting.status === 'completed' ? 'var(--success-600)' : 'var(--primary-600)',
                    textTransform: 'capitalize'
                  }}>
                    {meeting.status}
                  </span>
                </div>
                <button
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    marginLeft: 'auto'
                  }}
                >
                  <Eye size={16} />
                  View Statistics
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingStatistics;
