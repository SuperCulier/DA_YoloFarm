# Sử dụng Python 3.11
FROM python:3.11

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Cài đặt thư viện từ requirements.txt
RUN pip install --no-cache-dir -r requirements.txt


# Expose cổng 8000 để truy cập API
EXPOSE 8000

# Chạy ứng dụng FastAPI với Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]



