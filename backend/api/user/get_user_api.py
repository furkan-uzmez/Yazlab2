from fastapi import APIRouter ,  HTTPException, status , Query
from pydantic import BaseModel

from func.db.connection.open_db_connection import open_db_connection
from func.user.get_user import get_user
from func.user.follow import check_follow_status


router = APIRouter(prefix="/user", tags=["user"])

@router.get("/search")
async def search_users(query: str = Query(..., min_length=1), viewer_id: int = None):
    """
    Kullanıcı araması yapar.
    Kullanım: GET /user/search?query=ahmet&viewer_id=123
    """
    connection = open_db_connection()

    print(f"Arama sorgusu: {query}, Viewer ID: {viewer_id}")
    
    try:
        user_data = get_user(connection, query)
        
        # Eğer viewer_id varsa ve kullanıcı bulunduysa takip durumunu kontrol et
        if user_data and viewer_id:
            # user_data bir liste olabilir (search results)
            if isinstance(user_data, list):
                for user in user_data:
                    is_following = check_follow_status(connection, viewer_id, user['user_id'])
                    user['is_following'] = is_following
            elif isinstance(user_data, dict):
                 is_following = check_follow_status(connection, viewer_id, user_data['user_id'])
                 user_data['is_following'] = is_following

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
def get_user_by_email(query: str = Query(..., min_length=1), viewer_id: int = None):
    """
    E-posta ile kullanıcı araması yapar.
    Kullanım: GET /user/search_by_email?query=email@example.com&viewer_id=123
    """
    connection = open_db_connection()

    print(f"E-posta arama sorgusu: {query}, Viewer ID: {viewer_id}")
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT username FROM users WHERE email = %s", (query,))
        user_name = cursor.fetchone()
        print(f"Bulunan kullanıcı adı: {user_name}")
        user_name = user_name['username'] if user_name else None
        cursor.close()
        user_data = get_user(connection,user_name)

        # Eğer viewer_id varsa ve kullanıcı bulunduysa takip durumunu kontrol et
        if user_data and viewer_id:
             # user_data bir liste olabilir (search results)
            if isinstance(user_data, list):
                for user in user_data:
                    is_following = check_follow_status(connection, viewer_id, user['user_id'])
                    user['is_following'] = is_following
            elif isinstance(user_data, dict):
                 is_following = check_follow_status(connection, viewer_id, user_data['user_id'])
                 user_data['is_following'] = is_following

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