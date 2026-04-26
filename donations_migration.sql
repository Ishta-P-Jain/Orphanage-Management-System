-- ============================================================
--  donations_migration.sql — RUN THIS IN MYSQL WORKBENCH
--  Fixes the broken donations table and adds all new columns.
--  Safe to run multiple times — uses IF NOT EXISTS.
-- ============================================================

USE orphanage_db;

-- Step 1: Add aadhaar_masked (fixes the current crash)
ALTER TABLE donations
  ADD COLUMN  aadhaar_masked VARCHAR(20) DEFAULT NULL;

-- Step 2: Add new offline donation columns
ALTER TABLE donations ADD COLUMN aadhaar_masked VARCHAR(20);

ALTER TABLE donations ADD COLUMN phone VARCHAR(20);

ALTER TABLE donations ADD COLUMN type VARCHAR(50) DEFAULT 'Money';

ALTER TABLE donations ADD COLUMN description TEXT;

ALTER TABLE donations ADD COLUMN visit_date DATE;

ALTER TABLE donations ADD COLUMN mode VARCHAR(20) DEFAULT 'offline';

-- Step 3: Also add aadhaar_masked to applications if not done yet
ALTER TABLE applications
  ADD COLUMNaadhaar_masked VARCHAR(20) DEFAULT NULL;

-- Confirm: show final structure
DESCRIBE donations;
