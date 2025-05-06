export const BASE_URL = "http://localhost:8000";

export const GET_WEATHER_DATA_API = `${BASE_URL}/show-last-data`;

export const LOGIN_API = `${BASE_URL}/login`;

export const GET_DEVICES_API = `${BASE_URL}/device/list`;

export const GET_DEVICE_LOG_API = `${BASE_URL}/device/logs`;

export const CONTROL_DEVICE_API = `${BASE_URL}/device/control`;

export const SET_CONTROL_MODE_API = `${BASE_URL}/device/control/auto`;

export const GET_WEATHER_HOURLY_API = `${BASE_URL}/environment/hourlyData`;

export const GET_WEATHER_DAILY_API = `${BASE_URL}/environment/historyData`;

export const SET_THRESHOLD_API = `${BASE_URL}/environment/set-threshold`;

export const GET_THRESHOLD_ALERT_API = `ws://localhost:8000/ws/alerts`;
