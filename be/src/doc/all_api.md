# API bat tat thiet bi
  @router.post("/device/control")

  json body: 
  {
    "id": "p1",
    "value": 0
  }

  id: p1, p2, p3 là máy bơm, f1, f2, f3 là quạt
  value: 0 là tắt, 1 là bật.
  
  Kiểu trả về: không có



# trả về lịch sử hoạt động:
  @router.get("/device/logs")
  json body: 
  {
    "id": "f1"
  }
    kiểu trả về:
  [
    {
        "_id": "680941e8d11fda96adc7dc44",
        "id": "f1",
        "device_name": "Fan xxx",
        "action": "on",
        "timestamp": "2025-04-23T19:39:20.188528+00:00"
    },
    {
        "_id": "680941eed11fda96adc7dc45",
        "id": "f1",
        "device_name": "Fan xxx",
        "action": "off",
        "timestamp": "2025-04-23T19:39:26.595807+00:00"
    }
  ]  # sẽ có nhiều document có trạng thái ON và OFF khác tùy vào số lần bật tắt của thiết bị



# api trả về danh sách thiết bị
  @router.get("/device/list")
  json body: không có
  kiểu trả về: "_id" là id tự động của mongo (bỏ qua)
  [
    {
        "_id": "68094063721e8927ded861e0",
        "id": "f1",
        "name": "Fan xxx",
        "status": "off"
    },
    {
        "_id": "68094063721e8927ded861e1",
        "id": "f3",
        "name": "Fan yyy",
        "status": "off"
    },
    {
        "_id": "68094063721e8927ded861e2",
        "id": "f1",
        "name": "Fan zzz",
        "status": "off"
    },
    {
        "_id": "68094063721e8927ded861e3",
        "id": "p1",
        "name": "Pump zzz",
        "status": "off"
    },
    {
        "_id": "68094063721e8927ded861e4",
        "id": "p2",
        "name": "Pump zxy",
        "status": "off"
    },
    {
        "_id": "68094063721e8927ded861e5",
        "id": "p3",
        "name": "Pump yza",
        "status": "off"
    }
  ]


# Nội dung đã fix
  database tự động cập nhật dữ liệu
  show_value lấy dữ liệu từ database
  đổi phương thức thành Post.
  Thêm api cài đặt ngưỡng.
  chuyển đổi múi giờ trước khi lưu vào database
  đang fix bật tắt tự động {vẫn chưa chạy được}

  {
    "message": "Dữ liệu đã được cập nhật",
    "data": {
        "temperature": 25.8,
        "humidity": 53.6,
        "lux": 71.0,
        "soil_moisture": 0.0,
        "timestamp": "2025-04-28T15:25:01"
    }
}