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
import {
  fetchLatestWeatherData,
  getWeatherHourly,
  getWeatherDaily,
} from "../../apis/WeatherAPI.js";

// Combined Weather Card Component
const CombinedWeatherCard = ({ data }) => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-xl shadow-md text-gray-800 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="text-5xl font-bold">
          <FontAwesomeIcon
            icon={faTemperatureHalf}
            className="mr-2 text-red-500"
          />
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
          <FontAwesomeIcon
            icon={faSeedling}
            className="text-green-600 text-lg"
          />
          <div className="text-sm">Độ ẩm đất</div>
          <div className="font-semibold">{data.soilMoisture}%</div>
        </div>
        <div>
          <FontAwesomeIcon
            icon={faLightbulb}
            className="text-yellow-500 text-lg"
          />
          <div className="text-sm">Ánh sáng</div>
          <div className="font-semibold">{data.lux} lux</div>
        </div>
      </div>
    </div>
  );
};

export default function Weather() {
  const [selectedTab, setSelectedTab] = useState("Ngày");
  const [weatherData, setWeatherData] = useState({
    temperature: "--",
    humidity: "--",
    soilMoisture: "--",
    lux: "--",
    timestamp: "--:--",
    rawTimestamp: null,
  });
  const [chartData, setChartData] = useState([]);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);

  // Define the refresh interval (3 minutes = 180000 milliseconds)
  const REFRESH_INTERVAL = 150000;

  const fetchWeatherAndChartData = async () => {
    setIsWeatherLoading(true);
    setIsChartLoading(true);

    try {
      // Fetch latest weather data and chart data in parallel
      const [weatherResponse, chartResponse] = await Promise.all([
        fetchLatestWeatherData(),
        fetchChartData(),
      ]);

      // Update weather data
      if (weatherResponse) {
        setWeatherData({
          temperature: weatherResponse.temperature,
          humidity: weatherResponse.humidity,
          soilMoisture: weatherResponse.soilMoisture,
          lux: weatherResponse.lux,
          timestamp: new Date(
            weatherResponse.timestamp.replace(/Z$/, "")
          ).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          rawTimestamp: weatherResponse.timestamp,
        });
      }

      // Update chart data
      if (chartResponse) {
        setChartData(chartResponse);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsWeatherLoading(false);
      setIsChartLoading(false);
    }
  };

  const fetchChartData = async () => {
    if (!weatherData.rawTimestamp) return [];

    try {
      const baseDate = new Date(weatherData.rawTimestamp);
      const currentDate = new Date();
      let startDateStr, endDateStr, data;

      if (selectedTab === "Ngày") {
        startDateStr = baseDate.toISOString().split("T")[0] + "T00:00:00Z";
        data = await getWeatherHourly(startDateStr);

        if (data) {
          console.log("Fetched hourly data for chart:", data);
          return Object.entries(data).map(([hour, values]) => {
            const timestamp = new Date(startDateStr);
            timestamp.setUTCHours(parseInt(hour), 0, 0, 0);
            return {
              timestamp: timestamp.toISOString(),
              temperature: values.temperature,
              humidity: values.humidity,
              soilMoisture: values.soil_moisture,
              lux: values.lux,
            };
          });
        }
      } else {
        if (selectedTab === "Tuần") {
          const startOfWeek = new Date(baseDate);
          startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());
          const earliestDate = new Date("2025-05-01");
          startDateStr =
            startOfWeek < earliestDate
              ? earliestDate.toISOString().split("T")[0]
              : startOfWeek.toISOString().split("T")[0];

          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          const endDateToUse = endOfWeek > currentDate ? currentDate : endOfWeek;
          endDateStr = endDateToUse.toISOString().split("T")[0];
        } else if (selectedTab === "Tháng") {
          const startOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
          const earliestDate = new Date("2025-05-01");
          startDateStr =
            startOfMonth < earliestDate
              ? earliestDate.toISOString().split("T")[0]
              : startOfMonth.toISOString().split("T")[0];

          const endOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
          const endDateToUse = endOfMonth > currentDate ? currentDate : endOfMonth;
          endDateStr = endDateToUse.toISOString().split("T")[0];
        }

        data = await getWeatherDaily(startDateStr, endDateStr);

        if (data) {
          console.log("Fetched daily data for chart:", data);
          return Object.entries(data).map(([date, values]) => {
            const timestamp = new Date(date + "T00:00:00Z");
            return {
              timestamp: timestamp.toISOString(),
              temperature: values.temperature,
              humidity: values.humidity,
              soilMoisture: values.soil_moisture,
              lux: values.lux,
            };
          });
        }
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
      return [];
    }
  };


  useEffect(() => {
    fetchWeatherAndChartData();
    const intervalId = setInterval(() => {
      fetchWeatherAndChartData();
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Fetch chart data when the tab changes
    if (weatherData.rawTimestamp) {
      fetchChartData().then((data) => {
        setChartData(data);
        setIsChartLoading(false);
      });
    }
  }, [selectedTab, weatherData.rawTimestamp]);

  return (
    <>
      <SideBar />
      <div className="p-6 sm:ml-64 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Header Section: Title, Weather Card, and Update Button */}
        <div className="max-w-4xl mx-auto">

          {/* Update Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={fetchWeatherAndChartData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faRotateRight} />
            </button>
          </div>

          {/* Weather Card */}
          {isWeatherLoading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              Đang tải dữ liệu thời tiết...
            </div>
          ) : (
            <CombinedWeatherCard data={weatherData} />
          )}
        </div>

        {/* Chart Section: Heading, Tabs, and Chart */}
        <div className="max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
            Biểu đồ dữ liệu
          </h2>

          {/* Tabs for Chart */}
          <div className="text-sm font-medium text-center text-gray-500 dark:text-gray-400 mb-4">
            <ul className="flex justify-center -mb-px">
              {["Ngày", "Tuần", "Tháng"].map((label) => (
                <li key={label} className="me-2">
                  <button
                    className={`inline-block p-4 border-b-2 ${
                      selectedTab === label
                        ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                        : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                    } rounded-t-lg font-semibold`}
                    onClick={() => setSelectedTab(label)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Chart */}
          <div className="w-full h-[400px]">
            {isChartLoading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                Đang tải biểu đồ...
              </div>
            ) : chartData.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                Không có dữ liệu để hiển thị
              </div>
            ) : (
              <Chart weatherData={weatherData} selectedTab={selectedTab} chartData={chartData} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
