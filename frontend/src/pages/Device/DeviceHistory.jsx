import { useState, useEffect } from "react";
import { getDeviceLog } from "../../apis/DeviceAPI";

const HistoryPopup = ({ onClose }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchDeviceLogs = async () => {
      try {
        setLoading(true);
        // Fetch logs for all devices by not specifying a deviceId
        // You can modify this to filter by specific device if needed
        const logs = await getDeviceLog();
        setHistoryData(logs);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching device logs:", err);
        setError("Failed to load device history. Please try again later.");
        setLoading(false);
      }
    };

    fetchDeviceLogs();
  }, []);

  // Filter data based on search term
  const filteredData = historyData.filter(
    (entry) =>
      entry.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/50 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📜 Lịch sử hoạt động</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            ✖
          </button>
        </div>

        {/* Search */}
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm"
            className="p-2 border rounded-md w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="p-3">Mã</th>
                  <th className="p-3">Tên thiết bị</th>
                  <th className="p-3">Hành động</th>
                  <th className="p-3">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((entry) => (
                    <tr key={entry.id} className="border-b">
                      <td className="p-3">{entry.id}</td>
                      <td className="p-3">{entry.deviceName}</td>
                      <td className="p-3">{entry.action}</td>
                      <td className="p-3">
                        {new Date(entry.timestamp).toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center">
                      {searchTerm ? "Không tìm thấy kết quả" : "Không có dữ liệu lịch sử"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredData.length > 0 && (
          <div className="flex justify-center mt-4">
            <button 
              className={`px-3 py-1 border rounded-md mx-1 ${currentPage === 1 ? 'text-gray-400' : 'hover:bg-gray-100'}`}
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ◀
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                className={`px-3 py-1 border rounded-md mx-1 ${
                  number === currentPage ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            ))}
            
            <button 
              className={`px-3 py-1 border rounded-md mx-1 ${currentPage === totalPages ? 'text-gray-400' : 'hover:bg-gray-100'}`}
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPopup;
