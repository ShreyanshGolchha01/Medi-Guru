import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Video, 
  FileText, 
  BookOpen, 
  Award, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Settings,
  HelpCircle,
  Play,
  Download,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { SidebarItem } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const sidebarItems: SidebarItem[] = user?.role === 'admin' ? [
    // Admin Navigation
    {
      id: 'dashboard',
      label: 'Admin Dashboard',
      icon: 'Home',
      path: '/dashboard',
      roles: ['admin']
    },
    {
      id: 'create-meeting',
      label: 'Create Meeting',
      icon: 'Calendar',
      path: '/create-meeting',
      roles: ['admin']
    },
    {
      id: 'meetings',
      label: 'Manage Meetings',
      icon: 'Users',
      path: '/meetings',
      roles: ['admin']
    },
    {
      id: 'meeting-statistics',
      label: 'Meeting Statistics',
      icon: 'BarChart3',
      path: '/meeting-statistics',
      roles: ['admin']
    }
  ] : [
    // Doctor Navigation - Only Meetings
    {
      id: 'meetings',
      label: 'Meetings',
      icon: 'Calendar',
      path: '/meetings',
      roles: ['doctor']
    }
  ];

  const getIcon = (iconName: string, size: number = 20) => {
    const icons: Record<string, React.ComponentType<any>> = {
      Home,
      Calendar,
      Video,
      FileText,
      BookOpen,
      Award,
      MessageSquare,
      BarChart3,
      Users,
      Settings,
      HelpCircle,
      Play,
      Download
    };
    
    const IconComponent = icons[iconName];
    return IconComponent ? <IconComponent size={size} /> : <Home size={size} />;
  };

  const filteredItems = sidebarItems.filter(item => 
    item.roles?.includes(user?.role || 'doctor')
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'var(--bg-overlay)',
            zIndex: 998
          }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          width: '280px',
          height: 'calc(100vh - 70px)',
          background: 'var(--bg-white)',
          borderRight: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-md)',
          zIndex: 999,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform var(--transition-normal)',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {/* User Info Section */}
        <div style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--border-light)',
          background: 'var(--bg-light)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)'
          }}>
            {/* {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--border-medium)'
                }}
              />
            ) : (
              <div style={{
                width: '48px',
                height: '48px',
                background: 'var(--text-white)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--border-medium)',
                padding: '4px'
              }}>
                <img
                  src="/src/assets/medigurulogo.png"
                  alt="Medi Guru Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
            )} */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 'var(--font-base)',
                fontWeight: '600',
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {user?.name || 'User Name'}
              </div>
              <div style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--text-secondary)',
                textTransform: 'capitalize',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {user?.role === 'admin' ? 'Admin' : 'Doctor'}
              </div>
              <div style={{
                fontSize: 'var(--font-xs)',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {user?.department || 'Department'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: 'var(--spacing-md) 0' }}>
          <ul style={{
            listStyle: 'none',
            margin: 0,
            padding: 0
          }}>
            {filteredItems.map((item) => (
              <li key={item.id} style={{ margin: '0 var(--spacing-sm)' }}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    margin: '2px 0',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    color: isActive ? 'var(--text-white)' : 'var(--text-primary)',
                    background: isActive ? 'var(--primary-gradient)' : 'transparent',
                    transition: 'all var(--transition-fast)',
                    fontSize: 'var(--font-sm)',
                    fontWeight: isActive ? '600' : '500'
                  })}
                  onMouseEnter={(e) => {
                    const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-light)';
                      e.currentTarget.style.color = 'var(--primary-dark)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                >
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '20px'
                  }}>
                    {getIcon(item.icon)}
                  </span>
                  <span style={{
                    flex: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span style={{
                      background: '#dc3545',
                      color: 'white',
                      borderRadius: 'var(--radius-sm)',
                      padding: '2px 6px',
                      fontSize: 'var(--font-xs)',
                      fontWeight: 'bold',
                      minWidth: '18px',
                      textAlign: 'center'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Section */}
        <div style={{
          padding: 'var(--spacing-md)',
          borderTop: '1px solid var(--border-light)'
        }}>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            style={{
              width: '100%',
              background: 'transparent',
              border: '1px solid var(--border-medium)',
              color: '#dc3545',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-sm)',
              fontWeight: '500',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
              e.currentTarget.style.borderColor = '#dc3545';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'var(--border-medium)';
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Footer */}
        <div style={{
          padding: 'var(--spacing-md)',
          borderTop: '1px solid var(--border-light)',
          marginTop: 'auto',
          textAlign: 'center'
        }}>
          <p style={{
            margin: 0,
            fontSize: 'var(--font-xs)',
            color: 'var(--text-muted)',
            lineHeight: 1.4
          }}>
            Medi Guru Portal v1.0<br />
            SSIPMT, Raipur<br />
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
