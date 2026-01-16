# Store Rating Application

## Project Overview

The Store Rating Application is a full-stack web application that enables users to submit and manage ratings for registered stores. The system implements role-based access control with three distinct user roles: System Administrator, Normal User, and Store Owner. This application provides a secure, scalable platform for managing user authentication, store information, and rating submissions.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js |
| **Backend** | Express.js |
| **Database** | PostgreSQL |

---

## User Roles

The application supports three user roles with distinct capabilities:

1. **System Administrator** - Manages users, stores, and system-wide operations
2. **Normal User** - Submits and manages store ratings
3. **Store Owner** - Views ratings for their registered store

---

## Authentication & Authorization Overview

- **Single Login System**: All users authenticate through a unified login interface
- **Role-Based Access Control (RBAC)**: User permissions are determined by assigned role
- **Session Management**: Secure session handling with logout functionality
- **Password Security**: Enforced password complexity requirements
- **Password Update**: All authenticated users can update their password post-login

---

## Detailed Feature Breakdown

### System Administrator Capabilities

#### Dashboard
- **Total Users**: Count of all registered users in the system
- **Total Stores**: Count of all registered stores
- **Total Submitted Ratings**: Count of all ratings submitted by users

#### User Management
- Add new normal users and admin users
- User creation fields:
  - Name
  - Email
  - Password
  - Address
- View comprehensive user list with:
  - Name
  - Email
  - Address
  - Role
- Filter user listings by Name, Email, Address, and Role
- View detailed user information
  - For Store Owner users: display their associated store rating

#### Store Management
- Add new stores to the system
- View store listings with:
  - Store Name
  - Email
  - Address
  - Overall Rating (calculated average)
- Filter store listings by Name, Email, and Address

#### Account Management
- Logout functionality

---

### Normal User Capabilities

#### Authentication
- Sign up via registration page with fields:
  - Name
  - Email
  - Address
  - Password
- Log in with email and password

#### Store Browsing
- View list of all registered stores
- Search stores by Name and Address
- Store listings display:
  - Store Name
  - Address
  - Overall Rating
  - User's Previously Submitted Rating (if any)
  - Option to Submit a New Rating
  - Option to Modify Previously Submitted Rating

#### Rating Management
- Submit ratings (scale 1–5) for stores
- Modify previously submitted ratings
- View personal rating history

#### Account Management
- Update password after login
- Logout functionality

---

### Store Owner Capabilities

#### Authentication
- Log in with email and password

#### Dashboard
- View list of users who submitted ratings for their store
- View average rating of their store
- Monitor rating trends

#### Account Management
- Update password after login
- Logout functionality

---

## Validation Rules

| Field | Rules | Error Handling |
|-------|-------|----------------|
| **Name** | Minimum 20 characters, Maximum 60 characters | Display validation message on form |
| **Email** | Standard email format validation (RFC 5322 compliant) | Display validation message on form |
| **Password** | 8–16 characters, must include at least one uppercase letter and one special character | Display validation message on form |
| **Address** | Maximum 400 characters | Display validation message on form |
| **Rating** | Integer between 1 and 5 (inclusive) | Enforce via input controls |

---

## Database Schema Overview

### Core Tables

#### users
| Column | Type | Constraint | Purpose |
|--------|------|-----------|---------|
| user_id | SERIAL | PRIMARY KEY | Unique user identifier |
| name | VARCHAR(60) | NOT NULL | User full name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| address | VARCHAR(400) | NOT NULL | User address |
| role | ENUM (admin, user, store_owner) | NOT NULL | User role assignment |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

#### stores
| Column | Type | Constraint | Purpose |
|--------|------|-----------|---------|
| store_id | SERIAL | PRIMARY KEY | Unique store identifier |
| name | VARCHAR(255) | NOT NULL | Store name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Store email address |
| address | VARCHAR(400) | NOT NULL | Store address |
| owner_id | INTEGER | FOREIGN KEY (users.user_id) | Associated store owner |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Store creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

#### ratings
| Column | Type | Constraint | Purpose |
|--------|------|-----------|---------|
| rating_id | SERIAL | PRIMARY KEY | Unique rating identifier |
| user_id | INTEGER | FOREIGN KEY (users.user_id), NOT NULL | Rating submitter |
| store_id | INTEGER | FOREIGN KEY (stores.store_id), NOT NULL | Rated store |
| score | INTEGER | NOT NULL, CHECK (score >= 1 AND score <= 5) | Rating value (1–5) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Rating submission timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Rating modification timestamp |
| UNIQUE (user_id, store_id) | Constraint | | Ensures one rating per user per store |

---

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Login Page   │  │ Admin Panel  │  │ Store Ratings    │   │
│  │              │  │              │  │ Dashboard        │   │
│  │ Signup Page  │  │ User Mgmt    │  │                  │   │
│  │              │  │ Store Mgmt   │  │ Search & Filter  │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└──────────────────────────────────┬──────────────────────────┘
                                   │ HTTP/REST API
┌──────────────────────────────────┴──────────────────────────┐
│                   BACKEND (Express.js)                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Authentication & Authorization Middleware              │  │
│  │ Role-Based Access Control (RBAC)                       │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ API Routes & Controllers                               │  │
│  │  • Auth (Login, Signup, Password Update)              │  │
│  │  • Users (CRUD, List, Filter, Search)                 │  │
│  │  • Stores (CRUD, List, Filter, Search)                │  │
│  │  • Ratings (Submit, Modify, Calculate Average)        │  │
│  │  • Dashboard (Admin & Store Owner Views)              │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Business Logic & Validation Layer                      │  │
│  │ Input Validation, Password Hashing, Sorting           │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────┬──────────────────────────┘
                                   │ Database Queries
┌──────────────────────────────────┴──────────────────────────┐
│                   DATABASE (PostgreSQL)                      │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐   │
│  │ users table    │  │ stores table    │  │ ratings      │   │
│  │                │  │                 │  │ table        │   │
│  └────────────────┘  └────────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Instructions to Run the Project Locally

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Setup Steps

#### 1. Clone the Repository
```bash
cd c:\Users\gaura\Downloads\store rating application
```

#### 2. Database Setup
```bash
# Create PostgreSQL database
createdb store_rating_app

# Run migrations (if applicable)
psql store_rating_app < database/schema.sql
```

#### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with configuration
# DATABASE_URL=postgresql://username:password@localhost:5432/store_rating_app
# PORT=5000
# JWT_SECRET=your_secret_key

# Start backend server
npm start
```

#### 4. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file with API configuration
# REACT_APP_API_URL=http://localhost:5000

# Start React development server
npm start
```

#### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## Deployment Overview

### Backend Deployment (Express.js)
- Deploy to cloud platforms: Heroku, AWS EC2, Azure App Service, or DigitalOcean
- Use environment variables for sensitive configuration
- Ensure PostgreSQL is accessible from deployment environment
- Implement SSL/TLS for secure communication

### Frontend Deployment (React.js)
- Build optimized production bundle: `npm run build`
- Deploy to: Vercel, Netlify, AWS S3 + CloudFront, or GitHub Pages
- Configure API endpoints for production environment
- Enable CORS properly for API communication

### Database Deployment (PostgreSQL)
- Use managed PostgreSQL services: AWS RDS, Azure Database, or Heroku Postgres
- Implement automated backups
- Configure connection pooling for production
- Enable SSL connections for security

### General Best Practices
- Use environment variables for all configuration
- Implement proper logging and monitoring
- Set up CI/CD pipelines for automated testing and deployment
- Enable HTTPS/SSL for all communications
- Implement rate limiting and security headers

---

## Submission Checklist & Final Notes

### Code Quality
- [ ] Backend code follows Express.js best practices
- [ ] Frontend code follows React.js best practices and component structure
- [ ] All code is properly commented and documented
- [ ] No console errors or warnings in production build
- [ ] Database queries are optimized with proper indexing

### Features & Functionality
- [ ] All three user roles (Admin, Normal User, Store Owner) are fully functional
- [ ] Authentication and authorization work correctly for each role
- [ ] Role-based access control is properly enforced
- [ ] All validation rules are implemented and tested
- [ ] Sorting functionality works on all list views
- [ ] Filter and search features work as specified

### Testing
- [ ] User signup and login flows tested
- [ ] Password update functionality tested
- [ ] Rating submission and modification tested
- [ ] Admin dashboard displays accurate data
- [ ] Store Owner dashboard displays correct information
- [ ] Form validations work correctly

### Security
- [ ] Passwords are hashed using industry-standard algorithms (bcrypt)
- [ ] SQL injection prevention measures implemented
- [ ] CORS is properly configured
- [ ] Session management is secure
- [ ] User authentication token/session handling is secure

### Documentation
- [ ] README.md is complete and professional
- [ ] API endpoints are documented (if applicable)
- [ ] Database schema is documented
- [ ] Setup and run instructions are clear

### Deployment Readiness
- [ ] Environment variables are properly configured
- [ ] Database connection string is externalized
- [ ] Application builds without errors
- [ ] No hardcoded credentials in code

---

**Last Updated:** January 16, 2026

For questions or clarifications regarding this project, please refer to the project documentation or contact the development team.