// Chuyển sang database 'yolofarm'
db = db.getSiblingDB('yolofarm');

// Hàm tạo timestamp theo định dạng ISO
function formatTimestamp(date) {
  return date.toISOString();
}

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
  { id: "p3", name: "Pump yza", status: "off" }
]);

/*
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
*/

db.data_threshold.insertOne([
  { name: "temperature", min: 0.0, max: 10.0},
  { name: "humidity", min: 0.0, max: 0.5},
  { name: "lux", min: 0.0, max: 50.0},
  { name: "soil_moisture", min: 0.0, max: 50.0}
]);

// thêm data và enviroment_data
// Tạo dữ liệu từ 1/4/2025 đến ngày hôm trước
const startDate = new Date('2025-04-20T00:30:00');
const endDate = new Date(); // Ngày hiện tại
const data = [];

// Dữ liệu cho ngày 1/4/2025 đến hôm qua, cách 1 giờ
let currentDate = startDate;
while (currentDate < endDate) {
    data.push({
        "temperature": +((Math.random() * 10) + 20).toFixed(1),  // ép kiểu thành number
        "humidity": +((Math.random() * 20) + 40).toFixed(1),
        "lux": +((Math.random() * 30) + 50).toFixed(1),
        "soil_moisture": +((Math.random() * 100)).toFixed(1),
        "timestamp": formatTimestamp(currentDate)
    });

    // Tăng thời gian thêm 1 giờ
    currentDate.setHours(currentDate.getHours() + 1);
}

// Tạo dữ liệu cho ngày hôm nay, cách 10 phút
const todayStartDate = new Date(new Date().setHours(0, 10, 0, 0)); // Ngày hôm nay lúc 00:10

// Chuyển đổi giờ UTC sang giờ Việt Nam (GMT+7)
const todayEndDate = new Date(endDate.toLocaleString("en-GB", { timeZone: "Asia/Ho_Chi_Minh" }));

let currentDateToday = todayStartDate;
while (currentDateToday < todayEndDate) {
    data.push({
        "temperature": +((Math.random() * 10) + 20).toFixed(1),
        "humidity": +((Math.random() * 20) + 40).toFixed(1),
        "lux": +((Math.random() * 30) + 50).toFixed(1),
        "soil_moisture": +((Math.random() * 100)).toFixed(1),
        "timestamp": formatTimestamp(currentDateToday)
    });

    // Tăng thời gian thêm 10 phút
    currentDateToday.setMinutes(currentDateToday.getMinutes() + 10);
}


// Lưu dữ liệu vào collection 'environment_data'
db.environment_data.insertMany(data);