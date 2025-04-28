from src.config.database import insert_one, find_one, update_one, delete_one, find_all, transform_objectid
from src.models.device_model import Device
import requests
from datetime import datetime, timezone
from fastapi import HTTPException
from src.config.settings import ADAFRUIT_IO_USERNAME, ADAFRUIT_IO_KEY
from ai_controller import predict_from_model

print("Debug: device_controller.py loaded")
print("Available functions in device_controller:", dir())
feed = ["button-fan", "button-pump"]

DEVICE_LOGS_COLLECTION = "divice_logs"
#hàm bật tắt thiết bị
def control_device(feed_key: str, value: int):
    if value not in (0, 1):
        raise ValueError("Giá trị 'value' chỉ được phép là 0 hoặc 1")
    url = f"https://io.adafruit.com/api/v2/{ADAFRUIT_IO_USERNAME}/feeds/{feed_key}/data"
    headers = {
        "X-AIO-Key": ADAFRUIT_IO_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "value": value
    }
    response = requests.post(url, json=payload, headers=headers)
    print("URL:", url)
    print("Payload:", payload)
    print("Response status:", response.status_code)
    print("Response text:", response.text)

    return response.status_code == 200

#điều khiển tự động.
def control_devices_based_on_prediction(temp, humid):
    # Lấy tín hiệu điều khiển từ mô hình
    control_signals = predict_from_model(temp, humid)
    
    # Điều khiển bơm và quạt dựa trên tín hiệu dự đoán
    pump_signal = control_signals["pump"]
    fan_signal = control_signals["fan"]

    # Gọi hàm điều khiển cho bơm và quạt
    pump_control_result = control_device(feed[1], pump_signal)
    fan_control_result = control_device(feed[0], fan_signal)

    # Trả kết quả của việc điều khiển thiết bị
    if pump_control_result and fan_control_result:
        print("Cả bơm và quạt đã được điều khiển thành công.")
    else:
        print("Có lỗi trong quá trình điều khiển thiết bị.")

    return pump_control_result, fan_control_result

# ghi lại lịch sử bật tắt vào từng colection
def log_device_action(id: str, action: str):
    # Tìm thiết bị theo id trong DB
    device = find_one("devices", {"id": id})

    if not device:
        raise HTTPException(status_code=404, detail=f"Không tìm thấy thiết bị với id: {id}")

    log_data = {
        "id": id,
        "device_name": device["name"],  # Lấy tên thiết bị từ DB
        "action": action,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    insert_one(DEVICE_LOGS_COLLECTION, log_data)



##### Trả về lịch sử hoạt động
def get_device_logs(id: str):
    device_logs = list(find_all(DEVICE_LOGS_COLLECTION, {"id": id}))
    if device_logs:
        return transform_objectid(device_logs)
    else:
        raise HTTPException(status_code=404, detail=f"Không tìm thấy thiết bị có id: '{id}'")



###########################
COLLECTION_NAME = "devices"
def add_device(device: Device):
    existing_device = find_one(COLLECTION_NAME, {"name": device.name})
    if existing_device:
        return {"error": "Device already exists"}
    return insert_one(COLLECTION_NAME, device.dict())

def get_device(name: str):
    return find_one(COLLECTION_NAME, {"device_name": name})

def get_all_devices():
    raw_data = find_all(COLLECTION_NAME)
    return transform_objectid(raw_data)

def update_device(device_id: str, update_data: dict):
    return update_one(COLLECTION_NAME, {"_id": device_id}, update_data)

def delete_device(device_id: str):
    return delete_one(COLLECTION_NAME, {"_id": device_id})


