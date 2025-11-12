from fastapi import APIRouter ,  HTTPException, status
from pydantic import BaseModel

from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.user.follow import follow as follow_user , unfollow as unfollow_user


router = APIRouter(prefix="/user", tags=["user"])

class FollowRequest(BaseModel):
    follower_id: int
    followed_id: int

@router.post("/follow")
async def follow(request: FollowRequest):
    connection = open_db_connection()
    
    try:
        success = follow_user(connection, request.follower_id, request.followed_id)
    except Exception as e:
        print(f"HATA: Takip işlemi başarısız: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Follow process failed"
        )
    finally:
        connection.close()
    
    if success:
        return {"message": "Followed successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to follow user"
        )

@router.delete("/unfollow")
async def unfollow(request: FollowRequest):
    connection = open_db_connection()
    
    try:
        success = unfollow_user(connection, request.follower_id, request.followed_id)
    except Exception as e:
        print(f"HATA: Takipten çıkma işlemi başarısız: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unfollow process failed"
        )
    finally:
        connection.close()
    
    if success:
        return {"message": "Unfollowed successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to unfollow user"
        )
