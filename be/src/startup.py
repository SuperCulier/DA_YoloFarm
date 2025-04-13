from src.config.database import find_one, insert_one
from src.utils.security import hash_password

def seed_admin_user():
    if not find_one("users", {"username": "admin"}):
        insert_one("users", {
            "username": "admin",
            "hashed_password": hash_password("admin123"),
            "role": "admin"
        })
