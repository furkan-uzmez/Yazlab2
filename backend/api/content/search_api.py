from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from backend.func.content.search import search_content as search_content_func

router = APIRouter(prefix="/content", tags=["content"])


@router.get("/search")
async def search(query: str):
    try:
        results = search_content_func(query)
    except Exception as e:
        print(f"HATA: İçerik araması yapılamadı: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not perform content search"
        )   

    if results is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No content found for the given username"
        )

    return {"query": query, "results": results}