from fastapi import APIRouter
from src.services.adafruit_service import update_environment_data, show_value

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
    return show_value()
