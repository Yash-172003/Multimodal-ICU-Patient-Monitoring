from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..models import Patient, Prediction
from ..utils.schemas import DashboardSummary

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/", response_model=DashboardSummary)
def dashboard_summary(db: Session = Depends(get_db)):
    patient_count = db.query(Patient).count()
    latest = {}
    for pid, ts, rs, rl in db.query(Prediction.patient_id, Prediction.timestamp, Prediction.risk_score, Prediction.risk_level).all():
        if pid not in latest or ts > latest[pid][0]:
            latest[pid] = (ts, rs, rl)
    preds = list(latest.values())
    high_risk_count = sum(1 for _, _, rl in preds if rl == "high")
    if preds:
        avg = sum(rs for _, rs, _ in preds) / len(preds)
    else:
        avg = 0.0
    return DashboardSummary(patient_count=patient_count, high_risk_count=high_risk_count, average_risk=avg)
