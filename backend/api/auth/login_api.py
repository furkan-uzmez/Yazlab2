from fastapi import APIRouter , HTTPException, status
from pydantic import BaseModel

from func.auth.login_control import login_control
from func.db.connection.open_db_connection import open_db_connection


router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
async def login(request: LoginRequest):
    connection = open_db_connection()

    try:
        is_authenticated = login_control(connection, request.email, request.password)
    except Exception as e:
        print(f"HATA: Giriş işlemi başarısız: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login process failed"
        )
    finally:
        connection.close()

    if is_authenticated:
        return {"email": request.email , "message": "Login successful"}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )