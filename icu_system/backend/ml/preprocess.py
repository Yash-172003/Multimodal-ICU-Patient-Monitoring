import torch
import pandas as pd
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ..models import Vitals, Note

VITAL_FEATURES = [
    "heart_rate",
    "systolic_bp",
    "diastolic_bp",
    "spo2",
    "respiratory_rate",
    "temperature",
]

def vitals_sequence(db: Session, patient_id: int, hours: int = 24):
    end = datetime.utcnow()
    start = end - timedelta(hours=hours)
    q = (
        db.query(Vitals)
        .filter(Vitals.patient_id == patient_id)
        .filter(Vitals.timestamp >= start)
        .order_by(Vitals.timestamp.asc())
        .all()
    )
    if not q:
        seq = torch.zeros((1, len(VITAL_FEATURES)), dtype=torch.float32)
        return seq.unsqueeze(0)
    df = pd.DataFrame([
        {
            "timestamp": v.timestamp,
            **{k: float(getattr(v, k) or 0.0) for k in VITAL_FEATURES},
        }
        for v in q
    ])
    x = torch.tensor(df[VITAL_FEATURES].values, dtype=torch.float32)
    return x.unsqueeze(0)

def latest_note_text(db: Session, patient_id: int, hours: int = 24):
    end = datetime.utcnow()
    start = end - timedelta(hours=hours)
    note = (
        db.query(Note)
        .filter(Note.patient_id == patient_id)
        .filter(Note.timestamp >= start)
        .order_by(Note.timestamp.desc())
        .first()
    )
    if note:
        return note.text
    return ""
