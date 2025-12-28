from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from func.db.connection.open_db_connection import open_db_connection
from func.list.add_to_library import add_item_to_library

router = APIRouter(prefix="/list", tags=["list"])

from typing import Optional, Union

class AddLibraryItemRequest(BaseModel):
    username: str
    list_key: Optional[str] = None  # Özel listeler için opsiyonel
    external_id: Union[str, int]
    title: str
    poster_url: Optional[str] = None
    content_type: str
    description: Optional[str] = None
    release_year: Optional[int] = None
    duration_or_pages: Optional[int] = None
    api_source: str
    list_id: Optional[int] = None
    genres: Optional[list[str]] = None

@router.post("/add_item")
async def add_library_item(request: AddLibraryItemRequest):
    """
    Kullanıcının kütüphanesine içerik ekler.
    Kullanım: POST /list/add_item
    Body: {
        "username": "mehmetdemir1",
        "list_key": "watched",
        "list_id": 123,  # Opsiyonel, özel listeler için
        "external_id": "123",
        "title": "Film Adı",
        "poster_url": "https://...",
        "content_type": "movie",
        "description": "Film açıklaması...",
        "release_year": 2023,
        "duration_or_pages": 120,
        "api_source": "tmdb",
        "genres": ["Action", "Sci-Fi"]
    }
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )

    try:
        # list_id veya list_key'den biri mutlaka olmalı
        if not request.list_id and not request.list_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Either list_id or list_key must be provided"
            )
        
        success = add_item_to_library(
            connection=connection,
            username=request.username,
            list_key=request.list_key,
            external_id=request.external_id,
            title=request.title,
            poster_url=request.poster_url,
            content_type=request.content_type,
            description=request.description,
            release_year=request.release_year,
            duration_or_pages=request.duration_or_pages,
            api_source=request.api_source,
            list_id=request.list_id,
            genres=request.genres
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not add item to library"
            )
        
        return {"success": True, "message": "Item added to library successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"API Hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not add item to library"
        )
    finally:
        connection.close()

