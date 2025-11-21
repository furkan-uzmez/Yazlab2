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

@router.get("/search_by_email")
def get_user_by_email(query: str = Query(..., min_length=1)):
    """
    E-posta ile kullanıcı araması yapar.
    Kullanım: GET /
    """
    connection = open_db_connection()

    print(f"E-posta arama sorgusu: {query}")
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT username FROM users WHERE email = %s", (query,))
        user_name = cursor.fetchone()
        print(f"Bulunan kullanıcı adı: {user_name}")
        user_name = user_name['username'] if user_name else None
        cursor.close()
        user_data = get_user(connection,user_name)
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
            detail=f"User with email {query} not found"
        )