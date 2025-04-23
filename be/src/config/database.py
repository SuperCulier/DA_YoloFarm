import pymongo
from .settings import MONGO_URI, DB_NAME
from bson import ObjectId

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

def transform_objectid(data):
    if isinstance(data, list):
        return [transform_objectid(item) for item in data]
    elif isinstance(data, dict):
        new_data = {}
        for key, value in data.items():
            if isinstance(value, ObjectId):
                new_data[key] = str(value)
            elif isinstance(value, (dict, list)):
                new_data[key] = transform_objectid(value)
            else:
                new_data[key] = value
        return new_data
    else:
        return data