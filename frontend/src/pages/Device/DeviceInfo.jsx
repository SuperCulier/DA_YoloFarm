import React, { useState } from "react";

const DeviceInfo = ({ isOpen, onClose, device, logs }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!isOpen) return null;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = logs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(logs.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/50 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Thông tin thiết bị: {device.name}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            ✖
          </button>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-md">
          <p><strong>Mã thiết bị:</strong> {device.id}</p>
          <p><strong>Vị trí:</strong> {device.location}</p>
          <p><strong>Trạng thái hiện tại:</strong> {device.status}</p>
        </div>

        <h3 className="text-lg font-semibold mb-2">Lịch sử hoạt động</h3>
        
        {logs.length > 0 ? (
          <>
            <table className="w-full text-sm text-left text-gray-500 border border-gray-200 mb-4">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="p-3">STT</th>
                  <th className="p-3">Hành động</th>
                  <th className="p-3">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log, index) => (
                  <tr key={log.id} className="border-b">
                    <td className="p-3">{indexOfFirstItem + index + 1}</td>
                    <td className="p-3">{log.action}</td>
                    <td className="p-3">{new Date(log.timestamp).toLocaleString("vi-VN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination */}
            {totalPages > 1 && (
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
          </>
        ) : (
          <p className="text-center py-4">Không có dữ liệu lịch sử cho thiết bị này</p>
        )}
      </div>
    </div>
  );
};

export default DeviceInfo;
