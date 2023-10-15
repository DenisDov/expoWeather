import axios from "axios";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_WEATHER_API_URL,
  params: {
    appid: process.env.EXPO_PUBLIC_WEATHER_API_KEY,
    units: "metric",
  },
});
