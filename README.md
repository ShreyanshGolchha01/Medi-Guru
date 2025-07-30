# Medi Guru - Virtual Medical Training Portal

A comprehensive web platform for virtual medical training sessions, designed for Government Medical Officers of Raipur, Chhattisgarh.

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

### 📚 Learning Management
- **Session Management:** Weekly session scheduling with expert-led training
- **Live Integration:** Direct links to Zoom/Google Meet/Webex sessions
- **Resource Library:** Video recordings, PDFs, case studies, guidelines
- **Assessment System:** Pre/post-session quizzes with auto-grading
- **Certification:** Automatic certificate generation upon completion

### 📊 Monitoring & Analytics
- **Attendance Tracking:** Automated session attendance logging
- **Performance Analytics:** Quiz scores, participation rates, progress tracking
- **Feedback System:** Anonymous session feedback and suggestions
- **Reporting Dashboard:** Comprehensive reports for administrators

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM v6
- **Icons:** Lucide React
- **Styling:** Custom CSS with CSS Variables (No Tailwind)

### Design System
- **Theme:** Government portal with professional appearance
- **Colors:** Linear gradient theme `linear-gradient(135deg, #4A2C2A 0%, #333333 100%)`
- **Layout:** Responsive design with sidebar navigation
- **Components:** Reusable component library

### Development Features
- **Authentication:** Role-based access control with JWT
- **State Management:** React Hooks and Context API
- **Mock Data:** Comprehensive mock data for development
- **Form Validation:** Built-in form validation system
- **Responsive Design:** Mobile-first responsive layout

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medi-guru-2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🔐 Demo Accounts

For testing purposes, use these demo accounts:

| Role | Email | Access Level |
|------|-------|-------------|
| **Medical Officer** | rajesh.kumar@raipur.gov.in | Session access, quizzes, certificates |
| **Admin** | amit.verma@cmho.raipur.gov.in | Full system management |
| **Expert** | sunita.patel@expert.gov.in | Content creation, session management |
| **Monitoring** | deepak.agrawal@collector.raipur.gov.in | Analytics and reports |

*Note: Use any password or OTP for demo login*

## 📱 Features Overview

### 🏠 Dashboard
- Personalized welcome with user stats
- Upcoming session schedule
- Recent activity feed
- Quick action buttons
- Performance metrics

### 📅 Session Management
- Calendar view of training sessions
- Session details and registration
- Live session joining
- Recording access
- Expert information

### 📖 Learning Resources
- Downloadable materials (PDFs, documents)
- Video content library
- Search and filter functionality
- Category-wise organization

### 🧪 Assessment System
- Pre and post-session quizzes
- Multiple question types
- Automatic scoring
- Progress tracking
- Performance analytics

### 🏆 Certification
- Automatic certificate generation
- Verification system
- Download and sharing options
- Achievement tracking

### 💬 Feedback System
- Anonymous session feedback
- Rating system
- Suggestion collection
- Feedback analytics

## 🔧 Development Guidelines

### Code Standards
- TypeScript strict mode enabled
- ESLint and Prettier configured
- Component-based architecture
- Functional components with hooks
- Proper error handling and validation

### Styling Guidelines
- CSS Variables for theming
- Mobile-first responsive design
- Professional government portal appearance
- Consistent spacing and typography
- Interactive hover effects

### Component Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── contexts/           # React contexts
├── types/              # TypeScript type definitions
├── data/               # Mock data and API functions
├── styles/             # Global styles and themes
└── utils/              # Utility functions
```

## 🌐 Deployment

### Build Configuration
The application is configured for easy deployment on:
- **Vercel** (Recommended for frontend)
- **Netlify**
- **AWS S3 + CloudFront**
- **Traditional web servers**

### Environment Variables
Create a `.env` file for production configuration:
```env
VITE_API_BASE_URL=your_backend_api_url
VITE_APP_TITLE=Medi Guru Portal
VITE_ENVIRONMENT=production
```

## 🔮 Future Enhancements

### Phase 2 Features
- **Backend Integration:** REST API with database
- **Real-time Chat:** Live session chat functionality
- **Mobile App:** React Native mobile application
- **Advanced Analytics:** AI-powered learning insights
- **Multi-language Support:** Hindi and English interface

### Scalability
- **Multi-district Support:** Expand to other districts in Chhattisgarh
- **State Integration:** Connect with State Health LMS
- **Performance Optimization:** Advanced caching and optimization
- **Offline Support:** Progressive Web App features

## 📞 Support & Contact

**Technical Support:**  
CMHO Office, Raipur  
Health & Family Welfare Department  
Government of Chhattisgarh

**Development Team:**  
For technical queries and feature requests, please contact the development team.

## 📄 License

This project is developed for the Government of Chhattisgarh, Health & Family Welfare Department. All rights reserved.

---

**Medi Guru Portal v1.0**  
*Empowering Medical Excellence Through Virtual Training*
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
