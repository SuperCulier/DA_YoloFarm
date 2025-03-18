from fastapi import FastAPI
from src.routers import device, environment, adafruit

app = FastAPI()

# Đăng ký các router
app.include_router(device.router)
app.include_router(environment.router)
app.include_router(adafruit.router)

@app.get("/")
def root():
    return {"message": "Welcome to YoloFarm API"}

