import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { timestampToTime } from "./utils/timestampToTime";
import { degreesToDirection } from "./utils/degreesToDirection";
import { getLocations, getWeatherByCoords } from "./api/weather";
import { isEmpty } from "./utils/isEmpty";
import useDebounce from "./hooks/useDebounce";

const WeatherApp = () => {
  const [text, onChangeText] = useState("");
  const debouncedValue = useDebounce(text, 500);

  const [locations, setLocations] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [coords, setCoords] = useState({});
  const [loading, setLoading] = useState(false);

  async function fetchLocations() {
    const response = await getLocations(text);
    setLocations(response.data);
  }

  async function fetchWeatherByCoords() {
    const response = await getWeatherByCoords(coords);
    setWeatherData(response.data);
  }

  useEffect(() => {
    if (!text || text.trim() === "") return;
    fetchLocations();
  }, [debouncedValue]);

  useEffect(() => {
    if (isEmpty(coords)) return;
    fetchWeatherByCoords();
    setLocations(null);
    onChangeText("");
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

    return (
      <>
        <Text>Temperature: {temperature}°C</Text>
        <Text>Feels like: {tempFeels}°C</Text>
        <Text>Description: {description}</Text>
        <Text>Pressure: {pressure} hPa</Text>
        <Text>Sunrise: {sunrise}</Text>
        <Text>Sunset: {sunset}</Text>
        <Text>
          Wind: speed {windSpeed} km/h
          {windSpeed > 0 ? ` from ${windDirection}` : ""}
        </Text>
      </>
    );
  }

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
      {locations?.map((location, index) => {
        return (
          <Text
            key={index}
            onPress={() => setCoords({ lat: location.lat, lon: location.lon })}
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
});

export default WeatherApp;
