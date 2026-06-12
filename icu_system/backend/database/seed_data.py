from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random

# Import models
from ..models import (Patient, Vitals, Lab, Note, Prediction, 
                      Diagnosis, Procedure, Medication, Intervention, NursingAssessment)

# Comprehensive patient data for realistic ICU scenarios
PATIENT_PROFILES = [
    {"name": "Robert Anderson", "age": 68, "gender": "M", "condition": "post_cardiac_surgery"},
    {"name": "Maria Rodriguez", "age": 52, "gender": "F", "condition": "septic_shock"},
    {"name": "James Wilson", "age": 71, "gender": "M", "condition": "respiratory_failure"},
    {"name": "Patricia Chen", "age": 45, "gender": "F", "condition": "trauma"},
    {"name": "Michael Brown", "age": 59, "gender": "M", "condition": "stroke"},
    {"name": "Jennifer Davis", "age": 63, "gender": "F", "condition": "cardiac_arrest"},
    {"name": "William Martinez", "age": 55, "gender": "M", "condition": "pneumonia"},
    {"name": "Linda Taylor", "age": 72, "gender": "F", "condition": "post_surgery"},
    {"name": "David Thompson", "age": 48, "gender": "M", "condition": "diabetic_ketoacidosis"},
    {"name": "Sarah Johnson", "age": 67, "gender": "F", "condition": "copd_exacerbation"},
    {"name": "Christopher Lee", "age": 58, "gender": "M", "condition": "acute_mi"},
    {"name": "Elizabeth White", "age": 74, "gender": "F", "condition": "heart_failure"},
    {"name": "Daniel Harris", "age": 42, "gender": "M", "condition": "overdose"},
    {"name": "Nancy Clark", "age": 69, "gender": "F", "condition": "pulmonary_embolism"},
    {"name": "Thomas Walker", "age": 61, "gender": "M", "condition": "gi_bleeding"},
]

CLINICAL_NOTES = {
    "post_cardiac_surgery": "Post-op day 2 from CABG. Hemodynamically stable on minimal pressors. Chest tubes draining serosanguinous fluid. Awaiting extubation.",
    "septic_shock": "Admitted with severe sepsis, source likely pneumonia. On broad-spectrum antibiotics and vasopressor support. Lactate trending down.",
    "respiratory_failure": "Intubated for hypoxic respiratory failure secondary to ARDS. PEEP 12, FiO2 60%. Prone positioning considered.",
    "trauma": "MVC with multiple rib fractures and pulmonary contusion. Pain control and pulmonary hygiene ongoing. Hemodynamically stable.",
    "stroke": "Large vessel occlusion, s/p thrombectomy. Neuro checks Q1H. Blood pressure management critical. Currently sedated.",
    "cardiac_arrest": "ROSC after 12 minutes. Post-arrest care with TTM protocol. Continuous EEG monitoring. Prognosis guarded.",
    "pneumonia": "Community-acquired pneumonia with respiratory failure requiring mechanical ventilation. Responding to antibiotics.",
    "post_surgery": "Post-op from emergency bowel resection. Extubated POD1. Pain controlled. Diet advancing as tolerated.",
    "diabetic_ketoacidosis": "Severe DKA with initial pH 7.1. On insulin drip and aggressive fluid resuscitation. Gap closing appropriately.",
    "copd_exacerbation": "Severe COPD exacerbation, failed BiPAP trial, now intubated. Steroids and bronchodilators continuing.",
    "acute_mi": "STEMI s/p PCI to LAD. Hemodynamically stable. Troponin trending down. Cardiac rehab planned.",
    "heart_failure": "Acute on chronic systolic heart failure. Diuresing well. BNP elevated but improving. GDMT optimization ongoing.",
    "overdose": "Polypharmacy overdose. Intubated for airway protection. Toxicology consulted. Psychiatry to follow.",
    "pulmonary_embolism": "Massive PE with RV strain. Started on heparin drip. Hemodynamics improving. Considering step-down.",
    "gi_bleeding": "Upper GI bleed from peptic ulcer. EGD with cauterization performed. Hemoglobin stable. PPI drip ongoing.",
}


def create_patients(db: Session, n: int = 15):
    """Create realistic ICU patient profiles."""
    patients = []
    units = ["ICU-1", "ICU-2", "MICU", "SICU", "CCU"]
    
    for i in range(min(n, len(PATIENT_PROFILES))):
        profile = PATIENT_PROFILES[i]
        p = Patient(
            mrn=f"MRN{i+1:05d}",
            name=profile["name"],
            age=profile["age"],
            gender=profile["gender"],
            unit=random.choice(units),
            bed_id=f"B{i+1}",
        )
        p.condition = profile["condition"]  # Store for later use
        db.add(p)
        patients.append(p)
    
    db.commit()
    for p in patients:
        db.refresh(p)
    return patients


def get_vitals_for_condition(condition: str, base_time: datetime, offset_minutes: int):
    """Generate realistic vital signs based on patient condition."""
    # Base ranges for different conditions
    vital_ranges = {
        "post_cardiac_surgery": {
            "hr": (70, 95), "sbp": (100, 130), "dbp": (60, 80),
            "spo2": (94, 99), "rr": (12, 18), "temp": (36.8, 37.5)
        },
        "septic_shock": {
            "hr": (110, 140), "sbp": (85, 110), "dbp": (50, 70),
            "spo2": (88, 95), "rr": (22, 32), "temp": (38.5, 39.5)
        },
        "respiratory_failure": {
            "hr": (85, 115), "sbp": (90, 120), "dbp": (55, 75),
            "spo2": (88, 94), "rr": (20, 30), "temp": (37.0, 38.5)
        },
        "trauma": {
            "hr": (95, 125), "sbp": (95, 125), "dbp": (60, 80),
            "spo2": (91, 97), "rr": (18, 26), "temp": (36.5, 37.5)
        },
        "stroke": {
            "hr": (65, 90), "sbp": (140, 180), "dbp": (80, 100),
            "spo2": (94, 99), "rr": (14, 20), "temp": (36.8, 37.8)
        },
        "cardiac_arrest": {
            "hr": (75, 100), "sbp": (90, 120), "dbp": (55, 75),
            "spo2": (92, 97), "rr": (16, 22), "temp": (33.0, 36.0)  # TTM
        },
        "pneumonia": {
            "hr": (95, 120), "sbp": (95, 125), "dbp": (60, 80),
            "spo2": (89, 95), "rr": (20, 28), "temp": (38.0, 39.0)
        },
        "post_surgery": {
            "hr": (75, 95), "sbp": (100, 130), "dbp": (65, 85),
            "spo2": (94, 99), "rr": (14, 20), "temp": (36.8, 37.8)
        },
        "diabetic_ketoacidosis": {
            "hr": (100, 130), "sbp": (90, 115), "dbp": (55, 75),
            "spo2": (95, 99), "rr": (24, 35), "temp": (36.5, 37.5)
        },
        "copd_exacerbation": {
            "hr": (90, 115), "sbp": (95, 130), "dbp": (60, 80),
            "spo2": (86, 92), "rr": (22, 30), "temp": (37.0, 38.5)
        },
        "acute_mi": {
            "hr": (65, 90), "sbp": (100, 135), "dbp": (65, 85),
            "spo2": (95, 99), "rr": (14, 20), "temp": (36.8, 37.5)
        },
        "heart_failure": {
            "hr": (85, 110), "sbp": (95, 125), "dbp": (60, 80),
            "spo2": (90, 96), "rr": (18, 26), "temp": (36.5, 37.5)
        },
        "overdose": {
            "hr": (55, 85), "sbp": (85, 110), "dbp": (50, 70),
            "spo2": (93, 98), "rr": (10, 16), "temp": (36.0, 37.0)
        },
        "pulmonary_embolism": {
            "hr": (105, 135), "sbp": (90, 115), "dbp": (55, 75),
            "spo2": (87, 94), "rr": (22, 32), "temp": (36.8, 37.8)
        },
        "gi_bleeding": {
            "hr": (95, 120), "sbp": (85, 110), "dbp": (50, 70),
            "spo2": (94, 98), "rr": (16, 24), "temp": (36.5, 37.5)
        },
    }
    
    ranges = vital_ranges.get(condition, vital_ranges["post_surgery"])
    
    # Add some temporal variation (improvement over time for most conditions)
    hours_elapsed = offset_minutes / 60
    improvement_factor = min(hours_elapsed / 36, 0.3)  # Up to 30% improvement over 36 hours
    
    # Generate vitals with some random variation and trend
    hr_range = ranges["hr"]
    hr = random.uniform(hr_range[0], hr_range[1]) * (1 - improvement_factor * 0.15)
    
    sbp_range = ranges["sbp"]
    sbp = random.uniform(sbp_range[0], sbp_range[1]) * (1 + improvement_factor * 0.1)
    
    dbp_range = ranges["dbp"]
    dbp = random.uniform(dbp_range[0], dbp_range[1])
    
    spo2_range = ranges["spo2"]
    spo2 = min(100, random.uniform(spo2_range[0], spo2_range[1]) * (1 + improvement_factor * 0.05))
    
    rr_range = ranges["rr"]
    rr = random.uniform(rr_range[0], rr_range[1]) * (1 - improvement_factor * 0.2)
    
    temp_range = ranges["temp"]
    temp = random.uniform(temp_range[0], temp_range[1]) * (1 - improvement_factor * 0.05)
    
    return {
        "heart_rate": hr,
        "systolic_bp": sbp,
        "diastolic_bp": dbp,
        "spo2": spo2,
        "respiratory_rate": rr,
        "temperature": temp,
    }


def create_time_series(db: Session, patient: Patient, hours: int = 36, step_min: int = 15):
    """Generate realistic time-series vital signs based on patient condition."""
    now = datetime.utcnow()
    condition = getattr(patient, 'condition', 'post_surgery')
    
    for t in range(0, hours * 60, step_min):
        point_time = now - timedelta(minutes=(hours * 60 - t))
        vitals = get_vitals_for_condition(condition, point_time, t)
        
        v = Vitals(
            patient_id=patient.id,
            timestamp=point_time,
            heart_rate=vitals["heart_rate"],
            systolic_bp=vitals["systolic_bp"],
            diastolic_bp=vitals["diastolic_bp"],
            spo2=vitals["spo2"],
            respiratory_rate=vitals["respiratory_rate"],
            temperature=vitals["temperature"],
        )
        db.add(v)
    
    # Add clinical notes based on condition
    note_text = CLINICAL_NOTES.get(condition, "Patient admitted to ICU. Monitoring and supportive care ongoing.")
    note = Note(
        patient_id=patient.id,
        timestamp=now - timedelta(hours=1),
        text=note_text,
    )
    db.add(note)
    
    # Add a progress note
    progress_note = Note(
        patient_id=patient.id,
        timestamp=now - timedelta(hours=12),
        text=f"24-hour progress: Patient showing steady improvement. Vital signs stabilizing. Continue current management plan.",
    )
    db.add(progress_note)
    
    db.commit()


# Diagnosis/Procedure code mappings
CONDITION_DIAGNOSES = {
    "post_cardiac_surgery": [
        {"icd10": "I25.10", "desc": "Atherosclerotic heart disease", "type": "primary"},
        {"icd10": "Z95.1", "desc": "Presence of aortocoronary bypass graft", "type": "secondary"},
    ],
    "septic_shock": [
        {"icd10": "A41.9", "desc": "Sepsis, unspecified organism", "type": "primary"},
        {"icd10": "R65.21", "desc": "Severe sepsis with septic shock", "type": "primary"},
        {"icd10": "J18.9", "desc": "Pneumonia, unspecified organism", "type": "secondary"},
    ],
    "respiratory_failure": [
        {"icd10": "J96.01", "desc": "Acute respiratory failure with hypoxia", "type": "primary"},
        {"icd10": "J80", "desc": "Acute respiratory distress syndrome", "type": "primary"},
    ],
    "trauma": [
        {"icd10": "S22.42XA", "desc": "Multiple fractures of ribs, initial encounter", "type": "primary"},
        {"icd10": "S27.321A", "desc": "Contusion of lung, unilateral, initial encounter", "type": "secondary"},
    ],
    "stroke": [
        {"icd10": "I63.50", "desc": "Cerebral infarction due to unspecified occlusion", "type": "primary"},
    ],
    "cardiac_arrest": [
        {"icd10": "I46.9", "desc": "Cardiac arrest, cause unspecified", "type": "primary"},
    ],
    "pneumonia": [
        {"icd10": "J18.9", "desc": "Pneumonia, unspecified organism", "type": "primary"},
        {"icd10": "J96.01", "desc": "Acute respiratory failure with hypoxia", "type": "secondary"},
    ],
    "post_surgery": [
        {"icd10": "K56.60", "desc": "Unspecified intestinal obstruction", "type": "primary"},
        {"icd10": "Z98.89", "desc": "Other specified postprocedural states", "type": "secondary"},
    ],
    "diabetic_ketoacidosis": [
        {"icd10": "E11.10", "desc": "Type 2 diabetes with ketoacidosis", "type": "primary"},
    ],
    "copd_exacerbation": [
        {"icd10": "J44.1", "desc": "COPD with acute exacerbation", "type": "primary"},
        {"icd10": "J96.01", "desc": "Acute respiratory failure with hypoxia", "type": "secondary"},
    ],
    "acute_mi": [
        {"icd10": "I21.3", "desc": "ST elevation MI of unspecified site", "type": "primary"},
    ],
    "heart_failure": [
        {"icd10": "I50.23", "desc": "Acute on chronic systolic heart failure", "type": "primary"},
    ],
    "overdose": [
        {"icd10": "T50.901A", "desc": "Poisoning by unspecified drugs, accidental", "type": "primary"},
    ],
    "pulmonary_embolism": [
        {"icd10": "I26.99", "desc": "Other pulmonary embolism", "type": "primary"},
    ],
    "gi_bleeding": [
        {"icd10": "K92.2", "desc": "Gastrointestinal hemorrhage, unspecified", "type": "primary"},
        {"icd10": "K25.4", "desc": "Chronic or unspecified peptic ulcer with hemorrhage", "type": "secondary"},
    ],
}

CONDITION_PROCEDURES = {
    "post_cardiac_surgery": [
        {"cpt": "33533", "desc": "Coronary artery bypass, arterial graft", "type": "surgical", "duration": 240},
    ],
    "stroke": [
        {"cpt": "37184", "desc": "Thrombectomy, cerebral artery", "type": "therapeutic", "duration": 90},
    ],
    "acute_mi": [
        {"cpt": "92928", "desc": "Percutaneous coronary intervention", "type": "therapeutic", "duration": 60},
    ],
    "post_surgery": [
        {"cpt": "44120", "desc": "Enterectomy, resection of small intestine", "type": "surgical", "duration": 180},
    ],
    "gi_bleeding": [
        {"cpt": "43239", "desc": "EGD with biopsy", "type": "diagnostic", "duration": 30},
    ],
}

CONDITION_MEDICATIONS = {
    "post_cardiac_surgery": [
        {"name": "Norepinephrine", "dose": "0.05 mcg/kg/min", "route": "IV", "freq": "continuous", "indication": "vasopressor support"},
        {"name": "Aspirin", "dose": "81 mg", "route": "PO", "freq": "daily", "indication": "antiplatelet"},
        {"name": "Metoprolol", "dose": "25 mg", "route": "PO", "freq": "BID", "indication": "rate control"},
    ],
    "septic_shock": [
        {"name": "Norepinephrine", "dose": "0.15 mcg/kg/min", "route": "IV", "freq": "continuous", "indication": "septic shock"},
        {"name": "Vancomycin", "dose": "1g", "route": "IV", "freq": "q12h", "indication": "broad-spectrum antibiotic"},
        {"name": "Piperacillin-Tazobactam", "dose": "4.5g", "route": "IV", "freq": "q6h", "indication": "broad-spectrum antibiotic"},
    ],
    "respiratory_failure": [
        {"name": "Propofol", "dose": "20 mcg/kg/min", "route": "IV", "freq": "continuous", "indication": "sedation"},
        {"name": "Fentanyl", "dose": "50 mcg/hr", "route": "IV", "freq": "continuous", "indication": "analgesia"},
    ],
    "diabetic_ketoacidosis": [
        {"name": "Regular Insulin", "dose": "0.1 units/kg/hr", "route": "IV", "freq": "continuous", "indication": "DKA"},
        {"name": "Potassium Chloride", "dose": "20 mEq", "route": "IV", "freq": "q4h", "indication": "hypokalemia"},
    ],
    "copd_exacerbation": [
        {"name": "Methylprednisolone", "dose": "40 mg", "route": "IV", "freq": "q6h", "indication": "COPD exacerbation"},
        {"name": "Albuterol", "dose": "2.5 mg", "route": "NEB", "freq": "q4h", "indication": "bronchodilation"},
    ],
    "acute_mi": [
        {"name": "Aspirin", "dose": "325 mg", "route": "PO", "freq": "daily", "indication": "antiplatelet"},
        {"name": "Ticagrelor", "dose": "90 mg", "route": "PO", "freq": "BID", "indication": "antiplatelet"},
        {"name": "Atorvastatin", "dose": "80 mg", "route": "PO", "freq": "daily", "indication": "lipid management"},
    ],
    "heart_failure": [
        {"name": "Furosemide", "dose": "40 mg", "route": "IV", "freq": "BID", "indication": "diuresis"},
        {"name": "Carvedilol", "dose": "6.25 mg", "route": "PO", "freq": "BID", "indication": "heart failure"},
    ],
}


def create_diagnoses(db: Session, patient: Patient, condition: str):
    """Create diagnosis records for patient based on condition"""
    diagnoses_list = CONDITION_DIAGNOSES.get(condition, [])
    now = datetime.utcnow()
    
    for diag_data in diagnoses_list:
        diag = Diagnosis(
            patient_id=patient.id,
            timestamp=now - timedelta(hours=random.randint(24, 48)),
            icd10_code=diag_data["icd10"],
            description=diag_data["desc"],
            diagnosis_type=diag_data["type"],
            status="active"
        )
        db.add(diag)
    db.commit()


def create_procedures(db: Session, patient: Patient, condition: str):
    """Create procedure records for patient based on condition"""
    procedures_list = CONDITION_PROCEDURES.get(condition, [])
    now = datetime.utcnow()
    
    for proc_data in procedures_list:
        proc = Procedure(
            patient_id=patient.id,
            timestamp=now - timedelta(hours=random.randint(12, 36)),
            cpt_code=proc_data["cpt"],
            description=proc_data["desc"],
            procedure_type=proc_data["type"],
            duration_minutes=proc_data["duration"],
            outcome="successful"
        )
        db.add(proc)
    db.commit()


def create_medications(db: Session, patient: Patient, condition: str):
    """Create medication records for patient based on condition"""
    meds_list = CONDITION_MEDICATIONS.get(condition, [])
    now = datetime.utcnow()
    
    for med_data in meds_list:
        med = Medication(
            patient_id=patient.id,
            timestamp=now - timedelta(hours=random.randint(1, 24)),
            medication_name=med_data["name"],
            dosage=med_data["dose"],
            route=med_data["route"],
            frequency=med_data["freq"],
            indication=med_data["indication"],
            status="active",
            administered=True
        )
        db.add(med)
    db.commit()


def create_interventions(db: Session, patient: Patient, condition: str):
    """Create intervention records"""
    now = datetime.utcnow()
    
    interventions_map = {
        "respiratory_failure": [
            {"type": "respiratory", "desc": "Intubation and mechanical ventilation", "outcome": "successful"},
            {"type": "respiratory", "desc": "Prone positioning for 16 hours", "outcome": "improved oxygenation"},
        ],
        "cardiac_arrest": [
            {"type": "cardiovascular", "desc": "Targeted temperature management initiated", "outcome": "ongoing"},
        ],
        "septic_shock": [
            {"type": "cardiovascular", "desc": "Central line placement", "outcome": "successful"},
            {"type": "infectious", "desc": "Blood cultures obtained", "outcome": "pending"},
        ],
    }
    
    interventions_list = interventions_map.get(condition, [])
    for int_data in interventions_list:
        intervention = Intervention(
            patient_id=patient.id,
            timestamp=now - timedelta(hours=random.randint(2, 24)),
            intervention_type=int_data["type"],
            description=int_data["desc"],
            outcome=int_data["outcome"],
            details=f"Intervention performed as per ICU protocol. {int_data['outcome']}."
        )
        db.add(intervention)
    db.commit()


def create_nursing_assessments(db: Session, patient: Patient, condition: str):
    """Create nursing assessment records"""
    now = datetime.utcnow()
    shifts = ["night", "day", "evening"]
    nurses = ["RN Johnson", "RN Smith", "RN Patel", "RN Garcia"]
    
    # Create assessments for last 24 hours (3 shifts)
    for i in range(3):
        shift_time = now - timedelta(hours=(i * 8))
        
        # Condition-specific assessments
        gcs = 15
        consciousness = "alert"
        resp_effort = "normal"
        mobility = "ambulatory"
        
        if condition in ["stroke", "cardiac_arrest", "overdose"]:
            gcs = random.randint(8, 12)
            consciousness = "sedated"
            mobility = "bedbound"
        elif condition in ["respiratory_failure", "septic_shock"]:
            gcs = random.randint(12, 14)
            consciousness = "lethargic"
            resp_effort = "labored"
            mobility = "bedbound"
        
        assessment = NursingAssessment(
            patient_id=patient.id,
            timestamp=shift_time,
            shift=shifts[i % 3],
            nurse_name=random.choice(nurses),
            consciousness_level=consciousness,
            glasgow_coma_scale=gcs,
            respiratory_effort=resp_effort,
            oxygen_therapy="High flow nasal cannula" if condition in ["respiratory_failure", "pneumonia"] else "Room air",
            peripheral_pulses="strong",
            capillary_refill="<2s",
            skin_condition="intact",
            pressure_ulcer_risk=random.randint(15, 20),  # Braden score
            pain_score=random.randint(2, 5),
            pain_location="chest" if condition in ["acute_mi", "post_cardiac_surgery"] else "none",
            mobility=mobility,
            fluid_balance_ml=random.uniform(-500, 500),
            assessment_notes=f"Patient stable on {shifts[i % 3]} shift. Vital signs monitored closely.",
            care_plan_updates="Continue current plan of care. Monitor for changes."
        )
        db.add(assessment)
    db.commit()


def seed(db: Session):
    """Seed the database with patients and comprehensive time-series data."""
    # Seed patients only if not already present
    if db.query(Patient).count() == 0:
        patients = create_patients(db, 15)
        for p in patients:
            condition = getattr(p, 'condition', 'post_surgery')
            create_time_series(db, p, hours=36, step_min=15)
            create_diagnoses(db, p, condition)
            create_procedures(db, p, condition)
            create_medications(db, p, condition)
            create_interventions(db, p, condition)
            create_nursing_assessments(db, p, condition)
        print(f"✔ Database seeded successfully with {len(patients)} patients and comprehensive clinical data")
    else:
        print("✔ Database already contains patient data")

