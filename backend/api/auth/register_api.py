from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.auth.register import register_user as register

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    email: str
    password: str
    username: str


@router.post("/register")
async def register_user(request: RegisterRequest):
    connection = open_db_connection()

    try:
        success = register(connection, request.email, request.password, request.username)
    except Exception as e:
        print(f"HATA: Kayıt işlemi başarısız: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration process failed"
        )
    finally:
        connection.close()

    if success:
        return {"message": "User registered successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration failed. User may already exist."
        )