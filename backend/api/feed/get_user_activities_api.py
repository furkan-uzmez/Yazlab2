from fastapi import APIRouter, HTTPException, status, Query
from typing import Optional

from func.db.connection.open_db_connection import open_db_connection
from func.feed.get_user_activities import get_user_activities

router = APIRouter(prefix="/feed", tags=["feed"])

@router.get("/user_activities")
async def get_user_activities_endpoint(
    user_id: int = Query(..., description="ID of the user whose activities to fetch"),
    viewer_id: Optional[int] = Query(None, description="ID of the user viewing the profile (for like status)"),
    page: int = Query(1, ge=1)
):
    """
    Belirli bir kullanıcının son aktivitelerini getirir.
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )
    
    try:
        activities = get_user_activities(connection, user_id, viewer_id, page)
    except Exception as e:
        print(f"HATA: Kullanıcı aktiviteleri alınamadı: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not get user activities"
        )
    finally:
        connection.close()
    
    return {"user_id": user_id, "activities": activities}
