import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Upload,
  FileText,
  UserCheck,
  TrendingUp,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  description: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  category: string;
  instructor: string;
}

interface UploadStatus {
  preTest: 'pending' | 'uploaded' | 'not-required';
  attendance: 'pending' | 'uploaded' | 'not-required';
  postTest: 'pending' | 'uploaded' | 'not-required';
}

const Meetings: React.FC = () => {
  const { user } = useAuth();
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'pretest' | 'attendance' | 'posttest' | null>(null);
  const [uploading, setUploading] = useState(false);

  // Mock meetings data
  const meetings: Meeting[] = [
    {
      id: '1',
      title: 'Pediatric Emergency Care Workshop',
      date: '2025-01-15',
      time: '14:00',
      duration: '2 hours',
      location: 'Training Hall A, CMHO Office',
      attendees: 28,
      maxAttendees: 35,
      description: 'Comprehensive training on handling pediatric emergencies, including CPR techniques, medication protocols, and emergency procedures specific to children.',
      status: 'upcoming',
      category: 'Emergency Medicine',
      instructor: 'Dr. Rajesh Kumar'
    },
    {
      id: '2',
      title: 'Advanced Cardiology Update',
      date: '2025-01-18',
      time: '10:00',
      duration: '3 hours',
      location: 'Conference Room B, Medical College',
      attendees: 45,
      maxAttendees: 50,
      description: 'Latest developments in cardiology, new treatment protocols, and case studies from recent research.',
      status: 'upcoming',
      category: 'Cardiology',
      instructor: 'Dr. Priya Sharma'
    },
    {
      id: '3',
      title: 'Mental Health Awareness Training',
      date: '2025-01-12',
      time: '09:00',
      duration: '4 hours',
      location: 'Auditorium, District Hospital',
      attendees: 32,
      maxAttendees: 40,
      description: 'Training on identifying and addressing mental health issues in primary care settings.',
      status: 'completed',
      category: 'Mental Health',
      instructor: 'Dr. Anjali Verma'
    },
    {
      id: '4',
      title: 'COVID-19 Protocol Updates',
      date: '2025-01-20',
      time: '15:30',
      duration: '1.5 hours',
      location: 'Online Session',
      attendees: 65,
      maxAttendees: 100,
      description: 'Updated guidelines and protocols for COVID-19 management and prevention.',
      status: 'upcoming',
      category: 'Infectious Diseases',
      instructor: 'Dr. Suresh Patel'
    }
  ];

  // Mock upload status for each meeting
  const getUploadStatus = (meetingId: string): UploadStatus => {
    const statuses: Record<string, UploadStatus> = {
      '1': { preTest: 'pending', attendance: 'pending', postTest: 'pending' },
      '2': { preTest: 'uploaded', attendance: 'pending', postTest: 'pending' },
      '3': { preTest: 'uploaded', attendance: 'uploaded', postTest: 'uploaded' },
      '4': { preTest: 'not-required', attendance: 'pending', postTest: 'not-required' }
    };
    return statuses[meetingId] || { preTest: 'pending', attendance: 'pending', postTest: 'pending' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'var(--primary-600)';
      case 'ongoing': return 'var(--success-600)';
      case 'completed': return 'var(--gray-500)';
      default: return 'var(--gray-500)';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'upcoming': return 'var(--primary-100)';
      case 'ongoing': return 'var(--success-100)';
      case 'completed': return 'var(--gray-100)';
      default: return 'var(--gray-100)';
    }
  };

  const handleFileUpload = async (type: 'pretest' | 'attendance' | 'posttest') => {
    if (!uploadFile || !selectedMeeting) return;
    
    setUploadType(type);
    setUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setUploading(false);
      setUploadFile(null);
      setUploadType(null);
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} file uploaded successfully!`);
    }, 2000);
  };

  const getUploadStatusIcon = (status: 'pending' | 'uploaded' | 'not-required') => {
    switch (status) {
      case 'uploaded': return <CheckCircle size={16} style={{ color: 'var(--success-600)' }} />;
      case 'pending': return <AlertCircle size={16} style={{ color: 'var(--warning-600)' }} />;
      case 'not-required': return <Info size={16} style={{ color: 'var(--gray-500)' }} />;
    }
  };

  const getUploadStatusText = (status: 'pending' | 'uploaded' | 'not-required') => {
    switch (status) {
      case 'uploaded': return 'Uploaded';
      case 'pending': return 'Pending';
      case 'not-required': return 'Not Required';
    }
  };

  if (selectedMeeting) {
    const uploadStatus = getUploadStatus(selectedMeeting.id);
    
    return (
      <div style={{ padding: 'var(--spacing-lg)' }}>
        {/* Back Button */}
        <button 
          onClick={() => setSelectedMeeting(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            background: 'transparent',
            border: 'none',
            color: 'var(--primary-600)',
            fontSize: 'var(--font-base)',
            cursor: 'pointer',
            marginBottom: 'var(--spacing-lg)',
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--radius-md)',
            transition: 'background-color var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-50)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ArrowLeft size={20} />
          Back to Meetings
        </button>

        {/* Meeting Details Header */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{
            background: 'var(--primary-gradient)',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
            padding: 'var(--spacing-xl)',
            color: 'white',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <h1 style={{
              fontSize: 'var(--font-2xl)',
              fontWeight: 'bold',
              margin: '0 0 var(--spacing-sm) 0'
            }}>
              {selectedMeeting.title}
            </h1>
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-lg)',
              flexWrap: 'wrap',
              fontSize: 'var(--font-sm)',
              opacity: 0.9
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                <Calendar size={16} />
                {new Date(selectedMeeting.date).toLocaleDateString('en-IN')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                <Clock size={16} />
                {selectedMeeting.time} ({selectedMeeting.duration})
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                <MapPin size={16} />
                {selectedMeeting.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                <Users size={16} />
                {selectedMeeting.attendees}/{selectedMeeting.maxAttendees} attendees
              </div>
            </div>
          </div>

          <div style={{ padding: '0 var(--spacing-xl) var(--spacing-xl)' }}>
            <div className="row" style={{ marginBottom: 'var(--spacing-lg)' }}>
              <div className="col-8">
                <h3 style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: 'var(--font-lg)' }}>
                  Description
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {selectedMeeting.description}
                </p>
              </div>
              <div className="col-4">
                <div style={{
                  background: 'var(--background-soft)',
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)'
                }}>
                  <h4 style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: 'var(--font-base)' }}>
                    Meeting Info
                  </h4>
                  <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                    <div style={{ marginBottom: 'var(--spacing-xs)' }}>
                      <strong>Category:</strong> {selectedMeeting.category}
                    </div>
                    <div style={{ marginBottom: 'var(--spacing-xs)' }}>
                      <strong>Instructor:</strong> {selectedMeeting.instructor}
                    </div>
                    <div>
                      <strong>Status:</strong> 
                      <span style={{
                        marginLeft: 'var(--spacing-xs)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--font-xs)',
                        backgroundColor: getStatusBg(selectedMeeting.status),
                        color: getStatusColor(selectedMeeting.status),
                        textTransform: 'capitalize'
                      }}>
                        {selectedMeeting.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="card">
          <h2 style={{
            fontSize: 'var(--font-xl)',
            fontWeight: '600',
            marginBottom: 'var(--spacing-lg)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)'
          }}>
            <Upload size={20} />
            Upload Files
          </h2>

          <div className="row">
            {/* Pre-test Upload */}
            <div className="col-4">
              <div style={{
                padding: 'var(--spacing-lg)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
                background: uploadStatus.preTest === 'uploaded' ? 'var(--success-50)' : 'var(--background-white)'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-md) auto',
                  color: 'white'
                }}>
                  <FileText size={24} />
                </div>
                <h3 style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: 'var(--font-lg)' }}>
                  Pre-test Data
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-xs)',
                  marginBottom: 'var(--spacing-md)',
                  fontSize: 'var(--font-sm)'
                }}>
                  {getUploadStatusIcon(uploadStatus.preTest)}
                  <span style={{
                    color: uploadStatus.preTest === 'uploaded' ? 'var(--success-600)' :
                           uploadStatus.preTest === 'pending' ? 'var(--warning-600)' : 'var(--gray-500)'
                  }}>
                    {getUploadStatusText(uploadStatus.preTest)}
                  </span>
                </div>
                {uploadStatus.preTest !== 'not-required' && (
                  <>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      style={{ marginBottom: 'var(--spacing-md)', width: '100%' }}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => handleFileUpload('pretest')}
                      disabled={!uploadFile || uploading}
                      style={{
                        width: '100%',
                        opacity: (!uploadFile || uploading) ? 0.6 : 1
                      }}
                    >
                      {uploading && uploadType === 'pretest' ? 'Uploading...' : 'Upload Pre-test'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Attendance Upload */}
            <div className="col-4">
              <div style={{
                padding: 'var(--spacing-lg)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
                background: uploadStatus.attendance === 'uploaded' ? 'var(--success-50)' : 'var(--background-white)'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-md) auto',
                  color: 'white'
                }}>
                  <UserCheck size={24} />
                </div>
                <h3 style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: 'var(--font-lg)' }}>
                  Attendance Data
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-xs)',
                  marginBottom: 'var(--spacing-md)',
                  fontSize: 'var(--font-sm)'
                }}>
                  {getUploadStatusIcon(uploadStatus.attendance)}
                  <span style={{
                    color: uploadStatus.attendance === 'uploaded' ? 'var(--success-600)' :
                           uploadStatus.attendance === 'pending' ? 'var(--warning-600)' : 'var(--gray-500)'
                  }}>
                    {getUploadStatusText(uploadStatus.attendance)}
                  </span>
                </div>
                {uploadStatus.attendance !== 'not-required' && (
                  <>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      style={{ marginBottom: 'var(--spacing-md)', width: '100%' }}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => handleFileUpload('attendance')}
                      disabled={!uploadFile || uploading}
                      style={{
                        width: '100%',
                        opacity: (!uploadFile || uploading) ? 0.6 : 1
                      }}
                    >
                      {uploading && uploadType === 'attendance' ? 'Uploading...' : 'Upload Attendance'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Post-test Upload */}
            <div className="col-4">
              <div style={{
                padding: 'var(--spacing-lg)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
                background: uploadStatus.postTest === 'uploaded' ? 'var(--success-50)' : 'var(--background-white)'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-md) auto',
                  color: 'white'
                }}>
                  <TrendingUp size={24} />
                </div>
                <h3 style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: 'var(--font-lg)' }}>
                  Post-test Data
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-xs)',
                  marginBottom: 'var(--spacing-md)',
                  fontSize: 'var(--font-sm)'
                }}>
                  {getUploadStatusIcon(uploadStatus.postTest)}
                  <span style={{
                    color: uploadStatus.postTest === 'uploaded' ? 'var(--success-600)' :
                           uploadStatus.postTest === 'pending' ? 'var(--warning-600)' : 'var(--gray-500)'
                  }}>
                    {getUploadStatusText(uploadStatus.postTest)}
                  </span>
                </div>
                {uploadStatus.postTest !== 'not-required' && (
                  <>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      style={{ marginBottom: 'var(--spacing-md)', width: '100%' }}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => handleFileUpload('posttest')}
                      disabled={!uploadFile || uploading}
                      style={{
                        width: '100%',
                        opacity: (!uploadFile || uploading) ? 0.6 : 1
                      }}
                    >
                      {uploading && uploadType === 'posttest' ? 'Uploading...' : 'Upload Post-test'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{
            marginTop: 'var(--spacing-lg)',
            padding: 'var(--spacing-md)',
            background: 'var(--info-50)',
            border: '1px solid var(--info-200)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-sm)',
            color: 'var(--info-800)'
          }}>
            <strong>Note:</strong> Please upload Excel files (.xlsx, .xls) or CSV files only. 
            Ensure your data follows the standard format provided in the guidelines.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 style={{
          fontSize: 'var(--font-2xl)',
          fontWeight: 'bold',
          margin: '0 0 var(--spacing-sm) 0',
          color: 'var(--text-primary)'
        }}>
          {user?.role === 'admin' ? 'Manage Meetings' : 'Training Meetings'}
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          margin: 0,
          fontSize: 'var(--font-base)'
        }}>
          {user?.role === 'admin' 
            ? 'View and manage all training meetings and sessions'
            : 'View your training meetings and upload required documents'
          }
        </p>
      </div>

      {/* Meetings List */}
      <div style={{
        display: 'grid',
        gap: 'var(--spacing-md)',
        gridTemplateColumns: '1fr'
      }}>
        {meetings.map((meeting) => (
          <div 
            key={meeting.id}
            className="card"
            style={{
              cursor: 'pointer',
              transition: 'all var(--transition-normal)',
              border: '1px solid var(--border-light)'
            }}
            onClick={() => setSelectedMeeting(meeting)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
          >
            <div className="row" style={{ alignItems: 'center' }}>
              <div className="col-8">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'var(--primary-gradient)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    <Calendar size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: 'var(--font-lg)',
                      fontWeight: '600',
                      margin: '0 0 var(--spacing-xs) 0',
                      color: 'var(--text-primary)'
                    }}>
                      {meeting.title}
                    </h3>
                    <div style={{
                      display: 'flex',
                      gap: 'var(--spacing-lg)',
                      marginBottom: 'var(--spacing-xs)',
                      fontSize: 'var(--font-sm)',
                      color: 'var(--text-secondary)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                        <Calendar size={14} />
                        {new Date(meeting.date).toLocaleDateString('en-IN')}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                        <Clock size={14} />
                        {meeting.time}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                        <Users size={14} />
                        {meeting.attendees}/{meeting.maxAttendees}
                      </div>
                    </div>
                    <p style={{
                      color: 'var(--text-secondary)',
                      margin: 0,
                      fontSize: 'var(--font-sm)',
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {meeting.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-4" style={{ textAlign: 'right' }}>
                <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--font-xs)',
                    fontWeight: '600',
                    backgroundColor: getStatusBg(meeting.status),
                    color: getStatusColor(meeting.status),
                    textTransform: 'capitalize'
                  }}>
                    {meeting.status}
                  </span>
                </div>
                <div style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  <div style={{ fontWeight: '500' }}>{meeting.category}</div>
                  <div>{meeting.instructor}</div>
                </div>
                <ChevronRight 
                  size={20} 
                  style={{ 
                    color: 'var(--primary-600)',
                    transition: 'transform var(--transition-fast)'
                  }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No meetings message */}
      {meetings.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: 'var(--spacing-2xl)',
          color: 'var(--text-secondary)'
        }}>
          <Calendar size={48} style={{ opacity: 0.5, marginBottom: 'var(--spacing-md)' }} />
          <h3 style={{ margin: '0 0 var(--spacing-sm) 0' }}>No meetings scheduled</h3>
          <p style={{ margin: 0 }}>Check back later for new training sessions.</p>
        </div>
      )}
    </div>
  );
};

export default Meetings;
