from fastapi import FastAPI
import uvicorn

from backend.api.login_api import router as login_router

api = FastAPI()

api.include_router(login_router)

if __name__ == "__main__":
    uvicorn.run("backend.main:api", host="127.0.0.1", port=8000, reload=True)