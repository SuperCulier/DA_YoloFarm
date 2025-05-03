from src.config.database import db, update_one
from src.config.database import *
from src.models.environment import EnvironmentData
from fastapi.encoders import jsonable_encoder
from datetime import datetime, timezone, timedelta

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

def set_threshold(elemental: str, min_value: float, max_value: float):
    update_one("data_threshold", {"name": elemental}, {"min": min_value, "max": max_value})
    
def get_history_environment_data(start_day, end_day):
    """Lấy dữ liệu trung bình mỗi ngày từ start_day đến end_day (giờ Việt Nam - UTC+7)"""

    # Vì đang hiểu truyền start với end là UTC+7 nên cần gán mark này để đảm bảo timezone là UTC+7
    tz_utc_plus_7 = timezone(timedelta(hours=7))
    if start_day.tzinfo is None:
        start_day = start_day.replace(tzinfo=tz_utc_plus_7)
    else:
        start_day = start_day.astimezone(tz_utc_plus_7)

    if end_day.tzinfo is None:
        end_day = end_day.replace(tzinfo=tz_utc_plus_7)
    else:
        end_day = end_day.astimezone(tz_utc_plus_7)

    # Chuyển sang UTC để truy vấn query từ MongoDB (nó đang ở UTC+0)
    start_utc = start_day.astimezone(timezone.utc)
    end_utc = end_day.astimezone(timezone.utc)

    print(f"[DEBUG] Query từ {start_utc} đến {end_utc} (UTC)")

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
                    "$gte": start_utc,
                    "$lte": end_utc
                }
            }
        },
        {
            "$addFields": {
                # Chuyển timestamp sang UTC+7 trước khi lấy ngày
                "local_date": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": {
                            "$dateAdd": {
                                "startDate": "$ts",
                                "unit": "hour",
                                "amount": 7
                            }
                        }
                    }
                }
            }
        },
        {
            "$group": {
                "_id": "$local_date",
                "temperature": { "$avg": "$temperature" },
                "humidity": { "$avg": "$humidity" },
                "lux": { "$avg": "$lux" },
                "soil_moisture": { "$avg": "$soil_moisture" }
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
            "$sort": { "date": 1 }
        }
    ]

    result = list(db[COLLECTION_NAME].aggregate(pipeline))

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
    """Lấy thông số môi trường theo từng giờ trong ngày, theo giờ UTC+7."""

    # Vì đang hiểu truyền start với end là UTC+7 nên cần gán mark này để đảm bảo múi giờ UTC+7
    tz_utc_plus_7 = timezone(timedelta(hours=7))

    # Nếu không truyền ngày thì lấy thời điểm hiện tại ở UTC+7
    if date is None:
        local_now = datetime.now(tz_utc_plus_7)
    else:
        # Ép ngày có timezone là UTC+7 nếu chưa có
        local_now = date.astimezone(tz_utc_plus_7) if date.tzinfo else date.replace(tzinfo=tz_utc_plus_7)

    # Tính thời điểm bắt đầu và kết thúc trong ngày (theo UTC+7)
    local_end = local_now.replace(hour=23, minute=59, second=59, microsecond=0)
    local_start = local_end.replace(hour=0, minute=0, second=0, microsecond=0)

    # Chuyển sang UTC để truy vấn query MongoDB
    startDay = local_start.astimezone(timezone.utc)
    endDay = local_end.astimezone(timezone.utc)

    print(f"[DEBUG] Query MongoDB từ {startDay} đến {endDay} (theo UTC)")

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
                    "$lt": endDay
                }
            }
        },
        {
            "$addFields": {
                # Tạo trường giờ theo UTC+7
                "local_hour": {
                    "$hour": {
                        "$dateAdd": {
                            "startDate": "$ts",
                            "unit": "hour",
                            "amount": 7
                        }
                    }
                }
            }
        },
        {
            "$group": {
                "_id": "$local_hour",
                "temperature": { "$avg": "$temperature" },
                "humidity": { "$avg": "$humidity" },
                "lux": { "$avg": "$lux" },
                "soil_moisture": { "$avg": "$soil_moisture" }
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
            "$sort": { "hour": 1 }
        }
    ]

    result = list(db[COLLECTION_NAME].aggregate(pipeline))

    # Chuyển kết quả sang dạng dict lồng như yêu cầu
    result_dict = {
        str(item["hour"]): {
            "temperature": item["temperature"],
            "humidity": item["humidity"],
            "lux": item["lux"],
            "soil_moisture": item["soil_moisture"]
        } for item in result
    }

    return jsonable_encoder(result_dict) if result else {"message": "Không tìm thấy dữ liệu"}