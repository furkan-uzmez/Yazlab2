from fastapi import APIRouter, HTTPException, status, Query

from backend.func.content.get_popular_movies import (
    get_popular_movies,
    get_top_rated_movies,
    get_now_playing_movies
)
from backend.func.content.get_sorted_content import (
    get_most_commented_movies,
    get_most_added_movies
)
from backend.func.content.get_popular_books import (
    get_popular_books,
    get_new_books
)
from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.interactions.get_content_comment_count import get_content_comment_count
from backend.func.interactions.get_content_list_count import get_content_list_count

router = APIRouter(prefix="/content", tags=["content"])


@router.get("/popular/movies")
async def get_popular_movies_endpoint(
    category: str = Query("popular", description="Category: popular, top-rated, new, most-commented, most-added"),
    page: int = Query(1, ge=1, le=1000)
):
    """
    Popüler filmleri getirir.
    Kullanım: GET /content/popular/movies?category=popular&page=1
    Categories: popular, top-rated, new, most-commented, most-added
    """
    try:
        if category == "popular":
            result = get_popular_movies(page)
        elif category == "top-rated":
            result = get_top_rated_movies(page)
        elif category == "new":
            result = get_now_playing_movies(page)
        elif category == "most-commented":
            result = get_most_commented_movies(page)
        elif category == "most-added":
            result = get_most_added_movies(page)
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid category. Supported: popular, top-rated, new, most-commented, most-added"
            )
        
        if result is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Movies not found"
            )

        # --- Uygulama yorum sayısını ekle (comment_count) ---
        try:
            connection = open_db_connection()
        except Exception as conn_err:
            print(f"Uyarı: get_popular_movies için DB bağlantısı açılamadı: {conn_err}")
            connection = None

        if connection:
            try:
                for movie in result.get("results", []):
                    api_id = str(movie.get("id"))
                    if category != "most-commented":
                        movie["comment_count"] = get_content_comment_count(
                            connection, api_id, "movie"
                        )
                    movie["list_count"] = get_content_list_count(
                        connection, api_id, "movie"
                    )
            finally:
                connection.close()
        # DB yoksa, comment_count frontend'de 0 olarak kalır
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"HATA: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve movies"
        )

from backend.func.content.search_book import search_book


@router.get("/popular/books")
async def get_popular_books_endpoint(
    category: str = Query("popular", description="Category: popular, new"),
    page: int = Query(1, ge=1, description="Page number"),
    max_results: int = Query(20, ge=1, le=40),
    query: str = Query(None, description="Search query")
):
    """
    Popüler kitapları getirir veya arama yapar.
    Kullanım: GET /content/popular/books?category=popular&page=1&max_results=20&query=harry
    Categories: popular, new
    """
    try:
        start_index = (page - 1) * max_results
        
        if query:
            result = search_book(query, max_results, start_index)
        elif category == "popular":
            result = get_popular_books(max_results, start_index)
        elif category == "new":
            result = get_new_books(max_results, start_index)
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

        # --- Uygulama yorum sayısını ekle (comment_count) ---
        # Google Books sonuç yapısı: { items: [ { id, volumeInfo, ... }, ... ] }
        try:
            connection = open_db_connection()
        except Exception as conn_err:
            print(f"Uyarı: get_popular_books için DB bağlantısı açılamadı: {conn_err}")
            connection = None

        if connection:
            try:
                for item in result.get("items", []):
                    api_id = str(item.get("id"))
                    item["comment_count"] = get_content_comment_count(
                        connection, api_id, "book"
                    )
            finally:
                connection.close()

        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"HATA: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve books"
        )

