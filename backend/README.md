# Medi Guru Backend API

## Setup Instructions

### 1. XAMPP Setup
1. Copy the `backend` folder to your XAMPP `htdocs` directory
2. Rename it to `mediguru` (optional)
3. Start Apache and MySQL from XAMPP Control Panel

### 2. Database Setup
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create a new database named `mediguru`
3. Run the `setup_database.php` file in your browser: http://localhost/mediguru/setup_database.php

### 3. API Endpoints

#### Authentication
- **POST** `/api/login.php` - User login
  ```json
  {
    "email": "admin@mediguru.com",
    "password": "admin123"
  }
  ```

#### Meetings
- **GET** `/api/meetings.php` - Get all meetings (requires auth)
- **POST** `/api/create-meeting.php` - Create new meeting (requires auth)
  ```json
  {
    "name": "Meeting Name",
    "date": "2024-01-15",
    "time": "10:00",
    "topic": "Meeting Topic",
    "hosters": "Dr. Smith"
  }
  ```

#### Users (Admin only)
- **GET** `/api/users.php` - Get all users (admin only)

#### Analytics (Admin/Monitoring only)
- **GET** `/api/analytics.php` - Get dashboard analytics

### 4. Frontend Configuration
Update your React frontend to use:
```javascript
const API_BASE_URL = 'http://localhost/mediguru/api';
```

### 5. Default Users
After running setup_database.php, you'll have these default users:
- **Admin**: admin@mediguru.com / admin123
- **Doctor**: doctor@mediguru.com / doctor123
- **Expert**: expert@mediguru.com / expert123
- **Monitoring**: monitor@mediguru.com / monitor123

### 6. CORS Configuration
All APIs are configured with CORS headers to allow cross-origin requests from your React development server.

### 7. Authentication
- APIs use JWT tokens for authentication
- Include the token in the Authorization header: `Bearer <token>`
- Tokens expire after 24 hours

## File Structure
```
backend/
├── api/
│   ├── login.php
│   ├── create-meeting.php
│   ├── meetings.php
│   ├── users.php
│   └── analytics.php
├── config/
│   ├── database.php
│   └── helpers.php
├── setup_database.php
└── README.md
```

## Testing
1. Test login: POST to `/api/login.php` with credentials
2. Copy the returned token
3. Use token in Authorization header for other APIs
4. Check the browser console for any CORS or connection issues

## Troubleshooting
- If CORS errors occur, ensure all PHP files have proper CORS headers
- Check XAMPP Apache error logs for PHP errors
- Verify database connection in `config/database.php`
- Make sure the database `mediguru` exists and tables are created

### 1. Copy Backend Files
Copy the entire `backend` folder to your XAMPP `htdocs` directory:
```
C:\xampp\htdocs\mediguru\
```

### 2. Start XAMPP Services
- Start Apache
- Start MySQL

### 3. Setup Database
Run the database setup script by visiting:
```
http://localhost/mediguru/setup_database.php
```

This will:
- Create the `mediguru` database
- Create the `users` table
- Insert sample user data

### 4. Test Login API
You can test the login API using:
```
POST http://localhost/mediguru/api/login
Content-Type: application/json

{
    "email": "admin@mediguru.com",
    "password": "admin123"
}
```

## Sample Login Credentials

### Admin Account
- **Email:** admin@mediguru.com
- **Password:** admin123
- **Role:** admin

### Doctor Account
- **Email:** doctor@mediguru.com
- **Password:** doctor123
- **Role:** doctor

## API Endpoints

### Authentication
- `POST /api/login` - User login

## Directory Structure
```
backend/
├── api/
│   └── login.php          # Login endpoint
├── config/
│   ├── database.php       # Database connection
│   └── helpers.php        # Helper functions
├── setup_database.php     # Database setup script
├── .htaccess             # URL rewriting rules
└── README.md             # This file
```

## Frontend Integration
Update your React frontend to use:
```
const serverUrl = 'http://localhost/mediguru/';
```

The login will now work with the PHP backend!
