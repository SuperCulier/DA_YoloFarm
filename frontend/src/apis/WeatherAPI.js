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

export const getWeatherHourly = async () => {
  try {
    const response = await axios.get(GET_WEATHER_HOURLY_API);
    console.log(response.data);
    return{
      
    }
  } catch (error) {}
};
