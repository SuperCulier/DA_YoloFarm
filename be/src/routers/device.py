from fastapi import APIRouter, HTTPException
from ..controllers.device_controller import add_device, get_device, update_device, delete_device, control_device, log_device_action, get_device_logs, get_all_devices
from src.models.device_model import Device, control_model, log_device

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
feed = ["button-fan", "button-pump"]


# API bat tat thiet bi
@router.post("/device/control")
def api_control_device(request: control_model):
    id = request.id
    value = request.value
    # Chọn đúng feed_key
    if id.startswith("f"):
        feed_key = feed[0]
    else:
        feed_key = feed[1]

    # Điều khiển thiết bị
    if control_device(feed_key, value):
        action = "on" if value == 1 else "off"
        log_device_action(id, action)
        status = "bật" if value == 1 else "tắt"
        return {"message": f"Đã {status} thiết bị {id}"}
    else:
        raise HTTPException(status_code=500, detail=f"Không thể điều khiển thiết bị {id}")


# trả về lịch sử hoạt động:
@router.post("/device/logs")
def get_logs_devices(request: log_device):
    id = request.id
    return get_device_logs(id)

@router.get("/device/list")
def get_devices():
    return get_all_devices()


    



