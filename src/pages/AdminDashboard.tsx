import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  TrendingUp,
  Settings,
  BarChart3
} from 'lucide-react';

interface AdminStats {
  totalMeetings: number;
  totalAttendees: number;
  avgAttendance: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    // Mock admin stats
    const mockStats: AdminStats = {
      totalMeetings: 12,
      totalAttendees: 45,
      avgAttendance: 78
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
    <div style={{ 
      padding: '0 var(--spacing-md) var(--spacing-md) var(--spacing-md)'
    }}>
      {/* Admin Welcome Section */}
      <div style={{
        background: 'var(--primary-gradient)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-lg)',
        color: 'var(--text-white)',
        marginBottom: 'var(--spacing-md)'
      }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-sm)'
        }}>
          <div>
            <h1 style={{
              fontSize: 'var(--font-3xl)',
              fontWeight: 'bold',
              margin: '0 0 var(--spacing-xs) 0'
            }}>
              {getGreeting()}, Admin!
            </h1>
            <p style={{
              fontSize: 'var(--font-base)',
              margin: '0 0 var(--spacing-sm) 0',
              opacity: 0.9,
              lineHeight: 1.4
            }}>
              Manage meetings and monitor training progress.
            </p>
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-md)',
              flexWrap: 'wrap',
              fontSize: 'var(--font-sm)'
            }}>
              {/* <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)'
              }}>
                <Settings size={16} />
                <span>ADMINISTRATOR</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)'
              }}>
                <Calendar size={16} />
                <span>CMHO, Raipur</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Stats Cards */}
      {stats && (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-md)'
        }}>
          <div className="card" style={{
            textAlign: 'center',
            border: '1px solid var(--border-light)',
            transition: 'all var(--transition-normal)',
            cursor: 'pointer',
            padding: 'var(--spacing-md)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}>
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
              <Calendar size={30} />
            </div>
            <h3 style={{
              fontSize: 'var(--font-xl)',
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

          <div className="card" style={{
            textAlign: 'center',
            border: '1px solid var(--border-light)',
            transition: 'all var(--transition-normal)',
            cursor: 'pointer',
            padding: 'var(--spacing-md)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}>
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
              <Users size={30} />
            </div>
            <h3 style={{
              fontSize: 'var(--font-xl)',
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

          <div className="card" style={{
            textAlign: 'center',
            border: '1px solid var(--border-light)',
            transition: 'all var(--transition-normal)',
            cursor: 'pointer',
            padding: 'var(--spacing-md)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}>
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
              <TrendingUp size={30} />
            </div>
            <h3 style={{
              fontSize: 'var(--font-xl)',
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
      )}

      {/* Admin Actions */}
      <div className="card">
        <h2 style={{
          fontSize: 'var(--font-lg)',
          fontWeight: '600',
          marginBottom: 'var(--spacing-md)',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)'
        }}>
          <Settings size={18} />
          Admin Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 'var(--spacing-sm)'
        }}>
          <button 
            className="btn btn-outline" 
            style={{
              padding: 'var(--spacing-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-normal)',
              textAlign: 'center',
              fontSize: 'var(--font-sm)'
            }}
            onClick={() => navigate('/create-meeting')}
          >
            <Calendar size={18} />
            Create Meeting
          </button>
          <button 
            className="btn btn-outline" 
            style={{
              padding: 'var(--spacing-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-normal)',
              textAlign: 'center',
              fontSize: 'var(--font-sm)'
            }}
            onClick={() => navigate('/meeting-statistics')}
          >
            <BarChart3 size={18} />
            Statistics
          </button>
          <button 
            className="btn btn-outline" 
            style={{
              padding: 'var(--spacing-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-normal)',
              textAlign: 'center',
              fontSize: 'var(--font-sm)'
            }}
            onClick={() => navigate('/meetings')}
          >
            <Users size={18} />
            Manage
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
