from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Boolean
from sqlalchemy.orm import relationship
from ..database.db import Base
from datetime import datetime

class Medication(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    medication_name = Column(String, index=True)
    dosage = Column(String)
    route = Column(String)  # IV, PO, IM, SC, etc.
    frequency = Column(String)  # q4h, q6h, PRN, etc.
    indication = Column(String)
    status = Column(String)  # active, discontinued, completed
    administered = Column(Boolean, default=False)

    patient = relationship("Patient", back_populates="medications")
