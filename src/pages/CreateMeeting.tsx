import React, { useState } from 'react';
import { Calendar, Clock, User, BookOpen, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import serverUrl from '../services/server';

interface MeetingFormData {
  meetingName: string;
  meetingDate: string;
  meetingTime: string;
  meetingTopic: string;
  meetingHost: string;
}

const CreateMeeting: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<MeetingFormData>({
    meetingName: '',
    meetingDate: '',
    meetingTime: '',
    meetingTopic: '',
    meetingHost: ''
  });
  const [errors, setErrors] = useState<Partial<MeetingFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof MeetingFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<MeetingFormData> = {};
    
    if (!formData.meetingName.trim()) {
      newErrors.meetingName = 'Meeting name is required';
    }
    
    if (!formData.meetingDate) {
      newErrors.meetingDate = 'Meeting date is required';
    } else {
      const selectedDate = new Date(formData.meetingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.meetingDate = 'Meeting date cannot be in the past';
      }
    }
    
    if (!formData.meetingTime) {
      newErrors.meetingTime = 'Meeting time is required';
    }
    
    if (!formData.meetingTopic.trim()) {
      newErrors.meetingTopic = 'Meeting topic is required';
    }
    
    if (!formData.meetingHost.trim()) {
      newErrors.meetingHost = 'Meeting host name is required';
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
      // Get auth token from localStorage
      const authToken = localStorage.getItem('auth_token');
      
      if (!authToken) {
        alert('Authentication required. Please log in again.');
        navigate('/login');
        return;
      }

      // API call to create meeting
      const response = await fetch(`${serverUrl}medi_create-meeting.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          name: formData.meetingName,
          date: formData.meetingDate,
          time: formData.meetingTime,
          topic: formData.meetingTopic,
          hosters: formData.meetingHost
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Show success message and redirect
        alert('Meeting created successfully!');
        navigate('/meetings');
      } else {
        // Handle API errors
        const errorMessage = data.message || 'Failed to create meeting. Please try again.';
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      meetingName: '',
      meetingDate: '',
      meetingTime: '',
      meetingTopic: '',
      meetingHost: ''
    });
    setErrors({});
  };

  return (
    <div style={{
      padding: 'var(--spacing-sm)',
      maxWidth: '900px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        marginBottom: 'var(--spacing-lg)',
        background: 'var(--bg-white)',
        padding: 'var(--spacing-md)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-light)',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => navigate('/meetings')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: 'var(--spacing-xs)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)',
            minWidth: '44px',
            minHeight: '44px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-light)';
            e.currentTarget.style.color = 'var(--primary-dark)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h1 style={{
            margin: 0,
            fontSize: 'var(--font-xl)',
            fontWeight: '700',
            color: 'var(--text-primary)',
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.2
          }}>
            Create New Meeting
          </h1>
          <p style={{
            margin: '4px 0 0 0',
            fontSize: 'var(--font-sm)',
            color: 'var(--text-secondary)',
            lineHeight: 1.4
          }}>
            Schedule a new training session for medical officers
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{
        background: 'var(--bg-white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-light)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'var(--primary-gradient)',
          padding: 'var(--spacing-lg)',
          color: 'var(--text-white)'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: 'var(--font-xl)',
            fontWeight: '600'
          }}>
            Meeting Details
          </h2>
          <p style={{
            margin: '4px 0 0 0',
            fontSize: 'var(--font-sm)',
            opacity: 0.9,
            lineHeight: 1.4
          }}>
            Fill in the details to create a new training meeting
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 'var(--spacing-lg)' }}>
          <div style={{
            display: 'grid',
            gap: 'var(--spacing-lg)'
          }}>
            {/* Meeting Name */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                marginBottom: 'var(--spacing-xs)',
                fontSize: 'var(--font-sm)',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                <BookOpen size={16} />
                Meeting Name *
              </label>
              <input
                type="text"
                value={formData.meetingName}
                onChange={(e) => handleInputChange('meetingName', e.target.value)}
                placeholder="Enter meeting name (e.g., Monthly Training Session)"
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm)',
                  border: `2px solid ${errors.meetingName ? '#dc3545' : 'var(--border-light)'}`,
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-sm)',
                  outline: 'none',
                  transition: 'border-color var(--transition-fast)',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  if (!errors.meetingName) {
                    e.currentTarget.style.borderColor = 'var(--primary-color)';
                  }
                }}
                onBlur={(e) => {
                  if (!errors.meetingName) {
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                  }
                }}
              />
              {errors.meetingName && (
                <p style={{
                  margin: '4px 0 0 0',
                  fontSize: 'var(--font-xs)',
                  color: '#dc3545'
                }}>
                  {errors.meetingName}
                </p>
              )}
            </div>

            {/* Date and Time Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--spacing-md)'
            }}>
              {/* Meeting Date */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  marginBottom: 'var(--spacing-xs)',
                  fontSize: 'var(--font-sm)',
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  <Calendar size={16} />
                  Meeting Date *
                </label>
                <input
                  type="date"
                  value={formData.meetingDate}
                  onChange={(e) => handleInputChange('meetingDate', e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm)',
                    border: `2px solid ${errors.meetingDate ? '#dc3545' : 'var(--border-light)'}`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-sm)',
                    outline: 'none',
                    transition: 'border-color var(--transition-fast)',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    if (!errors.meetingDate) {
                      e.currentTarget.style.borderColor = 'var(--primary-color)';
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.meetingDate) {
                      e.currentTarget.style.borderColor = 'var(--border-light)';
                    }
                  }}
                />
                {errors.meetingDate && (
                  <p style={{
                    margin: '4px 0 0 0',
                    fontSize: 'var(--font-xs)',
                    color: '#dc3545'
                  }}>
                    {errors.meetingDate}
                  </p>
                )}
              </div>

              {/* Meeting Time */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  marginBottom: 'var(--spacing-xs)',
                  fontSize: 'var(--font-sm)',
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  <Clock size={16} />
                  Meeting Time *
                </label>
                <input
                  type="time"
                  value={formData.meetingTime}
                  onChange={(e) => handleInputChange('meetingTime', e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm)',
                    border: `2px solid ${errors.meetingTime ? '#dc3545' : 'var(--border-light)'}`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-sm)',
                    outline: 'none',
                    transition: 'border-color var(--transition-fast)',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    if (!errors.meetingTime) {
                      e.currentTarget.style.borderColor = 'var(--primary-color)';
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.meetingTime) {
                      e.currentTarget.style.borderColor = 'var(--border-light)';
                    }
                  }}
                />
                {errors.meetingTime && (
                  <p style={{
                    margin: '4px 0 0 0',
                    fontSize: 'var(--font-xs)',
                    color: '#dc3545'
                  }}>
                    {errors.meetingTime}
                  </p>
                )}
              </div>
            </div>

            {/* Meeting Topic */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                marginBottom: 'var(--spacing-xs)',
                fontSize: 'var(--font-sm)',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                <BookOpen size={16} />
                Meeting Topic *
              </label>
              <textarea
                value={formData.meetingTopic}
                onChange={(e) => handleInputChange('meetingTopic', e.target.value)}
                placeholder="Enter meeting topic or agenda (e.g., Advanced Cardiac Life Support Training)"
                rows={4}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm)',
                  border: `2px solid ${errors.meetingTopic ? '#dc3545' : 'var(--border-light)'}`,
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-sm)',
                  outline: 'none',
                  transition: 'border-color var(--transition-fast)',
                  resize: 'vertical',
                  minHeight: '100px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  if (!errors.meetingTopic) {
                    e.currentTarget.style.borderColor = 'var(--primary-color)';
                  }
                }}
                onBlur={(e) => {
                  if (!errors.meetingTopic) {
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                  }
                }}
              />
              {errors.meetingTopic && (
                <p style={{
                  margin: '4px 0 0 0',
                  fontSize: 'var(--font-xs)',
                  color: '#dc3545'
                }}>
                  {errors.meetingTopic}
                </p>
              )}
            </div>

            {/* Meeting Host */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                marginBottom: 'var(--spacing-xs)',
                fontSize: 'var(--font-sm)',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                <User size={16} />
                Meeting Host Name *
              </label>
              <input
                type="text"
                value={formData.meetingHost}
                onChange={(e) => handleInputChange('meetingHost', e.target.value)}
                placeholder="Enter host name (e.g., Dr. Rajesh Sharma)"
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm)',
                  border: `2px solid ${errors.meetingHost ? '#dc3545' : 'var(--border-light)'}`,
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-sm)',
                  outline: 'none',
                  transition: 'border-color var(--transition-fast)',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  if (!errors.meetingHost) {
                    e.currentTarget.style.borderColor = 'var(--primary-color)';
                  }
                }}
                onBlur={(e) => {
                  if (!errors.meetingHost) {
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                  }
                }}
              />
              {errors.meetingHost && (
                <p style={{
                  margin: '4px 0 0 0',
                  fontSize: 'var(--font-xs)',
                  color: '#dc3545'
                }}>
                  {errors.meetingHost}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-sm)',
            marginTop: 'var(--spacing-xl)',
            paddingTop: 'var(--spacing-lg)',
            borderTop: '1px solid var(--border-light)'
          }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-md)',
                background: isSubmitting ? 'var(--bg-muted)' : 'var(--primary-gradient)',
                color: 'var(--text-white)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-sm)',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition-fast)',
                opacity: isSubmitting ? 0.7 : 1,
                minHeight: '48px'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <Save size={16} />
              {isSubmitting ? 'Creating Meeting...' : 'Create Meeting'}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              style={{
                padding: 'var(--spacing-md)',
                background: 'var(--bg-white)',
                color: 'var(--text-secondary)',
                border: '2px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-sm)',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition-fast)',
                opacity: isSubmitting ? 0.5 : 1,
                minHeight: '48px'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.borderColor = 'var(--primary-color)';
                  e.currentTarget.style.color = 'var(--primary-dark)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMeeting;
