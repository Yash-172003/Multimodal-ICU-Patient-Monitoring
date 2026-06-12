from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..database.db import Base
from datetime import datetime

class Lab(Base):
    __tablename__ = "labs"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    wbc = Column(Float)
    hemoglobin = Column(Float)
    platelets = Column(Float)
    creatinine = Column(Float)
    sodium = Column(Float)
    potassium = Column(Float)
    lactate = Column(Float)

    patient = relationship("Patient", back_populates="labs")
