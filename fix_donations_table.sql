-- ============================================================
--  fix_donations_table.sql
--  Run this ONCE in MySQL Workbench.
--  This is the ONE definitive fix for the donation form crash.
--  Run each ALTER line individually — if one says
--  "Duplicate column name", skip it and run the next one.
-- ============================================================

USE orphanage_db;

-- ── Step 1: Add every missing column to donations ────────────

ALTER TABLE donations ADD COLUMN phone          VARCHAR(20)    DEFAULT NULL;
ALTER TABLE donations ADD COLUMN type           VARCHAR(50)    DEFAULT 'Money';
ALTER TABLE donations ADD COLUMN description    TEXT           DEFAULT NULL;
ALTER TABLE donations ADD COLUMN visit_date     DATE           DEFAULT NULL;
ALTER TABLE donations ADD COLUMN mode           VARCHAR(20)    DEFAULT 'offline';
ALTER TABLE donations ADD COLUMN aadhaar_masked VARCHAR(20)    DEFAULT NULL;

-- ── Step 2: Allow amount to be NULL (non-money donations) ──

ALTER TABLE donations MODIFY COLUMN amount DECIMAL(10,2) DEFAULT NULL;

-- ── Step 3: Make donor_email nullable (safety) ──────────────

ALTER TABLE donations MODIFY COLUMN donor_email VARCHAR(150) DEFAULT NULL;

-- ── Step 4: Confirm the final columns ───────────────────────

DESCRIBE donations;
