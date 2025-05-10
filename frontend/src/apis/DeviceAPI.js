import axios from "axios";
import {
  GET_DEVICES_API,
  GET_DEVICE_LOG_API,
  CONTROL_DEVICE_API,
} from "./apis";

export const getDeviceList = async () => {
  try {
    console.log("Fetching devices from:", GET_DEVICES_API);
    const response = await axios.get(GET_DEVICES_API);
    console.log("Device API response:", response.data);

    return response.data.map((device) => ({
      deviceId: device.id,
      name: device.name,
      status: device.status,
    }));
  } catch (error) {
    console.error(`Error fetching device list: ${error.message}`);
    throw new Error(`Failed to fetch device list: ${error.message}`);
  }
};

export const getDeviceLog = async (deviceId) => {
  try {
    console.log(`Fetching logs for device ${deviceId}...`);
    
    const response = await fetch(GET_DEVICE_LOG_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: deviceId }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Device log response:", data);
    
    return data.map((log) => ({
      id: log.id,
      deviceName: log.device_name,
      action: log.action,
      timestamp: log.timestamp,
    }));
  } catch (error) {
    console.error("Error fetching device log:", error.message);
    throw new Error(`Failed to fetch device log: ${error.message}`);
  }
};

export const controlDevice = async (deviceId, value) => {
  try {
    const response = await axios.post(CONTROL_DEVICE_API, {
      id: deviceId,
      value: value,
    });
    console.log(`Control device ${deviceId} response:`, response.status);
    return response.status === 200;
  } catch (error) {
    console.error(`Error control device: ${error.message}`);
    throw new Error(`Failed to control device: ${error.message}`);
  }
};
