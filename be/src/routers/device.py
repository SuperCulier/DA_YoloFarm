from fastapi import APIRouter, HTTPException
from ..controllers.device_controller import add_device, get_device, update_device, delete_device, control_device, log_device_action, get_device_logs, get_all_devices, run_auto_mode
from src.models.device_model import Device, control_model, log_device, Device_auto
from src.controllers.ai_controller import predict_from_model
from src.services.adafruit_service import show_value
from src.config.settings import status
import asyncio
#from src.services.adafruit_service import show_value

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

# Router để bật/tắt chế độ tự động
@router.post("/device/control/auto")
async def control_device_auto(request: Device_auto):
    global status

    # Nếu yêu cầu bật chế độ auto (status == 1)
    if request.status == 1:
        if status == 0:  # Nếu chế độ auto chưa bật, thì bắt đầu vòng lặp
            status = 1
            asyncio.create_task(run_auto_mode())  # Bắt đầu chạy task bất đồng bộ
            return {"message": "Chế độ tự động đã được bật."}
        else:
            return {"message": "Chế độ tự động đã được bật."}

    # Nếu yêu cầu tắt chế độ auto (status == 0)
    elif request.status == 0:
        status = 0  # Tắt chế độ auto
        return {"message": "Chế độ tự động đã được tắt."}

    return {"message": "Trạng thái không hợp lệ. Chỉ chấp nhận giá trị status=0 hoặc status=1."}

@router.get("/ai")
async def testAi():
    input = await show_value()
    predict_from_model(input.get("temperature"), input.get("humidity"))

# trả về lịch sử hoạt động:
@router.post("/device/logs")
def get_logs_devices(request: log_device):
    id = request.id
    return get_device_logs(id)

@router.get("/device/list")
def get_devices():
    return get_all_devices()


    



