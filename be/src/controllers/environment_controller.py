from src.config.database import db
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

