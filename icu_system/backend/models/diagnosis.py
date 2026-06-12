from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..database.db import Base
from datetime import datetime

class Diagnosis(Base):
    __tablename__ = "diagnoses"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    icd10_code = Column(String, index=True)
    description = Column(String)
    diagnosis_type = Column(String)  # primary, secondary, admission, discharge
    status = Column(String)  # active, resolved, rule-out

    patient = relationship("Patient", back_populates="diagnoses")
