from fastapi import APIRouter, HTTPException, status 
from typing import Union                                        
from pydantic import BaseModel
from func.db.connection.open_db_connection import open_db_connection
from func.list.remove_from_library import remove_item_from_library

router = APIRouter(prefix="/list", tags=["list"])

from typing import Optional

class RemoveLibraryItemRequest(BaseModel):
    username: str
    list_key: Optional[str] = None
    content_id: Optional[int] = None
    list_id: Optional[int] = None
    external_id: Optional[Union[str, int]] = None
    content_type: Optional[str] = None
    api_source: Optional[str] = None

@router.delete("/remove_item")
async def remove_library_item(request: RemoveLibraryItemRequest):
    """
    Kullanıcının kütüphanesinden içerik kaldırır.
    Kullanım: DELETE /list/remove_item
    Body: {
        "username": "mehmetdemir1",
        "list_key": "watched",
        "content_id": 123, # Opsiyonel (Internal ID)
        "external_id": "123", # Opsiyonel (External ID)
        "content_type": "movie",
        "api_source": "tmdb",
        "list_id": 123 # Opsiyonel
    }
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )

    try:
        success = remove_item_from_library(
            connection=connection,
            username=request.username,
            list_key=request.list_key,
            content_id=request.content_id,
            list_id=request.list_id,
            external_id=request.external_id,
            content_type=request.content_type,
            api_source=request.api_source
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not remove item from library"
            )
        
        return {"success": True, "message": "Item removed from library successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"API Hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not remove item from library"
        )
    finally:
        connection.close()

