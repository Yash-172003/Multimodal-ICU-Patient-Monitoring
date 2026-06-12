from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from ..database.db import Base
from datetime import datetime

class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    intervention_type = Column(String, index=True)  # respiratory, cardiovascular, renal, etc.
    description = Column(String)
    outcome = Column(String)
    details = Column(Text)

    patient = relationship("Patient", back_populates="interventions")
