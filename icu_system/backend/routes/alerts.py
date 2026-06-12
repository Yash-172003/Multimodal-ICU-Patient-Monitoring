from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..models import Prediction
from ..utils.schemas import AlertItem
from typing import List

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("/", response_model=List[AlertItem])
def alerts(db: Session = Depends(get_db)):
    latest = {}
    for pid, ts, rs, rl in db.query(Prediction.patient_id, Prediction.timestamp, Prediction.risk_score, Prediction.risk_level).all():
        if pid not in latest or ts > latest[pid][0]:
            latest[pid] = (ts, rs, rl)
    items: List[AlertItem] = []
    for pid, (ts, rs, rl) in latest.items():
        if rl == "high":
            items.append(AlertItem(
                patient_id=pid,
                name=f"Patient {pid}",
                risk_score=float(rs),
                risk_level=rl,
                message="High risk predicted in next 24–36h. Escalate monitoring.",
            ))
    return items
