from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from func.db.connection.open_db_connection import open_db_connection
from func.list.create_list import create_custom_list

router = APIRouter(prefix="/list", tags=["list"])

class CreateListRequest(BaseModel):
    username: str
    name: str
    description: Optional[str] = None

@router.post("/create")
async def create_list(request: CreateListRequest):
    """
    Kullanıcı için yeni bir özel liste oluşturur.
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )

    try:
        result = create_custom_list(
            connection=connection,
            username=request.username,
            list_name=request.name,
            description=request.description
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
            detail="Could not create list"
        )
    finally:
        connection.close()
