import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, Building2, Users, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { LoginForm } from '../types';

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
      }}>
        {/* Left Side - Welcome Section */}
        <div style={{
          color: 'var(--text-white)',
          padding: 'var(--spacing-lg)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'var(--text-white)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-dark)',
              fontSize: 'var(--font-2xl)',
              fontWeight: 'bold'
            }}>
              MG
            </div>
            <div>
              <h1 style={{
                fontSize: 'var(--font-3xl)',
                fontWeight: 'bold',
                margin: 0,
                lineHeight: 1.2
              }}>
                Medi Guru
              </h1>
              <p style={{
                fontSize: 'var(--font-base)',
                margin: 0,
                opacity: 0.9
              }}>
                Virtual Medical Training Portal
              </p>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h2 style={{
              fontSize: 'var(--font-2xl)',
              fontWeight: '600',
              marginBottom: 'var(--spacing-md)',
              lineHeight: 1.3
            }}>
              Welcome to Your Medical Training Hub
            </h2>
            <p style={{
              fontSize: 'var(--font-lg)',
              opacity: 0.9,
              lineHeight: 1.6,
              marginBottom: 'var(--spacing-lg)'
            }}>
              Join expert-led training sessions, access comprehensive learning materials, 
              and enhance your medical knowledge with our comprehensive virtual training platform.
            </p>
          </div>

          {/* Features */}
          <div style={{
            display: 'grid',
            gap: 'var(--spacing-md)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <Heart size={24} style={{ color: '#ff6b6b' }} />
              <span style={{ fontSize: 'var(--font-base)' }}>
                Expert-led weekly medical training sessions
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <Shield size={24} style={{ color: '#4ecdc4' }} />
              <span style={{ fontSize: 'var(--font-base)' }}>
                Secure government portal with role-based access
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <Users size={24} style={{ color: '#45b7d1' }} />
              <span style={{ fontSize: 'var(--font-base)' }}>
                Connect with medical professionals across Raipur
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <Building2 size={24} style={{ color: '#f9ca24' }} />
              <span style={{ fontSize: 'var(--font-base)' }}>
                CMHO Office, Raipur | Health & Family Welfare Dept., CG
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="card" style={{
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

          {/* Demo Accounts Info */}
          <div style={{
            marginTop: 'var(--spacing-lg)',
            padding: 'var(--spacing-md)',
            background: 'var(--bg-light)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)'
          }}>
            <h4 style={{
              fontSize: 'var(--font-sm)',
              fontWeight: '600',
              margin: '0 0 var(--spacing-xs) 0',
              color: 'var(--text-primary)'
            }}>
              Demo Accounts ({selectedRole === 'admin' ? 'Admin' : 'Doctor'}):
            </h4>
            <div style={{
              fontSize: 'var(--font-xs)',
              color: 'var(--text-secondary)',
              lineHeight: 1.4
            }}>
              {selectedRole === 'admin' ? (
                <>
                  <div>CMHO Admin: amit.verma@cmho.raipur.gov.in</div>
                  <div>District Collector: deepak.agrawal@collector.raipur.gov.in</div>
                </>
              ) : (
                <>
                  <div>Medical Officer: rajesh.kumar@raipur.gov.in</div>
                  <div>Pediatrician: priya.sharma@raipur.gov.in</div>
                  <div>Expert: sunita.patel@expert.gov.in</div>
                </>
              )}
              <div style={{ marginTop: 'var(--spacing-xs)', fontStyle: 'italic' }}>
                Use any password for demo login
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Design */}
      <style>{`
        @media (max-width: 768px) {
          .login-container {
            grid-template-columns: 1fr !important;
            gap: var(--spacing-lg) !important;
          }
          
          .welcome-section {
            order: 2;
            text-align: center;
            padding: var(--spacing-md) !important;
          }
          
          .login-form {
            order: 1;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
