from fastapi import APIRouter, HTTPException, status

from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.user.get_following import get_following as get_following_func

router = APIRouter(prefix="/user", tags=["user"])


@router.get("/{email:path}/following")
async def get_following(email: str):
    connection = open_db_connection()
    
    try:
        following = get_following_func(connection, email)
    except Exception as e:
        print(f"HATA: Takip edilenler listesi alınamadı: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve following list"
        )
    finally:
        connection.close()
    
    if following is None:
        return {"email": email, "following": []}
    
    return {"email": email, "following": following}

