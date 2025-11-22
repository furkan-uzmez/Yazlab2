from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.interactions.add_comments import add_comment as add_comment_func

router = APIRouter(prefix="/interactions", tags=["interactions"])

class CommentRequest(BaseModel):
    user_email: str
    content_id: int
    comment_text: str


@router.post("/add_comment")
async def add_comment(request: CommentRequest):
    """
    Yorum ekler.
    Kullanım: POST /interactions/add_comment
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )
    
    try:
        added = add_comment_func(
            connection,
            request.user_email,
            request.content_id,
            request.comment_text
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