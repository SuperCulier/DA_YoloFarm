// Chuyển sang database 'yolofarm'
db = db.getSiblingDB('yolofarm');

// Hàm tạo timestamp theo định dạng ISO
function formatTimestamp(date) {
  return date.toISOString();
}



// Thêm thiết bị mẫu
db.devices.insertMany([
  { id: "f1", name: "Fan xxx", status: "off" },
  { id: "p3", name: "Pump yza", status: "off" }
]);



db.data_threshold.insertMany([
  { name: "temperature", min: 0.0, max: 10.0},
  { name: "humidity", min: 0.0, max: 0.5},
  { name: "lux", min: 0.0, max: 50.0},
  { name: "soil_moisture", min: 0.0, max: 50.0}
]);

// thêm data và enviroment_data
// Tạo dữ liệu từ 1/4/2025 đến ngày hôm trước
// const startDate = new Date('2025-04-20T00:30:00');
// const endDate = new Date(new Date().setHours(0, 0, 0, 0)); // Ngày hiện tại lúc 0h
// const data = [];

// // Dữ liệu cho ngày 1/4/2025 đến hôm qua, cách 1 giờ
// let currentDate = startDate;
// while (currentDate < endDate) {
//     data.push({
//         "temperature": +((Math.random() * 10) + 20).toFixed(1),  // ép kiểu thành number
//         "humidity": +((Math.random() * 20) + 40).toFixed(1),
//         "lux": +((Math.random() * 30) + 50).toFixed(1),
//         "soil_moisture": +((Math.random() * 100)).toFixed(1),
//         "timestamp": formatTimestamp(currentDate)
//     });

//     // Tăng thời gian thêm 1 giờ
//     currentDate.setHours(currentDate.getHours() + 1);
// }

// // Tạo dữ liệu cho ngày hôm nay, cách 20 phút
// const todayStartDate = new Date(new Date().setHours(0, 10, 0, 0)); // Ngày hôm nay lúc 00:10

// const todayEndDate = new Date();

// let currentDateToday = todayStartDate;
// while (currentDateToday < todayEndDate) {
//     data.push({
//         "temperature": +((Math.random() * 10) + 20).toFixed(1),
//         "humidity": +((Math.random() * 20) + 40).toFixed(1),
//         "lux": +((Math.random() * 30) + 50).toFixed(1),
//         "soil_moisture": +((Math.random() * 100)).toFixed(1),
//         "timestamp": formatTimestamp(currentDateToday)
//     });

//     // Tăng thời gian thêm 10 phút
//     currentDateToday.setMinutes(currentDateToday.getMinutes() + 20);
// }


// // Lưu dữ liệu vào collection 'environment_data'
// db.environment_data.insertMany(data);



