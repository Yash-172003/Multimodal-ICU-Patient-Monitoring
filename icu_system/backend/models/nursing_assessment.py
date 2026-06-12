from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Float
from sqlalchemy.orm import relationship
from ..database.db import Base
from datetime import datetime

class NursingAssessment(Base):
    __tablename__ = "nursing_assessments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    shift = Column(String)  # day, evening, night
    nurse_name = Column(String)
    
    # Neurological
    consciousness_level = Column(String)  # alert, confused, lethargic, unresponsive
    glasgow_coma_scale = Column(Integer)
    
    # Respiratory
    respiratory_effort = Column(String)  # normal, labored, shallow
    oxygen_therapy = Column(String)
    
    # Cardiovascular
    peripheral_pulses = Column(String)  # strong, weak, absent
    capillary_refill = Column(String)  # <2s, >2s
    
    # Skin
    skin_condition = Column(String)  # intact, breakdown, wounds
    pressure_ulcer_risk = Column(Integer)  # Braden score
    
    # Pain
    pain_score = Column(Integer)  # 0-10
    pain_location = Column(String)
    
    # Activity
    mobility = Column(String)  # bedbound, chair, ambulatory
    
    # Intake/Output
    fluid_balance_ml = Column(Float)
    
    # General notes
    assessment_notes = Column(Text)
    care_plan_updates = Column(Text)

    patient = relationship("Patient", back_populates="nursing_assessments")
