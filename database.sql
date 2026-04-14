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
