from fastapi import APIRouter, HTTPException
from src.config.database import find_one
from src.utils.security import verify_password
from pydantic import BaseModel

router = APIRouter()

class LoginInput(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(data: LoginInput):
    user = find_one("users", {"username": data.username})
    if not user or not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Sai tên đăng nhập hoặc mật khẩu")
    return {"message": "Đăng nhập thành công ✅"}
