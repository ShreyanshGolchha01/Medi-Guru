import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Calendar,
  Users,
  TrendingUp,
  Award,
  Settings,
  Activity,
  FileText,
  BarChart3,
  UserPlus,
  CheckCircle
} from 'lucide-react';

interface AdminStats {
  totalMeetings: number;
  totalAttendees: number;
  avgAttendance: number;
  testPerformance: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    // Mock admin stats
    const mockStats: AdminStats = {
      totalMeetings: 12,
      totalAttendees: 45,
      avgAttendance: 78,
      testPerformance: 85
    };
    
    setStats(mockStats);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      {/* Admin Welcome Section */}
      <div style={{
        background: 'var(--primary-gradient)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--spacing-xl)',
        color: 'var(--text-white)',
        marginBottom: 'var(--spacing-lg)'
      }}>
        <div className="row" style={{ alignItems: 'center' }}>
          <div className="col-8">
            <h1 style={{
              fontSize: 'var(--font-3xl)',
              fontWeight: 'bold',
              margin: '0 0 var(--spacing-sm) 0'
            }}>
              {getGreeting()}, Admin {user?.name?.split(' ')[1] || user?.name}! 👨‍💼
            </h1>
            <p style={{
              fontSize: 'var(--font-lg)',
              margin: '0 0 var(--spacing-md) 0',
              opacity: 0.9,
              lineHeight: 1.5
            }}>
              Welcome to the Admin Dashboard. Manage meetings, view statistics, and monitor training progress across all departments.
            </p>
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-lg)',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)'
              }}>
                <Settings size={18} />
                <span style={{ fontSize: 'var(--font-sm)' }}>
                  ADMINISTRATOR
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)'
              }}>
                <Calendar size={18} />
                <span style={{ fontSize: 'var(--font-sm)' }}>
                  CMHO Office, Raipur
                </span>
              </div>
            </div>
          </div>
          <div className="col-4" style={{ textAlign: 'right' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-lg)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                fontSize: 'var(--font-2xl)',
                fontWeight: 'bold',
                marginBottom: 'var(--spacing-xs)'
              }}>
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </div>
              <div style={{
                fontSize: 'var(--font-base)',
                opacity: 0.9
              }}>
                {new Date().toLocaleDateString('en-IN', { year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Stats Cards */}
      {stats && (
        <div className="row" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="col-3">
            <div className="card" style={{
              textAlign: 'center',
              border: '1px solid var(--border-light)',
              transition: 'all var(--transition-normal)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}>
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
                <Calendar size={24} />
              </div>
              <h3 style={{
                fontSize: 'var(--font-2xl)',
                fontWeight: 'bold',
                margin: '0 0 var(--spacing-xs) 0',
                color: 'var(--text-primary)'
              }}>
                {stats.totalMeetings}
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                margin: 0,
                fontSize: 'var(--font-sm)'
              }}>
                Total Meetings
              </p>
            </div>
          </div>

          <div className="col-3">
            <div className="card" style={{
              textAlign: 'center',
              border: '1px solid var(--border-light)',
              transition: 'all var(--transition-normal)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}>
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
                <Users size={24} />
              </div>
              <h3 style={{
                fontSize: 'var(--font-2xl)',
                fontWeight: 'bold',
                margin: '0 0 var(--spacing-xs) 0',
                color: 'var(--text-primary)'
              }}>
                {stats.totalAttendees}
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                margin: 0,
                fontSize: 'var(--font-sm)'
              }}>
                Total Attendees
              </p>
            </div>
          </div>

          <div className="col-3">
            <div className="card" style={{
              textAlign: 'center',
              border: '1px solid var(--border-light)',
              transition: 'all var(--transition-normal)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}>
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
                <TrendingUp size={24} />
              </div>
              <h3 style={{
                fontSize: 'var(--font-2xl)',
                fontWeight: 'bold',
                margin: '0 0 var(--spacing-xs) 0',
                color: 'var(--text-primary)'
              }}>
                {stats.avgAttendance}%
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                margin: 0,
                fontSize: 'var(--font-sm)'
              }}>
                Avg. Attendance
              </p>
            </div>
          </div>

          <div className="col-3">
            <div className="card" style={{
              textAlign: 'center',
              border: '1px solid var(--border-light)',
              transition: 'all var(--transition-normal)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-md) auto',
                color: 'white'
              }}>
                <Award size={24} />
              </div>
              <h3 style={{
                fontSize: 'var(--font-2xl)',
                fontWeight: 'bold',
                margin: '0 0 var(--spacing-xs) 0',
                color: 'var(--text-primary)'
              }}>
                {stats.testPerformance}%
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                margin: 0,
                fontSize: 'var(--font-sm)'
              }}>
                Test Performance
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Main Content */}
      <div className="row">
        {/* Admin Actions */}
        <div className="col-6">
          <div className="card">
            <h2 style={{
              fontSize: 'var(--font-xl)',
              fontWeight: '600',
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <Settings size={20} />
              Admin Actions
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--spacing-md)'
            }}>
              <button 
                className="btn btn-primary" 
                style={{
                  padding: 'var(--spacing-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'all var(--transition-normal)',
                  textAlign: 'center'
                }}
                onClick={() => navigate('/create-meeting')}
              >
                <Calendar size={20} />
                Create Meeting
              </button>
              <button 
                className="btn btn-outline" 
                style={{
                  padding: 'var(--spacing-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'all var(--transition-normal)',
                  textAlign: 'center'
                }}
                onClick={() => navigate('/meeting-statistics')}
              >
                <BarChart3 size={20} />
                View Statistics
              </button>
              <button 
                className="btn btn-outline" 
                style={{
                  padding: 'var(--spacing-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'all var(--transition-normal)',
                  textAlign: 'center'
                }}
                onClick={() => navigate('/meetings')}
              >
                <Users size={20} />
                Manage Meetings
              </button>
              <button 
                className="btn btn-outline" 
                style={{
                  padding: 'var(--spacing-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'all var(--transition-normal)',
                  textAlign: 'center'
                }}
                onClick={() => navigate('/admin-reports')}
              >
                <FileText size={20} />
                Generate Reports
              </button>
            </div>
          </div>
        </div>

        {/* Recent Admin Activity */}
        <div className="col-6">
          <div className="card">
            <h2 style={{
              fontSize: 'var(--font-xl)',
              fontWeight: '600',
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <Activity size={20} />
              Recent Admin Activity
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div style={{
                padding: 'var(--spacing-md)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--background-soft)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  <h4 style={{ margin: 0, fontSize: 'var(--font-base)', fontWeight: '600' }}>
                    Meeting Created: Pediatric Emergency Care
                  </h4>
                  <span style={{ 
                    fontSize: 'var(--font-sm)', 
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap'
                  }}>
                    2 hours ago
                  </span>
                </div>
                <p style={{ 
                  margin: 0, 
                  fontSize: 'var(--font-sm)', 
                  color: 'var(--text-secondary)' 
                }}>
                  Scheduled for Tomorrow 2:00 PM | 25 Doctors Invited
                </p>
              </div>
              
              <div style={{
                padding: 'var(--spacing-md)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--background-soft)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  <h4 style={{ margin: 0, fontSize: 'var(--font-base)', fontWeight: '600' }}>
                    Statistics Report Generated
                  </h4>
                  <span style={{ 
                    fontSize: 'var(--font-sm)', 
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap'
                  }}>
                    1 day ago
                  </span>
                </div>
                <p style={{ 
                  margin: 0, 
                  fontSize: 'var(--font-sm)', 
                  color: 'var(--text-secondary)' 
                }}>
                  Monthly Training Report - December 2024
                </p>
              </div>
              
              <div style={{
                padding: 'var(--spacing-md)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--background-soft)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  <h4 style={{ margin: 0, fontSize: 'var(--font-base)', fontWeight: '600' }}>
                    New Doctor Registered
                  </h4>
                  <span style={{ 
                    fontSize: 'var(--font-sm)', 
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap'
                  }}>
                    2 days ago
                  </span>
                </div>
                <p style={{ 
                  margin: 0, 
                  fontSize: 'var(--font-sm)', 
                  color: 'var(--text-secondary)' 
                }}>
                  Dr. Priya Sharma - Cardiology Department
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Overview */}
      <div className="row" style={{ marginTop: 'var(--spacing-lg)' }}>
        <div className="col-12">
          <div className="card">
            <h2 style={{
              fontSize: 'var(--font-xl)',
              fontWeight: '600',
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <CheckCircle size={20} />
              System Overview
            </h2>
            <div className="row">
              <div className="col-4">
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-lg)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--background-soft)'
                }}>
                  <UserPlus size={32} style={{ color: 'var(--primary-600)', marginBottom: 'var(--spacing-sm)' }} />
                  <h3 style={{ margin: '0 0 var(--spacing-xs) 0', fontSize: 'var(--font-lg)' }}>32</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>Active Doctors</p>
                </div>
              </div>
              <div className="col-4">
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-lg)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--background-soft)'
                }}>
                  <Calendar size={32} style={{ color: 'var(--success-600)', marginBottom: 'var(--spacing-sm)' }} />
                  <h3 style={{ margin: '0 0 var(--spacing-xs) 0', fontSize: 'var(--font-lg)' }}>5</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>Upcoming Meetings</p>
                </div>
              </div>
              <div className="col-4">
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-lg)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--background-soft)'
                }}>
                  <FileText size={32} style={{ color: 'var(--warning-600)', marginBottom: 'var(--spacing-sm)' }} />
                  <h3 style={{ margin: '0 0 var(--spacing-xs) 0', fontSize: 'var(--font-lg)' }}>156</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>Reports Generated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
