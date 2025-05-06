import axios from "axios";
import {
  GET_WEATHER_DATA_API,
  GET_WEATHER_HOURLY_API,
  GET_WEATHER_DAILY_API,
} from "../apis/apis";

export const fetchLatestWeatherData = async () => {
  try {
    const response = await axios.get(GET_WEATHER_DATA_API);
    console.log(response);

    const data = response.data;

    return {
      temperature: data.temperature,
      humidity: data.humidity,
      soilMoisture: data.soil_moisture,
      lux: data.lux,
      timestamp: data.timestamp,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
  }
};

export const getWeatherHourly = async (date) => {
  try {
    const response = await axios.post(GET_WEATHER_HOURLY_API, {date});
    const chartData = Object.entries(response.data).map(([hour, values]) => ({
      timestamp: new Date(`${date}T${hour.padStart(2, "0")}:00:00`).getTime(),
      temperature: parseFloat(values.temperature.toFixed(1)),
      humidity: parseFloat(values.humidity.toFixed(1)),
      soil_moisture: parseFloat(values.soil_moisture.toFixed(1)),
      lux: parseFloat(values.lux.toFixed(1)),
    }));

    console.log("Transformed hourly data:", chartData);
    return chartData;
  } catch (error) {
    console.error("Error fetching hourly weather data:", error);
    throw error;
  }
};

export const getWeatherDaily = async (start_date, end_date) => {
  try {
    const response = await axios.post(GET_WEATHER_DAILY_API, {
      start_day: start_date,
      end_day: end_date,
    });
    const roundedData = {};

    // Assuming response.data is an object with date keys
    Object.entries(response.data).forEach(([date, values]) => {
      roundedData[date] = {
        temperature: parseFloat(values.temperature.toFixed(1)),
        humidity: parseFloat(values.humidity.toFixed(1)),
        soil_moisture: parseFloat(values.soil_moisture.toFixed(1)),
        lux: parseFloat(values.lux.toFixed(1)),
      };
    });

    console.log("Rounded daily data:", roundedData);
    return roundedData;
  } catch (error) {
    console.error("Error fetching daily weather data:", error);
    throw error;
  }
}
