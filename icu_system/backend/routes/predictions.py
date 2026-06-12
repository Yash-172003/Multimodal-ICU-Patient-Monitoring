from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..ml.predict import predict_patient
from ..models import Patient
from ..utils.schemas import PredictionBase

router = APIRouter(prefix="/predict", tags=["predict"])

@router.post("/{patient_id}", response_model=PredictionBase)
async def predict_endpoint(patient_id: int, db: Session = Depends(get_db)):
    p = db.query(Patient).filter(Patient.id == patient_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")
    pred = predict_patient(db, patient_id)
    return PredictionBase.model_validate(pred)
