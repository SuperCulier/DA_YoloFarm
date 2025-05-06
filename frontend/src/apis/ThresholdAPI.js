import axios from "axios";
import { SET_THRESHOLD_API, GET_THRESHOLD_ALERT_API } from "./apis";

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

export const getThresholdAlerts = async () => {
  const socket = new WebSocket(GET_THRESHOLD_ALERT_API);
  socket.onopen = () => {
    console.log("WebSocket connection opened");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    try {
      const message = JSON.parse(event.data);
      if (message.type === "alert") {
        console.log("Received alert:", message.data);
        // You can update UI or notify user here
      }
    } catch (e) {
      console.error("Invalid message:", event.data);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket closed");
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };

  return () => {
    socket.close();
  };
}
