from fastapi import APIRouter, HTTPException, status

from func.db.connection.open_db_connection import open_db_connection
from func.interactions.get_comments_by_content import get_comments_by_content

router = APIRouter(prefix="/interactions", tags=["interactions"])

@router.get("/get_comments_by_content")
async def get_comments_by_content_endpoint(content_id: str, email: str = None):
    """
    Belirli bir içerik için tüm yorumları getirir.
    Kullanım: GET /interactions/get_comments_by_content?content_id=1&email=user@example.com
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )
    
    try:
        comments = get_comments_by_content(connection, content_id, email)
    except Exception as e:
        print(f"HATA: Yorumlar alınamadı: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve comments"
        )
    finally:
        connection.close()
    
    return {"Message": "Comments found", "comments": comments}

