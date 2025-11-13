from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.user.update_user_profile import update_user_profile as update_user_profile_func


router = APIRouter(prefix="/user", tags=["user"])

class UpdateUserProfileRequest(BaseModel):
    new_username: str = None
    new_bio: str = None
    avatar_url: str = None

@router.put("/update_profile")
async def update_user_profile(request: UpdateUserProfileRequest):
    connection = open_db_connection()

    try:
        success = update_user_profile_func(
            connection,
            new_username=request.new_username,
            new_bio=request.new_bio,
            avatar_url=request.avatar_url
        )
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