from src.config.database import db, update_one
from src.config.database import *
from src.models.environment import EnvironmentData
from fastapi.encoders import jsonable_encoder
from datetime import datetime, timezone

COLLECTION_NAME = "environment_data"

def add_environment_data(data: EnvironmentData):
    """Thêm dữ liệu môi trường vào MongoDB"""
    return db[COLLECTION_NAME].insert_one(data.model_dump()).inserted_id

def get_all_environment_data():
    """Lấy toàn bộ dữ liệu môi trường"""
    return list(db[COLLECTION_NAME].find({}, {"_id": 0}))  # Ẩn _id để trả về JSON sạch

def get_latest_environment_data(region: str):
    """Lấy thông số môi trường gần nhất của một khu vực"""
    latest_data = db[COLLECTION_NAME].find_one(
        {"region": region}, 
        sort=[("timestamp", -1)],
        projection={"_id": 0}  # Không trả về _id
    )
    return latest_data if latest_data else {"message": "Không tìm thấy dữ liệu"}

def set_threshold(elemental: str, new_value: float):
    update_one("data_threshold", elemental, new_value)
    
def get_history_environment_data(start_day, end_day):
    """Lấy toàn bộ dữ liệu trong khoảng thời gian từ start_day đến end_day"""
    print(f"startDay: {start_day} - type: {type(start_day)}, now: {end_day} - type: {type(end_day)}")
    pipeline = [
        {
            "$addFields": {
                "ts": {
                    "$cond": [
                        { "$eq": [ { "$type": "$timestamp" }, "string" ] },
                        { "$toDate": "$timestamp" },
                        "$timestamp"
                    ]
                }
            }
        },
        {
            "$match": {
                "ts": {
                    # "$gte": start_day.isoformat(),
                    # "$lte": end_day.isoformat()
                    "$gte": start_day,
                    "$lte": end_day
                }
            }
        },
        {
            "$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$ts"}},
                "temperature": {"$avg": "$temperature"},
                "humidity": {"$avg": "$humidity"},
                "lux": {"$avg": "$lux"},
                "soil_moisture": {"$avg": "$soil_moisture"}
            }
        },
        {
        "$project": {
            "date": "$_id",
            "temperature": 1,
            "humidity": 1,
            "lux": 1,
            "soil_moisture": 1,
            "_id": 0  
            }
        },
        {
            "$sort": {"date": 1}
        }
    ]
    result = list(db[COLLECTION_NAME].aggregate(pipeline))
    print(f"result la: {result}")
    result_dict = {
        item["date"]: {
            "temperature": item["temperature"],
            "humidity": item["humidity"],
            "lux": item["lux"],
            "soil_moisture": item["soil_moisture"]
        } for item in result
    }
    return jsonable_encoder(result_dict) if result else {"message": "Không tìm thấy dữ liệu"}

def get_hourly_environment_data(date):
    """Lấy thông số môi trường của một khu vực theo từng giờ"""
    if date is None:
        now = datetime.now(timezone.utc)
    else:
        now = date.replace(hour=23, minute=59, second=59, microsecond=0)
    print(f"now TIME: {now} - type: {type(now)}")
    startDay = now.replace(hour=0, minute=0, second=0, microsecond=0)
    print(f"START TIME: {startDay} - type: {type(startDay)}")
    pipeline = [
        {
            "$addFields": {
                "ts": {
                    "$cond": [
                        { "$eq": [ { "$type": "$timestamp" }, "string" ] },
                        { "$toDate": "$timestamp" },
                        "$timestamp"
                    ]
                }
            }
        },
        {
            "$match": {
                "ts": {
                    "$gte": startDay,
                    "$lt": now
                }
            }
        },
        {
            "$group": {
                "_id": { "$hour": "$ts" },
                "temperature": { "$avg": "$temperature" },
                "humidity": { "$avg": "$humidity" },
                "lux": { "$avg": "$lux" },
                "soil_moisture": {"$avg": "$soil_moisture"}
            }
        },
        {
        "$project": {
            "hour": "$_id",
            "temperature": 1,
            "humidity": 1,
            "lux": 1,
            "soil_moisture": 1,
            "_id": 0  
            }
        },
        {
            "$sort": {"hour": 1}
        }
    ]

    result = list(db[COLLECTION_NAME].aggregate(pipeline))
    print(f"result la: {result}")
    result_dict = {
        str(item["hour"]): {
            "temperature": item["temperature"],
            "humidity": item["humidity"],
            "lux": item["lux"],
            "soil_moisture": item["soil_moisture"]
        } for item in result
    }
    return jsonable_encoder(result_dict) if result else {"message": "Không tìm thấy dữ liệu"}
