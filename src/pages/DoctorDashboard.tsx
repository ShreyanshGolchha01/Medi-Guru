import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Calendar,
  Users,
  TrendingUp,
  Award,
  BookOpen,
  FileText,
  Eye
} from 'lucide-react';

interface DoctorStats {
  upcomingSessions: number;
  completedSessions: number;
  averageScore: number;
  certificatesEarned: number;
}

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DoctorStats | null>(null);

  useEffect(() => {
    // TODO: Fetch doctor stats from API
    const fetchDoctorStats = async () => {
      try {
        // const response = await fetch('/api/doctor/stats');
        // const stats = await response.json();
        // setStats(stats);
        
        // For now, set empty stats
        setStats({
          upcomingSessions: 0,
          completedSessions: 0,
          averageScore: 0,
          certificatesEarned: 0
        });
      } catch (error) {
        console.error('Error fetching doctor stats:', error);
      }
    };

    fetchDoctorStats();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      {/* Doctor Welcome Section */}
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
              {getGreeting()}, Dr. {user?.name?.split(' ')[1] || user?.name}! 👨‍⚕️
            </h1>
            <p style={{
              fontSize: 'var(--font-lg)',
              margin: '0 0 var(--spacing-md) 0',
              opacity: 0.9,
              lineHeight: 1.5
            }}>
              Welcome back to your medical training dashboard. Ready to continue your learning journey and contribute to healthcare excellence?
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
                <Users size={18} />
                <span style={{ fontSize: 'var(--font-sm)' }}>
                  DOCTOR
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)'
              }}>
                <Calendar size={18} />
                <span style={{ fontSize: 'var(--font-sm)' }}>
                  {user?.department || 'Medical Department'}
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

      {/* Doctor Stats Cards */}
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
                {stats.upcomingSessions}
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                margin: 0,
                fontSize: 'var(--font-sm)'
              }}>
                Upcoming Sessions
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
                <BookOpen size={24} />
              </div>
              <h3 style={{
                fontSize: 'var(--font-2xl)',
                fontWeight: 'bold',
                margin: '0 0 var(--spacing-xs) 0',
                color: 'var(--text-primary)'
              }}>
                {stats.completedSessions}
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                margin: 0,
                fontSize: 'var(--font-sm)'
              }}>
                Completed Sessions
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
                {stats.averageScore.toFixed(1)}%
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                margin: 0,
                fontSize: 'var(--font-sm)'
              }}>
                Average Score
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
                {stats.certificatesEarned}
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                margin: 0,
                fontSize: 'var(--font-sm)'
              }}>
                Certificates Earned
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Main Content */}
      <div className="row">
        {/* Quick Actions */}
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
              <BookOpen size={20} />
              Quick Actions
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
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
                onClick={() => navigate('/meetings')}
              >
                <Eye size={20} />
                View Meetings
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
                onClick={() => navigate('/upload-pretest')}
              >
                <FileText size={20} />
                Upload Pre-test
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
                onClick={() => navigate('/upload-attendance')}
              >
                <Users size={20} />
                Upload Attendance
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
                onClick={() => navigate('/upload-posttest')}
              >
                <TrendingUp size={20} />
                Upload Post-test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
