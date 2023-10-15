import { api } from "./index";

const getLocations = async (query) =>
  api.get(`/geo/1.0/direct?q=${query}&limit=5`);

const getWeatherByCoords = async (query) =>
  api.get(`/data/2.5/weather?lat=${query.lat}&lon=${query.lon}`);

export { getLocations, getWeatherByCoords };
