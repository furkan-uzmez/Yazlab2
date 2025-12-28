from fastapi import APIRouter ,  HTTPException, status
from pydantic import BaseModel

from func.db.connection.open_db_connection import open_db_connection
from func.user.get_user_library import get_user_library as get_user_library_func


router = APIRouter(prefix="/user", tags=["user"])


@router.get("/{user_name}/get_library")
async def get_user_library(user_name: str):
    connection = open_db_connection()
    
    try:
        user_library_data = get_user_library_func(connection,user_name)
    except Exception as e:
        print(f"HATA: Kullanıcı kütüphanesi alınamadı: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve user library"
        )
    finally:
        connection.close()
    
    if user_library_data is not None:
        return {"message": "User found", "user_library_data": user_library_data}
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )