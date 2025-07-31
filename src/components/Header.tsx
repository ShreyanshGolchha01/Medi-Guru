import React, { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header style={{
      background: 'var(--primary-gradient)',
      color: 'var(--text-white)',
      padding: '0 var(--spacing-lg)',
      boxShadow: 'var(--shadow-md)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '90px',
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
              padding: '6px'
            }}>
              <img 
                src="/medigurulogo.svg" 
                alt="Medi Guru Logo"
                style={{
                  width: '50px',
                  height: '50px',
                  objectFit: 'contain'
                }}
              />
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
              {/* {user?.profileImage ? (
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
              )} */}
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
      {showUserMenu && (
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
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
