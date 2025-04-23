from pydantic import BaseModel
from typing import Optional

class control_model(BaseModel):
    id: str
    value: int

class log_device(BaseModel):
    id: str

class Device(BaseModel):
    name: str
    type: str
    status: Optional[bool] = False  # Mặc định thiết bị tắt

