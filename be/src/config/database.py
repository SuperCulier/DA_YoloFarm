import pymongo
from .settings import MONGO_URI, DB_NAME

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

