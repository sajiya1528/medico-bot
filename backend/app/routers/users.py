from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import database
from app.models import models
from app.schemas import schemas
from app.core import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.User])
def read_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.get("/profile", response_model=schemas.User)
def read_user_me(current_user: models.User = Depends(deps.get_current_active_user)):
    return current_user
