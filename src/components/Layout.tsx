import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

      <main style={{
        marginLeft: isSidebarOpen ? '280px' : '0',
        marginTop: '70px',
        transition: 'margin-left var(--transition-normal)',
        minHeight: 'calc(100vh - 70px)',
        background: 'var(--bg-light)'
      }}>
        <div style={{
          padding: 'var(--spacing-md)',
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          <Outlet />
        </div>
      </main>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 768px) {
          main {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
