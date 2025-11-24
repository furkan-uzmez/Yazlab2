from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Union

from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.feed.add_rating import add_rating

router = APIRouter(prefix="/feed", tags=["feed"])

class AddRatingRequest(BaseModel):
    user_email: str
    content_id: Union[int, str]  # Google Books için string, TMDB için int olabilir
    score: float
    content_title: str = None
    content_type: str = None
    cover_url: str = None
    api_id: str = None

@router.post("/add_rating")
async def add_rating_endpoint(request: AddRatingRequest):
    """
    Bir içeriğe puan ekler.
    Kullanım: POST /feed/add_rating
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )
    
    try:
        activity_id = add_rating(
            connection,
            request.user_email,
            request.content_id,
            request.score,
            request.content_title,
            request.content_type,
            request.cover_url,
            request.api_id
        )
        if activity_id is False:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not add rating"
            )
    except Exception as e:
        print(f"HATA: Rating eklenemedi: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not add rating"
        )
    finally:
        connection.close()
    
    return {"message": "Rating added successfully", "activity_id": activity_id}

