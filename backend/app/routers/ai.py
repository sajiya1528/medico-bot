from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class SymptomRequest(BaseModel):
    symptoms: List[str]

@router.post("/chat")
def chat(request: ChatRequest):
    message = request.message.lower()
    response = "I'm sorry, I didn't understand that."
    
    if 'hello' in message:
        response = "Hello! I am Medico Bot. How can I help you?"
    elif 'headache' in message:
        response = "For headache, try resting and drinking water."
    elif 'appointment' in message:
        response = "You can book an appointment in the dashboard."
        
    return {"response": response}

@router.post("/symptoms")
def check_symptoms(request: SymptomRequest):
    s = [sym.lower() for sym in request.symptoms]
    diagnosis = "Unsure. Please consult a doctor."
    
    if 'fever' in s and 'cough' in s:
        diagnosis = "Possible Flu or Viral Infection."
    elif 'headache' in s:
        diagnosis = "Possible Migraine or Tension Headache."
        
    return {"diagnosis": diagnosis, "advice": "Please see a doctor for confirmation."}
