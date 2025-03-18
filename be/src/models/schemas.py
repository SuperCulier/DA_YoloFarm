#phòng hờ, sau này xóa

from pydantic import BaseModel
from typing import Optional

class DeviceSchema(BaseModel):
    name: str
    type: str
    status: bool

class DeviceUpdateSchema(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    status: Optional[bool] = None
