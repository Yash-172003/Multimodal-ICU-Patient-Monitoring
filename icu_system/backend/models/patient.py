from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from ..database.db import Base
from datetime import datetime

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    mrn = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    gender = Column(String)
    unit = Column(String)
    bed_id = Column(String)
    admitted_at = Column(DateTime, default=datetime.utcnow)

    vitals = relationship("Vitals", back_populates="patient", cascade="all, delete-orphan")
    labs = relationship("Lab", back_populates="patient", cascade="all, delete-orphan")
    notes = relationship("Note", back_populates="patient", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="patient", cascade="all, delete-orphan")
    diagnoses = relationship("Diagnosis", back_populates="patient", cascade="all, delete-orphan")
    procedures = relationship("Procedure", back_populates="patient", cascade="all, delete-orphan")
    medications = relationship("Medication", back_populates="patient", cascade="all, delete-orphan")
    interventions = relationship("Intervention", back_populates="patient", cascade="all, delete-orphan")
    nursing_assessments = relationship("NursingAssessment", back_populates="patient", cascade="all, delete-orphan")
