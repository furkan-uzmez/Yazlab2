from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.interactions.rate_content import rate_content

router = APIRouter(prefix="/interactions", tags=["interactions"])

class RateContentRequest(BaseModel):
    user_email: str
    content_id: str
    score: float
    title: str
    poster_url: Optional[str] = None
    content_type: str
    genres: Optional[List[str]] = None

@router.post("/rate_content")
async def rate_content_endpoint(request: RateContentRequest):
    """
    İçeriği puanlar.
    """
    connection = open_db_connection()
    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )

    try:
        success = rate_content(
            connection=connection,
            user_email=request.user_email,
            content_id=request.content_id,
            score=request.score,
            title=request.title,
            poster_url=request.poster_url,
            content_type=request.content_type,
            genres=request.genres
        )

        if success:
            return {"message": "Rating saved successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to save rating"
            )
    except HTTPException:
        raise
    except Exception as e:
        print(f"API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
    finally:
        connection.close()
