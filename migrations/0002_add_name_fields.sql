-- Add separate name fields for better data organization
-- Migration: Add first_name, middle_name, last_name fields

ALTER TABLE doctors ADD COLUMN first_name TEXT;
ALTER TABLE doctors ADD COLUMN middle_name TEXT;
ALTER TABLE doctors ADD COLUMN last_name TEXT;

-- Create index on first and last name for search optimization
CREATE INDEX IF NOT EXISTS idx_doctors_first_name ON doctors(first_name);
CREATE INDEX IF NOT EXISTS idx_doctors_last_name ON doctors(last_name);
