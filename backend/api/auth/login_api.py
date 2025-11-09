from fastapi import APIRouter
from pydantic import BaseModel

from backend.func.auth.login_control import login_control
from backend.func.db.connection import open_db_connection


router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
async def login(request: LoginRequest):
    connection = open_db_connection()


    is_authenticated = login_control(connection, request.email, request.password)


    connection.close()

    if is_authenticated:
        return {"message": "Login successful"}
    else:
        return {"message": "Invalid email or password"}