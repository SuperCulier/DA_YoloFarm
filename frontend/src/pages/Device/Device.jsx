import SideBar from "../../components/SideBar.jsx";
import Switch from "../../components/Switch.jsx";
import DeviceHistory from "../../pages/Device/DeviceHistory.jsx";
import DeviceSchedule from "../../pages/Device/DeviceSchedule.jsx";
import { useState } from "react";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DeviceList = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const devices = [
    { name: "Bơm 1", location: "Vườn 1", id: "P-01", time: "05/03/2025", value: "80%", status: "Run" },
    { name: "Bơm 2", location: "Vườn 2", id: "P-02", time: "03/03/2025", value: "30%", status: "Inactive" },
    { name: "Bơm 3", location: "Vườn 3", id: "P-03", time: "03/03/2025", value: "60%", status: "Inactive" },
    { name: "Đèn 1", location: "Vườn 1", id: "L-01", time: "03/03/2025", value: "60%", status: "Run" },
    { name: "Đèn 2", location: "Vườn 1", id: "L-02", time: "03/03/2025", value: "30%", status: "Run" },
  ];

  return (
    <>
      <SideBar />
      <div className="p-6 sm:ml-64 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Danh sách thiết bị</h2>
          <button
            onClick={() => setShowHistory(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            📜 Lịch sử hoạt động
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="p-3">Tên thiết bị</th>
                <th className="p-3">Vị trí</th>
                <th className="p-3">Mã thiết bị</th>
                {/* <th className="p-3">Thời gian hoạt động</th> */}
                {/* <th className="p-3">Thông số</th> */}
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Điều khiển</th>
                <th className="p-3">Lên lịch</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{device.name}</td>
                  <td className="p-3">{device.location}</td>
                  <td className="p-3">{device.id}</td>
                  {/* <td className="p-3">{device.time}</td> */}
                  {/* <td className="p-3">{device.value}</td> */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs ${
                        device.status === "Run" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {device.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <Switch checked={device.status === "Run"} />
                  </td>
                  <td className="p-3">
                    <button
                      className="px-3 py-1 text-gray-600 rounded-md hover:bg-yellow-600"
                      onClick={() => {
                        setSelectedDevice(device);
                        setIsScheduleOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faClipboardList}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal lên lịch */}
        {isScheduleOpen && (
          <DeviceSchedule
            isOpen={isScheduleOpen}
            onClose={() => setIsScheduleOpen(false)}
            device={selectedDevice}
          />
        )}

        {/* Lịch sử hoạt động */}
        {showHistory && <DeviceHistory onClose={() => setShowHistory(false)} />}
      </div>
    </>
  );
};

export default DeviceList;
