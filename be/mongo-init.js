// Chuyển sang database 'yolofarm'
db = db.getSiblingDB('yolofarm');

// Tạo user nếu chưa có
/*db.createUser({
  user: "admin",
  pwd: "password", // Mật khẩu nên được hash nếu cần bảo mật hơn
  roles: [{ role: "readWrite", db: "yolofarm" }]
});*/

// Thêm dữ liệu người dùng mặc định
//db.users.insertOne({
//  username: "admin",
//  password: "admin123",
// role: "admin" });

// Thêm thiết bị mẫu
db.devices.insertMany([
  { id: "f1", name: "Fan xxx", status: "off" },
  { id: "f3", name: "Fan yyy", status: "off" },
  { id: "f1", name: "Fan zzz", status: "off" },
  { id: "p1", name: "Pump zzz", status: "off" },
  { id: "p2", name: "Pump zxy", status: "off" },
  { id: "p3", name: "Pump yza", status: "off" },
]);


// Chèn dữ liệu trung bình theo giờ (1h -> 0h)
let hourlyData = [];
for (let i = 1; i <= 24; i++) {
  hourlyData.push({
    time: i,
    temperature: Math.random() * (35 - 25) + 25,       // 25-35°C
    humidity: Math.random() * (80 - 50) + 50,          // 50-80%
    lux: Math.random() * (1000 - 100) + 100,           // 100-1000 lux
    soil_moisture: Math.random() * (60 - 20) + 20      // 20-60%
  });
}
db.average_by_hour.insertMany(hourlyData);

// Chèn dữ liệu trung bình theo ngày (1 -> 31)
let dailyData = [];
for (let d = 1; d <= 13; d++) {
  dailyData.push({
    date: d,
    temperature: Math.random() * (35 - 25) + 25,
    humidity: Math.random() * (80 - 50) + 50,
    lux: Math.random() * (1000 - 100) + 100,
    soil_moisture: Math.random() * (60 - 20) + 20
  });
}
db.average_by_day.insertMany(dailyData);

// Chèn dữ liệu trung bình theo tháng (1 -> 12)
let monthlyData = [];
for (let m = 1; m <= 4; m++) {
  monthlyData.push({
    month: m,
    temperature: Math.random() * (35 - 25) + 25,
    humidity: Math.random() * (80 - 50) + 50,
    lux: Math.random() * (1000 - 100) + 100,
    soil_moisture: Math.random() * (60 - 20) + 20
  });
}
db.average_by_month.insertMany(monthlyData);

// thêm dữ liệu môi trường ứng với thời gian hiện tại để test, xóa khi demo và nộp bài
let now = new Date();
db.environment_data.insertOne({
  //region: "farm_1",
  timestamp: now.toISOString(),
  temperature: Math.random() * (35 - 25) + 25,
  humidity: Math.random() * (80 - 50) + 50,
  lux: Math.random() * (1000 - 100) + 100,
  soil_moisture: Math.random() * (60 - 20) + 20
});

db.data_threshold.insertOne([
  { name: "temperature", min: 20.0, max: 40.0},
  { name: "humidity", min: 0.0, max: 50.0},
  { name: "lux", min: 0.0, max: 50.0},
  { name: "soil_moisture", min: 0.0, max: 50.0}
]);