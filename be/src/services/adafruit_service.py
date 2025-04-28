from fastapi.encoders import jsonable_encoder
import requests
from datetime import datetime, timezone, timedelta
from src.config.settings import ADAFRUIT_IO_USERNAME, ADAFRUIT_IO_KEY
from src.config.database import insert_one, find_one, find_one_latest

# Danh sách các feed cần lấy dữ liệu
FEED_KEYS = ["temperature", "humidity", "lux", "soil-moisture"]
COLLECTION_NAME = "environment_data"

# Tạo múi giờ Việt Nam
vietnam_tz = timezone(timedelta(hours=7))

def fetch_data(feed_key):
    """Lấy dữ liệu từ Adafruit IO"""
    url = f"https://io.adafruit.com/api/v2/{ADAFRUIT_IO_USERNAME}/feeds/{feed_key}/data?limit=1"
    headers = {"X-AIO-Key": ADAFRUIT_IO_KEY}
    
    print(f"📡 Request URL: {url}")
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
    """Trả về dữ liệu JSON gồm 1 timestamp duy nhất và các thông số đo được từ Adafruit IO."""
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
        # Chuyển UTC → giờ Việt Nam
        vn_time = latest_timestamp.astimezone(vietnam_tz)
        # Format ISO nhưng không có +07:00
        result["timestamp"] = vn_time.strftime("%Y-%m-%dT%H:%M:%S")
    else:
        result["timestamp"] = None

    return result

async def update_environment_data():
    """Lấy dữ liệu từ Adafruit IO và lưu vào MongoDB nếu chưa có"""
    data = await get_value()  # ⬅️ Phải await get_value vì nó async
    if data:
        existing_data = find_one(COLLECTION_NAME, {"timestamp": data["timestamp"]})
        
        if existing_data:
            print(f"⚡️ Dữ liệu timestamp {data['timestamp']} đã tồn tại trong database. Không lưu thêm.")
        else:
            data_copy = data.copy()
            insert_one(COLLECTION_NAME, data_copy)
            print(f"✅ Dữ liệu mới đã được lưu vào MongoDB: {data_copy}")
    else:
        print(f"❌ Không lấy được dữ liệu mới từ Adafruit IO")

    return jsonable_encoder(data)

def show_value():
    """Trả về dữ liệu JSON gồm 1 timestamp duy nhất và các thông số đo được từ MongoDB."""
    latest_data = find_one_latest(COLLECTION_NAME)

    if latest_data:
        latest_data["_id"] = str(latest_data["_id"])  # Chuyển ObjectId thành chuỗi JSON
        return latest_data
    else:
        return {"message": "Không tìm thấy dữ liệu"}
