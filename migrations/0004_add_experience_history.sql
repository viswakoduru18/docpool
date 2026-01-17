-- Add experience history tracking
-- Migration: Experience history with multiple work entries

-- Experience history field (stored as JSON array)
ALTER TABLE doctors ADD COLUMN experience_history TEXT; -- JSON: [{hospitalClinicName, fromMonth, fromYear, toMonth, toYear, current}]

-- Flag for manual experience override
ALTER TABLE doctors ADD COLUMN manual_experience_override INTEGER DEFAULT 0;

-- Index for searching doctors by experience
CREATE INDEX IF NOT EXISTS idx_doctors_experience ON doctors(years_of_experience);
