from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.list.delete_list import delete_custom_list

router = APIRouter(prefix="/list", tags=["list"])

class DeleteListRequest(BaseModel):
    username: str
    list_id: int

@router.delete("/delete")
async def delete_list(request: DeleteListRequest):
    """
    Kullanıcının özel listesini siler.
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )

    try:
        result = delete_custom_list(
            connection=connection,
            username=request.username,
            list_id=request.list_id
        )
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["message"]
            )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not delete list"
        )
    finally:
        connection.close()
