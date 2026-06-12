import asyncio
import random
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..utils.ws import manager
from ..models import Vitals

router = APIRouter()

@router.websocket("/ws/vitals/{patient_id}")
async def ws_vitals(websocket: WebSocket, patient_id: int, db: Session = Depends(get_db)):
    key = f"patient:{patient_id}"
    await manager.connect(key, websocket)
    try:
        while True:
            latest = (
                db.query(Vitals)
                .filter(Vitals.patient_id == patient_id)
                .order_by(Vitals.timestamp.desc())
                .first()
            )
            if latest:
                hr = max(40.0, min(160.0, (latest.heart_rate or 80.0) + random.uniform(-3, 3)))
                sbp = max(70.0, min(180.0, (latest.systolic_bp or 110.0) + random.uniform(-4, 4)))
                dbp = max(40.0, min(120.0, (latest.diastolic_bp or 70.0) + random.uniform(-3, 3)))
                spo2 = max(80.0, min(100.0, (latest.spo2 or 98.0) + random.uniform(-1, 1)))
                rr = max(8.0, min(40.0, (latest.respiratory_rate or 16.0) + random.uniform(-2, 2)))
                temp = max(35.0, min(41.0, (latest.temperature or 37.0) + random.uniform(-0.2, 0.2)))
            else:
                hr, sbp, dbp, spo2, rr, temp = 80.0, 110.0, 70.0, 98.0, 16.0, 37.0
            v = Vitals(
                patient_id=patient_id,
                heart_rate=hr,
                systolic_bp=sbp,
                diastolic_bp=dbp,
                spo2=spo2,
                respiratory_rate=rr,
                temperature=temp,
            )
            db.add(v)
            db.commit()
            db.refresh(v)
            await manager.send_json(key, {
                "id": v.id,
                "patient_id": v.patient_id,
                "timestamp": v.timestamp.isoformat(),
                "heart_rate": v.heart_rate,
                "systolic_bp": v.systolic_bp,
                "diastolic_bp": v.diastolic_bp,
                "spo2": v.spo2,
                "respiratory_rate": v.respiratory_rate,
                "temperature": v.temperature,
            })
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        manager.disconnect(key)
    except Exception:
        manager.disconnect(key)
