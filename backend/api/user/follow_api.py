from fastapi import APIRouter ,  HTTPException, status
from pydantic import BaseModel

from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.user.follow import follow as follow_user


router = APIRouter(prefix="/user", tags=["user"])

class FollowRequest(BaseModel):
    follower_id: int
    followed_id: int

@router.post("/follow")
async def follow(request: FollowRequest):
    connection = open_db_connection()
    
    success = follow_user(connection, request.follower_id, request.followed_id)

    connection.close()
    
    if success:
        return {"message": "Followed successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to follow user"
        )