from fastapi.encoders import jsonable_encoder
import requests
from datetime import datetime, timezone, timedelta
from src.config.settings import ADAFRUIT_IO_USERNAME, ADAFRUIT_IO_KEY
from src.config.database import insert_one, find_one, find_one_latest, find_all
from fastapi.websockets import WebSocket
import asyncio

# Danh sách các feed cần lấy dữ liệu
FEED_KEYS = ["temperature", "humidity", "lux", "soil-moisture"]
COLLECTION_NAME = "environment_data"
THRESHOLD_COLLECTION = "data_threshold"

# Múi giờ Việt Nam
vietnam_tz = timezone(timedelta(hours=7))


def fetch_data(feed_key):
    url = f"https://io.adafruit.com/api/v2/{ADAFRUIT_IO_USERNAME}/feeds/{feed_key}/data?limit=1"
    headers = {"X-AIO-Key": ADAFRUIT_IO_KEY}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        if data:
            latest_entry = data[0]
            return {
                "region": "farm_1",
                "feed": feed_key,
                "value": float(latest_entry["value"]),
                "timestamp": datetime.strptime(
                    latest_entry["created_at"],
                    "%Y-%m-%dT%H:%M:%S.%fZ" if "." in latest_entry["created_at"] else "%Y-%m-%dT%H:%M:%SZ"
                )
            }
    return None


async def get_value():
    result = {}
    latest_timestamp = None
    for feed in FEED_KEYS:
        data = fetch_data(feed)
        key = feed.replace("-", "_")
        if data:
            result[key] = data["value"]
            if not latest_timestamp or data["timestamp"] > latest_timestamp:
                latest_timestamp = data["timestamp"]
        else:
            result[key] = None

    if latest_timestamp:
        vn_time = latest_timestamp.astimezone(vietnam_tz)
        result["timestamp"] = vn_time.strftime("%Y-%m-%dT%H:%M:%S")
    else:
        result["timestamp"] = None
    return result


async def update_environment_data(notify_callback=None):
    """Lấy dữ liệu mới, lưu vào DB nếu chưa có, và kiểm tra cảnh báo"""
    data = await get_value()
    if data:
        # Kiểm tra dữ liệu đã tồn tại chưa
        existing_data = find_one(COLLECTION_NAME, {"timestamp": data["timestamp"]})
        if existing_data:
            print(f"⚡️ Dữ liệu timestamp {data['timestamp']} đã tồn tại trong database. Không lưu thêm.")
        else:
            insert_one(COLLECTION_NAME, data.copy())
            print(f"✅ Dữ liệu mới đã được lưu vào MongoDB: {data}")

        # 🚨 Kiểm tra vượt ngưỡng
        alerts = []
        thresholds = find_all(THRESHOLD_COLLECTION)
        for threshold in thresholds:
            name = threshold["name"]
            min_val = threshold["min"]
            max_val = threshold["max"]
            value = data.get(name)

            if value is not None and (value < min_val or value > max_val):
                alerts.append({
                    "parameter": name,
                    "value": value,
                    "min": min_val,
                    "max": max_val,
                    "message": f"{name} = {value} vượt ngưỡng [{min_val}, {max_val}]"
                })

        if alerts and notify_callback:
            await notify_callback(alerts)  # Gửi thông báo tới frontend
    else:
        print(f"❌ Không lấy được dữ liệu mới từ Adafruit IO")
    return jsonable_encoder(data)


async def show_value():
    """Trả về dữ liệu JSON gồm 1 timestamp duy nhất và các thông số đo được từ MongoDB."""
    latest_data = find_one_latest(COLLECTION_NAME)

    if latest_data:
        latest_data["_id"] = str(latest_data["_id"])  # Chuyển ObjectId thành chuỗi JSON
        return latest_data
    else:
        return {"message": "Không tìm thấy dữ liệu"}
