from fastapi import APIRouter, HTTPException, status , Query
from pydantic import BaseModel

from backend.func.content.search_movie import search_movie as search_movie_func
from backend.func.content.search_book import search_book as search_book_func

router = APIRouter(prefix="/content", tags=["content"])


@router.get("/search")
async def search(
    query: str = Query(...),
    api_type: str = Query(...)
):
    print(f"INFO: İçerik araması yapılıyor: {query} için {api_type}")

    try:
        if api_type == "movie":
            results = search_movie_func(query)
        elif api_type == "book":
            results = search_book_func(query)
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid api_type. Supported: movie, book."
            )
    except Exception as e:
        print(f"HATA: {e}")
        raise HTTPException(500, "Could not perform content search")

    if results is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No content found for the given username"
        )

    return {"query": query, "results": results}