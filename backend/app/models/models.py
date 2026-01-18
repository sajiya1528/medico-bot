from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    role = Column(String)  # 'admin', 'doctor', 'patient'
    is_active = Column(Boolean, default=True)

    appointments_patient = relationship("Appointment", back_populates="patient", foreign_keys="Appointment.patient_id")
    appointments_doctor = relationship("Appointment", back_populates="doctor", foreign_keys="Appointment.doctor_id")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)  # Storing as string for simplicity with frontend ISO format
    time_slot = Column(String)
    status = Column(String, default="pending")  # pending, confirmed, completed, cancelled
    symptoms = Column(String, nullable=True)
    
    patient_id = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("users.id"))

    patient = relationship("User", back_populates="appointments_patient", foreign_keys=[patient_id])
    doctor = relationship("User", back_populates="appointments_doctor", foreign_keys=[doctor_id])
    
    created_at = Column(DateTime, default=datetime.utcnow)
