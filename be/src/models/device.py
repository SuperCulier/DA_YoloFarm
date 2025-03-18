from pydantic import BaseModel
from typing import Optional

class Device(BaseModel):
    name: str
    type: str
    status: Optional[bool] = False  # Mặc định thiết bị tắt

