# Medi Guru - Virtual Medical Training Portal

A comprehensive web platform for virtual medical training sessions, designed for Government Medical Officers in Raipur, Chhattisgarh.

## 🏥 Project Overview

**Client:** District Administration, Raipur | Health & Family Welfare Department, CG  
**Prepared For:** CMHO Office, Raipur

Medi Guru is a centralized web platform that enables weekly virtual medical training sessions, stores educational resources, tracks participation, evaluates impact, and provides continuous medical education for Government Medical Officers.

## 🌟 Key Features

### 👥 User Management
- **Medical Officers:** View sessions, attend training, take quizzes, submit feedback
- **Admin (CMHO Office):** Manage sessions, users, view reports and analytics
- **Experts:** Provide content, upload materials, conduct sessions
- **Monitoring Team:** View progress reports and analytics dashboards

### 📚 Training Management
- **Session Scheduling:** Create and manage virtual training sessions
- **File Upload System:** Excel-based data upload for:
  - Registered participants (Name, Designation, Block, Phone)
  - Attendance records (Login time, Duration)
  - Pre-test results (Scores and departments)
  - Post-test results (Performance tracking)
- **Live Integration:** Direct session management and monitoring
- **Statistics Dashboard:** Comprehensive analytics and reporting

### 📊 Data Management & Analytics
- **Excel File Processing:** Automated parsing and validation of Excel uploads
- **Real-time Statistics:** Attendance rates, test scores, participation analytics
- **Export Functionality:** Download reports in Excel format with meeting details
- **Search & Filter:** Advanced filtering across all data types
- **Backup System:** Automatic JSON backup of all uploaded data

### 🔐 Authentication & Security
- **Role-based Access Control:** JWT-based authentication system
- **Secure File Storage:** Server-side file validation and storage
- **Token Management:** Persistent localStorage-based session management
- **CORS Protection:** Secure cross-origin resource sharing

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite (Fast development and optimized builds)
- **Routing:** React Router DOM v6
- **Icons:** Lucide React (Modern icon library)
- **Excel Processing:** XLSX library for file handling
- **Styling:** Custom CSS with CSS Variables (No external frameworks)

### Backend
- **Language:** PHP 8.x
- **Database:** MySQL/MariaDB
- **Authentication:** JWT (JSON Web Tokens)
- **File Processing:** Server-side Excel parsing and validation
- **API Architecture:** RESTful API design

### Database Schema
```sql
-- Main tables
meetings (id, title, date, time, category, instructor, status)
registered (m_id, name, designation, block, phone)
meeting_attendance (meeting_id, participant_name, login_time, attended_time)
pretest_results (meeting_id, name, department, score, total_marks)
posttest_results (meeting_id, name, department, score, total_marks)
files (m_id, registered_url, attend_url, pre_url, post_url)
```

### Design System
- **Theme:** Government portal with professional appearance
- **Colors:** Linear gradient theme `linear-gradient(135deg, #4A2C2A 0%, #333333 100%)`
- **Layout:** Responsive design with clean, accessible interface
- **Typography:** Professional font hierarchy for government applications

## 🚀 Getting Started

### Prerequisites
- **Frontend:** Node.js (v18+), npm/yarn
- **Backend:** PHP 8.x, MySQL/MariaDB, Apache/Nginx
- **Development:** XAMPP/WAMP (for local development)

### Installation

#### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/ShreyanshGolchha01/Medi-Guru.git
cd medi-guru-2

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Backend Setup
```bash
# Place backend files in your web server directory
# Example: C:\xampp\htdocs\mediguru\

# Configure database connection in backend/api/database.php
# Update CORS settings for your domain

# Import database schema (SQL file provided)
# Ensure uploads/ directory has write permissions
```

### Environment Configuration

#### Frontend (.env)
```env
VITE_API_URL=http://localhost/mediguru/backend/api/
VITE_APP_ENV=development
```

#### Backend (database.php)
```php
$host = 'localhost';
$dbname = 'mediguru_db';
$username = 'your_db_user';
$password = 'your_db_password';
```

## 📱 Application Features

### 🏠 Admin Dashboard
- **Statistics Overview:** Total meetings, attendees, average attendance
- **Quick Actions:** Create meeting, view statistics, manage data
- **Performance Metrics:** Real-time data visualization

### 📅 Meeting Management
- **Create Meetings:** Comprehensive form with validation
- **Session Scheduling:** Date, time, topic, and instructor management
- **Status Tracking:** Upcoming, ongoing, and completed sessions

### 📊 Statistics & Reporting
- **Meeting Statistics:** Detailed view for each training session
- **Data Visualization:** 
  - Registered participants overview
  - Attendance tracking with login times
  - Pre-test and post-test performance analysis
  - Export capabilities for all data types

### � File Upload System
- **Excel File Processing:** Intelligent parsing of various Excel formats
- **Data Validation:** Real-time validation with error reporting
- **Multiple File Types:** Support for different data categories
- **Backup Storage:** Automatic JSON backup of uploaded data

### � Advanced Features
- **Search Functionality:** Global search across participants, times, scores
- **Export System:** Excel export with meeting information sheets
- **Error Handling:** Comprehensive error reporting and validation
- **Responsive Design:** Mobile-friendly interface

## 🧪 API Endpoints

### Authentication
```
POST /api/login.php - User authentication
POST /api/logout.php - User logout
```

### Meeting Management
```
GET /api/meetings.php - Fetch all meetings
POST /api/create-meeting.php - Create new meeting
GET /api/meeting-statistics.php - Get meeting statistics
```

### File Operations
```
POST /api/upload-file.php - Upload and process Excel files
GET /api/upload-status.php - Check upload status
```

### Data Types Supported
- **registered:** Participant registration data
- **attendance:** Login time and duration tracking
- **pretest:** Pre-training assessment scores
- **posttest:** Post-training evaluation results

## � File Format Requirements

### Registered Participants Excel Format
| Name | Designation | Block | Phone |
|------|-------------|-------|-------|
| Dr. John Doe | Medical Officer | Block A | 9876543210 |

### Attendance Excel Format
| Name | Login Time | Duration |
|------|------------|----------|
| Dr. John Doe | 10:30 AM | 45 minutes |

### Test Results Excel Format
| Name | Department | Score | Total Marks |
|------|------------|-------|-------------|
| Dr. John Doe | Cardiology | 85 | 100 |

## 🔧 Development Guidelines

### Code Standards
- **TypeScript:** Strict mode enabled with proper type definitions
- **PHP:** PSR-4 autoloading and modern PHP practices
- **Database:** Prepared statements for security
- **Error Handling:** Comprehensive try-catch blocks
- **Validation:** Both client-side and server-side validation

### Security Features
- **SQL Injection Protection:** Prepared statements throughout
- **File Upload Security:** Type validation and sanitization
- **Authentication:** JWT with expiration handling
- **CORS Configuration:** Proper cross-origin handling
- **Input Validation:** Comprehensive data sanitization

## 🌐 Deployment

### Production Setup
```bash
# Build frontend
npm run build

# Deploy to web server
# Configure production database
# Update API URLs in frontend
# Set proper file permissions
```

### Server Requirements
- **PHP:** 8.0+ with PDO, JSON extensions
- **MySQL:** 5.7+ or MariaDB 10.3+
- **Web Server:** Apache/Nginx with mod_rewrite
- **SSL:** HTTPS recommended for production

## 📊 Database Design

### Key Tables
- **meetings:** Core session information
- **registered:** Participant registration data
- **meeting_attendance:** Login tracking with timestamps
- **pretest_results & posttest_results:** Assessment scores
- **files:** File upload tracking and references

### Data Relationships
- Meetings → Participants (1:Many)
- Meetings → Attendance Records (1:Many) 
- Meetings → Test Results (1:Many)
- Files → Meetings (1:1 per file type)

## 🔮 Future Enhancements

### Phase 2 Features
- **Advanced Analytics:** AI-powered insights and trends
- **Mobile Application:** React Native mobile app
- **Real-time Notifications:** Session reminders and updates
- **Video Integration:** Built-in video conferencing
- **Certificate Generation:** Automated completion certificates

### Scalability Features
- **Multi-district Support:** Expand across Chhattisgarh
- **API Rate Limiting:** Enhanced security measures
- **Caching Layer:** Redis/Memcached integration
- **Load Balancing:** High-availability setup

## 🆘 Troubleshooting

### Common Issues
1. **File Upload Errors:** Check directory permissions and file size limits
2. **Database Connection:** Verify credentials and server availability
3. **CORS Issues:** Update backend CORS settings for your domain
4. **Authentication Problems:** Check JWT secret and token expiration

### Debug Mode
```php
// Enable in backend for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## 📞 Support & Documentation

**Technical Contact:**  
CMHO Office, Raipur  
Health & Family Welfare Department  
Government of Chhattisgarh

**Repository:** [GitHub - Medi-Guru](https://github.com/ShreyanshGolchha01/Medi-Guru)

## 📄 License

This project is developed for the Government of Chhattisgarh, Health & Family Welfare Department. All rights reserved.

---

**Medi Guru Portal v2.0**  
*Empowering Medical Excellence Through Virtual Training*

Built with ❤️ for healthcare professionals in Chhattisgarh
```
