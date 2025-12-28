from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from func.db.connection.open_db_connection import open_db_connection
from func.feed.get_user_feed import get_user_feed as get_user_feed_func

router = APIRouter(prefix="/feed", tags=["feed"])


@router.get("/search")
async def get_feed(email: str):
    print(f"Kullanıcı beslemesi isteniyor: {email}")
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )
    
    try:
        results = get_user_feed_func(connection, email)
    except Exception as e:
        print(f"HATA: Kullanıcı beslemesi alınamadı: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not get user feed"
        )
    
    if results is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No feed found for the given email"
        )
    
    return {"email": email, "feed": results}