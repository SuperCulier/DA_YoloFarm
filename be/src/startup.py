from src.config.database import find_one, insert_one
from src.utils.security import hash_password
from src.services.adafruit_service import update_environment_data
import asyncio

time_delay = 120

def seed_admin_user():
    if not find_one("users", {"username": "admin"}):
        insert_one("users", {
            "username": "admin",
            "hashed_password": hash_password("admin123"),
            "role": "admin"
        })

async def periodic_update():
    while True:
        print("🔄 Đang kiểm tra và cập nhật dữ liệu...")
        update_environment_data()  # Gọi hàm cập nhật Adafruit -> MongoDB
        await asyncio.sleep(time_delay)  # Chờ 5 phút = 300 giây rồi chạy tiếp