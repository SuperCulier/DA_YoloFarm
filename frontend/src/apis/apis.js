const API_BASE_URL = "http://localhost:8000";

export const fetchLatestWeatherData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/show-last-data`);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    console.log("aaaa")
    const data = await response.json();
    return {
      temperature: {
        value: data.temperature.value,
        timestamp: data.temperature.timestamp,
      },
      humidity: {
        value: data.humidity.value,
        timestamp: data.humidity.timestamp,
      },
      lux: {
        value: data.lux.value,
        timestamp: data.lux.timestamp,
      },
      soilMoisture: {
        value: data.soil_moisture.value,
        timestamp: data.soil_moisture.timestamp,
      },
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};
