from fastapi import APIRouter, HTTPException, status
from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.list.get_user_library import get_user_library as get_lib_func

router = APIRouter(prefix="/list", tags=["list"])

@router.get("/get_library")
async def get_library(username: str):
    """
    Kullanıcının kütüphane listelerini (İzledim, Okudum vb.) getirir.
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )

    try:
        # Kütüphane verisini çek
        data = get_lib_func(connection, username)
        
        # Eğer fonksiyon None veya boş sözlük dönerse bile başarılı kabul edip boş veri dönebiliriz.
        # Ancak get_lib_func içinde bir hata olursa exception fırlatılacaktır.
        
    except Exception as e:
        print(f"HATA: Kütüphane verisi alınamadı: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve user library"
        )
    finally:
        # Bağlantıyı her durumda kapat
        connection.close()

    return data