-- DocPool Database Schema - Comprehensive Doctor Information System
-- Created: 2026-01-17

-- Main Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
  -- Core Identification
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doctor_id TEXT UNIQUE NOT NULL, -- System generated unique ID (e.g., DOC-2024-0001)
  full_name TEXT NOT NULL,
  gender TEXT CHECK(gender IN ('Male', 'Female', 'Other')),
  date_of_birth TEXT, -- ISO date format
  profile_photo_url TEXT,
  mobile_number TEXT NOT NULL,
  email TEXT,
  whatsapp_enabled INTEGER DEFAULT 0, -- 0=No, 1=Yes
  
  -- Professional Credentials
  primary_qualification TEXT, -- MBBS / BDS / BAMS / BHMS etc.
  specialization TEXT, -- Cardiology / Dermatology / Ortho etc.
  super_specialization TEXT, -- DM / MCh (if applicable)
  years_of_experience INTEGER,
  medical_council_reg_no TEXT,
  registration_council TEXT, -- State / NMC
  registration_valid_till TEXT, -- ISO date format
  
  -- Practice & Work Details
  practice_type TEXT CHECK(practice_type IN ('Clinic', 'Hospital', 'Both')),
  primary_hospital_name TEXT,
  secondary_hospitals TEXT, -- JSON array of hospital names
  clinic_name TEXT,
  opd_days TEXT, -- JSON array: ["Monday", "Tuesday", ...]
  opd_timings TEXT, -- JSON: {"start": "09:00", "end": "18:00"}
  consultation_fee REAL,
  teleconsultation_available INTEGER DEFAULT 0, -- 0=No, 1=Yes
  
  -- Location & Reach
  state TEXT,
  city TEXT,
  area_locality TEXT,
  pin_code TEXT,
  google_maps_link TEXT,
  home_visit_available INTEGER DEFAULT 0, -- 0=No, 1=Yes
  
  -- Digital & Platform Mapping
  listed_on_mysaa INTEGER DEFAULT 0,
  listed_on_docsynapse INTEGER DEFAULT 0,
  app_login_created INTEGER DEFAULT 0,
  doctor_category TEXT CHECK(doctor_category IN ('Platinum', 'Gold', 'Silver', NULL)),
  cme_participation INTEGER DEFAULT 0,
  workshop_conductor INTEGER DEFAULT 0,
  
  -- Referral & Network Intelligence
  referral_capability TEXT CHECK(referral_capability IN ('High', 'Medium', 'Low', NULL)),
  common_referral_specialties TEXT, -- JSON array
  inbound_referrals INTEGER DEFAULT 0,
  outbound_referrals INTEGER DEFAULT 0,
  network_strength_score INTEGER CHECK(network_strength_score BETWEEN 1 AND 10),
  
  -- Commercial & Compliance
  payment_model TEXT CHECK(payment_model IN ('Fixed', 'Revenue Share', NULL)),
  agreement_signed INTEGER DEFAULT 0,
  agreement_start_date TEXT,
  agreement_end_date TEXT,
  gst_registered INTEGER DEFAULT 0,
  gst_number TEXT,
  
  -- Engagement & Activity Tracking
  last_interaction_date TEXT,
  last_cme_attended TEXT,
  last_referral_date TEXT,
  engagement_status TEXT CHECK(engagement_status IN ('Active', 'Dormant', 'Inactive')) DEFAULT 'Active',
  assigned_relationship_manager TEXT,
  
  -- Internal Notes & Flags
  strategic_doctor INTEGER DEFAULT 0,
  kol INTEGER DEFAULT 0, -- Key Opinion Leader
  special_remarks TEXT,
  compliance_flag INTEGER DEFAULT 0,
  
  -- System Fields
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_doctors_doctor_id ON doctors(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctors_mobile ON doctors(mobile_number);
CREATE INDEX IF NOT EXISTS idx_doctors_email ON doctors(email);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);
CREATE INDEX IF NOT EXISTS idx_doctors_city ON doctors(city);
CREATE INDEX IF NOT EXISTS idx_doctors_state ON doctors(state);
CREATE INDEX IF NOT EXISTS idx_doctors_engagement_status ON doctors(engagement_status);
CREATE INDEX IF NOT EXISTS idx_doctors_doctor_category ON doctors(doctor_category);
CREATE INDEX IF NOT EXISTS idx_doctors_created_at ON doctors(created_at);

-- Trigger to update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_doctors_timestamp 
AFTER UPDATE ON doctors
BEGIN
  UPDATE doctors SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Activity Log Table (for tracking all doctor interactions)
CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doctor_id TEXT NOT NULL,
  activity_type TEXT NOT NULL, -- 'created', 'updated', 'interaction', 'referral', 'cme', etc.
  activity_description TEXT,
  performed_by TEXT, -- User who performed the action
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_doctor_id ON activity_logs(doctor_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
