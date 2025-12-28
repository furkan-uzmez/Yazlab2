from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from func.db.connection.open_db_connection import open_db_connection
from func.interactions.delete_comment import delete_comment

router = APIRouter(prefix="/interactions", tags=["interactions"])

class DeleteCommentRequest(BaseModel):
    comment_id: int
    user_email: str


@router.delete("/delete_comment")
async def delete_comment_endpoint(request: DeleteCommentRequest):
    """
    Bir yorumu siler. Sadece yorum sahibi silebilir.
    Kullanım: DELETE /interactions/delete_comment
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )
    
    try:
        deleted = delete_comment(
            connection,
            request.comment_id,
            request.user_email
        )
        if deleted is False:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not delete comment"
            )
    except Exception as e:
        print(f"HATA: Yorum silinemedi: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not delete comment"
        )
    finally:
        connection.close()
    
    return {"message": "Comment deleted successfully"}

