import React, { useState } from "react";
import SideBar from "../../components/SideBar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSeedling,
  faTemperatureHalf,
  faWind,
  faLightbulb,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import Chart from "../../components/Chart.jsx";
import { fetchLatestWeatherData } from "../../apis/apis.js";

// Component WeatherCard
const WeatherCard = ({ title, icon, value, updatedAt }) => {
  return (
    <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-center mb-2">
        <h5 className="text-xl font-regular tracking-tight text-gray-900 dark:text-white">
          <FontAwesomeIcon
            icon={icon}
            className="mr-2 text-blue-500"
            size="lg"
          />
          {title}
        </h5>
        <p className="text-sm text-gray-500 dark:text-gray-400">{updatedAt}</p>
      </div>
      <p className="text-2xl text-center font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
};

export default function Weather() {
  const [selectedTab, setSelectedTab] = useState("Ngày");

  const [weatherData, setWeatherData] = useState([
    {
      title: "Nhiệt độ",
      icon: faTemperatureHalf,
      value: "Đang tải...",
      updatedAt: "--:--",
    },
    {
      title: "Độ ẩm không khí",
      icon: faWind,
      value: "Đang tải...",
      updatedAt: "--:--",
    },
    {
      title: "Độ ẩm đất",
      icon: faSeedling,
      value: "Đang tải...",
      updatedAt: "--:--",
    },
    {
      title: "Lux",
      icon: faLightbulb,
      value: "Đang tải...",
      updatedAt: "--:--",
    },
  ]);

  const updateWeatherData = async () => {
    const newData = await fetchLatestWeatherData();
    if (newData) {
      setWeatherData([
        {
          title: "Nhiệt độ",
          icon: faTemperatureHalf,
          value: `${newData.temperature.value}°C`,
          updatedAt: newData.temperature.timestamp,
        },
        {
          title: "Độ ẩm không khí",
          icon: faWind,
          value: `${newData.humidity.value}%`,
          updatedAt: newData.humidity.timestamp,
        },
        {
          title: "Độ ẩm đất",
          icon: faSeedling,
          value: `${newData.soilMoisture.value}%`,
          updatedAt: newData.soilMoisture.timestamp,
        },
        {
          title: "Lux",
          icon: faLightbulb,
          value: `${newData.lux.value} lux`,
          updatedAt: newData.lux.timestamp,
        },
      ]);
    }
  };

  return (
    <>
      <SideBar />
      <div className="p-6 sm:ml-64 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Tabs chọn thời gian */}
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
        {/* Nút cập nhật dữ liệu */}
        <button
          className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          onClick={updateWeatherData}
        >
          <FontAwesomeIcon icon={faRotateRight} />
        </button>

        {/* Weather cards - bố cục 2x2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 max-w-4xl mx-auto">
          {weatherData.map((data, index) => (
            <WeatherCard
              key={index}
              title={data.title}
              icon={data.icon}
              value={data.value}
              updatedAt={data.updatedAt}
            />
          ))}
        </div>
        {/* Biểu đồ - thu hẹp và căn giữa */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-0">
          <div className="w-full h-[400px]">
            <Chart />
          </div>
        </div>
      </div>
    </>
  );
}
