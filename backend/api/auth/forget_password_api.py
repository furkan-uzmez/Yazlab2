from fastapi import APIRouter
from pydantic import BaseModel


from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.auth.forget_password import send_reset_email,update_password
from backend.func.security.jwt_utils import create_reset_token, validate_reset_token


router = APIRouter(prefix="/auth", tags=["auth"])

class ForgetPasswordRequest(BaseModel):
    email: str

@router.post("/send_forget_password_email")
async def send_forget_password_email(request: ForgetPasswordRequest):
    token = create_reset_token(email=request.email)

    success = await send_reset_email(request.email, token)

    # 2. Sonuca göre cevap döndür
    if success:
        # Başarılı: E-posta gönderildi
        return {"message": f"Password reset link sent to {request.email}"}
    else:
        # Başarısız: E-posta gönderilemedi
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send email. Please try again later."
        )

# Frontend'den gelecek JSON gövdesi için Model ---
class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@router.post("/update_password")
def update_password(request: ResetPasswordRequest):
    try:
        # Bu 'validate_reset_token' sizin JWT'nizi çözen fonksiyon olmalı
        email = validate_reset_token(request.token) 
        if email is None:
            raise Exception("Invalid or expired token")
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid token: {e}"
        )
    
    connection = open_db_connection()
    
    success = update_password(connection,password,email)

    connection.close()
    
    if success:
        return {"message": "Password updated successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update password. Please try again later."
        )