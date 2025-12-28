from fastapi import APIRouter, HTTPException, status , Query
from pydantic import BaseModel

from func.content.search_movie import search_movie as search_movie_func
from func.content.search_book import search_book as search_book_func

router = APIRouter(prefix="/content", tags=["content"])


@router.get("/search")
async def search(
    query: str = Query(...),
    api_type: str = Query(...)
):
    print(f"INFO: İçerik araması yapılıyor: {query} için {api_type}")

    try:
        normalized_results = []
        if api_type == "movie":
            raw_data = search_movie_func(query)
            # TMDB returns results in 'results' key
            items = raw_data.get('results', [])
            for item in items:
                poster_path = item.get('poster_path')
                poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None
                normalized_results.append({
                    "id": item.get('id'),
                    "title": item.get('title'),
                    "type": "Film",
                    "poster_url": poster_url,
                    "release_year": item.get('release_date', '')[:4] if item.get('release_date') else None,
                    "description": item.get('overview')
                })
                
        elif api_type == "book":
            raw_data = search_book_func(query)
            # Google Books returns results in 'items' key
            items = raw_data.get('items', [])
            for item in items:
                volume_info = item.get('volumeInfo', {})
                image_links = volume_info.get('imageLinks', {})
                normalized_results.append({
                    "id": item.get('id'),
                    "title": volume_info.get('title'),
                    "type": "Kitap",
                    "poster_url": image_links.get('thumbnail'),
                    "release_year": volume_info.get('publishedDate', '')[:4] if volume_info.get('publishedDate') else None,
                    "description": volume_info.get('description'),
                    "authors": volume_info.get('authors', [])
                })
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid api_type. Supported: movie, book."
            )
            
        results = normalized_results

    except Exception as e:
        print(f"HATA: {e}")
        raise HTTPException(500, "Could not perform content search")

    return {"query": query, "results": results}