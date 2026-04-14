<<<<<<< HEAD
# 🏠 Orphanage Authentication System
## Complete Step-by-Step Setup Guide for Beginners

---

## 📁 Project Structure

```
orphanage-auth/
│
├── database.sql                   ← Run this in MySQL first
│
├── backend/
│   ├── .env                       ← Your secret config (edit this!)
│   ├── package.json               ← Node.js dependencies list
│   ├── server.js                  ← Express server entry point
│   ├── db.js                      ← MySQL connection
│   ├── mailer.js                  ← Email sender (Nodemailer)
│   └── auth.js                    ← Register & Login routes
│
└── frontend/
    ├── package.json               ← React dependencies list
    └── src/
        ├── index.js               ← React entry point
        ├── App.js                 ← Root component (page switching)
        ├── api.js                 ← API call functions
        └── pages/
            ├── Login.js           ← Login page
            ├── Register.js        ← Registration page
            └── Dashboard.js       ← Dashboard (visual only)
```

---

## ✅ PREREQUISITES — Install These First

Before running the project, you need these installed on your PC:

### 1. Node.js (includes npm)
- Download from: https://nodejs.org
- Choose the **LTS** version (recommended)
- After install, open Command Prompt and verify:
  ```
  node --version
  npm --version
  ```
  You should see version numbers like `v20.x.x` and `10.x.x`

### 2. MySQL
- Download from: https://dev.mysql.com/downloads/installer/
- During install, choose **MySQL Server** + **MySQL Workbench**
- Remember the **root password** you set — you'll need it!
- After install, verify in Command Prompt:
  ```
  mysql --version
  ```

### 3. A Code Editor (optional but recommended)
- Download **VS Code** from: https://code.visualstudio.com

---

## 🚀 STEP-BY-STEP SETUP

---

### STEP 1 — Set Up the Database

**Option A: Using MySQL Workbench (Recommended for beginners)**

1. Open **MySQL Workbench**
2. Click on your local connection (usually `Local instance MySQL`)
3. Enter your **root password**
4. Click **File → Open SQL Script**
5. Browse and select `database.sql` from this project
6. Click the **⚡ lightning bolt** button (Execute) to run it
7. You should see `orphanage_db` appear in the left panel under Schemas

**Option B: Using Command Line**

1. Open Command Prompt
2. Run:
   ```bash
   mysql -u root -p
   ```
3. Enter your MySQL root password
4. Run:
   ```sql
   source C:/path/to/orphanage-auth/database.sql
   ```
   (Replace the path with where you saved the project)

---

### STEP 2 — Configure the Backend

1. Open the file `backend/.env` in any text editor (Notepad or VS Code)
2. Fill in your details:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_mysql_password    ← Change this!
DB_NAME=orphanage_db
JWT_SECRET=orphanage_super_secret_key_2024
EMAIL_USER=yourgmail@gmail.com            ← Change this!
EMAIL_PASS=your_app_password_here         ← Change this! (see Step 3)
```

---

### STEP 3 — Set Up Gmail App Password (for Email)

You CANNOT use your normal Gmail password. You need an **App Password**.

1. Go to: https://myaccount.google.com
2. Click **Security** in the left sidebar
3. Under "How you sign in to Google", click **2-Step Verification**
   - If not enabled, enable it first (required!)
4. Scroll down to the bottom and click **App Passwords**
5. In "App name" type: `Orphanage App`
6. Click **Create**
7. Google will show a **16-character password** like: `abcd efgh ijkl mnop`
8. Copy this password (without spaces) and paste it into `.env` as `EMAIL_PASS`

> ⚠️ Important: Keep this password secret. Never share it or upload it to GitHub.

---

### STEP 4 — Install & Run the Backend

Open **Command Prompt** or **Terminal**:

```bash
# Navigate into the backend folder
cd C:\path\to\orphanage-auth\backend

# Install all required packages (do this only once)
npm install

# Start the server
node server.js
```

✅ You should see:
```
✅ Server running at http://localhost:5000
```

> Keep this terminal window open! The backend must stay running.

---

### STEP 5 — Install & Run the Frontend

Open a **second** Command Prompt window (keep the backend one open):

```bash
# Navigate into the frontend folder
cd C:\path\to\orphanage-auth\frontend

# Install all required packages (do this only once)
npm install

# Start the React app
npm start
```

✅ After a moment, your browser should automatically open:
```
http://localhost:3000
```

You'll see the **Login page** of the app!

---

## 🧪 HOW TO TEST THE APP

### Test Registration:
1. Click **"Register here"** on the login page
2. Fill in your name, email, and password
3. Click **Register**
4. ✅ You should see a green success message
5. ✅ Check your email inbox — you should receive a welcome email!

### Test Login:
1. Go to the Login page
2. Enter the email and password you just registered with
3. Click **Login**
4. ✅ You should be redirected to the **Dashboard**

### Test Logout:
1. On the dashboard, click the red **Logout** button (top right)
2. ✅ You'll be taken back to the Login page

---

## 🌐 API ENDPOINTS REFERENCE

| Method | URL                     | What it does              |
|--------|-------------------------|---------------------------|
| POST   | /api/auth/register      | Creates a new user        |
| POST   | /api/auth/login         | Logs in and returns token |
| GET    | /                       | Health check              |

---

## ❌ COMMON ERRORS & FIXES

### "Cannot connect to database"
- Make sure MySQL is running (check Windows Services or MySQL Workbench)
- Double-check `DB_PASSWORD` in your `.env` file

### "Email not sending"
- Make sure 2-Step Verification is ON in your Google account
- Use App Password, NOT your real Gmail password
- Check that `EMAIL_USER` and `EMAIL_PASS` in `.env` are correct

### "npm install fails"
- Make sure you're in the correct folder (backend or frontend)
- Try running Command Prompt as Administrator

### "Port already in use"
- Another app is using port 5000 or 3000
- Change `PORT=5001` in `.env` and restart backend
- Or close the other app using that port

### "Module not found"
- Run `npm install` again in the correct folder

---

## 🔒 SECURITY NOTES

- Passwords are **hashed with bcrypt** — never stored as plain text
- JWT tokens expire after **1 day**
- Never commit your `.env` file to GitHub
- Add `.env` to your `.gitignore` file if sharing the project

---

## 📞 QUICK REFERENCE — Running the App

Every time you want to use the app:

1. Open **Terminal 1** → go to `backend/` → run `node server.js`
2. Open **Terminal 2** → go to `frontend/` → run `npm start`
3. Open browser → go to `http://localhost:3000`

That's it! 🎉
=======
# Orphanage-Management-System
a web-based application designed to efficiently manage and streamline the daily operations of an orphanage. It provides a centralized platform for administrators to handle records, monitor activities, and improve overall organizational efficiency.

