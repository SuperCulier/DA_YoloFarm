import os
from dotenv import load_dotenv
from pathlib import Path 

BASE_DIR = Path(__file__).resolve().parent.parent  # Lấy thư mục gốc của dự án
ENV_PATH = BASE_DIR / ".env"  # Đường dẫn tuyệt đối đến file .env

# Tải biến môi trường từ file .env
load_dotenv(dotenv_path=ENV_PATH)

# API Key của Adafruit IO

ADAFRUIT_IO_USERNAME = os.getenv("ADAFRUIT_IO_USERNAME", "trunglamcsek22")
ADAFRUIT_IO_KEY = os.getenv("ADAFRUIT_IO_KEY", "aio_xqWh62mGrZCvl5NEuNGMtTQ2BuzK")  #chỗ này bị lỗi - nên phải copy key vào để chạy

# Thông tin MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "yolofarm")

