# EEIMS — Electric Equipment Inventory Management System

A comprehensive full-stack web application for managing electrical equipment, tools, and spare parts in a manufacturing factory.

## Table of Contents
- [Tech Stack](#tech-stack)
- [System Requirements](#system-requirements)
- [Features](#features)
- [User Roles](#user-roles)
- [Login Credentials](#login-credentials)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Business Logic](#business-logic)
- [Environment Variables](#environment-variables)

---

## Tech Stack

### Frontend
- **React.js 18** with Vite 5
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Recharts** - Charts and graphs

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Sequelize ORM** - Database ORM
- **MySQL 8.0** - Relational database

### Additional Libraries
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **nodemailer** - Email sending
- **node-cron** - Scheduled jobs
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

---

## System Requirements

### Software Requirements
| Software | Version | Required |
|----------|---------|----------|
| Node.js | 18.x or higher | Yes |
| npm | 9.x or higher | Yes |
| MySQL | 8.0 or higher | Yes |

### Database Configuration
- **Database Name:** eeims_db
- **Database User:** root
- **Database Password:** root123
- **Database Host:** localhost

### Port Configuration
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

---

## Features

### Admin Features
- Dashboard with KPIs and charts
- Full CRUD for equipment, categories, locations
- User management (create manager/technician/employee)
- View and manage alerts
- Schedule maintenance tasks
- Generate reports (Inventory, Issues, Maintenance, Low Stock)

### Manager Features
- Dashboard with stock overview
- View pending employee requests
- Approve/Reject equipment requests
- Direct equipment issuance
- Issue history tracking
- View reports

### Technician Features
- My Schedule (assigned tasks)
- Log maintenance completion
- Report equipment damage
- View maintenance history

### Employee Features
- Dashboard with request status
- Browse available equipment
- Request equipment
- Track my requests
- View request history

---

## User Roles

| Role | How Created | Access Level |
|------|-------------|--------------|
| Admin | Auto-seeded on server start | Full system access |
| Manager | Created by Admin only | Equipment, Issues, Reports |
| Technician | Created by Admin only | Maintenance tasks |
| Employee | Self-registration | Browse, Request, My Requests |

---

## Login Credentials

### Default Accounts (Pre-seeded)

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Admin | admin@eeims.com | Admin@123 | Full system access |
| Manager | manager@eeims.com | Manager@123 | Equipment & Issues management |
| Technician | tech@eeims.com | Tech@123 | Maintenance tasks |
| Employee | Use /register page | Your chosen password | Self-register |

### Creating New Users

**For Employee (Self-Registration):**
1. Navigate to `/register`
2. Fill in: Name, Email, Password
3. Role automatically set to 'employee'
4. Login with credentials

**For Manager/Technician:**
1. Login as Admin (admin@eeims.com / Admin@123)
2. Go to Users page
3. Click "Add User"
4. Fill details and select role
5. User receives login credentials

---

## Installation

### Prerequisites Installation

1. **Install Node.js:**
   - Download from https://nodejs.org/
   - Recommended: Node.js 18.x LTS

2. **Install MySQL:**
   - Download from https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP/MAMP

3. **Create Database:**
   ```sql
   CREATE DATABASE eeims_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### Backend Setup

```bash
cd backend
npm install
```

Configure environment variables in `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=root123
DB_NAME=eeims_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=12h
ADMIN_EMAIL=admin@eeims.com
ADMIN_PASSWORD=Admin@123
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Important JWT_SECRET Note:**
- Use a strong random string (e.g., "eeims-secret-key-2024-secure")
- Keep this secret safe - it's used for token signing
- Example: JWT_SECRET=eeims_jwt_secret_key_abc123xyz789

Start backend server:
```bash
npm run dev
# or
node server.js
```

Expected output:
```
Server running on port 5000
Database connected successfully
Admin user seeded successfully
```

### Frontend Setup

```bash
cd frontend
npm install
```

Configure environment in `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

### Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **API Health:** http://localhost:5000/api/health

---

## Project Structure

```
eeims-project/
├── backend/
│   ├── config/
│   │   ├── db.js              # MySQL connection with Sequelize
│   │   └── nodemailer.js      # Email configuration
│   ├── controllers/           # Business logic
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── equipment.controller.js
│   │   ├── category.controller.js
│   │   ├── location.controller.js
│   │   ├── issue.controller.js
│   │   ├── maintenance.controller.js
│   │   ├── alert.controller.js
│   │   ├── dashboard.controller.js
│   │   └── report.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT authentication
│   │   ├── role.middleware.js  # Role-based access
│   │   ├── error.middleware.js # Error handling
│   │   └── validate.middleware.js
│   ├── models/                 # Sequelize models
│   │   ├── User.js
│   │   ├── Equipment.js
│   │   ├── Category.js
│   │   ├── Location.js
│   │   ├── Issue.js
│   │   ├── Maintenance.js
│   │   ├── Alert.js
│   │   └── index.js
│   ├── routes/                 # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── equipment.routes.js
│   │   ├── category.routes.js
│   │   ├── location.routes.js
│   │   ├── issue.routes.js
│   │   ├── maintenance.routes.js
│   │   ├── alert.routes.js
│   │   ├── dashboard.routes.js
│   │   └── report.routes.js
│   ├── utils/                  # Helpers
│   │   ├── seeder.js          # Database seeder
│   │   ├── maintenanceChecker.js
│   │   ├── lowStockChecker.js
│   │   ├── sendEmail.js
│   │   └── generateToken.js
│   ├── .env                    # Environment variables
│   ├── package.json
│   └── server.js              # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── AdminLayout.jsx
    │   │   │   ├── ManagerLayout.jsx
    │   │   │   ├── TechnicianLayout.jsx
    │   │   │   ├── UserLayout.jsx
    │   │   │   ├── Sidebar.jsx
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── ProtectedRoute.jsx
    │   │   │   └── RoleRoute.jsx
    │   │   ├── ui/
    │   │   │   ├── Button.jsx
    │   │   │   ├── Input.jsx
    │   │   │   ├── Select.jsx
    │   │   │   ├── Table.jsx
    │   │   │   ├── Modal.jsx
    │   │   │   ├── Badge.jsx
    │   │   │   ├── Loader.jsx
    │   │   │   ├── EmptyState.jsx
    │   │   │   └── AlertBell.jsx
    │   │   ├── equipment/
    │   │   │   ├── EquipmentCard.jsx
    │   │   │   ├── EquipmentFilter.jsx
    │   │   │   └── EquipmentForm.jsx
    │   │   └── charts/
    │   │       ├── StockBarChart.jsx
    │   │       ├── CategoryPieChart.jsx
    │   │       └── IssueTrendLine.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── AlertContext.jsx
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── login/
    │   │   │   └── register/
    │   │   ├── admin/
    │   │   │   ├── dashboard/
    │   │   │   ├── equipment/
    │   │   │   ├── categories/
    │   │   │   ├── locations/
    │   │   │   ├── users/
    │   │   │   ├── maintenance/
    │   │   │   ├── alerts/
    │   │   │   └── reports/
    │   │   ├── manager/
    │   │   │   ├── dashboard/
    │   │   │   ├── equipment-view/
    │   │   │   ├── issue-part/
    │   │   │   ├── issue-equipment/
    │   │   │   ├── issue-history/
    │   │   │   ├── track-returns/
    │   │   │   └── maintenance-tracking/
    │   │   ├── technician/
    │   │   │   ├── my-schedule/
    │   │   │   ├── log-maintenance/
    │   │   │   ├── report-damage/
    │   │   │   └── maintenance-history/
    │   │   └── user/
    │   │       ├── dashboard/
    │   │       ├── browse-equipment/
    │   │       ├── request-equipment/
    │   │       ├── my-requests/
    │   │       └── my-history/
    │   ├── services/
    │   │   ├── axios.js
    │   │   ├── authService.js
    │   │   ├── userService.js
    │   │   ├── equipmentService.js
    │   │   ├── categoryService.js
    │   │   ├── locationService.js
    │   │   ├── issueService.js
    │   │   ├── maintenanceService.js
    │   │   ├── alertService.js
    │   │   └── reportService.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   └── App.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Employee self-registration | Public |
| POST | /api/auth/login | User login | Public |
| GET | /api/auth/me | Get current user | Auth |

### Users (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | Get all users |
| POST | /api/users | Create user |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |

### Equipment
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/equipment | Get all equipment |
| GET | /api/equipment/low-stock | Get low stock items |
| POST | /api/equipment | Create equipment |
| PUT | /api/equipment/:id | Update equipment |
| DELETE | /api/equipment/:id | Delete equipment |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | Get all categories |
| POST | /api/categories | Create category |
| PUT | /api/categories/:id | Update category |
| DELETE | /api/categories/:id | Delete category |

### Locations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/locations | Get all locations |
| POST | /api/locations | Create location |
| PUT | /api/locations/:id | Update location |
| DELETE | /api/locations/:id | Delete location |

### Issues
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/issues | Get all issues |
| GET | /api/issues/pending | Get pending requests |
| GET | /api/issues/my-requests | Get user's requests |
| POST | /api/issues/request | Request equipment |
| POST | /api/issues/direct | Direct issue |
| PUT | /api/issues/:id/approve | Approve request |
| PUT | /api/issues/:id/reject | Reject request |
| PUT | /api/issues/:id/return | Return equipment |

### Maintenance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/maintenance | Get all maintenance |
| GET | /api/maintenance/technician/:id | Get technician tasks |
| POST | /api/maintenance | Schedule maintenance |
| PUT | /api/maintenance/:id/complete | Complete maintenance |

### Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/alerts | Get all alerts |
| GET | /api/alerts/unread/count | Get unread count |
| PUT | /api/alerts/:id/read | Mark as read |
| PUT | /api/alerts/mark-all-read | Mark all as read |
| POST | /api/alerts/report-damage | Report damage |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard | Get dashboard stats |
| GET | /api/dashboard/equipment-by-category | Category chart |
| GET | /api/dashboard/issue-trend | Issue trend data |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reports/inventory | Inventory report |
| GET | /api/reports/issues | Issues report |
| GET | /api/reports/maintenance | Maintenance report |
| GET | /api/reports/low-stock | Low stock report |

---

## Database Models

### User
```javascript
{
  id: INTEGER PRIMARY KEY,
  name: STRING,
  email: STRING UNIQUE,
  password: STRING (hashed),
  role: ENUM('admin', 'manager', 'technician', 'employee'),
  createdBy: INTEGER (nullable),
  updatedBy: INTEGER (nullable),
  createdAt: DATE,
  updatedAt: DATE
}
```

### Category
```javascript
{
  id: INTEGER PRIMARY KEY,
  name: STRING UNIQUE,
  description: TEXT,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Location
```javascript
{
  id: INTEGER PRIMARY KEY,
  name: STRING UNIQUE,
  description: TEXT,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Equipment
```javascript
{
  id: INTEGER PRIMARY KEY,
  name: STRING,
  description: TEXT,
  categoryId: INTEGER (FK),
  locationId: INTEGER (FK),
  quantity: INTEGER,
  condition: ENUM('good', 'fair', 'poor'),
  minimumStock: INTEGER,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Issue
```javascript
{
  id: INTEGER PRIMARY KEY,
  equipmentId: INTEGER (FK),
  userId: INTEGER (FK, nullable),
  quantity: INTEGER,
  status: ENUM('pending', 'approved', 'issued', 'returned', 'rejected'),
  issueDate: DATE,
  returnDate: DATE (nullable),
  requestedReturnDate: DATE,
  remarks: TEXT,
  rejectionReason: TEXT,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Maintenance
```javascript
{
  id: INTEGER PRIMARY KEY,
  equipmentId: INTEGER (FK),
  technicianId: INTEGER (FK, nullable),
  scheduledDate: DATE,
  completedDate: DATE (nullable),
  status: ENUM('pending', 'completed', 'overdue'),
  notes: TEXT,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Alert
```javascript
{
  id: INTEGER PRIMARY KEY,
  type: ENUM('low_stock', 'maintenance_due', 'general'),
  message: TEXT,
  equipmentId: INTEGER (FK, nullable),
  isRead: BOOLEAN,
  createdAt: DATE,
  updatedAt: DATE
}
```

---

## Business Logic

### Stock Auto-Update
- When equipment is issued → quantity reduces
- When equipment is returned → quantity increases
- Prevents negative stock

### Low Stock Alert
- Triggered when equipment quantity <= minimumStock
- Created automatically on issue and equipment update
- Daily cron job at 8 AM checks all equipment

### Maintenance Checker
- Daily cron job at 9 AM
- Finds maintenance due in 3 days
- Marks overdue maintenance automatically
- Sends email notifications (if configured)

### JWT Authentication
- Token expires in 12 hours
- Stored in localStorage
- Auto logout on 401 response
- Session persists on page refresh

---

## Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=root123
DB_NAME=eeims_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=12h

# Admin Account
ADMIN_EMAIL=admin@eeims.com
ADMIN_PASSWORD=Admin@123

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL is running
   - Verify credentials in .env
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in backend/.env
   - Kill process using port 5000

3. **JWT Token Issues**
   - Clear localStorage
   - Re-login to get new token

4. **CORS Errors**
   - Ensure backend is running
   - Check VITE_API_URL in frontend/.env

### Checking Logs
- Backend logs: Check terminal output
- Browser console: F12 Developer Tools

---

## Office PC Setup Guide

### Prerequisites (Office PC must have)
1. **Node.js** - Download from https://nodejs.org (v18+)
2. **MySQL** - Ensure MySQL service is running
3. **Database** - Create database `eeims_db`

### Database Setup (Run in MySQL)
```sql
CREATE DATABASE eeims_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Quick Start (Office PC)

#### 1. Clone Project
```bash
git clone <your-repo-url>
cd eeims-project
```

#### 2. Configure Backend
Create/edit `backend/.env`:
```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASS=root123
DB_NAME=eeims_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=12h
ADMIN_EMAIL=admin@eeims.com
ADMIN_PASSWORD=Admin@123
```

#### 3. Configure Frontend
Create/edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

#### 4. Install & Run
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

#### 5. Access
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5001/api

### Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@eeims.com | Admin@123 |

### If Project Already Exists (Don't Clone Fresh)
```bash
# Just update credentials in backend/.env
DB_USER=your_office_db_user
DB_PASS=your_office_db_password

# Then run
cd backend
npm start

# New terminal
cd frontend
npm run dev
```

### Troubleshooting Office PC Issues

| Issue | Solution |
|-------|----------|
| Login not working | Check MySQL is running |
| 403 Forbidden errors | Restart backend after recent code changes |
| Database connection error | Verify DB_USER and DB_PASS in .env |
| Port already in use | Change PORT=5002 in backend/.env |
| Old data showing | Clear browser localStorage and re-login |

---

## License

This project is for educational and internal use purposes.

---

## Developed By

EEIMS Development Team