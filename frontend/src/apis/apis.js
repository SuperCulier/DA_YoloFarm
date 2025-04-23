export const BASE_URL = "http://localhost:8000";

export const GET_WEATHER_DATA_API = `${BASE_URL}/show-last-data`;

export const LOGIN_API = `${BASE_URL}/login`;

export const DEVICES_API = `${BASE_URL}/device`;

export const GET_DEVICE_API = (deviceId) => `${DEVICES_API}/${deviceId}`;

