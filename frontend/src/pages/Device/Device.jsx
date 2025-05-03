import SideBar from "../../components/SideBar.jsx";
import Switch from "../../components/Switch.jsx";
import DeviceInfo from "./DeviceInfo.jsx";
import { useState, useEffect } from "react";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDeviceList, getDeviceLog, controlDevice, setControlMode } from "../../apis/DeviceAPI.js";

const DeviceList = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showDeviceInfo, setShowDeviceInfo] = useState(false);
  const [deviceLogs, setDeviceLogs] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAutoMode, setIsAutoMode] = useState(false);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        console.log("Fetching device list...");
        const deviceList = await getDeviceList();
        console.log("Device list received:", deviceList);
        
        const formattedDevices = deviceList.map((device) => ({
          id: device.deviceId,
          name: device.name,
          location: "Vườn 1",
          status: device.status === "on" ? "Run" : "Inactive",
        }));
        
        setDevices(formattedDevices);
        setLoading(false);
      } catch (err) {
        console.error("Error in fetchDevices:", err);
        setError("Failed to fetch devices. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchDevices();
  }, []);

  const fetchDeviceHistory = async (deviceId) => {
    try {
      console.log(`Fetching history for device ${deviceId}...`);
      const logs = await getDeviceLog(deviceId);
      console.log("Device logs received:", logs);
      setDeviceLogs(logs);
      const selected = devices.find((d) => d.id === deviceId);
      if (!selected) {
        throw new Error(`Device ${deviceId} not found in devices list`);
      }
      setSelectedDevice(selected);
      setShowDeviceInfo(true);
      setError(null); 
    } catch (err) {
      console.error(`Error fetching history for device ${deviceId}:`, err.message);
      setError(`Không thể tải lịch sử thiết bị ${deviceId}: ${err.message}`);
    }
  };

  const handleDeviceToggle = async (device, newStatus) => {
    if (isAutoMode) {
      alert("Manual control is disabled in Auto mode.");
      return;
    }

    const originalDevices = [...devices];
    const newDevices = devices.map((d) =>
      d.id === device.id
        ? { ...d, status: newStatus ? "Run" : "Inactive" }
        : d
    );
    setDevices(newDevices);

    try {
      const value = newStatus ? 1 : 0;
      await controlDevice(device.id, value);
      console.log(`Device ${device.id} toggled to ${newStatus ? "Bật" : "Tắt"}`);
    } catch (err) {
      setDevices(originalDevices);
      setError(`Không thể điều khiển thiết bị ${device.name}: ${err.message}`);
      console.error("Error controlling device:", err);
    }
  };

  const handleControlModeToggle = async (checked) => {
    try {
      const status = checked ? 1 : 0;
      const success = await setControlMode(status);
      if (success) {
        setIsAutoMode(checked);
      } else {
        alert("Không thể thay đổi chế độ điều khiển.");
      }
    } catch (err) {
      alert(`Lỗi khi đổi chế độ điều khiển: ${err.message}`);
    }
  };

  return (
    <>
      <SideBar />
      <div className="p-6 sm:ml-64 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold">Danh sách thiết bị</h2>
            
            <div className="flex items-center bg-gray-100 p-2 rounded-lg">
              <span className={`px-2 text-sm font-medium ${!isAutoMode ? "text-blue-600 font-bold" : "text-gray-500"}`}>
                Thủ công
              </span>
              <Switch 
                checked={isAutoMode} 
                onCheckedChange={handleControlModeToggle}
              />
              <span className={`px-2 text-sm font-medium ${isAutoMode ? "text-green-600 font-bold" : "text-gray-500"}`}>
                Tự động
              </span>
            </div>
          </div>
        </div>

        <div className={`p-3 mb-4 rounded-md ${isAutoMode ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
          <p>
            {isAutoMode 
              ? "Chế độ tự động đang kích hoạt. Các thiết bị sẽ được điều khiển tự động và không thể điều khiển thủ công."
              : "Chế độ thủ công đang kích hoạt. Bạn có thể điều khiển trực tiếp các thiết bị."}
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="p-3">Tên thiết bị</th>
                  <th className="p-3">Vị trí</th>
                  <th className="p-3">Mã thiết bị</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3">Điều khiển</th>
                  <th className="p-3">Thông tin</th>
                </tr>
              </thead>
              <tbody>
                {devices.length > 0 ? (
                  devices.map((device, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{device.name}</td>
                      <td className="p-3">{device.location}</td>
                      <td className="p-3">{device.id}</td>
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
                        <Switch 
                          checked={device.status === "Run"} 
                          onCheckedChange={(checked) => handleDeviceToggle(device, checked)}
                          disabled={isAutoMode}
                        />
                      </td>
                      <td className="p-3">
                        <button
                          className="px-3 py-1 text-blue-600 rounded-md hover:bg-blue-100"
                          onClick={() => fetchDeviceHistory(device.id)}
                        >
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center">No devices found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {showDeviceInfo && selectedDevice && (
          <DeviceInfo
            isOpen={showDeviceInfo}
            onClose={() => setShowDeviceInfo(false)}
            device={selectedDevice}
            logs={deviceLogs}
          />
        )}
      </div>
    </>
  );
};

export default DeviceList;
