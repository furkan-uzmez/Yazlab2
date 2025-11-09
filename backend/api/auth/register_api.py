from fastapi import APIRouter
from pydantic import BaseModel

from backend.func.db.connection import open_db_connection
from backend.func.db.insertion import register

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    email: str
    password: str
    username: str


@router.post("/register")
async def register_user(request: RegisterRequest):
    connection = open_db_connection()

    success = register(connection, request.email, request.password, request.username)

    connection.close()

    if success:
        return {"message": "User registered successfully"}
    else:
        return {"message": "Registration failed"}