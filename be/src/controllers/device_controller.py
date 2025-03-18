from src.config.database import insert_one, find_one, update_one, delete_one
from src.models.device import Device

print("Debug: device_controller.py loaded")
print("Available functions in device_controller:", dir())

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
