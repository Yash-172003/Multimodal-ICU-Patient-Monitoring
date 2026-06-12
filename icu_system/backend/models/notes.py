from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..database.db import Base
from datetime import datetime

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    text = Column(Text)

    patient = relationship("Patient", back_populates="notes")
