-- ============================================================
--  applications_migration.sql — RUN THIS IN MYSQL WORKBENCH
--  Fixes the "Could not submit application" crash by adding
--  the missing columns to both tables.
--
--  ⚠️  Run EACH statement one at a time if any fails.
--  The donations table fixes the Food/Clothes/Scholarship bug.
--  The applications table fixes the adoption form crash.
-- ============================================================

USE orphanage_db;

-- ── Fix applications table ────────────────────────────────
-- These columns are missing, causing the INSERT to crash

ALTER TABLE applications ADD COLUMN aadhaar_masked VARCHAR(20) DEFAULT NULL;
ALTER TABLE applications ADD COLUMN phone          VARCHAR(20) DEFAULT NULL;
ALTER TABLE applications ADD COLUMN visit_date     DATE        DEFAULT NULL;

-- ── Fix donations table ───────────────────────────────────
-- These may already exist from the previous migration.
-- If any line says "Duplicate column", just skip it — that's fine.

ALTER TABLE donations ADD COLUMN aadhaar_masked VARCHAR(20)  DEFAULT NULL;
ALTER TABLE donations ADD COLUMN phone          VARCHAR(20)  DEFAULT NULL;
ALTER TABLE donations ADD COLUMN type           VARCHAR(50)  DEFAULT 'Money';
ALTER TABLE donations ADD COLUMN description    TEXT         DEFAULT NULL;
ALTER TABLE donations ADD COLUMN visit_date     DATE         DEFAULT NULL;
ALTER TABLE donations ADD COLUMN mode           VARCHAR(20)  DEFAULT 'offline';

-- Allow amount to be NULL (needed for non-money donations)
ALTER TABLE donations MODIFY COLUMN amount DECIMAL(10,2) DEFAULT NULL;

-- ── Confirm final structure ───────────────────────────────
DESCRIBE applications;
DESCRIBE donations;
