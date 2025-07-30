import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { LoginForm } from '../types';
import serverUrl from '../services/server';

const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'medical_officer'>('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login(
        formData.email,
        formData.password
      );
      
      if (formData.rememberMe) {
        localStorage.setItem('remember_me', 'true');
      }
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Login failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--primary-gradient)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-md)',
      position: 'relative'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 500px)',
        gap: 'var(--spacing-xl)',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}
      className="login-container"
      >
        {/* Left Side - Welcome Section */}
        <div style={{
          color: 'var(--text-white)',
          padding: 'var(--spacing-lg)',
          position: 'relative'
        }}
        className="welcome-section"
        >
          {/* Large Background Logo Circle */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '40%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            height: '400px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 1,
            zIndex: 0,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2), inset 0 0 30px rgba(255, 255, 255, 0.1)'
          }}>
            <img 
              src="/medigurulogo.svg" 
              alt="Medi Guru Background Logo" 
              style={{
                width: '320px',
                height: '320px',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="card login-form" style={{
          background: 'var(--bg-white)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-xl)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: 'var(--spacing-xl)'
          }}>
            <h3 style={{
              fontSize: 'var(--font-2xl)',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: '0 0 var(--spacing-xs) 0'
            }}>
              Sign In to Your Account
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              margin: 0,
              fontSize: 'var(--font-base)'
            }}>
              Access your medical training dashboard
            </p>
          </div>

          {/* Role Selection Toggle */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '4px',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              style={{
                flex: 1,
                padding: 'var(--spacing-sm)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                background: selectedRole === 'admin' ? 'var(--primary-gradient)' : 'transparent',
                color: selectedRole === 'admin' ? 'var(--text-white)' : 'var(--text-secondary)',
                fontSize: 'var(--font-sm)',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Shield size={16} style={{ marginRight: 'var(--spacing-xs)' }} />
              Admin
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('medical_officer')}
              style={{
                flex: 1,
                padding: 'var(--spacing-sm)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                background: selectedRole === 'medical_officer' ? 'var(--primary-gradient)' : 'transparent',
                color: selectedRole === 'medical_officer' ? 'var(--text-white)' : 'var(--text-secondary)',
                fontSize: 'var(--font-sm)',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Users size={16} style={{ marginRight: 'var(--spacing-xs)' }} />
              Doctor
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={16} style={{ marginRight: 'var(--spacing-xs)' }} />
                Official Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-control ${errors.email ? 'error' : ''}`}
                placeholder="your.name@raipur.gov.in"
                required
              />
              {errors.email && (
                <div className="form-error">{errors.email}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock size={16} style={{ marginRight: 'var(--spacing-xs)' }} />
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-control ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  required
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 'var(--spacing-sm)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <div className="form-error">{errors.password}</div>
              )}
            </div>

            {/* Remember Me */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                cursor: 'pointer',
                fontSize: 'var(--font-sm)',
                color: 'var(--text-secondary)'
              }}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: 'var(--accent-color)'
                  }}
                />
                Remember me
              </label>
              
              <a
                href="#forgot-password"
                style={{
                  color: 'var(--accent-color)',
                  fontSize: 'var(--font-sm)',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                marginBottom: 'var(--spacing-md)'
              }}
            >
              {isSubmitting || isLoading ? (
                <>
                  <span className="loading" style={{ marginRight: 'var(--spacing-xs)' }} />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Powered By */}
            <div style={{
              textAlign: 'center',
              marginBottom: 'var(--spacing-md)',
              padding: 'var(--spacing-sm)',
              borderTop: '1px solid var(--border-light)',
              fontSize: 'var(--font-xs)',
              color: 'var(--text-muted)'
            }}>
              Powered by: <strong style={{ color: 'var(--primary-dark)' }}>SSIPMT, RAIPUR</strong>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div style={{
                background: 'rgba(220, 53, 69, 0.1)',
                border: '1px solid #dc3545',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-sm)',
                color: '#dc3545',
                fontSize: 'var(--font-sm)',
                textAlign: 'center',
                marginBottom: 'var(--spacing-md)'
              }}>
                {errors.submit}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Responsive Design */}
      <style>{`
        @media (max-width: 768px) {
          .login-container {
            grid-template-columns: 1fr !important;
            gap: var(--spacing-md) !important;
            padding: var(--spacing-sm) !important;
          }
          
          .welcome-section {
            order: 1;
            text-align: center;
            padding: var(--spacing-md) !important;
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .welcome-section > div {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            transform: none !important;
            width: 200px !important;
            height: 200px !important;
            margin: 0 auto !important;
          }
          
          .welcome-section img {
            width: 150px !important;
            height: 150px !important;
          }
          
          .login-form {
            order: 2;
            margin: 0 !important;
            padding: var(--spacing-lg) !important;
            border-radius: var(--radius-lg) !important;
          }
        }

        @media (max-width: 480px) {
          .login-container {
            padding: var(--spacing-xs) !important;
          }
          
          .welcome-section {
            min-height: 150px;
          }
          
          .welcome-section > div {
            width: 150px !important;
            height: 150px !important;
          }
          
          .welcome-section img {
            width: 120px !important;
            height: 120px !important;
          }
          
          .login-form {
            padding: var(--spacing-md) !important;
            border-radius: var(--radius-md) !important;
          }
          
          .login-form h3 {
            font-size: var(--font-lg) !important;
          }
          
          .login-form p {
            font-size: var(--font-sm) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
