from fastapi import FastAPI
import uvicorn

from fastapi.middleware.cors import CORSMiddleware

from backend.api.auth.login_api import router as login_router
from backend.api.auth.register_api import router as register_router
from backend.api.auth.forget_password_api import router as forget_password_router
from backend.api.user.get_followers_api import router as get_followers_router
from database.create_tables import create_tables
from database.insert_users_data import insert_initial_data

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

if __name__ == "__main__":
    create_tables()
    insert_initial_data()
    uvicorn.run("backend.api.main_api:api", host="127.0.0.1", port=8000, reload=True)