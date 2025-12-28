from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from func.db.connection.open_db_connection import open_db_connection
from func.feed.like_review import like_review as like_review_func

router = APIRouter(prefix="/feed", tags=["feed"])

class LikeReviewRequest(BaseModel):
    activity_id : int
    username : str

@router.post('/like_review')
async def like_review(request:LikeReviewRequest):
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )
    
    try:
        liked = like_review_func(connection,request.activity_id,request.username)
        if liked is False:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not liked review"
            )
    except Exception as e:
        print(f"HATA: Beğenilemedi: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not liked review"
        )
    finally:
        connection.close()
    
    return {"message": "Liked successfully"}