from fastapi import APIRouter, HTTPException, status

from func.db.connection.open_db_connection import open_db_connection
from func.list.get_user_list import get_lists as get_lists_func

router = APIRouter(prefix="/list", tags=["list"])

@router.get('/get_lists')
async def get_lists(username: str):
    """
    Kullanıcının özel listelerini getirir.
    Kullanım: GET /list/get_lists?username=mehmetdemir1
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )

    try:
        # Fonksiyonu çağır
        user_lists = get_lists_func(connection, username)
        
    except Exception as e:
        print(f"API Hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve lists"
        )
    finally:
        connection.close()

    # Liste boş olsa bile 200 OK dönmek ve boş dizi vermek doğrudur.
    return {"username": username, "lists": user_lists}