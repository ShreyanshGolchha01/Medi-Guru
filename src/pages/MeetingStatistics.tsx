import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../contexts/AuthContext';
import serverUrl from '../services/server';
import * as XLSX from 'xlsx';

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

interface RegisteredParticipant {
  id: string;
  name: string;
  department: string;
  designation: string;
  block: string;
  email?: string;
  phone?: string;
  registrationDate: string;
  status: 'registered' | 'confirmed' | 'cancelled';
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

type StatisticsView = 'overview' | 'registered' | 'pretest' | 'posttest' | 'attendance';

const MeetingStatistics: React.FC = () => {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [activeView, setActiveView] = useState<StatisticsView>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [meetingAttendance, setMeetingAttendance] = useState<{[key: string]: number}>({});
  const [statisticsData, setStatisticsData] = useState<{
    registered: any[];
    pretest: any[];
    posttest: any[];
    attendance: any[];
  }>({
    registered: [],
    pretest: [],
    posttest: [],
    attendance: []
  });
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const { user } = useAuth();

  // Fetch meetings from API
  useEffect(() => {
    const fetchMeetings = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${serverUrl}meetings.php`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Meetings API response:', data);
          if (data.meetings && Array.isArray(data.meetings)) {
            setMeetings(data.meetings);
            console.log('Meetings set:', data.meetings);
            
            // Fetch attendance count for each meeting
            const attendanceMap: {[key: string]: number} = {};
            for (const meeting of data.meetings) {
              try {
                const attendanceResponse = await fetch(`${serverUrl}meeting-statistics.php?meetingId=${meeting.id}&type=attendance`, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                if (attendanceResponse.ok) {
                  const attendanceData = await attendanceResponse.json();
                  const actualAttendees = attendanceData.data ? attendanceData.data.length : 0;
                  attendanceMap[meeting.id] = actualAttendees;
                  console.log(`Meeting ${meeting.id}: ${actualAttendees} actual attendees`);
                } else {
                  attendanceMap[meeting.id] = 0;
                }
              } catch (error) {
                console.error(`Error fetching attendance for meeting ${meeting.id}:`, error);
                attendanceMap[meeting.id] = 0;
              }
            }
            setMeetingAttendance(attendanceMap);
          } else {
            console.log('No meetings found or invalid format');
            setMeetings([]);
          }
        } else {
          console.error('Failed to fetch meetings:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Error response:', errorText);
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeetings();
  }, []);

  // Fetch statistics data when a meeting is selected
  useEffect(() => {
    if (selectedMeeting) {
      fetchAllStatistics(selectedMeeting.id);
    }
  }, [selectedMeeting]);

  const fetchAllStatistics = async (meetingId: string) => {
    setStatisticsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      
      // Fetch all four types of data in parallel
      const [registeredResponse, pretestResponse, posttestResponse, attendanceResponse] = await Promise.all([
        fetch(`${serverUrl}meeting-statistics.php?meetingId=${meetingId}&type=registered`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${serverUrl}meeting-statistics.php?meetingId=${meetingId}&type=pretest`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${serverUrl}meeting-statistics.php?meetingId=${meetingId}&type=posttest`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${serverUrl}meeting-statistics.php?meetingId=${meetingId}&type=attendance`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      const registeredData = registeredResponse.ok ? await registeredResponse.json() : { data: [] };
      const pretestData = pretestResponse.ok ? await pretestResponse.json() : { data: [] };
      const posttestData = posttestResponse.ok ? await posttestResponse.json() : { data: [] };
      const attendanceData = attendanceResponse.ok ? await attendanceResponse.json() : { data: [] };

      console.log('Statistics API responses:', {
        registered: registeredData,
        pretest: pretestData,
        posttest: posttestData,
        attendance: attendanceData
      });

      setStatisticsData({
        registered: registeredData.data || [],
        pretest: pretestData.data || [],
        posttest: posttestData.data || [],
        attendance: attendanceData.data || []
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setStatisticsLoading(false);
    }
  };

  // Update the get data functions to use actual data
  const getRegisteredData = (meetingId: string): RegisteredParticipant[] => {
    if (!statisticsData.registered || !Array.isArray(statisticsData.registered)) {
      return [];
    }
    return statisticsData.registered.map((item, index) => ({
      id: `registered-${index}`,
      name: item.name || 'Unknown',
      department: item.department || item.designation || 'Unknown',
      designation: item.designation || 'Unknown',
      block: item.block || 'N/A',
      email: item.email || '',
      phone: item.phone || 'N/A',
      registrationDate: item.registration_date ? new Date(item.registration_date).toLocaleDateString('en-IN') : '--',
      status: item.status || 'registered' as const
    }));
  };

  const getPreTestData = (meetingId: string): ParticipantScore[] => {
    if (!statisticsData.pretest || !Array.isArray(statisticsData.pretest)) {
      return [];
    }
    return statisticsData.pretest.map((item, index) => ({
      id: `pretest-${index}`,
      name: item.name || 'Unknown',
      department: item.department || 'Unknown',
      score: parseInt(item.score) || 0,
      totalQuestions: parseInt(item.total_marks) || 0,
      timeTaken: '00:00', // API doesn't provide this yet
      status: 'completed' as const
    }));
  };

  const getPostTestData = (meetingId: string): ParticipantScore[] => {
    if (!statisticsData.posttest || !Array.isArray(statisticsData.posttest)) {
      return [];
    }
    return statisticsData.posttest.map((item, index) => ({
      id: `posttest-${index}`,
      name: item.name || 'Unknown',
      department: item.department || 'Unknown',
      score: parseInt(item.score) || 0,
      totalQuestions: parseInt(item.total_marks) || 0,
      timeTaken: '00:00', // API doesn't provide this yet
      status: 'completed' as const
    }));
  };

  const getAttendanceData = (meetingId: string): AttendanceRecord[] => {
    if (!statisticsData.attendance || !Array.isArray(statisticsData.attendance)) {
      return [];
    }
    return statisticsData.attendance.map((item, index) => ({
      id: `attendance-${index}`,
      name: item.name || 'Unknown',
      department: item.department || 'Unknown',
      loginTime: item.recorded_at ? new Date(item.recorded_at).toLocaleTimeString('en-IN') : '--',
      logoutTime: '--', // API doesn't provide this yet
      duration: '--', // API doesn't provide this yet
      status: 'present' as const
    }));
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'var(--success-600)';
    if (percentage >= 60) return 'var(--warning-600)';
    return 'var(--error-600)';
  };

  const calculateStats = (data: any[], type: 'score' | 'attendance') => {
    if (!data || data.length === 0) {
      return type === 'score' 
        ? { total: 0, completed: 0, pending: 0, absent: 0, average: '0' }
        : { total: 0, present: 0, late: 0, absent: 0, attendanceRate: '0' };
    }

    if (type === 'score') {
      const completed = data.filter(item => item.status === 'completed');
      const avgScore = completed.length > 0 
        ? completed.reduce((sum, item) => {
            const percentage = (item.score / item.totalQuestions * 100);
            return sum + (isNaN(percentage) ? 0 : percentage);
          }, 0) / completed.length 
        : 0;
      return {
        total: data.length,
        completed: completed.length,
        pending: data.filter(item => item.status === 'pending').length,
        absent: data.filter(item => item.status === 'absent').length,
        average: isNaN(avgScore) ? '0' : avgScore.toFixed(1)
      };
    } else {
      const presentCount = data.filter(item => item.status !== 'absent').length;
      const attendanceRate = data.length > 0 ? (presentCount / data.length) * 100 : 0;
      
      return {
        total: data.length,
        present: data.filter(item => item.status === 'present').length,
        late: data.filter(item => item.status === 'late').length,
        absent: data.filter(item => item.status === 'absent').length,
        attendanceRate: isNaN(attendanceRate) ? '0' : attendanceRate.toFixed(1)
      };
    }
  };

  // Export data to Excel
  const exportToExcel = (data: any[], type: StatisticsView) => {
    if (!selectedMeeting || !data || data.length === 0) {
      alert('No data available to export');
      return;
    }

    let exportData: any[] = [];
    let filename = '';

    switch (type) {
      case 'registered':
        exportData = data.map((item, index) => ({
          'S.No.': index + 1,
          'Name': item.name,
          'Designation': item.designation,
          'Block': item.block,
          'Phone': item.phone || 'N/A',
          'Status': item.status
        }));
        filename = `${selectedMeeting.title.replace(/[^a-zA-Z0-9]/g, '_')}_Registered_Participants.xlsx`;
        break;

      case 'pretest':
        exportData = data.map((item, index) => ({
          'S.No.': index + 1,
          'Name': item.name,
          'Department': item.department,
          'Score': item.score,
          'Total Questions': item.totalQuestions,
          'Percentage': item.totalQuestions > 0 ? `${((item.score / item.totalQuestions) * 100).toFixed(1)}%` : '0%',
          'Status': item.status
        }));
        filename = `${selectedMeeting.title.replace(/[^a-zA-Z0-9]/g, '_')}_PreTest_Results.xlsx`;
        break;

      case 'posttest':
        exportData = data.map((item, index) => ({
          'S.No.': index + 1,
          'Name': item.name,
          'Department': item.department,
          'Score': item.score,
          'Total Questions': item.totalQuestions,
          'Percentage': item.totalQuestions > 0 ? `${((item.score / item.totalQuestions) * 100).toFixed(1)}%` : '0%',
          'Status': item.status
        }));
        filename = `${selectedMeeting.title.replace(/[^a-zA-Z0-9]/g, '_')}_PostTest_Results.xlsx`;
        break;

      case 'attendance':
        exportData = data.map((item, index) => ({
          'S.No.': index + 1,
          'Name': item.name,
          'Department': item.department,
          'Login Time': item.loginTime,
          'Logout Time': item.logoutTime,
          'Duration': item.duration,
          'Status': item.status
        }));
        filename = `${selectedMeeting.title.replace(/[^a-zA-Z0-9]/g, '_')}_Attendance_Report.xlsx`;
        break;

      default:
        alert('Invalid export type');
        return;
    }

    try {
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Auto-fit column widths
      const colWidths = exportData.length > 0 ? Object.keys(exportData[0]).map(key => ({
        wch: Math.max(
          key.length,
          Math.max(...exportData.map(row => String(row[key] || '').length))
        ) + 2
      })) : [];
      
      worksheet['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, type === 'registered' ? 'Registered Participants' :
                                                       type === 'pretest' ? 'Pre-test Results' : 
                                                       type === 'posttest' ? 'Post-test Results' : 
                                                       'Attendance Report');

      // Add meeting info sheet
      const meetingInfo = [
        { 'Meeting Details': 'Title', 'Value': selectedMeeting.title },
        { 'Meeting Details': 'Date', 'Value': new Date(selectedMeeting.date).toLocaleDateString('en-IN') },
        { 'Meeting Details': 'Time', 'Value': selectedMeeting.time },
        { 'Meeting Details': 'Duration', 'Value': selectedMeeting.duration },
        { 'Meeting Details': 'Category', 'Value': selectedMeeting.category },
        { 'Meeting Details': 'Instructor', 'Value': selectedMeeting.instructor },
        { 'Meeting Details': 'Status', 'Value': selectedMeeting.status },
        { 'Meeting Details': 'Export Date', 'Value': new Date().toLocaleDateString('en-IN') },
        { 'Meeting Details': 'Export Time', 'Value': new Date().toLocaleTimeString('en-IN') }
      ];

      const infoWorksheet = XLSX.utils.json_to_sheet(meetingInfo);
      infoWorksheet['!cols'] = [{ wch: 20 }, { wch: 30 }];
      XLSX.utils.book_append_sheet(workbook, infoWorksheet, 'Meeting Info');

      // Write file
      XLSX.writeFile(workbook, filename);

      // Show success message
      alert(`Data exported successfully!\nFile: ${filename}\nRecords: ${exportData.length}`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const renderOverview = () => {
    if (!selectedMeeting) return null;
    
    if (statisticsLoading) {
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--spacing-2xl)', 
          color: 'var(--text-secondary)' 
        }}>
          <BarChart3 size={48} style={{ opacity: 0.5, marginBottom: 'var(--spacing-md)' }} />
          <h3 style={{ margin: '0 0 var(--spacing-sm) 0' }}>Loading statistics...</h3>
          <p style={{ margin: 0 }}>Please wait while we fetch the data.</p>
        </div>
      );
    }
    
    const registeredData = getRegisteredData(selectedMeeting.id);
    const preTestData = getPreTestData(selectedMeeting.id);
    const postTestData = getPostTestData(selectedMeeting.id);
    const attendanceData = getAttendanceData(selectedMeeting.id);
    
    const registeredStats = { total: registeredData.length, confirmed: registeredData.filter(p => p.status === 'confirmed').length };
    const preTestStats = calculateStats(preTestData, 'score');
    const postTestStats = calculateStats(postTestData, 'score');
    const attendanceStats = calculateStats(attendanceData, 'attendance');

    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: 'var(--spacing-md)' 
      }}>
        <div className="card" style={{ textAlign: 'center', border: '1px solid var(--info-200)' }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--spacing-sm) auto',
            color: 'white'
          }}>
            <Users size={24} />
          </div>
          <h3 style={{ margin: '0 0 var(--spacing-xs) 0', fontSize: 'var(--font-lg)' }}>Registered Participants</h3>
          <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
            <div>Total Registered: {registeredStats.total}</div>
            <div>Confirmed: {registeredStats.confirmed}</div>
          </div>
          <button
            className="btn btn-outline"
            style={{ 
              fontSize: 'var(--font-xs)', 
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              margin: '0 auto'
            }}
            onClick={() => exportToExcel(registeredData, 'registered')}
            disabled={registeredData.length === 0}
          >
            <Download size={14} />
            Export
          </button>
        </div>
        <div className="card" style={{ textAlign: 'center', border: '1px solid var(--success-200)' }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--spacing-sm) auto',
            color: 'white'
          }}>
            <FileText size={24} />
          </div>
          <h3 style={{ margin: '0 0 var(--spacing-xs) 0', fontSize: 'var(--font-lg)' }}>Pre-test Results</h3>
          <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
            <div>Average Score: {preTestStats.average}%</div>
            <div>Total Participants: {preTestStats.total}</div>
          </div>
          <button
            className="btn btn-outline"
            style={{ 
              fontSize: 'var(--font-xs)', 
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              margin: '0 auto'
            }}
            onClick={() => exportToExcel(preTestData, 'pretest')}
            disabled={preTestData.length === 0}
          >
            <Download size={14} />
            Export
          </button>
        </div>
        
        <div className="card" style={{ textAlign: 'center', border: '1px solid var(--primary-200)' }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--spacing-sm) auto',
            color: 'white'
          }}>
            <UserCheck size={24} />
          </div>
          <h3 style={{ margin: '0 0 var(--spacing-xs) 0', fontSize: 'var(--font-lg)' }}>Attendance</h3>
          <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
            <div>Attendance Rate: {attendanceStats.attendanceRate}%</div>
            <div>Present: {attendanceStats.present}/{attendanceStats.total}</div>
          </div>
          <button
            className="btn btn-outline"
            style={{ 
              fontSize: 'var(--font-xs)', 
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              margin: '0 auto'
            }}
            onClick={() => exportToExcel(attendanceData, 'attendance')}
            disabled={attendanceData.length === 0}
          >
            <Download size={14} />
            Export
          </button>
        </div>
        
        <div className="card" style={{ textAlign: 'center', border: '1px solid var(--warning-200)' }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--spacing-sm) auto',
            color: 'white'
          }}>
            <TrendingUp size={24} />
          </div>
          <h3 style={{ margin: '0 0 var(--spacing-xs) 0', fontSize: 'var(--font-lg)' }}>Post-test Results</h3>
          <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
            <div>Average Score: {postTestStats.average}%</div>
            <div>Total Participants: {postTestStats.total}</div>
          </div>
          <button
            className="btn btn-outline"
            style={{ 
              fontSize: 'var(--font-xs)', 
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              margin: '0 auto'
            }}
            onClick={() => exportToExcel(postTestData, 'posttest')}
            disabled={postTestData.length === 0}
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>
    );
  };

  const renderDetailedView = () => {
    if (!selectedMeeting) return null;

    if (statisticsLoading) {
      return (
        <div className="card">
          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-2xl)', 
            color: 'var(--text-secondary)' 
          }}>
            <BarChart3 size={48} style={{ opacity: 0.5, marginBottom: 'var(--spacing-md)' }} />
            <h3 style={{ margin: '0 0 var(--spacing-sm) 0' }}>Loading {activeView} data...</h3>
            <p style={{ margin: 0 }}>Please wait while we fetch the information.</p>
          </div>
        </div>
      );
    }

    let data: any[] = [];
    let title = '';
    let columns: string[] = [];

    switch (activeView) {
      case 'registered':
        data = getRegisteredData(selectedMeeting.id);
        title = 'Registered Participants';
        columns = ['Name', 'Designation', 'Block', 'Phone'];
        break;
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
        columns = ['Name', 'Department', 'Login Time'];
        break;
    }

    const filteredData = data.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      if (activeView === 'registered') {
        return item.name.toLowerCase().includes(searchLower) ||
               (item.designation && item.designation.toLowerCase().includes(searchLower)) ||
               (item.block && item.block.toLowerCase().includes(searchLower)) ||
               (item.phone && item.phone.toLowerCase().includes(searchLower));
      } else {
        return item.name.toLowerCase().includes(searchLower) ||
               item.department.toLowerCase().includes(searchLower);
      }
    });

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
            <div style={{ position: 'relative', flex: '1', maxWidth: '300px' }}>
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
                  width: '100%',
                  padding: 'var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) 40px',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-sm)',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button 
              className="btn btn-outline mobile-hidden" 
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', flexShrink: 0 }}
              onClick={() => exportToExcel(filteredData, activeView)}
              disabled={filteredData.length === 0}
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-sm)' }}>
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
                  {activeView === 'registered' ? (
                    <>
                      <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>
                        {item.designation || item.department}
                      </td>
                      <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>
                        {item.block || 'N/A'}
                      </td>
                      <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>
                        {item.phone || 'N/A'}
                      </td>
                    </>
                  ) : (
                    <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>
                      {item.department}
                    </td>
                  )}
                  {activeView === 'attendance' && (
                    <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>
                      {item.loginTime}
                    </td>
                  )}
                  {(activeView === 'pretest' || activeView === 'posttest') && (
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
      <div style={{ padding: 'var(--spacing-sm)' }}>
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
            borderRadius: 'var(--radius-md)',
            minHeight: '44px'
          }}
        >
          <ArrowLeft size={20} />
          <span>Back to Meetings</span>
        </button>

        {/* Meeting Header */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{
            background: 'var(--primary-gradient)',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
            padding: 'var(--spacing-md)',
            color: 'white',
            marginBottom: 'var(--spacing-md)'
          }}>
            <h1 style={{ fontSize: 'var(--font-xl)', fontWeight: 'bold', margin: '0 0 var(--spacing-xs) 0', lineHeight: 1.2 }}>
              {selectedMeeting.title} - Statistics
            </h1>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', fontSize: 'var(--font-sm)', opacity: 0.9 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} />
                <span>{new Date(selectedMeeting.date).toLocaleDateString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} />
                <span>{selectedMeeting.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={14} />
                <span>{meetingAttendance[selectedMeeting.id] !== undefined 
                            ? `${meetingAttendance[selectedMeeting.id]} attended` 
                            : `${selectedMeeting.attendees} participants`
                          }</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ padding: '0 var(--spacing-md) var(--spacing-md)' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 'var(--spacing-xs)',
              marginBottom: 'var(--spacing-md)'
            }}>
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'registered', label: 'Registered', icon: Users },
                { id: 'pretest', label: 'Pre-test', icon: FileText },
                { id: 'attendance', label: 'Attendance', icon: UserCheck },
                { id: 'posttest', label: 'Post-test', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id as StatisticsView)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--spacing-xs)',
                      padding: 'var(--spacing-xs)',
                      border: activeView === tab.id ? 'none' : '1px solid var(--border-light)',
                      background: activeView === tab.id ? 'var(--primary-gradient)' : 'transparent',
                      color: activeView === tab.id ? 'white' : 'var(--text-secondary)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontSize: 'var(--font-sm)',
                      fontWeight: activeView === tab.id ? '600' : '500',
                      transition: 'all var(--transition-fast)',
                      minHeight: '40px',
                      flexDirection: 'column'
                    }}
                  >
                    <Icon size={18} />
                    <span style={{ fontSize: 'var(--font-xs)' }}>{tab.label}</span>
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
    <div style={{ padding: 'var(--spacing-sm)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 style={{
          fontSize: 'var(--font-2xl)',
          fontWeight: 'bold',
          margin: '0 0 var(--spacing-xs) 0',
          color: 'var(--text-primary)',
          lineHeight: 1.2
        }}>
          Meeting Statistics
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          margin: 0,
          fontSize: 'var(--font-sm)',
          lineHeight: 1.4
        }}>
          View detailed statistics and performance data for all training meetings
        </p>
      </div>

      {/* Meetings List */}
      <div style={{ display: 'grid', gap: 'var(--spacing-sm)', gridTemplateColumns: '1fr' }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-2xl)',
            color: 'var(--text-secondary)'
          }}>
            <BarChart3 size={48} style={{ opacity: 0.5, marginBottom: 'var(--spacing-md)' }} />
            <h3 style={{ margin: '0 0 var(--spacing-sm) 0' }}>Loading meetings...</h3>
          </div>
        ) : meetings.length > 0 ? (
          <>
            {console.log('Rendering meetings:', meetings)}
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
                          {meetingAttendance[meeting.id] !== undefined 
                            ? `${meetingAttendance[meeting.id]} attended` 
                            : `${meeting.attendees} participants`
                          }
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
          </>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-2xl)',
            color: 'var(--text-secondary)'
          }}>
            <BarChart3 size={48} style={{ opacity: 0.5, marginBottom: 'var(--spacing-md)' }} />
            <h3 style={{ margin: '0 0 var(--spacing-sm) 0' }}>No meetings available</h3>
            <p style={{ margin: 0 }}>
              No training meetings found. Check back later for new sessions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingStatistics;
