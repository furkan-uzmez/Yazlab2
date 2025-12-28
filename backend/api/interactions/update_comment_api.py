from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from func.db.connection.open_db_connection import open_db_connection
from func.interactions.update_comment import update_comment

router = APIRouter(prefix="/interactions", tags=["interactions"])

class UpdateCommentRequest(BaseModel):
    comment_id: int
    user_email: str
    new_text: str


@router.put("/update_comment")
async def update_comment_endpoint(request: UpdateCommentRequest):
    """
    Bir yorumu günceller. Sadece yorum sahibi güncelleyebilir.
    Kullanım: PUT /interactions/update_comment
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )
    
    try:
        updated = update_comment(
            connection,
            request.comment_id,
            request.user_email,
            request.new_text
        )
        if updated is False:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not update comment"
            )
    except Exception as e:
        print(f"HATA: Yorum güncellenemedi: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not update comment"
        )
    finally:
        connection.close()
    
    return {"message": "Comment updated successfully"}

