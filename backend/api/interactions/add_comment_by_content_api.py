from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.interactions.add_comment_by_content import add_comment_by_content

router = APIRouter(prefix="/interactions", tags=["interactions"])

class CommentByContentRequest(BaseModel):
    user_email: str
    content_id: str  # Changed to str to support external IDs
    comment_text: str
    title: str = None
    poster_url: str = None
    content_type: str = None


@router.post("/add_comment_by_content")
async def add_comment_by_content_endpoint(request: CommentByContentRequest):
    """
    Bir içeriğe yorum ekler.
    Kullanım: POST /interactions/add_comment_by_content
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )
    
    try:
        added = add_comment_by_content(
            connection,
            request.user_email,
            request.content_id,
            request.comment_text,
            request.title,
            request.poster_url,
            request.content_type
        )
        if added is False:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not add comment"
            )
    except Exception as e:
        print(f"HATA: Yorum eklenemedi: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not add comment"
        )
    finally:
        connection.close()
    
    return {"message": "Comment added successfully"}

