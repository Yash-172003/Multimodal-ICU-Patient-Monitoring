import torch
from sqlalchemy.orm import Session
from ..database.db import SessionLocal
from .models import CombinedModel, ClinicalBERTEncoder
from .preprocess import vitals_sequence, latest_note_text
from ..models import Prediction, Patient
from datetime import datetime
import asyncio
from concurrent.futures import ThreadPoolExecutor

MODEL_PATH = "backend/ml/checkpoints/model.pt"
MODEL_VERSION = "1.0.0"

_device = torch.device("cpu")
_model = None
_text = None
_model_loading = False
_executor = ThreadPoolExecutor(max_workers=2)

def _load_models():
    """Load ML models (can be slow on first run due to HF download)"""
    global _model, _text, _model_loading
    if _model is not None:
        return True
    
    if _model_loading:
        # Already loading in another thread
        return False
        
    try:
        _model_loading = True
        print("⏳ Loading ML models (this may take 30-60 seconds on first run)...")
        
        _model = CombinedModel()
        try:
            state_dict = torch.load(MODEL_PATH, map_location=_device, weights_only=False)
            _model.load_state_dict(state_dict)
            print("✓ Loaded trained model weights")
        except Exception as e:
            print(f"⚠ Using untrained model (checkpoint not found: {e})")
        _model.eval()
        
        _text = ClinicalBERTEncoder()
        print("✓ ML models loaded successfully")
        return True
    except Exception as e:
        print(f"✗ Error loading ML models: {e}")
        return False
    finally:
        _model_loading = False

@torch.no_grad()
def predict_patient(db: Session, patient_id: int) -> Prediction:
    """Generate risk prediction for a patient"""
    # Always use heuristic prediction for now (ML models cause blocking)
    # TODO: Implement async model loading in background
    return _heuristic_prediction(db, patient_id)
    
    # ML model code disabled to prevent blocking
    # if not _load_models():
    #     return _heuristic_prediction(db, patient_id)
    # 
    # try:
    #     x = vitals_sequence(db, patient_id)
    #     note = latest_note_text(db, patient_id)
    #     if note == "":
    #         note = "no clinical note"
    #     
    #     text_emb = _text.encode([note])
    #     score = _model(x, text_emb).item()
    # except Exception as e:
    #     print(f"⚠ Prediction error for patient {patient_id}: {e}")
    #     return _heuristic_prediction(db, patient_id)
    # 
    # level = "low"
    # if score >= 0.7:
    #     level = "high"
    # elif score >= 0.4:
    #     level = "medium"
    # 
    # pred = Prediction(
    #     patient_id=patient_id,
    #     timestamp=datetime.utcnow(),
    #     risk_score=float(score),
    #     risk_level=level,
    #     model_version=MODEL_VERSION,
    # )
    # db.add(pred)
    # db.commit()
    # db.refresh(pred)
    # return pred

def _heuristic_prediction(db: Session, patient_id: int) -> Prediction:
    """Simple heuristic-based prediction when ML model is not available"""
    from ..models import Vitals
    import random
    
    # Get latest vitals
    latest_v = (
        db.query(Vitals)
        .filter(Vitals.patient_id == patient_id)
        .order_by(Vitals.timestamp.desc())
        .first()
    )
    
    if not latest_v:
        score = 0.3
    else:
        # Simple scoring based on vital sign abnormalities
        score = 0.0
        
        # Heart rate (normal: 60-100)
        if latest_v.heart_rate < 50 or latest_v.heart_rate > 120:
            score += 0.15
        elif latest_v.heart_rate < 60 or latest_v.heart_rate > 100:
            score += 0.05
        
        # Systolic BP (normal: 90-140)
        if latest_v.systolic_bp < 85 or latest_v.systolic_bp > 160:
            score += 0.20
        elif latest_v.systolic_bp < 90 or latest_v.systolic_bp > 140:
            score += 0.10
        
        # SpO2 (normal: >95%)
        if latest_v.spo2 < 88:
            score += 0.25
        elif latest_v.spo2 < 92:
            score += 0.15
        elif latest_v.spo2 < 95:
            score += 0.05
        
        # Respiratory rate (normal: 12-20)
        if latest_v.respiratory_rate < 8 or latest_v.respiratory_rate > 30:
            score += 0.15
        elif latest_v.respiratory_rate < 12 or latest_v.respiratory_rate > 24:
            score += 0.08
        
        # Temperature (normal: 36.5-37.5)
        if latest_v.temperature < 35.5 or latest_v.temperature > 39.0:
            score += 0.15
        elif latest_v.temperature < 36.0 or latest_v.temperature > 38.0:
            score += 0.05
        
        # Add small random variation
        score += random.uniform(-0.05, 0.05)
        score = max(0.0, min(1.0, score))  # Clamp to [0, 1]
    
    level = "low"
    if score >= 0.7:
        level = "high"
    elif score >= 0.4:
        level = "medium"
    
    pred = Prediction(
        patient_id=patient_id,
        timestamp=datetime.utcnow(),
        risk_score=float(score),
        risk_level=level,
        model_version="heuristic-1.0",
    )
    db.add(pred)
    db.commit()
    db.refresh(pred)
    return pred

async def predict_all_patients():
    """Predict risk for all patients (used by scheduler)"""
    db = SessionLocal()
    try:
        ids = [p.id for p in db.query(Patient).all()]
        for pid in ids:
            try:
                predict_patient(db, pid)
            except Exception as e:
                print(f"Error predicting patient {pid}: {e}")
    finally:
        db.close()
