import axios from "axios";
import { SET_THRESHOLD_API } from "./apis";

export const setThreshold = async (name, minValue, maxValue) => {
  try {
    const response = await axios.put(SET_THRESHOLD_API, {
      name,
      minValue,
      maxValue,
    });

    console.log(`Set threshold ${name} response:`, response.status);
    return response.status === 200;
  } catch (error) {
    console.error(`Error setting ${name} threshold: ${error.message}`);
    throw new Error(`Failed to set ${name} threshold: ${error.message}`);
  }
};
