from fastapi import APIRouter, HTTPException, status, Query

from backend.func.content.get_popular_movies import (
    get_popular_movies,
    get_top_rated_movies,
    get_now_playing_movies
)
from backend.func.content.get_popular_books import (
    get_popular_books,
    get_new_books
)

router = APIRouter(prefix="/content", tags=["content"])

@router.get("/popular/movies")
async def get_popular_movies_endpoint(
    category: str = Query("popular", description="Category: popular, top-rated, new"),
    page: int = Query(1, ge=1, le=1000)
):
    """
    Popüler filmleri getirir.
    Kullanım: GET /content/popular/movies?category=popular&page=1
    Categories: popular, top-rated, new
    """
    try:
        if category == "popular":
            result = get_popular_movies(page)
        elif category == "top-rated":
            result = get_top_rated_movies(page)
        elif category == "new":
            result = get_now_playing_movies(page)
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid category. Supported: popular, top-rated, new"
            )
        
        if result is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Movies not found"
            )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"HATA: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve movies"
        )

@router.get("/popular/books")
async def get_popular_books_endpoint(
    category: str = Query("popular", description="Category: popular, new"),
    max_results: int = Query(40, ge=1, le=40)
):
    """
    Popüler kitapları getirir.
    Kullanım: GET /content/popular/books?category=popular&max_results=40
    Categories: popular, new
    """
    try:
        if category == "popular":
            result = get_popular_books(max_results)
        elif category == "new":
            result = get_new_books(max_results)
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid category. Supported: popular, new"
            )
        
        if result is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Books not found"
            )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"HATA: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve books"
        )

