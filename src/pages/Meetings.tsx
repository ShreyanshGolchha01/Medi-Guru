import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import serverUrl from '../services/server';
import * as XLSX from 'xlsx';
import {
  Calendar,
  Clock,
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
  const [uploadFiles, setUploadFiles] = useState<{
    pretest: File | null;
    attendance: File | null;
    posttest: File | null;
  }>({
    pretest: null,
    attendance: null,
    posttest: null
  });
  const [uploadType, setUploadType] = useState<'pretest' | 'attendance' | 'posttest' | null>(null);
  const [uploading, setUploading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  
  // TODO: Replace with API calls
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatuses, setUploadStatuses] = useState<{[key: string]: UploadStatus}>({});

  // Fetch meetings from API
  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      const authToken = localStorage.getItem('auth_token');
      
      if (!authToken) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${serverUrl}meetings.php`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.meetings) {
          // Transform API data to match frontend interface
          const transformedMeetings = data.meetings.map((meeting: any) => ({
            id: meeting.id.toString(),
            title: meeting.name,
            date: meeting.date,
            time: meeting.time,
            duration: meeting.duration || '2 hours',
            location: meeting.location || 'Training Hall',
            attendees: meeting.attendees || 0,
            maxAttendees: meeting.maxAttendees || 50,
            description: meeting.topic,
            status: meeting.status,
            category: meeting.category || 'Medical Training',
            instructor: meeting.hosters
          }));
          setMeetings(transformedMeetings);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch meetings');
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load meetings on component mount
  useEffect(() => {
    fetchMeetings();
  }, []);

  // Fetch upload status for a specific meeting
  const fetchUploadStatus = async (meetingId: string) => {
    try {
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) return;

      const response = await fetch(`${serverUrl}upload-status.php?meetingId=${meetingId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUploadStatuses(prev => ({
            ...prev,
            [meetingId]: data.upload_status
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching upload status:', error);
    }
  };

  // TODO: Replace with actual API call to get upload status
  const getUploadStatus = (meetingId: string): UploadStatus => {
    // Check if we have cached status
    if (uploadStatuses[meetingId]) {
      return uploadStatuses[meetingId];
    }
    
    // Fetch status if not cached
    fetchUploadStatus(meetingId);
    
    // Return default status while loading
    return { preTest: 'not-required', attendance: 'pending', postTest: 'not-required' };
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
    const file = uploadFiles[type];
    if (!file || !selectedMeeting) return;
    
    setUploadType(type);
    setUploading(true);
    
    try {
      // Parse Excel/CSV file
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      if (!jsonData || jsonData.length === 0) {
        throw new Error('File is empty or has no valid data');
      }
      
      console.log('Parsed Excel data:', jsonData);
      
      // Send parsed data to backend
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response = await fetch(`${serverUrl}upload-file.php`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          meetingId: selectedMeeting.id,
          type: type,
          data: jsonData,
          fileName: file.name
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Clear file after successful upload
        setUploadFiles(prev => ({
          ...prev,
          [type]: null
        }));
        
        // Refresh upload status for this meeting
        await fetchUploadStatus(selectedMeeting.id);
        
        // Show success message with details
        let message = `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!\n`;
        message += `Processed: ${result.processed_count}/${result.total_count} records`;
        
        if (result.errors && result.errors.length > 0) {
          message += `\n\nWarnings:\n${result.errors.slice(0, 5).join('\n')}`;
          if (result.errors.length > 5) {
            message += `\n... and ${result.errors.length - 5} more errors`;
          }
        }
        
        alert(message);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
      setUploadType(null);
    }
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

  // Filter and sort meetings
  const getFilteredAndSortedMeetings = () => {
    let filtered = meetings;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = meetings.filter(meeting => meeting.status === statusFilter);
    }
    
    // Sort by status priority: upcoming -> ongoing -> completed
    const statusPriority = { 'upcoming': 1, 'ongoing': 2, 'completed': 3 };
    
    return filtered.sort((a, b) => {
      const priorityA = statusPriority[a.status] || 4;
      const priorityB = statusPriority[b.status] || 4;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If same status, sort by date
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  };

  if (selectedMeeting) {
    const uploadStatus = getUploadStatus(selectedMeeting.id);
    
    return (
      <div style={{ padding: 'var(--spacing-sm)' }}>
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
            transition: 'background-color var(--transition-fast)',
            minHeight: '44px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-50)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ArrowLeft size={20} />
          <span>Back to Meetings</span>
        </button>

        {/* Meeting Details Header */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{
            background: 'var(--primary-gradient)',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
            padding: 'var(--spacing-md)',
            color: 'white',
            marginBottom: 'var(--spacing-md)'
          }}>
            <h1 style={{
              fontSize: 'var(--font-xl)',
              fontWeight: 'bold',
              margin: '0 0 var(--spacing-xs) 0',
              lineHeight: 1.2
            }}>
              {selectedMeeting.title}
            </h1>
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-sm)',
              flexWrap: 'wrap',
              fontSize: 'var(--font-sm)',
              opacity: 0.9
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={20} />
                {new Date(selectedMeeting.date).toLocaleDateString('en-IN')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                <Clock size={20} />
                {selectedMeeting.time} ({selectedMeeting.duration})
              </div>
            </div>
          </div>

          <div style={{ padding: '0 var(--spacing-xl) var(--spacing-xl)' }}>
            <div className="row" style={{ marginBottom: 'var(--spacing-lg)' }}>
              <div className="col-12">
                <div style={{
                  background: 'var(--bg-light)',
                  padding: 'var(--spacing-lg)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)'
                }}>
                  <h3 style={{ margin: '0 0 var(--spacing-md) 0', fontSize: 'var(--font-lg)' }}>
                    Meeting Information
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--spacing-md)',
                    fontSize: 'var(--font-sm)'
                  }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Meeting Topic:</strong>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {selectedMeeting.category}
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Hosted By:</strong>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {selectedMeeting.instructor}
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Status:</strong>
                      <div style={{ marginTop: '4px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--font-xs)',
                          fontWeight: '600',
                          backgroundColor: getStatusBg(selectedMeeting.status),
                          color: getStatusColor(selectedMeeting.status),
                          textTransform: 'capitalize'
                        }}>
                          {selectedMeeting.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Duration:</strong>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {selectedMeeting.duration}
                      </div>
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
            <Upload size={24} />
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
                  <FileText size={30} />
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
                  {getUploadStatusIcon('not-required')}
                  <span style={{ color: 'var(--gray-500)', fontStyle: 'italic' }}>
                    Optional - Upload if Available
                  </span>
                </div>
                
                {/* Optional upload section - always available */}
                <div style={{
                  position: 'relative',
                  marginBottom: 'var(--spacing-md)',
                  overflow: 'hidden'
                }}>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => setUploadFiles(prev => ({
                      ...prev,
                      pretest: e.target.files?.[0] || null
                    }))}
                    style={{
                      position: 'absolute',
                      left: '-9999px',
                      opacity: 0
                    }}
                    id="pretest-file-input"
                  />
                  <label
                    htmlFor="pretest-file-input"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--spacing-xs)',
                      width: '100%',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      background: 'var(--bg-white)',
                      border: '2px dashed var(--border-medium)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      fontSize: 'var(--font-sm)',
                      color: 'var(--text-secondary)',
                      textAlign: 'center',
                      minHeight: '50px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-dark)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-light)';
                      e.currentTarget.style.color = 'var(--primary-dark)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-white)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <Upload size={16} />
                    {uploadFiles.pretest?.name || 'Choose Excel/CSV File (Optional)'}
                  </label>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleFileUpload('pretest')}
                  disabled={!uploadFiles.pretest || uploading}
                  style={{
                    width: '100%',
                    opacity: (!uploadFiles.pretest || uploading) ? 0.6 : 1
                  }}
                >
                  {uploading && uploadType === 'pretest' ? 'Uploading...' : 'Upload Pre-test (Optional)'}
                </button>
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
                  <UserCheck size={30} />
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
                           uploadStatus.attendance === 'pending' ? 'var(--warning-600)' : 'var(--gray-500)',
                    fontWeight: '700',
                    fontSize: 'var(--font-sm)'
                  }}>
                    {uploadStatus.attendance === 'pending' && ' MANDATORY - '}
                    {getUploadStatusText(uploadStatus.attendance)}
                    {uploadStatus.attendance === 'pending' && ' - REQUIRED'}
                  </span>
                </div>
                {uploadStatus.attendance !== 'not-required' && (
                  <>
                    <div style={{
                      position: 'relative',
                      marginBottom: 'var(--spacing-md)',
                      overflow: 'hidden'
                    }}>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={(e) => setUploadFiles(prev => ({
                          ...prev,
                          attendance: e.target.files?.[0] || null
                        }))}
                        style={{
                          position: 'absolute',
                          left: '-9999px',
                          opacity: 0
                        }}
                        id="attendance-file-input"
                      />
                      <label
                        htmlFor="attendance-file-input"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 'var(--spacing-xs)',
                          width: '100%',
                          padding: 'var(--spacing-sm) var(--spacing-md)',
                          background: 'var(--bg-white)',
                          border: '2px dashed var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                          fontSize: 'var(--font-sm)',
                          color: 'var(--text-secondary)',
                          textAlign: 'center',
                          minHeight: '50px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--primary-dark)';
                          e.currentTarget.style.backgroundColor = 'var(--bg-light)';
                          e.currentTarget.style.color = 'var(--primary-dark)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-medium)';
                          e.currentTarget.style.backgroundColor = 'var(--bg-white)';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                      >
                        <Upload size={16} />
                        {uploadFiles.attendance?.name || 'Choose Excel/CSV File (MANDATORY)'}
                      </label>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleFileUpload('attendance')}
                      disabled={!uploadFiles.attendance || uploading}
                      style={{
                        width: '100%',
                        opacity: (!uploadFiles.attendance || uploading) ? 0.6 : 1
                      }}
                    >
                      {uploading && uploadType === 'attendance' ? 'Uploading...' : 'Upload Attendance (REQUIRED)'}
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
                  <TrendingUp size={30} />
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
                  {getUploadStatusIcon('not-required')}
                  <span style={{ color: 'var(--gray-500)', fontStyle: 'italic' }}>
                    Optional - Upload if Available
                  </span>
                </div>
                
                {/* Optional upload section - always available */}
                <div style={{
                  position: 'relative',
                  marginBottom: 'var(--spacing-md)',
                  overflow: 'hidden'
                }}>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => setUploadFiles(prev => ({
                      ...prev,
                      posttest: e.target.files?.[0] || null
                    }))}
                    style={{
                      position: 'absolute',
                      left: '-9999px',
                      opacity: 0
                    }}
                    id="posttest-file-input"
                  />
                  <label
                    htmlFor="posttest-file-input"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--spacing-xs)',
                      width: '100%',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      background: 'var(--bg-white)',
                      border: '2px dashed var(--border-medium)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      fontSize: 'var(--font-sm)',
                      color: 'var(--text-secondary)',
                      textAlign: 'center',
                      minHeight: '50px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-dark)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-light)';
                      e.currentTarget.style.color = 'var(--primary-dark)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-white)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <Upload size={16} />
                    {uploadFiles.posttest?.name || 'Choose Excel/CSV File (Optional)'}
                  </label>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleFileUpload('posttest')}
                  disabled={!uploadFiles.posttest || uploading}
                  style={{
                    width: '100%',
                    opacity: (!uploadFiles.posttest || uploading) ? 0.6 : 1
                  }}
                >
                  {uploading && uploadType === 'posttest' ? 'Uploading...' : 'Upload Post-test (Optional)'}
                </button>
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
    <div style={{ padding: 'var(--spacing-sm)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 style={{
          fontSize: 'var(--font-2xl)',
          fontWeight: 'bold',
          margin: '0 0 var(--spacing-xs) 0',
          color: 'var(--text-primary)',
          lineHeight: 1.2
        }}>
          {user?.role === 'admin' ? 'Manage Meetings' : 'Training Meetings'}
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          margin: 0,
          fontSize: 'var(--font-sm)',
          lineHeight: 1.4
        }}>
          {user?.role === 'admin' 
            ? 'View and manage all training meetings and sessions'
            : 'View your training meetings and upload required documents'
          }
        </p>
      </div>

      {/* Filter Section */}
      <div style={{ 
        marginBottom: 'var(--spacing-lg)',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        flexWrap: 'wrap'
      }}>
        <span style={{
          fontSize: 'var(--font-sm)',
          fontWeight: '500',
          color: 'var(--text-primary)'
        }}>
          Filter by Status:
        </span>
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {[
            { value: 'all', label: 'All' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'ongoing', label: 'Ongoing' },
            { value: 'completed', label: 'Completed' }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value as any)}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                border: statusFilter === filter.value ? 'none' : '1px solid var(--border-light)',
                background: statusFilter === filter.value 
                  ? 'var(--primary-gradient)' 
                  : 'var(--bg-white)',
                color: statusFilter === filter.value ? 'var(--text-white)' : 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: statusFilter === filter.value 
                  ? 'var(--shadow-sm)' 
                  : '0 1px 2px rgba(0, 0, 0, 0.05)',
                minWidth: '70px',
                textAlign: 'center' as const,
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                if (statusFilter !== filter.value) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-light)';
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }
              }}
              onMouseLeave={(e) => {
                if (statusFilter !== filter.value) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-white)';
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                }
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onMouseUp={(e) => {
                if (statusFilter !== filter.value) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Meetings List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)'
      }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-2xl)',
            color: 'var(--text-secondary)'
          }}>
            <Calendar size={48} style={{ opacity: 0.5, marginBottom: 'var(--spacing-md)' }} />
            <h3 style={{ margin: '0 0 var(--spacing-sm) 0' }}>Loading meetings...</h3>
          </div>
        ) : error ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-2xl)',
            color: 'var(--text-secondary)'
          }}>
            <AlertCircle size={48} style={{ color: 'var(--error-500)', marginBottom: 'var(--spacing-md)' }} />
            <h3 style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--error-600)' }}>Error Loading Meetings</h3>
            <p style={{ margin: '0 0 var(--spacing-md) 0' }}>{error}</p>
            <button
              onClick={fetchMeetings}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: 'var(--primary-600)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: 'var(--font-sm)'
              }}
            >
              Try Again
            </button>
          </div>
        ) : getFilteredAndSortedMeetings().length > 0 ? (
          getFilteredAndSortedMeetings().map((meeting) => (
            <div 
              key={meeting.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--spacing-md)',
                background: 'var(--bg-white)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
                boxShadow: 'var(--shadow-sm)'
              }}
              onClick={() => setSelectedMeeting(meeting)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              {/* Icon */}
              <div style={{
                width: '40px',
                height: '40px',
                background: 'var(--primary-gradient)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0,
                marginRight: 'var(--spacing-md)'
              }}>
                <Calendar size={25} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-xs)',
                  flexWrap: 'wrap',
                  gap: 'var(--spacing-sm)'
                }}>
                  <h3 style={{
                    fontSize: 'var(--font-base)',
                    fontWeight: '600',
                    margin: 0,
                    color: 'var(--text-primary)',
                    lineHeight: 1.3,
                    flex: '1 1 auto',
                    minWidth: '200px'
                  }}>
                    {meeting.title}
                  </h3>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--font-xs)',
                    fontWeight: '600',
                    backgroundColor: getStatusBg(meeting.status),
                    color: getStatusColor(meeting.status),
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}>
                    {meeting.status}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 'var(--font-sm)',
                  color: 'var(--text-secondary)',
                  flexWrap: 'wrap',
                  gap: 'var(--spacing-sm)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-lg)',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                      <Calendar size={16} />
                      {new Date(meeting.date).toLocaleDateString('en-IN')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                      <Clock size={16} />
                      {meeting.time}
                    </div>
                    <div style={{ fontWeight: '500', color: 'var(--primary-600)' }}>
                      {meeting.category}
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      {meeting.instructor}
                    </div>
                  </div>
                  <ChevronRight 
                    size={16} 
                    style={{ 
                      color: 'var(--primary-600)',
                      transition: 'transform var(--transition-fast)',
                      flexShrink: 0
                    }} 
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-2xl)',
            color: 'var(--text-secondary)'
          }}>
            <Calendar size={48} style={{ opacity: 0.5, marginBottom: 'var(--spacing-md)' }} />
            <h3 style={{ margin: '0 0 var(--spacing-sm) 0' }}>
              {statusFilter === 'all' ? 'No meetings scheduled' : `No ${statusFilter} meetings`}
            </h3>
            <p style={{ margin: 0 }}>
              {statusFilter === 'all' 
                ? 'Check back later for new training sessions.' 
                : 'Try selecting a different filter or check back later.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meetings;
