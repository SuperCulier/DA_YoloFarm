from fastapi import APIRouter
from src.services.adafruit_service import update_environment_data, show_value
from src.controllers.environment_controller import (
    add_environment_data
)
router = APIRouter()

@router.get("/fetch-data")
async def fetch_data_api():
    """API để lấy dữ liệu từ Adafruit IO và lưu vào MongoDB"""
    try:
        results = update_environment_data()
        return {
            "message": "Dữ liệu đã được cập nhật",
            "data": results
        }
    except Exception as e:
        print(f"❌ Lỗi: {e}")  # Ghi log lỗi
        return {"error": str(e)}

@router.get("/show-last-data")
def get_latest_data():
    """API lấy bộ thông số môi trường mới nhất từ Adafruit IO"""
    res = show_value()
    # add_environment_data(res)
    temp = {}
    temp["temperature"] = res["temperature"]
    temp["humidity"] = res["humidity"]
    temp["light"] = res["lux"]
    temp["timestamp"] = res["timestamp"]
    temp["area"] = "farm_1"
    add_environment_data(temp)
    return res
