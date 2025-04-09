import pymongo
from .settings import MONGO_URI, DB_NAME
from datetime import datetime, timezone

client = pymongo.MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_all():
    pass  # Hoặc logic lấy dữ liệu từ MongoDB
def insert_one(collection, data):
    return db[collection].insert_one(data).inserted_id

def insert_many(collection, data_list):
    return db[collection].insert_many(data_list).inserted_ids

def find_one(collection, query):
    return db[collection].find_one(query)

def find_all(collection, query={}):
    return list(db[collection].find(query))

def update_one(collection, query, new_values):
    return db[collection].update_one(query, {"$set": new_values}).modified_count

def delete_one(collection, query):
    return db[collection].delete_one(query).deleted_count

def create_hourlyDataOnRegion(source_collection, new_collection, date):
    """
    Gom nhóm dữ liệu theo region, sau đó gom theo giờ, tính trung bình và lưu vào collection mới.
    """
    if date is None:
        now = datetime.now(timezone.utc)
    else:
        now = date.replace(hour=23, minute=59, second=59, microsecond=0)
    startDay = now.replace(hour=0, minute=0, second=0, microsecond=0)

    pipeline = [
        {
            "$match": {
                "timestamp": {
                    "$gte": startDay,
                    "$lte": now
                }
            }
        },
        {
            "$group": {
                "_id": {
                    "region": "$region",
                    "hour": { "$hour": "$timestamp" },
                    "feed": "$feed"
                },
                "avg_value": { "$avg": "$value" }
            }
        },
        {
            "$group": {
                "_id": {
                    "region": "$_id.region",
                    "hour": "$_id.hour"
                },
                "feeds": {
                    "$push": {
                        "feed": "$_id.feed",
                        "avg_value": "$avg_value"
                    }
                }
            }
        },
        {
            "$group": {
                "_id": "$_id.region",
                "data": {
                    "$push": {
                        "_id": "$_id.hour",
                        "feeds": "$feeds"
                    }
                }
            }
        },
        # sort theo region
        {
            "$sort": { "_id": 1 }
        }
    ]

    try:
        # Thực hiện pipeline
        result = list(db[source_collection].aggregate(pipeline))
        if result:
            # Xóa dữ liệu cũ trong new_collection trước khi lưu dữ liệu mới
            db[new_collection].delete_many({})
            db[new_collection].insert_many(result)
            print(f"Đã lưu {len(result)} bản ghi vào collection '{new_collection}'")
        else:
            print("Không có dữ liệu nào để lưu")
    except Exception as e:
        raise Exception(f"Lỗi khi tạo dữ liệu theo giờ: {e}")