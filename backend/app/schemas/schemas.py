from typing import List, Optional
from pydantic import BaseModel

# Token
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User
class UserBase(BaseModel):
    email: str
    name: Optional[str] = None
    role: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True # updated for pydantic v2

class UserLogin(BaseModel):
    email: str
    password: str

# Appointment
class AppointmentBase(BaseModel):
    date: str
    time_slot: str
    symptoms: Optional[str] = None
    doctor_id: int

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdateStatus(BaseModel):
    status: str

class Appointment(AppointmentBase):
    id: int
    status: str
    patient_id: int
    # including simple user info if needed, or separate it
    patient: Optional[User] = None
    doctor: Optional[User] = None

    class Config:
        from_attributes = True
