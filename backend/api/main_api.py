from fastapi import FastAPI
import uvicorn

from fastapi.middleware.cors import CORSMiddleware

from backend.api.auth.login_api import router as login_router
from backend.api.auth.register_api import router as register_router
from backend.api.auth.forget_password_api import router as forget_password_router
from backend.api.user.get_followers_api import router as get_followers_router
from backend.api.user.get_following_api import router as get_following_router
from backend.api.user.get_user_api import router as get_user_router
from backend.api.feed.get_user_feed_api import router as get_user_feed_router
from backend.api.feed.like_review_api import router as like_review_router
from backend.api.content.search_api import router as search_content_router
from backend.api.interactions.add_comments_api import router as add_comment_router
from backend.api.interactions.get_comments_api import router as get_comments_router
from backend.api.interactions.like_comment_api import router as like_comment_router
from backend.api.interactions.update_comments_api import router as update_comment_router
from database.create_tables import create_tables
from database.insert_users_data import insert_initial_data
from database.insert_feed import insert_mock_activities
from database.insert_comments import insert_mock_comments
from database.insert_library_data import insert_library_for_user 

api = FastAPI()

api.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React uygulamanın portunu yaz
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api.include_router(login_router)
api.include_router(register_router)
api.include_router(forget_password_router)
api.include_router(get_followers_router)
api.include_router(get_following_router)
api.include_router(get_user_router)
api.include_router(get_user_feed_router)
api.include_router(like_review_router)
api.include_router(search_content_router)
api.include_router(add_comment_router)
api.include_router(get_comments_router)
api.include_router(like_comment_router)
api.include_router(get_comments_by_content_router)
api.include_router(add_comment_by_content_router)
api.include_router(update_comment_router)

if __name__ == "__main__":
    create_tables()
    insert_initial_data()
    insert_mock_activities()
    insert_mock_comments()
    insert_library_for_user('mehmet.demir@example.com')
    insert_library_for_user('mustafa.kaya@example.com')
    uvicorn.run("backend.api.main_api:api", host="127.0.0.1", port=8000, reload=True)