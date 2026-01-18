from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import database
from app.models import models
from app.schemas import schemas
from app.core import deps

router = APIRouter()

@router.post("/", response_model=schemas.Appointment)
def create_appointment(
    appointment: schemas.AppointmentCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    db_appointment = models.Appointment(
        **appointment.dict(),
        patient_id=current_user.id
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

@router.get("/", response_model=List[schemas.Appointment])
def read_appointments(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    if current_user.role == 'patient':
        return db.query(models.Appointment).filter(models.Appointment.patient_id == current_user.id).all()
    elif current_user.role == 'doctor':
        return db.query(models.Appointment).filter(models.Appointment.doctor_id == current_user.id).all()
    # Admin sees all
    return db.query(models.Appointment).all()

@router.put("/{appointment_id}", response_model=schemas.Appointment)
def update_appointment(
    appointment_id: int,
    status_update: schemas.AppointmentUpdateStatus,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appointment.status = status_update.status
    db.commit()
    db.refresh(appointment)
    return appointment

@router.get("/{appointment_id}", response_model=schemas.Appointment)
def read_appointment(
    appointment_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Optional: Check permissions (if user allowed to view this appointment)
    if current_user.role == 'patient' and appointment.patient_id != current_user.id:
         raise HTTPException(status_code=403, detail="Not authorized")
    if current_user.role == 'doctor' and appointment.doctor_id != current_user.id:
         raise HTTPException(status_code=403, detail="Not authorized")
         
    return appointment

@router.delete("/{appointment_id}")
def delete_appointment(
    appointment_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    db.delete(appointment)
    db.commit()
    return {"ok": True}
