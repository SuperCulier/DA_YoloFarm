import axios from 'axios'
import { GET_WEATHER_DATA } from "../apis/apis"

export const fetchLatestWeatherData = async () => {
  try {
    const response = await axios.get(GET_WEATHER_DATA);
    console.log(response)
    // if (!response) {
    //   throw new Error("Failed to fetch weather data");
    // }

    const data = response.data;
    
    return {
      temperature: data.temperature,
      humidity: data.humidity,
      soilMoisture: data.soil_moisture,
      lux: data.lux,
      timestamp: data.timestamp,
    };
  } catch (error) {
    // Axios errors often have response details
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error fetching weather data - Status:", error.response.status);
      console.error("Error fetching weather data - Data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error fetching weather data - No response:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error fetching weather data:', error.message);
    }
    return null; // Indicate failure
  }
};
