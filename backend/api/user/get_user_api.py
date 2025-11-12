from fastapi import APIRouter ,  HTTPException, status
from pydantic import BaseModel

from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.user.get_user import get_user


router = APIRouter(prefix="/user", tags=["user"])

class UserRequest(BaseModel):
    user_name: str

@router.get("/get_user")
async def get_user(request: UserRequest):
    connection = open_db_connection()
    
    try:
        user_data = get_user(connection, request.user_name)
    except Exception as e:
        print(f"HATA: Kullanıcı alınamadı: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve user"
        )
    finally:
        connection.close()
    
    if user_data is not None:
        return {"message": "User found", "user": user}
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )