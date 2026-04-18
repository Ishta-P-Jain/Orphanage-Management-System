-- ============================================================
--  children_dummy_data.sql
--  Run this AFTER your main database.sql has been executed.
--  Inserts 15 dummy children into the children table.
--  The `date_of_birth` is calculated so ages match the descriptions.
-- ============================================================

USE orphanage_db;

INSERT INTO children
  (full_name, date_of_birth, gender, health_status, education_level, background_info, status)
VALUES
  ('Ravi Kumar',      '2016-03-14', 'Male',   'Healthy',         'Grade 3',    'Loves cricket and drawing. Very energetic and friendly.',          'Active'),
  ('Priya Nair',      '2014-07-22', 'Female', 'Healthy',         'Grade 5',    'Excellent in studies. Wants to become a teacher someday.',         'Active'),
  ('Arun Shankar',    '2018-11-05', 'Male',   'Healthy',         'Pre-School', 'Very playful and loves building blocks and colouring books.',      'Active'),
  ('Meena Reddy',     '2013-01-30', 'Female', 'Healthy',         'Grade 6',    'Talented in classical dance. Participates in all events.',         'Active'),
  ('Suresh Patel',    '2015-09-17', 'Male',   'Under Treatment', 'Grade 4',    'Recovering from mild fever. Loves football and outdoor games.',    'Active'),
  ('Lakshmi Devi',    '2017-04-08', 'Female', 'Healthy',         'Grade 1',    'Shy but very creative. Loves painting and making paper crafts.',   'Active'),
  ('Karan Singh',     '2012-06-25', 'Male',   'Healthy',         'Grade 7',    'Good in mathematics. Aspires to become an engineer.',             'Active'),
  ('Anitha Bai',      '2019-02-14', 'Female', 'Healthy',         'Pre-School', 'The youngest and most cheerful child. Loves music and dancing.',  'Active'),
  ('Vijay Mohan',     '2016-08-03', 'Male',   'Healthy',         'Grade 2',    'Loves storytelling and reading comic books.',                     'Active'),
  ('Deepa Kumari',    '2014-12-19', 'Female', 'Healthy',         'Grade 5',    'Passionate about cooking. Helps staff during meal preparation.',  'Active'),
  ('Rahul Gupta',     '2011-05-11', 'Male',   'Healthy',         'Grade 8',    'Top student. Loves science experiments and technology.',          'Active'),
  ('Saranya Pillai',  '2015-10-27', 'Female', 'Under Treatment', 'Grade 4',    'Recovering from a respiratory issue. Loves singing and music.',   'Active'),
  ('Mohan Das',       '2013-07-09', 'Male',   'Healthy',         'Grade 6',    'Loves chess and strategy games. Very calm and thoughtful.',       'Active'),
  ('Kavitha Rao',     '2017-03-21', 'Female', 'Healthy',         'Grade 1',    'Active and curious. Loves asking questions and learning.',        'Active'),
  ('Santhosh Kumar',  '2012-11-16', 'Male',   'Healthy',         'Grade 8',    'Excellent in sports. Represented school in state-level athletics.','Active');

-- Confirm insert
SELECT COUNT(*) AS total_children FROM children;


-- ============================================================
--  DATABASE MIGRATION
--  Add aadhaar_masked column to donations and applications.
--  Run this only if you have not already added these columns.
--  Safe to run — uses IF NOT EXISTS logic via ALTER TABLE.
-- ============================================================

-- Add aadhaar_masked to donations table
ALTER TABLE donations
  ADD COLUMN IF NOT EXISTS aadhaar_masked VARCHAR(20) DEFAULT NULL
  COMMENT 'Stores masked Aadhaar e.g. ********9012. Never store full number.';

-- Add aadhaar_masked to applications table
ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS aadhaar_masked VARCHAR(20) DEFAULT NULL
  COMMENT 'Stores masked Aadhaar e.g. ********9012. Never store full number.';

-- Confirm columns added
DESCRIBE donations;
DESCRIBE applications;
