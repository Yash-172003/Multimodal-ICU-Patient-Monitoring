from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database.db import get_db
from ..models import Patient, Prediction, Vitals, Diagnosis, Medication, Intervention
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from collections import defaultdict

router = APIRouter(prefix="/analytics", tags=["analytics"])


class PopulationStats(BaseModel):
    total_patients: int
    average_age: float
    gender_distribution: Dict[str, int]
    unit_distribution: Dict[str, int]
    average_risk_score: float
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int


class RiskTrend(BaseModel):
    date: str
    average_risk: float
    high_risk_count: int
    patient_count: int


class DiagnosisStats(BaseModel):
    icd10_code: str
    description: str
    patient_count: int
    average_risk: float


class TreatmentEfficacy(BaseModel):
    medication_name: str
    patient_count: int
    average_initial_risk: float
    average_final_risk: float
    improvement_percentage: float


class TemporalPattern(BaseModel):
    hour: int
    average_heart_rate: float
    average_bp: float
    average_spo2: float
    deterioration_count: int


@router.get("/population-stats", response_model=PopulationStats)
def get_population_stats(db: Session = Depends(get_db)):
    """Get overall population statistics"""
    patients = db.query(Patient).all()
    
    if not patients:
        return PopulationStats(
            total_patients=0, average_age=0, gender_distribution={},
            unit_distribution={}, average_risk_score=0,
            high_risk_count=0, medium_risk_count=0, low_risk_count=0
        )
    
    # Basic demographics
    total = len(patients)
    avg_age = sum(p.age for p in patients) / total
    
    gender_dist = defaultdict(int)
    unit_dist = defaultdict(int)
    for p in patients:
        gender_dist[p.gender] += 1
        unit_dist[p.unit] += 1
    
    # Risk statistics
    latest_preds = {}
    for pred in db.query(Prediction).all():
        if pred.patient_id not in latest_preds or pred.timestamp > latest_preds[pred.patient_id].timestamp:
            latest_preds[pred.patient_id] = pred
    
    risk_scores = [p.risk_score for p in latest_preds.values()]
    avg_risk = sum(risk_scores) / len(risk_scores) if risk_scores else 0
    
    high = sum(1 for p in latest_preds.values() if p.risk_level == "high")
    medium = sum(1 for p in latest_preds.values() if p.risk_level == "medium")
    low = sum(1 for p in latest_preds.values() if p.risk_level == "low")
    
    return PopulationStats(
        total_patients=total,
        average_age=avg_age,
        gender_distribution=dict(gender_dist),
        unit_distribution=dict(unit_dist),
        average_risk_score=avg_risk,
        high_risk_count=high,
        medium_risk_count=medium,
        low_risk_count=low
    )


@router.get("/risk-trends", response_model=List[RiskTrend])
def get_risk_trends(
    days: int = Query(7, ge=1, le=30),
    db: Session = Depends(get_db)
):
    """Get risk score trends over time"""
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    
    predictions = db.query(Prediction).filter(
        Prediction.timestamp >= start_date
    ).all()
    
    # Group by date
    daily_data = defaultdict(lambda: {"risks": [], "high_count": 0})
    for pred in predictions:
        date_key = pred.timestamp.date().isoformat()
        daily_data[date_key]["risks"].append(pred.risk_score)
        if pred.risk_level == "high":
            daily_data[date_key]["high_count"] += 1
    
    trends = []
    for date_str in sorted(daily_data.keys()):
        data = daily_data[date_str]
        avg_risk = sum(data["risks"]) / len(data["risks"]) if data["risks"] else 0
        trends.append(RiskTrend(
            date=date_str,
            average_risk=avg_risk,
            high_risk_count=data["high_count"],
            patient_count=len(data["risks"])
        ))
    
    return trends


@router.get("/diagnosis-correlation", response_model=List[DiagnosisStats])
def get_diagnosis_risk_correlation(db: Session = Depends(get_db)):
    """Analyze risk scores by diagnosis"""
    diagnoses = db.query(Diagnosis).filter(Diagnosis.status == "active").all()
    
    # Get latest predictions
    latest_preds = {}
    for pred in db.query(Prediction).all():
        if pred.patient_id not in latest_preds or pred.timestamp > latest_preds[pred.patient_id].timestamp:
            latest_preds[pred.patient_id] = pred
    
    # Group by diagnosis code
    diag_data = defaultdict(lambda: {"patients": set(), "risks": []})
    for diag in diagnoses:
        key = f"{diag.icd10_code}:{diag.description}"
        diag_data[key]["patients"].add(diag.patient_id)
        if diag.patient_id in latest_preds:
            diag_data[key]["risks"].append(latest_preds[diag.patient_id].risk_score)
    
    results = []
    for diag_key, data in diag_data.items():
        code, desc = diag_key.split(":", 1)
        avg_risk = sum(data["risks"]) / len(data["risks"]) if data["risks"] else 0
        results.append(DiagnosisStats(
            icd10_code=code,
            description=desc,
            patient_count=len(data["patients"]),
            average_risk=avg_risk
        ))
    
    return sorted(results, key=lambda x: x.average_risk, reverse=True)


@router.get("/treatment-efficacy", response_model=List[TreatmentEfficacy])
def analyze_treatment_efficacy(db: Session = Depends(get_db)):
    """Analyze treatment effectiveness by comparing risk scores before/after"""
    medications = db.query(Medication).filter(Medication.status == "active").all()
    
    # Group by medication
    med_data = defaultdict(lambda: {"patients": set(), "initial": [], "final": []})
    
    for med in medications:
        # Get predictions before and after medication
        preds = db.query(Prediction).filter(
            Prediction.patient_id == med.patient_id
        ).order_by(Prediction.timestamp).all()
        
        if len(preds) < 2:
            continue
        
        # Find predictions around medication time
        before = [p for p in preds if p.timestamp < med.timestamp]
        after = [p for p in preds if p.timestamp > med.timestamp]
        
        if before and after:
            med_data[med.medication_name]["patients"].add(med.patient_id)
            med_data[med.medication_name]["initial"].append(before[-1].risk_score)
            med_data[med.medication_name]["final"].append(after[0].risk_score)
    
    results = []
    for med_name, data in med_data.items():
        if not data["initial"] or not data["final"]:
            continue
        
        avg_initial = sum(data["initial"]) / len(data["initial"])
        avg_final = sum(data["final"]) / len(data["final"])
        improvement = ((avg_initial - avg_final) / avg_initial * 100) if avg_initial > 0 else 0
        
        results.append(TreatmentEfficacy(
            medication_name=med_name,
            patient_count=len(data["patients"]),
            average_initial_risk=avg_initial,
            average_final_risk=avg_final,
            improvement_percentage=improvement
        ))
    
    return sorted(results, key=lambda x: x.improvement_percentage, reverse=True)


@router.get("/temporal-patterns", response_model=List[TemporalPattern])
def analyze_temporal_patterns(
    hours: int = Query(24, ge=1, le=168),
    db: Session = Depends(get_db)
):
    """Identify temporal patterns in vital signs and deterioration"""
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(hours=hours)
    
    vitals = db.query(Vitals).filter(Vitals.timestamp >= start_time).all()
    
    # Group by hour
    hourly_data = defaultdict(lambda: {
        "hr": [], "sbp": [], "spo2": [], "deterioration": 0
    })
    
    for v in vitals:
        hour = v.timestamp.hour
        hourly_data[hour]["hr"].append(v.heart_rate)
        hourly_data[hour]["sbp"].append(v.systolic_bp)
        hourly_data[hour]["spo2"].append(v.spo2)
        
        # Count deterioration events (abnormal vitals)
        if v.heart_rate > 120 or v.systolic_bp < 90 or v.spo2 < 90:
            hourly_data[hour]["deterioration"] += 1
    
    patterns = []
    for hour in range(24):
        if hour in hourly_data:
            data = hourly_data[hour]
            patterns.append(TemporalPattern(
                hour=hour,
                average_heart_rate=sum(data["hr"]) / len(data["hr"]) if data["hr"] else 0,
                average_bp=sum(data["sbp"]) / len(data["sbp"]) if data["sbp"] else 0,
                average_spo2=sum(data["spo2"]) / len(data["spo2"]) if data["spo2"] else 0,
                deterioration_count=data["deterioration"]
            ))
    
    return patterns


@router.get("/retrospective-summary")
def get_retrospective_summary(
    patient_id: Optional[int] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    days: Optional[int] = 30,
    db: Session = Depends(get_db)
):
    """Comprehensive retrospective analysis for a patient or population"""
    filters = []
    
    if patient_id:
        filters.append(Patient.id == patient_id)
    
    patients = db.query(Patient).filter(*filters).all() if filters else db.query(Patient).all()
    
    # Calculate aggregate statistics
    total_diagnoses = 0
    total_procedures = 0
    total_interventions = 0
    total_medications = 0
    high_risk_count = 0
    total_risk_sum = 0
    risk_count = 0
    patients_with_improvement = 0
    total_improvement = 0
    
    # Track most common diagnoses and procedures
    diagnosis_counts = {}
    procedure_counts = {}
    
    patient_details = []
    for patient in patients:
        # Count diagnoses
        for d in patient.diagnoses:
            total_diagnoses += 1
            key = (d.icd10_code, d.description)
            diagnosis_counts[key] = diagnosis_counts.get(key, 0) + 1
        
        # Count procedures
        for p in patient.procedures:
            total_procedures += 1
            key = (p.cpt_code, p.description)
            procedure_counts[key] = procedure_counts.get(key, 0) + 1
        
        # Count interventions and medications
        total_interventions += len(patient.interventions)
        active_meds = [m for m in patient.medications if m.status == "active"]
        total_medications += len(active_meds)
        
        # Calculate risk metrics
        predictions = sorted(patient.predictions, key=lambda x: x.timestamp)
        if predictions:
            latest_risk = predictions[-1].risk_score
            total_risk_sum += latest_risk
            risk_count += 1
            
            if latest_risk >= 0.7:
                high_risk_count += 1
            
            # Calculate improvement
            if len(predictions) >= 2:
                initial_risk = predictions[0].risk_score
                final_risk = predictions[-1].risk_score
                if initial_risk > 0:
                    improvement = ((initial_risk - final_risk) / initial_risk) * 100
                    total_improvement += improvement
                    patients_with_improvement += 1
        
        patient_summary = {
            "id": patient.id,
            "name": patient.name,
            "age": patient.age,
            "diagnoses": [{"code": d.icd10_code, "desc": d.description} 
                         for d in patient.diagnoses],
            "procedures": [{"code": p.cpt_code, "desc": p.description} 
                          for p in patient.procedures],
            "medications": [m.medication_name for m in active_meds],
            "interventions": len(patient.interventions),
            "risk_trajectory": [{"time": p.timestamp.isoformat(), "risk": p.risk_score} 
                               for p in predictions],
            "nursing_assessments": len(patient.nursing_assessments)
        }
        patient_details.append(patient_summary)
    
    # Calculate averages
    avg_risk = (total_risk_sum / risk_count * 100) if risk_count > 0 else 0
    avg_improvement = total_improvement / patients_with_improvement if patients_with_improvement > 0 else 0
    high_risk_pct = (high_risk_count / len(patients) * 100) if patients else 0
    treatment_coverage = (total_medications / len(patients) * 100) if patients else 0
    
    # Get top diagnoses and procedures
    top_diagnoses = sorted(diagnosis_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    top_procedures = sorted(procedure_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    
    summary = {
        "patient_count": len(patients),
        "total_patients": len(patients),
        "analysis_period": {
            "start": start_date or "all_time",
            "end": end_date or datetime.utcnow().isoformat()
        },
        "total_diagnoses": total_diagnoses,
        "total_procedures": total_procedures,
        "total_interventions": total_interventions,
        "high_risk_patients": high_risk_count,
        "high_risk_percentage": high_risk_pct,
        "average_risk_score": avg_risk,
        "risk_improvement": avg_improvement,
        "treatment_coverage": treatment_coverage if total_medications > 0 else 0,
        "most_common_diagnoses": [
            {"icd10_code": k[0], "description": k[1], "count": v}
            for k, v in top_diagnoses
        ],
        "most_frequent_procedures": [
            {"cpt_code": k[0], "description": k[1], "count": v}
            for k, v in top_procedures
        ],
        "patients": patient_details
    }
    
    return summary
