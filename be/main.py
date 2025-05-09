import uvicorn
import asyncio
from contextlib import asynccontextmanager 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.routers import device, environment, adafruit, auth
from src.startup import seed_admin_user, periodic_update

seed_admin_user()

@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(periodic_update())
    yield

app = FastAPI(lifespan=lifespan)

# CORS cho frontend (Vue, React, v.v.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Hoặc domain thật sự
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tạo admin mặc định
# seed_admin_user()

# Đăng ký các router
app.include_router(device.router)
app.include_router(environment.router)
app.include_router(adafruit.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Welcome to YoloFarm API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

