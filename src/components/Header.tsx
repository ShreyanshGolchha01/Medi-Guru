import React, { useState } from 'react';
import { Bell, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Notification } from '../types';
import { mockNotifications } from '../data/mockData';

interface HeaderProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useState<Notification[]>(
    user ? mockNotifications.filter(n => n.userId === user.id) : []
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header style={{
      background: 'var(--primary-gradient)',
      color: 'var(--text-white)',
      padding: '0 var(--spacing-md)',
      boxShadow: 'var(--shadow-md)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        maxWidth: '100%'
      }}>
        {/* Left Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)'
        }}>
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuToggle}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-white)',
              cursor: 'pointer',
              padding: 'var(--spacing-xs)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo and Title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'var(--text-white)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-dark)',
              fontWeight: 'bold',
              fontSize: 'var(--font-lg)'
            }}>
              MG
            </div>
            <div>
              <h1 style={{
                fontSize: 'var(--font-xl)',
                fontWeight: '600',
                margin: 0,
                lineHeight: 1
              }}>
                Medi Guru
              </h1>
              <p style={{
                fontSize: 'var(--font-xs)',
                margin: 0,
                opacity: 0.9,
                lineHeight: 1
              }}>
                Virtual Medical Training Portal
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)'
        }}>
          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-white)',
                cursor: 'pointer',
                padding: 'var(--spacing-xs)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'background-color var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  background: '#dc3545',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: 'var(--bg-white)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                width: '320px',
                maxHeight: '400px',
                overflowY: 'auto',
                zIndex: 1001,
                marginTop: 'var(--spacing-xs)'
              }}>
                <div style={{
                  padding: 'var(--spacing-md)',
                  borderBottom: '1px solid var(--border-light)',
                  background: 'var(--bg-light)'
                }}>
                  <h3 style={{
                    margin: 0,
                    color: 'var(--text-primary)',
                    fontSize: 'var(--font-base)',
                    fontWeight: '600'
                  }}>
                    Notifications ({notifications.length})
                  </h3>
                </div>
                
                <div>
                  {notifications.length === 0 ? (
                    <div style={{
                      padding: 'var(--spacing-lg)',
                      textAlign: 'center',
                      color: 'var(--text-muted)'
                    }}>
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        style={{
                          padding: 'var(--spacing-md)',
                          borderBottom: '1px solid var(--border-light)',
                          background: notification.isRead ? 'transparent' : 'rgba(46, 139, 87, 0.1)',
                          cursor: 'pointer',
                          transition: 'background-color var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg-light)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = notification.isRead ? 'transparent' : 'rgba(46, 139, 87, 0.1)';
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: 'var(--spacing-xs)'
                        }}>
                          <h4 style={{
                            margin: 0,
                            fontSize: 'var(--font-sm)',
                            fontWeight: '600',
                            color: 'var(--text-primary)'
                          }}>
                            {notification.title}
                          </h4>
                          <span style={{
                            fontSize: 'var(--font-xs)',
                            color: 'var(--text-muted)'
                          }}>
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                        <p style={{
                          margin: 0,
                          fontSize: 'var(--font-sm)',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.4
                        }}>
                          {notification.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div style={{
                    padding: 'var(--spacing-md)',
                    background: 'var(--bg-light)',
                    textAlign: 'center'
                  }}>
                    <button style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-color)',
                      cursor: 'pointer',
                      fontSize: 'var(--font-sm)',
                      fontWeight: '500'
                    }}>
                      Mark all as read
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-white)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-xs)',
                borderRadius: 'var(--radius-md)',
                transition: 'background-color var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'var(--text-white)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-dark)'
                }}>
                  <User size={16} />
                </div>
              )}
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  fontSize: 'var(--font-sm)',
                  fontWeight: '500',
                  lineHeight: 1
                }}>
                  {user?.name || 'User'}
                </div>
                <div style={{
                  fontSize: 'var(--font-xs)',
                  opacity: 0.9,
                  lineHeight: 1
                }}>
                  {user?.role.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: 'var(--bg-white)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                width: '200px',
                zIndex: 1001,
                marginTop: 'var(--spacing-xs)',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: 'var(--spacing-md)',
                  borderBottom: '1px solid var(--border-light)',
                  background: 'var(--bg-light)'
                }}>
                  <div style={{
                    fontSize: 'var(--font-sm)',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    {user?.name}
                  </div>
                  <div style={{
                    fontSize: 'var(--font-xs)',
                    color: 'var(--text-muted)'
                  }}>
                    {user?.email}
                  </div>
                </div>

                <div>
                  <button
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--font-sm)',
                      transition: 'background-color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-light)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <User size={16} />
                    Profile
                  </button>

                  <button
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--font-sm)',
                      transition: 'background-color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-light)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Settings size={16} />
                    Settings
                  </button>

                  <hr style={{
                    margin: 'var(--spacing-xs) 0',
                    border: 'none',
                    borderTop: '1px solid var(--border-light)'
                  }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      color: '#dc3545',
                      fontSize: 'var(--font-sm)',
                      transition: 'background-color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 999
          }}
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
