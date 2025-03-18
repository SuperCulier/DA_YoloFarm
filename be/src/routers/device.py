from fastapi import APIRouter
from ..controllers.device_controller import add_device, get_device, update_device, delete_device
from src.models.device import Device

router = APIRouter(prefix="/device", tags=["Device"])

@router.post("/")
def create_device(device: Device):
    return add_device(device)

@router.get("/{device_id}")
def read_device(device_id: str):
    return get_device(device_id)

@router.put("/{device_id}")
def modify_device(device_id: str, update_data: dict):
    return update_device(device_id, update_data)

@router.delete("/{device_id}")
def remove_device(device_id: str):
    return delete_device(device_id)

