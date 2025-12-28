from fastapi import APIRouter, HTTPException, status
from func.db.connection.open_db_connection import open_db_connection
from func.list.get_list_items import get_list_items as get_list_items_func

router = APIRouter(prefix="/list", tags=["list"])

@router.get('/items/{list_id}')
async def get_list_items(list_id: int):
    """
    Belirli bir listenin içeriklerini getirir.
    Kullanım: GET /list/items/123
    """
    connection = open_db_connection()

    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )

    try:
        items = get_list_items_func(connection, list_id)
        
    except Exception as e:
        print(f"API Hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve list items"
        )
    finally:
        connection.close()

    return {"list_id": list_id, "items": items}
