import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Meetings from './pages/Meetings';
import MeetingStatistics from './pages/MeetingStatistics';
import CreateMeeting from './pages/CreateMeeting';

// Import global theme styles
import './styles/theme.css';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--primary-gradient)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading" style={{ 
            marginBottom: 'var(--spacing-md)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderTopColor: 'white'
          }} />
          <p style={{ margin: 0, fontSize: 'var(--font-lg)' }}>
            Loading Medi Guru Portal...
          </p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Admin and Doctor specific pages
const AdminReports: React.FC = () => (
  <div className="container">
    <h2>Admin Reports</h2>
    <p>Admin reports page is under development...</p>
  </div>
);

const UploadPretest: React.FC = () => (
  <div className="container">
    <h2>Upload Pre-test</h2>
    <p>Doctor pre-test upload page is under development...</p>
  </div>
);

const UploadAttendance: React.FC = () => (
  <div className="container">
    <h2>Upload Attendance</h2>
    <p>Doctor attendance upload page is under development...</p>
  </div>
);

const UploadPosttest: React.FC = () => (
  <div className="container">
    <h2>Upload Post-test</h2>
    <p>Doctor post-test upload page is under development...</p>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Admin Routes */}
        <Route path="create-meeting" element={<CreateMeeting />} />
        <Route path="meeting-statistics" element={<MeetingStatistics />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="admin-reports" element={<AdminReports />} />
        
        {/* Doctor Routes */}
        <Route path="upload-pretest" element={<UploadPretest />} />
        <Route path="upload-attendance" element={<UploadAttendance />} />
        <Route path="upload-posttest" element={<UploadPosttest />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
