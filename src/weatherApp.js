import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { timestampToTime } from "./utils/timestampToTime";
import { degreesToDirection } from "./utils/degreesToDirection";
import { getLocations, getWeatherByCoords } from "./api/weather";
import { isEmpty } from "./utils/isEmpty";
import useDebounce from "./hooks/useDebounce";

const WeatherApp = () => {
  const [query, setQuery] = useState("");
  const debouncedValue = useDebounce(query, 500);

  const [locations, setLocations] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [coords, setCoords] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchLocations() {
    try {
      const response = await getLocations(query);
      setLocations(response.data);
    } catch (error) {
      setError(error.response);
    }
  }

  async function fetchWeatherByCoords() {
    setLoading(true);
    try {
      const response = await getWeatherByCoords(coords);
      setWeatherData(response.data);
    } catch (error) {
      setError(error.response);
    } finally {
      setLoading(false);
      setLocations(null);
      setQuery("");
    }
  }

  useEffect(() => {
    if (!query || query.trim() === "") return;
    fetchLocations();
  }, [debouncedValue]);

  useEffect(() => {
    if (isEmpty(coords)) return;
    fetchWeatherByCoords();
  }, [coords]);

  function renderWeather() {
    const temperature = Math.round(weatherData.main.temp);
    const tempFeels = Math.round(weatherData.main.feels_like);
    const description = weatherData.weather[0].description;
    const pressure = weatherData.main.pressure;
    const sunrise = timestampToTime(weatherData.sys.sunrise);
    const sunset = timestampToTime(weatherData.sys.sunset);
    const windSpeed = Math.round(weatherData.wind.speed);
    const windDirection = degreesToDirection(weatherData.wind.deg);

    if (loading) {
      return (
        <ActivityIndicator
          size="large"
          color="tomato"
          style={styles.activityIndicator}
        />
      );
    }

    return (
      <>
        <Text>Temperature: {temperature}°C</Text>
        <Text>Feels like: {tempFeels}°C</Text>
        <Text>Description: {description}</Text>
        <Text>Pressure: {pressure} hPa</Text>
        <Text>Sunrise: {sunrise}</Text>
        <Text>Sunset: {sunset}</Text>
        <Text>
          Wind speed: {windSpeed} km/h
          {windSpeed > 0 ? ` from ${windDirection}` : ""}
        </Text>
      </>
    );
  }

  return (
    <View style={{ padding: 16 }}>
      <TextInput style={styles.input} onChangeText={setQuery} value={query} />

      {error && <Text>{error}</Text>}

      {!isEmpty(locations) &&
        locations.map((location, index) => {
          return (
            <Text
              key={index}
              onPress={() =>
                setCoords({ lat: location.lat, lon: location.lon })
              }
            >
              {location.name}, {location.country}, {location.state}
            </Text>
          );
        })}

      {weatherData && renderWeather()}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
  activityIndicator: {
    margin: 32,
  },
});

export default WeatherApp;
