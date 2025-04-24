from fastapi import APIRouter, HTTPException
from src.controllers.environment_controller import (
    add_environment_data, 
    get_all_environment_data, 
    get_latest_environment_data,
    set_threshold,
    get_hourly_environment_data,
    get_history_environment_data,
)
from src.models.environment import EnvironmentData
from datetime import datetime
# Định nghĩa router với tiền tố "/environment"
router = APIRouter(prefix="/environment", tags=["Environment"])

@router.post("/")
async def create_environment_data(data: EnvironmentData):
    """API để thêm dữ liệu môi trường mới"""
    inserted_id = add_environment_data(data)
    return {"message": "Dữ liệu môi trường đã được thêm", "id": str(inserted_id)}

@router.get("/")
async def read_all_environment_data():
    """API lấy toàn bộ dữ liệu môi trường"""
    data = get_all_environment_data()
    if not data:
        raise HTTPException(status_code=404, detail="Không tìm thấy dữ liệu")
    return data

@router.get("/latest/{region}")
async def read_latest_environment_data(region: str):
    """API lấy dữ liệu môi trường mới nhất của một khu vực"""
    data = get_latest_environment_data(region)
    if not data:  # Nếu không có dữ liệu
        raise HTTPException(status_code=404, detail="Không tìm thấy dữ liệu")
    return data

@router.put("/set-threshold/{threshold_type}")
async def api_set_threshold(threshold_type: str, value: float):
    set_threshold(threshold_type, value)
    return {"message": "Threshold set", "type": threshold_type, "value": value}

# body json: {"value": 42.5}
# thay đổi các giá trị ngưỡng:
     # nhiệt độ:        /set-threshold/temperature
     # độ ẩm không khí: /set-threshold/humidity
     # độ ẩm đất:       /set-threshold/lux
     # ánh sáng:        /set-threshold/soil_moisture

@router.get("/historyData")
async def read_history(start_day, end_day):
    """ API để lấy dữ liệu trung bình mỗi ngày theo region, trong khoảng tgian start_dat đến end_day"""
    if type(start_day) is str:
        start_day = datetime.fromisoformat(start_day)
    if type(end_day) is str:
        end_day = datetime.fromisoformat(end_day)
    if (start_day > end_day):
        raise HTTPException(status_code=404, detail="start_day phải nhỏ hơn end_day")
    data = get_history_environment_data(start_day, end_day)

    if not data:
        raise HTTPException(status_code=404, detail="Không có dữ liệu trong khoảng thời gian này")
    return data

@router.get("/hourlyData")
async def read_hourly(date=None):
    """date = None là lấy dữ liệu ngày hôm nay"""
    if type(date) is str:
        date = datetime.fromisoformat(date)
    data = get_hourly_environment_data(date)
    if not data:  
        raise HTTPException(status_code=404, detail="Không tìm thấy dữ liệu")
    return data

