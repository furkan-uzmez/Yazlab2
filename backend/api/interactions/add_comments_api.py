from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from func.db.connection.open_db_connection import open_db_connection
from func.interactions.add_comments import add_comment as add_comment_func

router = APIRouter(prefix="/interactions", tags=["interactions"])

class CommentRequest(BaseModel):
    user_email: str
    activity_id: int  # Activity ID'si ile yorum ekle
    comment_text: str
    just_content: int = 0  # 0: Her yerde, 1: Sadece içerikte


@router.post("/add_comment")
async def add_comment(request: CommentRequest):
    """
    Bir aktiviteye (Activity Card) yorum ekler.
    Kullanım: POST /interactions/add_comment
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )
    
    try:
        new_id = add_comment_func(
            connection,
            request.user_email,
            request.activity_id,
            request.comment_text,
            request.just_content
        )
        if new_id is False:
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
    
    return {"message": "Comment added successfully","new_comment_id": new_id}