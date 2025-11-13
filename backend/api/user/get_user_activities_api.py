from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.user.get_user_activities import get_user_activities as get_user_activities_func


router = APIRouter(prefix="/user", tags=["user"])

@router.get("/{username}/activities")
async def get_user_activities(username: str):
    connection = open_db_connection()

    try:
        activities = get_user_activities_func(connection, username)
    except Exception as e:
        print(f"HATA: Kullanıcı aktiviteleri alınamadı: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve user activities"
        )
    finally:
        connection.close()

    return {"username": username, "activities": activities}