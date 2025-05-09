from fastapi.encoders import jsonable_encoder
import requests
from datetime import datetime
from src.config.settings import ADAFRUIT_IO_USERNAME, ADAFRUIT_IO_KEY
from src.config.database import insert_one

# Danh sách các feed cần lấy dữ liệu
FEED_KEYS = ["temperature", "humidity", "lux", "soil-moisture"]
COLLECTION_NAME = "environment_data"

def fetch_data(feed_key):
    """Lấy dữ liệu từ Adafruit IO"""
    url = f"https://io.adafruit.com/api/v2/{ADAFRUIT_IO_USERNAME}/feeds/{feed_key}/data"
    headers = {"X-AIO-Key": ADAFRUIT_IO_KEY}
    
    # Kiểm tra phản hồi từ Adafruit
    print(f"📡 Request URL: {url}")
    

    response = requests.get(url, headers=headers)

    print(f" da qua doan nay///////////////////////////////////////////////////")

    print(f"📡 Status Code: {response.status_code}")
    print(f"📡 Response JSON: {response.json()}")

    if response.status_code == 200:
        data = response.json()
        if data:
            latest_entry = data[0]
            return {
                "region": "farm_1",
                "feed": feed_key,
                "value": float(latest_entry["value"]),
                "timestamp": datetime.strptime(latest_entry["created_at"], 
                             "%Y-%m-%dT%H:%M:%S.%fZ" if "." in latest_entry["created_at"] else "%Y-%m-%dT%H:%M:%SZ")
            }
    return None

"""
def show_value():
    latest_data = {}

    for feed in FEED_KEYS:
        data = fetch_data(feed)  # Lấy dữ liệu từ Adafruit

        if data:
            latest_data[feed] = {
                "region": data["region"],
                "value": data["value"],
                "timestamp": data["timestamp"].isoformat()  # Chuyển datetime thành chuỗi ISO 8601
            }
        else:
            latest_data[feed] = {"error": "Không có dữ liệu"}
    return latest_data
"""
    
def show_value():
    """Trả về dữ liệu JSON gồm 1 timestamp duy nhất và các thông số đo được từ Adafruit IO."""
    result = {}
    latest_timestamp = None

    for feed in FEED_KEYS:
        data = fetch_data(feed)
        # Chuyển key từ dạng 'soil-moisture' → 'soil_moisture'
        key = feed.replace("-", "_")

        if data:
            # Lưu giá trị đo được
            result[key] = data["value"]
            # Chọn timestamp mới nhất làm chuẩn
            if not latest_timestamp or data["timestamp"] > latest_timestamp:
                latest_timestamp = data["timestamp"]
        else:
            result[key] = None  # gán giá trị mặc định

    # Ghi timestamp cuối vào JSON trả về
    if latest_timestamp:
        result["timestamp"] = latest_timestamp.isoformat()
    else:
        result["timestamp"] = None

    return result


"""
def update_environment_data():
    results = []
    for feed in FEED_KEYS:
        data = fetch_data(feed)  # Lấy dữ liệu từ Adafruit IO
        print(f"✅ Fetch data for {feed}: {data}")  # Debug dữ liệu lấy về

        if data:
            data_copy = data.copy()  # Tạo bản sao trước khi lưu
            insert_one(COLLECTION_NAME, data_copy)  # Lưu vào MongoDB
            results.append(data)  # Thêm bản gốc vào danh sách kết quả
            print(f"✅ Dữ liệu đã được lưu vào MongoDB: {data_copy}")
        else:
            print(f"❌ Không có dữ liệu để lưu cho {feed}")

    # Chuyển _id thành chuỗi nếu có
    for item in results:
        if "_id" in item:
            item["_id"] = str(item["_id"])  # Chuyển ObjectId thành chuỗi

    print("✅ Dữ liệu trước khi trả về:", results)  # Debug dữ liệu

    return jsonable_encoder(results)
"""

def update_environment_data():
    """Lấy và lưu dữ liệu vào MongoDB"""
    data = show_value()  # Lấy dữ liệu từ Adafruit IO
    if data:
        data_copy = data.copy()  # Tạo bản sao trước khi lưu
        insert_one(COLLECTION_NAME, data_copy)  # Lưu vào MongoDB
        print(f"✅ Dữ liệu đã được lưu vào MongoDB: {data_copy}")
    else:
        print(f"❌ Không có dữ liệu để lưu cho")
    print("✅ Dữ liệu trước khi trả về:", data)  # Debug dữ liệu
    return jsonable_encoder(data)
