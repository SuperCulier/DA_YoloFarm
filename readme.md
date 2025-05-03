tải docker desktop (không cần cài Mongo và các thư viện python)

1. vào Terminal, di chuyển đến thử mục "be"
2. chạy lệnh: docker compose up --build -d
   "lệch này sẽ load code lên docker và khỏi chạy server, http://localhost:8000/"
3. Nếu muốn sửa đổi trong mã nguồn thì dùng câu lệnh: docker compose down -v  # Dừng và xóa container + volume
   Có thể vào docker desktop để xóa luôn mục image nếu muốn xóa cả database.
   Xóa tất cả thư mục __pycache__ trong Be (nếu có)
   Chạy lên lệnh 2 để load code mới



4. Nội dung đã fix:
  database tự động cập nhật dữ liệu,
  show_value lấy dữ liệu từ database,
  đổi phương thức thành Post.
  Thêm api cài đặt ngưỡng.
  chuyển đổi múi giờ trước khi lưu vào database,
  đang fix bật tắt tự động {vẫn chưa chạy được}
