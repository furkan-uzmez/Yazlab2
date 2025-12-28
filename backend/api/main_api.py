from contextlib import asynccontextmanager
from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# Router importların
from api.auth.login_api import router as login_router
from api.auth.register_api import router as register_router
from api.auth.forget_password_api import router as forget_password_router
from api.user.get_followers_api import router as get_followers_router
from api.user.get_following_api import router as get_following_router
from api.user.follow_api import router as follow_router
from api.user.get_user_api import router as get_user_router
from api.user.update_user_profile_api import router as update_user_profile_router
from api.interactions.rate_content_api import router as rate_content_router
from api.user.recommendations_api import router as recommendations_router
from api.list.get_user_library_api import router as get_user_library_router
from api.list.get_user_list_api import router as get_user_list_router
from api.list.add_library_item_api import router as add_library_item_router
from api.list.remove_library_item_api import router as remove_library_item_router
from api.feed.get_user_feed_api import router as get_user_feed_router
from api.feed.like_review_api import router as like_review_router
from api.feed.add_rating_api import router as add_rating_router
from api.feed.add_review_api import router as add_review_router
from api.feed.get_user_activities_api import router as get_user_activities_router
from api.content.search_api import router as search_content_router
from api.content.get_details_api import router as get_details_router
from api.content.get_popular_content_api import router as get_popular_content_router
from api.interactions.add_comments_api import router as add_comment_router
from api.interactions.get_comments_api import router as get_comments_router
from api.interactions.like_comment_api import router as like_comment_router
from api.interactions.update_comments_api import router as update_comment_router
from api.interactions.get_comments_by_content_api import router as get_comments_by_content_router
from api.interactions.add_comment_by_content_api import router as add_comment_by_content_router
from api.interactions.delete_comment_api import router as delete_comment_router
from api.list.create_list_api import router as create_list_router
from api.list.delete_list_api import router as delete_list_router
from api.list.get_list_items_api import router as get_list_items_router
from api.list.update_list_api import router as update_list_router

# Database importları
from database.create_tables import create_tables
from database.insert_users_data import insert_initial_data
from database.insert_feed import insert_mock_activities
from database.insert_comments import insert_mock_comments
from database.insert_library_data import insert_library_for_user

"""# --- BU KISIM YENİ: Veritabanını Başlatma ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Uygulama açılırken burası çalışır
    print("🚀 Veritabanı tabloları ve veriler yükleniyor...")
    try:
        create_tables()
        # Hata almamak için try-except içine alıyoruz (zaten varsa çökmesin)
        try: insert_initial_data()
        except: pass
        
        try: insert_mock_activities()
        except: pass
        
        try: insert_mock_comments()
        except: pass
        
        try:
            insert_library_for_user('mehmet.demir@example.com')
            insert_library_for_user('mustafa.kaya@example.com')
        except: pass
        
        print("✅ Veritabanı hazır!")
    except Exception as e:
        print(f"❌ Veritabanı hatası: {e}")
    
    yield
    # Uygulama kapanırken burası çalışır
    print("🛑 Uygulama kapatılıyor...")"""

# lifespan'i buraya ekliyoruz
#api = FastAPI(lifespan=lifespan)

api = FastAPI()


api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router'lar
api.include_router(login_router)
api.include_router(register_router)
api.include_router(forget_password_router)
api.include_router(get_followers_router)
api.include_router(get_following_router)
api.include_router(follow_router)
api.include_router(get_user_router)
api.include_router(update_user_profile_router)
api.include_router(get_user_library_router)
api.include_router(get_user_list_router)
api.include_router(add_library_item_router)
api.include_router(remove_library_item_router)
api.include_router(create_list_router)
api.include_router(delete_list_router)
api.include_router(get_list_items_router)
api.include_router(update_list_router)
api.include_router(get_user_feed_router)
api.include_router(like_review_router)
api.include_router(add_rating_router)
api.include_router(add_review_router)
api.include_router(get_user_activities_router)
api.include_router(search_content_router)
api.include_router(get_details_router)
api.include_router(get_popular_content_router)
api.include_router(add_comment_router)
api.include_router(get_comments_router)
api.include_router(like_comment_router)
api.include_router(get_comments_by_content_router)
api.include_router(add_comment_by_content_router)
api.include_router(update_comment_router)
api.include_router(delete_comment_router)
api.include_router(recommendations_router)
api.include_router(rate_content_router)

"""# Burası artık sadece lokal testler için
if __name__ == "__main__":
    uvicorn.run("api.main_api:api", host="127.0.0.1", port=8000, reload=True)"""