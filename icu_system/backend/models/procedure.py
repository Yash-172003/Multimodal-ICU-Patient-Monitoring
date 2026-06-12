from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from ..database.db import Base
from datetime import datetime

class Procedure(Base):
    __tablename__ = "procedures"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    cpt_code = Column(String, index=True)
    description = Column(String)
    procedure_type = Column(String)  # diagnostic, therapeutic, surgical
    duration_minutes = Column(Float)
    outcome = Column(String)  # successful, complicated, aborted

    patient = relationship("Patient", back_populates="procedures")
