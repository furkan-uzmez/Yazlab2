from fastapi import FastAPI
import uvicorn

from backend.api.auth.login_api import router as login_router
from backend.api.auth.register_api import router as register_router


api = FastAPI()

api.include_router(login_router)
api.include_router(register_router)


if __name__ == "__main__":
    uvicorn.run("backend.main:api", host="127.0.0.1", port=8000, reload=True)