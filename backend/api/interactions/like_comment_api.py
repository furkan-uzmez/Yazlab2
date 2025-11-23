from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.func.db.connection.open_db_connection import open_db_connection
from backend.func.interactions.like_comment import like_comment as like_comment_func

router = APIRouter(prefix="/interactions", tags=["interactions"])

class LikeCommentRequest(BaseModel):
    comment_id: int
    username: str

@router.post("/like_comment")
async def like_comment(request: LikeCommentRequest):
    conn = open_db_connection()
    result = like_comment_func(conn, request.comment_id, request.username)
    conn.close()
    
    if result:
        return {"message": "Success"}
    else:
        raise HTTPException(status_code=400, detail="Operation failed")