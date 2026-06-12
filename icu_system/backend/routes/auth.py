from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(req: LoginRequest):
    if req.username == "admin" and req.password == "admin":
        return {"token": "mock-token-123"}
    raise HTTPException(status_code=401, detail="Invalid credentials")
