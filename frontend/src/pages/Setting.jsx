import { useState } from "react";
import SideBar from "../components/SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTemperatureHalf, faDroplet, faSeedling, faSun } from "@fortawesome/free-solid-svg-icons";
import { setThreshold } from "../apis/ThresholdAPI";

export default function Setting() {
  // State for min and max thresholds for each parameter
  const [temperatureMin, setTemperatureMin] = useState(15);
  const [temperatureMax, setTemperatureMax] = useState(25);
  const [humidityMin, setHumidityMin] = useState(40);
  const [humidityMax, setHumidityMax] = useState(50);
  const [soilMoistureMin, setSoilMoistureMin] = useState(30);
  const [soilMoistureMax, setSoilMoistureMax] = useState(40);
  const [luxMin, setLuxMin] = useState(800);
  const [luxMax, setLuxMax] = useState(1000);
  
  // Add loading and success states
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Handler to ensure max is not less than min
  const handleMinMax = (minSetter, maxSetter, minValue, maxValue, newValue, isMin) => {
    if (isMin) {
      if (newValue <= maxValue) minSetter(newValue);
      else minSetter(maxValue);
    } else {
      if (newValue >= minValue) maxSetter(newValue);
      else maxSetter(minValue);
    }
  };

  // Function to handle saving all thresholds
  const handleSaveThresholds = async () => {
    setIsLoading(true);
    setSaveStatus(null);
    
    try {
      // Create an array of all the threshold settings
      const thresholdSettings = [
        { name: "temperature", minValue: temperatureMin, maxValue: temperatureMax },
        { name: "humidity", minValue: humidityMin, maxValue: humidityMax },
        { name: "soilMoisture", minValue: soilMoistureMin, maxValue: soilMoistureMax },
        { name: "lux", minValue: luxMin, maxValue: luxMax }
      ];
      
      // Call the API for each threshold setting
      const results = await Promise.all(
        thresholdSettings.map(setting => 
          setThreshold(setting.name, setting.minValue, setting.maxValue)
        )
      );
      
      // Check if all API calls were successful
      const allSuccessful = results.every(result => result === true);
      
      if (allSuccessful) {
        setSaveStatus("success");
        // Reset status after 3 seconds
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Error saving thresholds:", error);
      setSaveStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SideBar />
      <div className="p-6 sm:ml-64 bg-gray-50 dark:bg-gray-900 min-h-screen flex justify-center">
        <div className="max-w-4xl w-full">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">
            Thiết lập ngưỡng cảnh báo
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Temperature Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faTemperatureHalf} className="text-gray-600 text-2xl" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
                  Nhiệt độ
                </h2>
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 dark:text-gray-300 mb-1">Min</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={temperatureMin}
                  onChange={(e) => handleMinMax(setTemperatureMin, setTemperatureMax, temperatureMin, temperatureMax, Number(e.target.value), true)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                />
                <div className="text-center mt-3 text-gray-600 dark:text-gray-300 font-medium">
                  {temperatureMin}°C
                </div>
              </div>
              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-1">Max</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={temperatureMax}
                  onChange={(e) => handleMinMax(setTemperatureMin, setTemperatureMax, temperatureMin, temperatureMax, Number(e.target.value), false)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                />
                <div className="text-center mt-3 text-gray-600 dark:text-gray-300 font-medium">
                  {temperatureMax}°C
                </div>
              </div>
            </div>

            {/* Humidity Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faDroplet} className="text-gray-600 text-2xl" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
                  Độ ẩm
                </h2>
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 dark:text-gray-300 mb-1">Min</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={humidityMin}
                  onChange={(e) => handleMinMax(setHumidityMin, setHumidityMax, humidityMin, humidityMax, Number(e.target.value), true)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                />
                <div className="text-center mt-3 text-gray-600 dark:text-gray-300 font-medium">
                  {humidityMin}%
                </div>
              </div>
              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-1">Max</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={humidityMax}
                  onChange={(e) => handleMinMax(setHumidityMin, setHumidityMax, humidityMin, humidityMax, Number(e.target.value), false)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                />
                <div className="text-center mt-3 text-gray-600 dark:text-gray-300 font-medium">
                  {humidityMax}%
                </div>
              </div>
            </div>

            {/* Soil Moisture Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faSeedling} className="text-gray-600 text-2xl" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
                  Độ ẩm đất
                </h2>
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 dark:text-gray-300 mb-1">Min</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soilMoistureMin}
                  onChange={(e) => handleMinMax(setSoilMoistureMin, setSoilMoistureMax, soilMoistureMin, soilMoistureMax, Number(e.target.value), true)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                />
                <div className="text-center mt-3 text-gray-600 dark:text-gray-300 font-medium">
                  {soilMoistureMin}%
                </div>
              </div>
              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-1">Max</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soilMoistureMax}
                  onChange={(e) => handleMinMax(setSoilMoistureMin, setSoilMoistureMax, soilMoistureMin, soilMoistureMax, Number(e.target.value), false)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                />
                <div className="text-center mt-3 text-gray-600 dark:text-gray-300 font-medium">
                  {soilMoistureMax}%
                </div>
              </div>
            </div>

            {/* Lux Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faSun} className="text-gray-600 text-2xl" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
                  Lux
                </h2>
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 dark:text-gray-300 mb-1">Min</label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={luxMin}
                  onChange={(e) => handleMinMax(setLuxMin, setLuxMax, luxMin, luxMax, Number(e.target.value), true)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                />
                <div className="text-center mt-3 text-gray-600 dark:text-gray-300 font-medium">
                  {luxMin} lux
                </div>
              </div>
              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-1">Max</label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={luxMax}
                  onChange={(e) => handleMinMax(setLuxMin, setLuxMax, luxMin, luxMax, Number(e.target.value), false)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                />
                <div className="text-center mt-3 text-gray-600 dark:text-gray-300 font-medium">
                  {luxMax} lux
                </div>
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSaveThresholds}
              disabled={isLoading}
              className={`px-8 py-3 rounded-lg font-medium text-white transition-colors duration-300 ${
                isLoading 
                  ? "bg-gray-500" 
                  : saveStatus === "success"
                  ? "bg-green-500 hover:bg-green-600" 
                  : saveStatus === "error"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isLoading 
                ? "Đang lưu..." 
                : saveStatus === "success" 
                ? "Lưu thành công!" 
                : saveStatus === "error" 
                ? "Lưu thất bại" 
                : "Lưu cài đặt"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
