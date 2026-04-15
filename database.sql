-- ============================================
--  STEP 1: Run this file in MySQL Workbench
--  or MySQL command line before starting app
-- ============================================

-- Create the database
CREATE DATABASE IF NOT EXISTS orphanage_db;

-- Use the database
USE orphanage_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  role        VARCHAR(50)   DEFAULT 'user',
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  TABLE 2: children
--  Stores details of every child in the orphanage
-- ============================================================
CREATE TABLE IF NOT EXISTS children (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  full_name       VARCHAR(150)  NOT NULL,
  date_of_birth   DATE,
  gender          ENUM('Male', 'Female', 'Other'),
  admission_date  DATE          DEFAULT (CURRENT_DATE),
  health_status   VARCHAR(100)  DEFAULT 'Healthy',   
  education_level VARCHAR(100),                       
  background_info TEXT,                               
  photo_url       VARCHAR(255),                       
  status          ENUM('Active', 'Adopted', 'Transferred', 'Discharged') DEFAULT 'Active',
  created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
 
 
-- ============================================================
--  TABLE 3: donations
--  Records every donation received by the orphanage
-- ============================================================
CREATE TABLE IF NOT EXISTS donations (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  donor_name      VARCHAR(150)  NOT NULL,
  donor_email     VARCHAR(150),
  donor_phone     VARCHAR(20),
  amount          DECIMAL(10, 2) NOT NULL,            
  donation_type   ENUM('Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Kind') DEFAULT 'Cash',
  purpose         VARCHAR(255),                       
  notes           TEXT,
  donated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
 
 
-- ============================================================
--  TABLE 4: applications
--  Tracks adoption or support applications from the public
-- ============================================================
CREATE TABLE IF NOT EXISTS applications (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  applicant_name  VARCHAR(150)  NOT NULL,
  applicant_email VARCHAR(150)  NOT NULL,
  applicant_phone VARCHAR(20),
  application_type ENUM('Adoption', 'Sponsorship', 'Volunteering', 'Foster Care') NOT NULL,
  child_id        INT,                                
  message         TEXT,                               
  status          ENUM('Pending', 'Under Review', 'Approved', 'Rejected') DEFAULT 'Pending',
  reviewed_by     INT,                                
  submitted_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 
  -- Link to children and users tables
  FOREIGN KEY (child_id)     REFERENCES children(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewed_by)  REFERENCES users(id)    ON DELETE SET NULL
);
 
 
-- ============================================================
--  TABLE 5: staff
--  Stores details of all orphanage staff members
-- ============================================================
CREATE TABLE IF NOT EXISTS staff (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNIQUE,                            
  full_name    VARCHAR(150)  NOT NULL,
  role         VARCHAR(100)  NOT NULL,                
  phone        VARCHAR(20),
  email        VARCHAR(150),
  join_date    DATE          DEFAULT (CURRENT_DATE),
  salary       DECIMAL(10, 2),
  is_active    BOOLEAN       DEFAULT TRUE,
  created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
 
 
-- ============================================================
--  TABLE 6: medical_records
--  Tracks health and medical history of each child
-- ============================================================
CREATE TABLE IF NOT EXISTS medical_records (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  child_id      INT           NOT NULL,
  record_date   DATE          DEFAULT (CURRENT_DATE),
  diagnosis     VARCHAR(255)  NOT NULL,               
  treatment     TEXT,                                 
  doctor_name   VARCHAR(150),
  hospital      VARCHAR(200),
  notes         TEXT,
  follow_up_date DATE,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
 
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);
 
 
-- ============================================================
--  TABLE 7: events
--  Stores orphanage events (visits, fundraisers, celebrations)
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(200)  NOT NULL,
  description   TEXT,
  event_date    DATE          NOT NULL,
  event_time    TIME,
  location      VARCHAR(255),
  organizer     VARCHAR(150),
  status        ENUM('Upcoming', 'Ongoing', 'Completed', 'Cancelled') DEFAULT 'Upcoming',
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
 
 
