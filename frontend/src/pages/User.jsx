import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";

export default function User() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Load alerts from localStorage
    const stored = JSON.parse(localStorage.getItem("alerts") || "[]");

    // Mark all as read
    const updated = stored.map((a) => ({ ...a, read: true }));
    localStorage.setItem("alerts", JSON.stringify(updated));

    setAlerts(updated);
  }, []);

  return (
    <>
      <SideBar />
      <div className="max-w-2xl mx-auto mt-8 p-4">
        <h1 className="text-2xl font-semibold mb-4">Thông báo</h1>

        {alerts.length === 0 ? (
          <p className="text-gray-500">Không có thông báo nào.</p>
        ) : (
          <ul className="space-y-4">
            {alerts
              .sort((a, b) => b.id - a.id)
              .map((alert) => (
                <li
                  key={alert.id}
                  className="p-4 bg-white shadow rounded-lg border border-gray-200"
                >
                  <p className="text-gray-800">{alert.text}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(alert.id).toLocaleString()}
                  </p>
                </li>
              ))}
          </ul>
        )}
      </div>
    </>
  );
}
