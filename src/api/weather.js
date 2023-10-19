import { api } from "./index";

const getLocations = async (query) =>
  api.get(`/geo/1.0/direct?q=${query}&limit=5`);

const getWeatherByCoords = async (coords) =>
  api.get(`/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}`);

export { getLocations, getWeatherByCoords };
