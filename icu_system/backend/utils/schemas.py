from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PatientBase(BaseModel):
    id: int
    mrn: str
    name: str
    age: int
    gender: str
    unit: str
    bed_id: str
    admitted_at: datetime

    class Config:
        from_attributes = True

class VitalsBase(BaseModel):
    id: int
    patient_id: int
    timestamp: datetime
    heart_rate: float
    systolic_bp: float
    diastolic_bp: float
    spo2: float
    respiratory_rate: float
    temperature: float

    class Config:
        from_attributes = True

class PredictionBase(BaseModel):
    id: int
    patient_id: int
    timestamp: datetime
    risk_score: float
    risk_level: str
    model_version: str

    class Config:
        from_attributes = True

class PatientDetail(PatientBase):
    latest_vitals: Optional[VitalsBase] = None
    latest_prediction: Optional[PredictionBase] = None

class DashboardSummary(BaseModel):
    patient_count: int
    high_risk_count: int
    average_risk: float

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class AlertItem(BaseModel):
    patient_id: int
    name: str
    risk_score: float
    risk_level: str
    message: str
