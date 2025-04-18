import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTemperatureHalf,
  faWind,
  faLightbulb,
  faSeedling,
  faRotateRight,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import Chart from "../../components/Chart.jsx";
import { fetchLatestWeatherData } from "../../apis/WeatherAPI.js";

// Combined Weather Card Component
const CombinedWeatherCard = ({ data }) => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-xl shadow-md text-gray-800 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="text-5xl font-bold">
          <FontAwesomeIcon icon={faTemperatureHalf} className="mr-2 text-red-500" />
          {data.temperature}°
        </div>
        <div className="text-right text-sm text-gray-500 dark:text-gray-300">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>Vườn nhà</span>
          </div>
          <div>Cập nhật lúc {data.timestamp}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center border-t pt-4">
        <div>
          <FontAwesomeIcon icon={faWind} className="text-blue-500 text-lg" />
          <div className="text-sm">Độ ẩm</div>
          <div className="font-semibold">{data.humidity}%</div>
        </div>
        <div>
          <FontAwesomeIcon icon={faSeedling} className="text-green-600 text-lg" />
          <div className="text-sm">Độ ẩm đất</div>
          <div className="font-semibold">{data.soilMoisture}%</div>
        </div>
        <div>
          <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500 text-lg" />
          <div className="text-sm">Ánh sáng</div>
          <div className="font-semibold">{data.lux} lux</div>
        </div>
      </div>
    </div>
  );
};

export default function Weather() {
  const [selectedTab, setSelectedTab] = useState("Ngày");
  const [weatherData, setWeatherData] = useState(null);

  const updateWeatherData = async () => {
    const data = await fetchLatestWeatherData();
    if (data) {
      setWeatherData({
        temperature: data.temperature,
        humidity: data.humidity,
        soilMoisture: data.soilMoisture,
        lux: data.lux,
        timestamp: new Date(data.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }    
  };

  useEffect(() => {
    updateWeatherData();
  }, []);

  return (
    <>
      <SideBar />
      <div className="p-6 sm:ml-64 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Tabs */}
        <div className="text-sm font-medium text-center text-gray-500 dark:text-gray-400 mb-6">
          <ul className="flex flex-wrap justify-center -mb-px">
            {["Ngày", "Tuần", "Tháng"].map((label) => (
              <li key={label} className="me-2">
                <a
                  href="#"
                  className={`inline-block p-4 border-b-2 ${
                    selectedTab === label
                      ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  } rounded-t-lg font-semibold`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedTab(label);
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Update button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={updateWeatherData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faRotateRight} />
          </button>
        </div>

        {/* Weather Card */}
        {weatherData && <CombinedWeatherCard data={weatherData} />}

        {/* Chart */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-0 mt-8">
          <div className="w-full h-[400px]">
            <Chart />
          </div>
        </div>
      </div>
    </>
  );
}
