from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.interactions.get_comments import get_comments as get_comments_func

router = APIRouter(prefix="/interactions", tags=["interactions"])

@router.get("/get_all_comments")
async def get_comments():
    """
    Belirli bir aktiviteye ait yorumları getirir.
    Kullanım: GET /interactions/get_comments/{activity_id}
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )
    
    try:
        comments = get_comments_func(connection)
    except Exception as e:
        print(f"HATA: Yorumlar alınamadı: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve comments"
        )
    finally:
        connection.close()

    if comments is False:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No comments found for the given activity"
        )
    
    return {"Message": "Comments found", "comments": comments}
    