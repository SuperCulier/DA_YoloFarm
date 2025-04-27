from pydantic import BaseModel
from datetime import datetime

class EnvironmentData(BaseModel):
    temperature: float
    humidity: float
    light: float
    area: str  # Khu vực đo thông số
    timestamp: datetime

class HistoryRequest(BaseModel):
    start_day: datetime
    end_day: datetime

class HourlyRequest(BaseModel):
    date : datetime

class en_threshold(BaseModel):
    name: str
    minValue: float
    maxValue: float
