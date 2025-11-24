from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.interactions.update_comments import update_comment as update_comment_func

router = APIRouter(prefix="/interactions", tags=["interactions"])

# İstek Gövdesi Modeli
class UpdateCommentRequest(BaseModel):
    comment_id: int
    username: str  # Yorumu kimin düzenlediğini doğrulamak için
    new_text: str

@router.put("/update_comment")
async def update_comment(request: UpdateCommentRequest):
    """
    Var olan bir yorumu günceller.
    Kullanım: PUT /interactions/update_comment
    Body: { "comment_id": 15, "username": "mehmet123", "new_text": "Yeni yorumum..." }
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection failed"
        )
    
    try:
        success = update_comment_func(
            connection, 
            request.comment_id, 
            request.username, 
            request.new_text
        )
        
        if not success:
            # İşlem başarısızsa (yetki yoksa veya yorum yoksa)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update comment (Check permissions or if comment exists)"
            )
            
    except Exception as e:
        print(f"API Hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )
    finally:
        connection.close()
    
    return {"message": "Comment updated successfully"}