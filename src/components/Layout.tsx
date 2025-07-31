import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-light)'
    }}>
      <Header 
        onMenuToggle={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            transition: 'opacity var(--transition-fast)'
          }}
          onClick={closeSidebar}
        />
      )}

      <main style={{
        marginLeft: isMobile ? '0' : (isSidebarOpen ? '280px' : '0'),
        marginTop: '30px',
        transition: 'margin-left var(--transition-normal)',
        minHeight: 'calc(100vh - 70px)',
        background: 'var(--bg-light)'
      }}>
        <div style={{
          padding: 'var(--spacing-xs)',
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
