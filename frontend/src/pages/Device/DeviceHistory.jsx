const HistoryPopup = ({ onClose }) => {
  const historyData = [
    { name: "Bơm 1", location: "Vườn 1", id: "P-01", time: "05/03/2025 12:00:50", value: "80%", status: "Run" },
    { name: "Bơm 1", location: "Vườn 1", id: "P-01", time: "03/03/2025 15:30:31", value: "30%", status: "Inactive" },
    { name: "Bơm 1", location: "Vườn 1", id: "P-01", time: "03/03/2025 17:05:59", value: "60%", status: "Inactive" },
  ];

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/50 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📜 Lịch sử hoạt động</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            ✖
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="🔍"
            className="p-2 border rounded-md w-1/2"
          />
          {/* <select className="p-2 border rounded-md">
            <option>Mới nhất</option>
            <option>Cũ nhất</option>
          </select> */}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="p-3">Tên thiết bị</th>
                <th className="p-3">Vị trí</th>
                <th className="p-3">Mã thiết bị</th>
                <th className="p-3">Thời gian hoạt động</th>
                <th className="p-3">Thông số</th>
                <th className="p-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((entry, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{entry.name}</td>
                  <td className="p-3">{entry.location}</td>
                  <td className="p-3">{entry.id}</td>
                  <td className="p-3">{entry.time}</td>
                  <td className="p-3">{entry.value}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs ${
                        entry.status === "Run"
                          ? "bg-green-500"
                          : entry.status === "Inactive"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button className="px-3 py-1 border rounded-md mx-1">◀</button>
          <button className="px-3 py-1 border rounded-md mx-1 bg-blue-500 text-white">1</button>
          <button className="px-3 py-1 border rounded-md mx-1">2</button>
          <button className="px-3 py-1 border rounded-md mx-1">▶</button>
        </div>
      </div>
    </div>
  );
};

export default HistoryPopup;
