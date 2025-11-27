from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.user.update_user_profile import update_user_profile as update_user_profile_func


router = APIRouter(prefix="/user", tags=["user"])

class UpdateUserProfileRequest(BaseModel):
    current_username: str
    new_username: str = None
    new_bio: str = None
    avatar_url: str = None

@router.put("/update_profile")
async def update_user_profile(request: UpdateUserProfileRequest):
    connection = open_db_connection()
    if connection is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not connect to the database"
        )

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT user_id FROM users WHERE username = %s", (request.current_username,))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
            
        user_id = user['user_id']
        cursor.close()

        success = update_user_profile_func(
            connection,
            user_id=user_id,
            new_username=request.new_username,
            new_bio=request.new_bio,
            avatar_url=request.avatar_url
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"HATA: Kullanıcı profili güncellenemedi: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not update user profile"
        )
    finally:
        connection.close()

    if success:
        return {"message": "User profile updated successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update user profile"
        )