-- Add enhanced fields for photos, OP strength, and working places
-- Migration: Enhanced doctor information fields

-- Photo fields
ALTER TABLE doctors ADD COLUMN profile_photo TEXT;
ALTER TABLE doctors ADD COLUMN hospital_photo TEXT;
ALTER TABLE doctors ADD COLUMN logo_photo TEXT;

-- Daily OP Strength fields (boolean for each range)
ALTER TABLE doctors ADD COLUMN op_strength_0_20 INTEGER DEFAULT 0;
ALTER TABLE doctors ADD COLUMN op_strength_20_50 INTEGER DEFAULT 0;
ALTER TABLE doctors ADD COLUMN op_strength_50_75 INTEGER DEFAULT 0;
ALTER TABLE doctors ADD COLUMN op_strength_75_100 INTEGER DEFAULT 0;
ALTER TABLE doctors ADD COLUMN op_strength_100_plus INTEGER DEFAULT 0;

-- Working places data (stored as JSON)
ALTER TABLE doctors ADD COLUMN working_places TEXT; -- JSON: {hospital: [...], clinic: [...]}

-- Create indexes for OP strength queries
CREATE INDEX IF NOT EXISTS idx_doctors_op_strength ON doctors(op_strength_100_plus, op_strength_75_100, op_strength_50_75);
