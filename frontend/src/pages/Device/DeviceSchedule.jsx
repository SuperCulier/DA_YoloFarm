import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DeviceSchedule = ({ isOpen, onClose, device }) => {
  const [schedule, setSchedule] = useState({
    time: new Date(),
    power: 50,
    mode: "",
  });

  if (!isOpen || !device) return null; // Không hiển thị nếu modal đóng hoặc không có thiết bị

  const handleChange = (e) => {
    setSchedule({ ...schedule, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setSchedule({ ...schedule, time: date });
  };

  const handleSave = () => {
    console.log("Lịch hoạt động:", schedule);
    onClose(); // Đóng modal sau khi lưu
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-[500px] max-w-md p-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          Lên lịch cho {device.name}
        </h2>

        {/* DateTime Picker */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Thời gian hoạt động</label>
          <DatePicker
            selected={schedule.time}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat="Pp"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Power Slider */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Công suất (%)</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              name="power"
              min="0"
              max="100"
              value={schedule.power}
              onChange={handleChange}
              className="w-full"
            />
            <span className="font-semibold">{schedule.power}%</span>
          </div>
        </div>

        {/* Chế độ hoạt động */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600">Chế độ hoạt động</label>
          <select
            name="mode"
            value={schedule.mode}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
          >
            <option value="">Chọn chế độ</option>
            <option value="auto">Tự động</option>
            <option value="manual">Thủ công</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            Đóng
          </button>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceSchedule;
