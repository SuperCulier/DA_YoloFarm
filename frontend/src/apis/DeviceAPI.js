import axios from "axios";
import { DEVICES_API, GET_DEVICE_API } from "./apis";

export const createDevice = async (deviceData) => {
  try {
    const response = await axios.post(DEVICES_API, deviceData);
    return response.data;
  } catch (error) {
    console.error('Error creating device:', error.message);
    throw error;
  }
}

export const getDeviceDetail = async (deviceId) => {
  try {
    const response = await axios.get(GET_DEVICE_API(deviceId));
    return response.data;
  } catch (error) {
    console.error(`Error fetching device ${deviceId}:`, error.message);
    throw error;
  }
}
