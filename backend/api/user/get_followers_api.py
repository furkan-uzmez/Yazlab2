from fastapi import APIRouter ,  HTTPException, status
from pydantic import BaseModel

from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.user.get_followers import get_followers as get_followers_func

router = APIRouter(prefix="/user", tags=["user"])


@router.get("/{email:path}/followers")
async def get_followers(email: str):
    connection = open_db_connection()
    
    try:
        followers = get_followers_func(connection, email)
    except Exception as e:
        print(f"HATA: Takipçi listesi alınamadı: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve followers list"
        )
    finally:
        connection.close()
    
    
    if followers is None or followers == []:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No followers found for the user"
        )
    

    return {"email": email, "followers": followers}