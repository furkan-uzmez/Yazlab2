from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.list.update_list import update_list as update_list_func

router = APIRouter(prefix="/list", tags=["list"])

class UpdateListRequest(BaseModel):
    list_id: int
    name: str
    description: str

@router.put('/update')
async def update_list(request: UpdateListRequest):
    """
    Listeyi günceller.
    Kullanım: PUT /list/update
    Body: { "list_id": 1, "name": "Yeni Ad", "description": "Yeni Açıklama" }
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )

    try:
        success = update_list_func(connection, request.list_id, request.name, request.description)
        
        if not success:
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not update list"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"API Hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not update list"
        )
    finally:
        connection.close()

    return {"success": True, "message": "List updated successfully"}
