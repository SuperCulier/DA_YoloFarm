from src.config.database import *
from src.models.environment import EnvironmentData

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

def get_hourly_data(region: str, date):
    """Lấy thông số môi trường của một khu vực theo từng giờ"""
    HOURLY_COLLECTION = date.strftime("%d%m%Y")
    create_hourlyDataOnRegion(
            source_collection=COLLECTION_NAME,
            new_collection=HOURLY_COLLECTION,
            date=date
            )

    hourly_data = list(db[HOURLY_COLLECTION].find({"_id": region}, {"_id": 0}))

    return hourly_data if hourly_data else {"message": "Không tìm thấy dữ liệu"}
    
