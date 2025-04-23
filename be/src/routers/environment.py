from fastapi import APIRouter, HTTPException
from src.controllers.environment_controller import (
    add_environment_data, 
    get_all_environment_data, 
    get_latest_environment_data,
    set_threshold
)
from src.models.environment import EnvironmentData

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