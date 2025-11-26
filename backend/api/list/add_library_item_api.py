from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.list.add_to_library import add_item_to_library

router = APIRouter(prefix="/list", tags=["list"])

class AddLibraryItemRequest(BaseModel):
    username: str
    list_key: str
    external_id: str
    title: str
    poster_url: str
    content_type: str
    api_source: str = 'user_add'

@router.post("/add_item")
async def add_library_item(request: AddLibraryItemRequest):
    """
    Kullanıcının kütüphanesine içerik ekler.
    Kullanım: POST /list/add_item
    Body: {
        "username": "mehmetdemir1",
        "list_key": "watched",
        "external_id": "123",
        "title": "Film Adı",
        "poster_url": "https://...",
        "content_type": "movie",
        "api_source": "user_add"
    }
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )

    try:
        success = add_item_to_library(
            connection=connection,
            username=request.username,
            list_key=request.list_key,
            external_id=request.external_id,
            title=request.title,
            poster_url=request.poster_url,
            content_type=request.content_type,
            api_source=request.api_source
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

