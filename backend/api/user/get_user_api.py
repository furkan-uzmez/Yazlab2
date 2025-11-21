from fastapi import APIRouter ,  HTTPException, status , Query
from pydantic import BaseModel

from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.user.get_user import get_user


router = APIRouter(prefix="/user", tags=["user"])

@router.get("/search")
async def search_users(query: str = Query(..., min_length=1)):
    """
    Kullanıcı araması yapar.
    Kullanım: GET /user/search?query=ahmet
    """
    connection = open_db_connection()

    print(f"Arama sorgusu: {query}")
    
    try:
        user_data = get_user(connection, query)
    except Exception as e:
        print(f"HATA: Kullanıcı alınamadı: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve user"
        )
    finally:
        connection.close()
    
    if user_data is not None:
        return {"message": "User found", "results": user_data}
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{query} user not found"
        )