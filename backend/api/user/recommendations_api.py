from fastapi import APIRouter, HTTPException, status, Query
from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.user.recommendations import get_recommended_users

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/recommendations")
async def get_recommendations(user_id: int = Query(..., description="ID of the current user")):
    """
    Get recommended users for the current user.
    """
    connection = open_db_connection()
    
    try:
        recommendations = get_recommended_users(connection, user_id)
    except Exception as e:
        print(f"HATA: Önerilen kullanıcılar alınamadı: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve recommendations"
        )
    finally:
        connection.close()
    
    return recommendations
