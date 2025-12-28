from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Union

from func.db.connection.open_db_connection import open_db_connection
from func.feed.add_review import add_review

router = APIRouter(prefix="/feed", tags=["feed"])

class AddReviewRequest(BaseModel):
    user_email: str
    content_id: Union[int, str]  # Google Books için string, TMDB için int olabilir
    review_text: str
    content_title: str = None
    content_type: str = None
    cover_url: str = None
    api_id: str = None
    rating_score: float = None

@router.post("/add_review")
async def add_review_endpoint(request: AddReviewRequest):
    """
    Bir içeriğe yorum (review) ekler.
    Kullanım: POST /feed/add_review
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )
    
    try:
        activity_id = add_review(
            connection,
            request.user_email,
            request.content_id,
            request.review_text,
            request.content_title,
            request.content_type,
            request.cover_url,
            request.api_id,
            request.rating_score
        )
        if activity_id is False:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not add review"
            )
    except Exception as e:
        print(f"HATA: Review eklenemedi: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not add review"
        )
    finally:
        connection.close()
    
    return {"message": "Review added successfully", "activity_id": activity_id}

