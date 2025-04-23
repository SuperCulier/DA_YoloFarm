from fastapi import APIRouter, HTTPException
from ..controllers.device_controller import add_device, get_device, update_device, delete_device, control_device, log_fan_action, log_led_action, log_pump_action, get_device_logs
from src.models.device import Device

"""
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
 """

router = APIRouter()

# API bat tat thiet bi
# Quạt
@router.post("/control/fan/on")
def fan_on():
    if control_device("button-fan", "1"):
        log_fan_action("on")
        return {"message": "Quạt đã bật"}
    else:
        raise HTTPException(status_code=500, detail="Không thể bật quạt")

@router.post("/control/fan/off")
def fan_off():
    if control_device("button-fan", "0"):
        log_fan_action("off")
        return {"message": "Quạt đã tắt"}
    else:
        raise HTTPException(status_code=500, detail="Không thể tắt quạt")

# Đèn
@router.post("/control/led/on")
def light_on():
    if control_device("led", "1"):
        log_led_action("on")
        return {"message": "Đèn đã bật"}
    else:
        raise HTTPException(status_code=500, detail="Không thể bật đèn")

@router.post("/control/led/off")
def light_off():
    if control_device("led", "0"):
        log_led_action("off")
        return {"message": "Đèn đã tắt"}
    else:
        raise HTTPException(status_code=500, detail="Không thể tắt đèn")

# Bơm
@router.post("/control/pump/on")
def pump_on():
    if control_device("button-pump", "1"):
        log_pump_action("on")
        return {"message": "Máy bơm đã bật"}
    else:
        raise HTTPException(status_code=500, detail="Không thể bật máy bơm")

@router.post("/control/pump/off")
def pump_off():
    if control_device("button-pump", "0"):
        log_pump_action("off")
        return {"message": "Máy bơm đã tắt"}
    else:
        raise HTTPException(status_code=500, detail="Không thể tắt máy bơm")
    

# trả về lịch sử hoạt động:
@router.get("/logs")
def get_all_device_logs():
    fan_logs = get_device_logs("fan_logs")
    pump_logs = get_device_logs("led_logs")
    light_logs = get_device_logs("pump_logs")
    
    return {
        "fan_logs": fan_logs,
        "pump_logs": pump_logs,
        "light_logs": light_logs
    }

@router.get("/logs/fan")
def get_logs_fan():
    return get_device_logs("fan_logs")

@router.get("/logs/led")
def get_logs_led():
    return get_device_logs("led_logs")

@router.get("/logs/pump")
def get_logs_pump():
    return get_device_logs("pump_logs")



    



