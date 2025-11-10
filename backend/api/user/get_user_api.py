from fastapi import APIRouter ,  HTTPException, status
from pydantic import BaseModel

from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.user.get_user import get_user


router = APIRouter(prefix="/user", tags=["user"])

class UserRequest(BaseModel):
    user_name: str

@router.get("/get_user")
async def get_user(request: UserRequest):
    connection = open_db_connection()
    
    user_data = get_user(request.user_name)

    connection.close()
    
    if user_data is not None:
        return {"message": "User found", "user": user}
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )