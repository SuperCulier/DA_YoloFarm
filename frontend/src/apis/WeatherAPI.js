import axios from 'axios'
import { GET_WEATHER_DATA_API } from "../apis/apis"

export const fetchLatestWeatherData = async () => {
  try {
    const response = await axios.get(GET_WEATHER_DATA_API);
    console.log(response)

    const data = response.data;
    
    return {
      temperature: data.temperature,
      humidity: data.humidity,
      soilMoisture: data.soil_moisture,
      lux: data.lux,
      timestamp: data.timestamp,
    };
  } catch (error) {
      console.error('Error fetching weather data:', error.message);
  }
};
