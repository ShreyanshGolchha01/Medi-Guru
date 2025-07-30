import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Route to appropriate dashboard based on user role
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else if (user?.role === 'doctor') {
    // Redirect doctors directly to meetings page
    return <Navigate to="/meetings" replace />;
  } else {
    // Fallback in case of unknown role
    return (
      <div style={{ 
        padding: 'var(--spacing-lg)', 
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        <h2>Access Denied</h2>
        <p>Please contact administrator for access.</p>
      </div>
    );
  }
};

export default Dashboard;
