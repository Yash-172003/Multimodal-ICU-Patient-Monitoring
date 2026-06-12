from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..models import Patient, Vitals, Prediction
from ..utils.schemas import PatientDetail, PatientBase, VitalsBase, PredictionBase
from typing import List, Optional

router = APIRouter(prefix="/patients", tags=["patients"])

@router.get("/", response_model=List[PatientDetail])
def list_patients(db: Session = Depends(get_db)):
    patients = db.query(Patient).all()
    out: List[PatientDetail] = []
    for p in patients:
        latest_v = (
            db.query(Vitals)
            .filter(Vitals.patient_id == p.id)
            .order_by(Vitals.timestamp.desc())
            .first()
        )
        latest_pred = (
            db.query(Prediction)
            .filter(Prediction.patient_id == p.id)
            .order_by(Prediction.timestamp.desc())
            .first()
        )
        item = PatientDetail(
            id=p.id,
            mrn=p.mrn,
            name=p.name,
            age=p.age,
            gender=p.gender,
            unit=p.unit,
            bed_id=p.bed_id,
            admitted_at=p.admitted_at,
            latest_vitals=VitalsBase.model_validate(latest_v) if latest_v else None,
            latest_prediction=PredictionBase.model_validate(latest_pred) if latest_pred else None,
        )
        out.append(item)
    return out

@router.get("/{patient_id}", response_model=PatientDetail)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    p = db.query(Patient).filter(Patient.id == patient_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")
    latest_v = (
        db.query(Vitals)
        .filter(Vitals.patient_id == p.id)
        .order_by(Vitals.timestamp.desc())
        .first()
    )
    latest_pred = (
        db.query(Prediction)
        .filter(Prediction.patient_id == p.id)
        .order_by(Prediction.timestamp.desc())
        .first()
    )
    return PatientDetail(
        id=p.id,
        mrn=p.mrn,
        name=p.name,
        age=p.age,
        gender=p.gender,
        unit=p.unit,
        bed_id=p.bed_id,
        admitted_at=p.admitted_at,
        latest_vitals=VitalsBase.model_validate(latest_v) if latest_v else None,
        latest_prediction=PredictionBase.model_validate(latest_pred) if latest_pred else None,
    )

@router.get("/{patient_id}/vitals", response_model=List[VitalsBase])
def get_patient_vitals(
    patient_id: int,
    hours: int = Query(24, ge=1, le=168),
    db: Session = Depends(get_db),
):
    from datetime import datetime, timedelta
    start = datetime.utcnow() - timedelta(hours=hours)
    vs = (
        db.query(Vitals)
        .filter(Vitals.patient_id == patient_id)
        .filter(Vitals.timestamp >= start)
        .order_by(Vitals.timestamp.asc())
        .all()
    )
    return [VitalsBase.model_validate(v) for v in vs]

@router.get("/{patient_id}/predictions", response_model=List[PredictionBase])
def get_patient_predictions(
    patient_id: int,
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    preds = (
        db.query(Prediction)
        .filter(Prediction.patient_id == patient_id)
        .order_by(Prediction.timestamp.asc())
        .all()
    )
    if len(preds) > limit:
        preds = preds[-limit:]
    return [PredictionBase.model_validate(p) for p in preds]
