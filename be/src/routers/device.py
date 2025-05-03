from fastapi import APIRouter, HTTPException
from ..controllers.device_controller import add_device, get_device, update_device, delete_device, control_device, log_device_action, get_device_logs, get_all_devices, run_auto_mode
from src.models.device_model import control_model, log_device, Device_auto
from src.controllers.ai_controller import predict_from_model
from src.services.adafruit_service import show_value
import src.config.settings as config
import asyncio
import logging
#from src.services.adafruit_service import show_value


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
status_lock = asyncio.Lock()

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
        res = "bật" if value == 1 else "tắt"
        return {"message": f"Đã {res} thiết bị {id}"}
    else:
        raise HTTPException(status_code=500, detail=f"Không thể điều khiển thiết bị {id}")

# Router để bật/tắt chế độ tự động
@router.post("/device/control/auto")
async def control_device_auto(request: Device_auto):
    async with status_lock:
        if request.value == 1:
            if config.status == 0:
                config.status = 1
                asyncio.create_task(run_auto_mode())
                logger.info("Auto mode enabled by request.")
                return {"message": "Chế độ tự động đã được bật."}
            else:
                logger.info("Auto mode enable request ignored (already active).")
                return {"message": "Chế độ tự động đã được bật từ trước."}

        elif request.value == 0:
            config.status = 0
            logger.info("Auto mode disabled by request.")
            return {"message": "Chế độ tự động đã được tắt."}

        return {"message": "Trạng thái không hợp lệ. Chỉ chấp nhận giá trị status=0 hoặc status=1."}


@router.get("/ai")
async def testAi():
    input = await show_value()
    await predict_from_model(input.get("temperature"), input.get("humidity"))

# trả về lịch sử hoạt động:
@router.post("/device/logs")
def get_logs_devices(request: log_device):
    id = request.id
    return get_device_logs(id)

@router.get("/device/list")
def get_devices():
    return get_all_devices()


    



