
# 🏠 Hope Orphanage Management System

A full-stack web application for managing an orphanage — featuring user authentication, child profiles, donation tracking, adoption applications, and automated email notifications.

---

## 📋Overview

**Hope Orphanage** is a comprehensive management system designed to streamline orphanage operations. It provides a centralized platform for managing children records, processing donations (both monetary and in-kind), handling adoption applications, and maintaining communication with donors and prospective parents through automated emails.

The system consists of two main components:
- **Backend API** (Node.js + Express + MySQL)
- **Frontend** (React.js)

---

## ✨ Key Features

### 🔐 Authentication & Security
- **User Registration & Login** — Secure account creation with bcrypt password hashing
- **JWT Token Authentication** — Stateless session management with 24-hour token expiry
- **Email Verification via OTP** — 6-digit one-time passwords sent to user emails for form submissions
- **Aadhaar Validation** — 12-digit Aadhaar number masking for privacy compliance

### 👶 Children Management
- **Child Profiles** — View all registered children with details including name, age, gender, health status, education level, and admission date
- **Status Tracking** — Track children status: Active, Adopted, or Transferred
- **Age Calculation** — Automatic age computation from date of birth

### 💝 Donation System
- **Multiple Donation Types** — Support for:
  - 💵 Money (monetary donations)
  - 🍚 Food (groceries, meals)
  - 👕 Clothes (clothing items)
  - 🎓 Scholarship (educational support)
- **Offline Donation Scheduling** — Donors can schedule visits to the orphanage
- **Donation Tracking** — Complete history of all donations with donor details, amounts, and visit dates
- **Summary Dashboard** — Total donations count and money raised

### 🏠 Adoption Applications
- **Application Types** — Support for Adoption, Foster Care, and Volunteer requests
- **Application Tracking** — View all applications with status (Pending, Approved, Rejected)
- **OTP Verification** — Email verification required before submission

### 📊 Dashboard & Analytics
- **Real-time Statistics** — Total children, donations, applications, and events count
- **Total Funds Raised** — Sum of all monetary donations
- **Recent Activity Feed** — Latest updates on children, donations, and applications

### 📧 Email Notifications
Automated email confirmations for:
- User registration
- Login notifications
- Donation submissions (with visit date details)
- Adoption application receipts
- OTP verification codes

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js, CSS-in-JS (inline styles) |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL with connection pooling |
| **Authentication** | JWT (JSON Web Tokens), bcrypt |
| **Email Service** | Nodemailer with Gmail SMTP |
| **API Communication** | RESTful JSON API |

---

## 🎯 Use Cases

### For Orphanage Administrators
- View dashboard with quick statistics
- Manage and monitor all children records
- Track all incoming donations (money, food, clothes, scholarships)
- Review and process adoption applications

### For Donors
- Register and login to the system
- Submit offline donations of money, food, clothes, or scholarships
- Schedule convenient visit dates to the orphanage
- Receive email confirmations for their contributions

### For Prospective Parents
- Submit adoption applications
- Choose between Adoption, Foster Care, or Volunteer options
- Receive application status updates via email

### For General Public
- Learn about the orphanage via the About Us page
- Contact the orphanage through the Contact page
- View publicly accessible information

---

## 📱 Pages & Navigation

| Page | Description |
|------|-------------|
| **Login** | User authentication with email/password |
| **Register** | New user account creation |
| **Dashboard** | Overview with stats, activity feed, and quick actions |
| **Children** | Grid view of all children with status badges |
| **Donations** | Table of all donations with filtering by type |
| **Donate Form** | Multi-step donation form with OTP verification |
| **Adopt Form** | Application form for adoption/foster/volunteer |
| **Contact Us** | Orphanage contact information and location |
| **About Us** | Mission, vision, and organizational details |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server (v8.0+)
- Gmail account (for sending emails)

### Installation

```bash
# Clone the repository
cd orphanage-auth

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Configuration

Create a `.env` file in the `backend` folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=orphanage_db
JWT_SECRET=your_secret_key
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Database Setup

1. Open **MySQL Workbench** or command line
2. Run the SQL scripts in this order:
   - `database.sql` — Creates the database schema
   - `children_dummy_data.sql` — Adds sample children data

### Running the Application

```bash
# Start backend (Terminal 1)
cd backend
node server.js

# Start frontend (Terminal 2)
cd frontend
npm start
```

Access the application at: **http://localhost:3000**

---

## 📂 Project Structure

```
orphanage-auth/
├── database.sql                 # Database schema
├── children_dummy_data.sql      # Sample children data
├── donations_migration.sql      # Donations table migration
├── applications_migration.sql   # Applications table migration
├── MASTER_fix.sql               # Database fixes
│
├── backend/
│   ├── server.js               # Express server entry point
│   ├── db.js                   # MySQL connection pool
│   ├── auth.js                 # Authentication routes
│   ├── routes.js               # API routes (children, donations, etc.)
│   ├── mailer.js               # Email sending functions
│   ├── otpStore.js             # OTP generation & verification
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.js              # Main React component
    │   ├── api.js              # API helper functions
    │   └── pages/
    │       ├── Login.js
    │       ├── Register.js
    │       ├── Dashboard.js
    │       ├── Children.js
    │       ├── Donations.js
    │       ├── DonateForm.js
    │       ├── AdoptForm.js
    │       ├── ContactUs.js
    │       └── AboutUs.js
    └── package.json
```

---

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
