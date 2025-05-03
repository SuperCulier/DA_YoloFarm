from fastapi import APIRouter, WebSocket
from src.services.adafruit_service import update_environment_data, show_value
import asyncio

router = APIRouter()
connected_clients = []
time_delay = 120


# api này để test, không dùng nữa vì data đã được cập nhật tự động định kỳ thông qua WebSocket ở dưới.
@router.get("/fetch-data")
async def fetch_data_api():
    try:
        results = await update_environment_data()
        return {
            "message": "Dữ liệu đã được cập nhật",
            "data": results
        }
    except Exception as e:
        print(f"❌ Lỗi: {e}")  # Ghi log lỗi
        return {"error": str(e)}

        
@router.get("/show-last-data")
def get_latest_data():
    """API lấy bộ thông số môi trường mới nhất từ database"""
    return show_value()

# WebSocket dùng để gửi cãnh báo.
@router.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)

    try:
        while True:
            await asyncio.sleep(time_delay)  # Cứ mỗi "time_delay" giây kiểm tra
            await update_environment_data(notify_callback=send_alerts)
    except Exception as e:
        print("WebSocket error:", e)
    finally:
        connected_clients.remove(websocket)


async def send_alerts(alerts):
    for client in connected_clients:
        try:
            await client.send_json({"type": "alert", "data": alerts})
        except:
            pass