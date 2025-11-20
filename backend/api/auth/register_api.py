from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.auth.register import register_user as register
from database.follow_everyone import follow_everyone as follow_all_users
from database.make_everyone_follow_me import make_them_follow_me

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
        follow_all_users(request.email) # test amaçlı daha sonra kaldırılacak
        make_them_follow_me(request.email) # test amaçlı daha sonra kaldırılacak
        return {"message": "User registered successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration failed. User may already exist."
        )