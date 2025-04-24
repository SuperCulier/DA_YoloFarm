from fastapi import FastAPI
from src.routers import device, environment, adafruit, auth, ai
from src.startup import seed_admin_user

app = FastAPI()
seed_admin_user()
# Đăng ký các router
app.include_router(device.router)
app.include_router(environment.router)
app.include_router(adafruit.router)
app.include_router(auth.router)
app.include_router(ai.router)

print("✅ Router AI đã được đăng ký")
@app.get("/")
def root():
    return {"message": "Welcome to YoloFarm API"}



