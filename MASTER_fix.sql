-- ============================================================
--  MASTER_fix.sql
--  Run this ONCE in MySQL Workbench.
--  This replaces ALL previous migration files.
--  Run each line ONE AT A TIME.
--  If a line says "Duplicate column" → skip it, that's fine.
--  If a line says "Data truncated" → that's the ENUM bug, fixed below.
-- ============================================================

USE orphanage_db;

-- ══════════════════════════════════════════════════════════════
--  STEP 1: Fix the donations table
--  The original table has:
--    donation_type ENUM('Cash','Bank Transfer','UPI','Cheque','Kind')
--    amount        DECIMAL(10,2) NOT NULL
--  Both of these crash the new form.
--  We fix them here.
-- ══════════════════════════════════════════════════════════════

-- 1a. Change donation_type from a strict ENUM to a plain VARCHAR
--     so it accepts 'Money', 'Food', 'Clothes', 'Scholarship'
ALTER TABLE donations
  MODIFY COLUMN donation_type VARCHAR(50) DEFAULT 'Money';

-- 1b. Allow amount to be NULL (non-money donations have no amount)
ALTER TABLE donations
  MODIFY COLUMN amount DECIMAL(10,2) DEFAULT NULL;

-- 1c. Allow donor_email to be NULL (safety)
ALTER TABLE donations
  MODIFY COLUMN donor_email VARCHAR(150) DEFAULT NULL;

-- 1d. Add the new columns (skip any that say "Duplicate column")
ALTER TABLE donations ADD COLUMN phone          VARCHAR(20)  DEFAULT NULL;
ALTER TABLE donations ADD COLUMN type           VARCHAR(50)  DEFAULT 'Money';
ALTER TABLE donations ADD COLUMN description    TEXT         DEFAULT NULL;
ALTER TABLE donations ADD COLUMN visit_date     DATE         DEFAULT NULL;
ALTER TABLE donations ADD COLUMN mode           VARCHAR(20)  DEFAULT 'offline';
ALTER TABLE donations ADD COLUMN aadhaar_masked VARCHAR(20)  DEFAULT NULL;
ALTER TABLE donations ADD COLUMN purpose        VARCHAR(255) DEFAULT NULL;

-- ══════════════════════════════════════════════════════════════
--  STEP 2: Fix the applications table
--  Missing columns cause the adoption form crash.
-- ══════════════════════════════════════════════════════════════

ALTER TABLE applications ADD COLUMN aadhaar_masked VARCHAR(20) DEFAULT NULL;
ALTER TABLE applications ADD COLUMN phone          VARCHAR(20) DEFAULT NULL;
ALTER TABLE applications ADD COLUMN visit_date     DATE        DEFAULT NULL;

-- ══════════════════════════════════════════════════════════════
--  STEP 3: Verify — check final structure of both tables
-- ══════════════════════════════════════════════════════════════

DESCRIBE donations;
DESCRIBE applications;
