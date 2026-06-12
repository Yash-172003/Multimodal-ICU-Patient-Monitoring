CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY,
  mrn VARCHAR UNIQUE,
  name VARCHAR,
  age INTEGER,
  gender VARCHAR,
  unit VARCHAR,
  bed_id VARCHAR,
  admitted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vitals (
  id INTEGER PRIMARY KEY,
  patient_id INTEGER,
  timestamp TIMESTAMP,
  heart_rate REAL,
  systolic_bp REAL,
  diastolic_bp REAL,
  spo2 REAL,
  respiratory_rate REAL,
  temperature REAL,
  FOREIGN KEY(patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS labs (
  id INTEGER PRIMARY KEY,
  patient_id INTEGER,
  timestamp TIMESTAMP,
  wbc REAL,
  hemoglobin REAL,
  platelets REAL,
  creatinine REAL,
  sodium REAL,
  potassium REAL,
  lactate REAL,
  FOREIGN KEY(patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY,
  patient_id INTEGER,
  timestamp TIMESTAMP,
  text TEXT,
  FOREIGN KEY(patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS predictions (
  id INTEGER PRIMARY KEY,
  patient_id INTEGER,
  timestamp TIMESTAMP,
  risk_score REAL,
  risk_level VARCHAR,
  model_version VARCHAR,
  FOREIGN KEY(patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS diagnoses (
  id INTEGER PRIMARY KEY,
  patient_id INTEGER,
  timestamp TIMESTAMP,
  icd10_code VARCHAR,
  description VARCHAR,
  diagnosis_type VARCHAR,
  status VARCHAR,
  FOREIGN KEY(patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS procedures (
  id INTEGER PRIMARY KEY,
  patient_id INTEGER,
  timestamp TIMESTAMP,
  cpt_code VARCHAR,
  description VARCHAR,
  procedure_type VARCHAR,
  duration_minutes REAL,
  outcome VARCHAR,
  FOREIGN KEY(patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS medications (
  id INTEGER PRIMARY KEY,
  patient_id INTEGER,
  timestamp TIMESTAMP,
  medication_name VARCHAR,
  dosage VARCHAR,
  route VARCHAR,
  frequency VARCHAR,
  indication VARCHAR,
  status VARCHAR,
  administered BOOLEAN,
  FOREIGN KEY(patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS interventions (
  id INTEGER PRIMARY KEY,
  patient_id INTEGER,
  timestamp TIMESTAMP,
  intervention_type VARCHAR,
  description VARCHAR,
  outcome VARCHAR,
  details TEXT,
  FOREIGN KEY(patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS nursing_assessments (
  id INTEGER PRIMARY KEY,
  patient_id INTEGER,
  timestamp TIMESTAMP,
  shift VARCHAR,
  nurse_name VARCHAR,
  consciousness_level VARCHAR,
  glasgow_coma_scale INTEGER,
  respiratory_effort VARCHAR,
  oxygen_therapy VARCHAR,
  peripheral_pulses VARCHAR,
  capillary_refill VARCHAR,
  skin_condition VARCHAR,
  pressure_ulcer_risk INTEGER,
  pain_score INTEGER,
  pain_location VARCHAR,
  mobility VARCHAR,
  fluid_balance_ml REAL,
  assessment_notes TEXT,
  care_plan_updates TEXT,
  FOREIGN KEY(patient_id) REFERENCES patients(id)
);
