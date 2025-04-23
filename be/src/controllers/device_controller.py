from src.config.database import insert_one, find_one, update_one, delete_one
from src.models.device import Device
import requests
from datetime import datetime, timezone

from src.config.settings import ADAFRUIT_IO_USERNAME, ADAFRUIT_IO_KEY

print("Debug: device_controller.py loaded")
print("Available functions in device_controller:", dir())

#hàm bật tắt thiết bị
def control_device(feed_key: str, value: str):
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

# ghi lại lịch sử bật tắt vào từng colection
def log_fan_action(action: str):
    log_data = {
        "action": action,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    insert_one("fan_logs", log_data)

def log_led_action(action: str):
    log_data = {
        "action": action,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    insert_one("led_logs", log_data)

def log_pump_action(action: str):
    log_data = {
        "action": action,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    insert_one("pump_logs", log_data)



###########################
COLLECTION_NAME = "devices"
def add_device(device: Device):
    existing_device = find_one(COLLECTION_NAME, {"name": device.name})
    if existing_device:
        return {"error": "Device already exists"}
    return insert_one(COLLECTION_NAME, device.dict())

def get_device(device_id: str):
    return find_one(COLLECTION_NAME, {"_id": device_id})

def update_device(device_id: str, update_data: dict):
    return update_one(COLLECTION_NAME, {"_id": device_id}, update_data)

def delete_device(device_id: str):
    return delete_one(COLLECTION_NAME, {"_id": device_id})


