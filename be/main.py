import uvicorn
from fastapi import FastAPI
from src.routers import device, environment, adafruit, auth
from src.startup import seed_admin_user
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

seed_admin_user()
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
