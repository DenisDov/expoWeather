import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import dayjs from "dayjs";

import { degreesToDirection } from "./utils/degreesToDirection";
import { getLocations, getWeatherByCoords } from "./api/weather";
import { isEmpty } from "./utils/isEmpty";
import useDebounce from "./hooks/useDebounce";
import dummyData from "./utils/dummyData";

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
    const formattedDate = dayjs.unix(weatherData.dt).format("DD MMMM, HH:MM");
    const temperature = Math.round(weatherData.main.temp);
    const tempFeels = Math.round(weatherData.main.feels_like);
    const description = weatherData.weather[0].description;
    const pressure = weatherData.main.pressure;
    const sunrise = dayjs.unix(weatherData.sys.sunrise).format("HH:MM");
    const sunset = dayjs.unix(weatherData.sys.sunset).format("HH:MM");
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
        <Text>{formattedDate}</Text>
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 64 }}>{temperature}°C</Text>
            <Text>Feels like: {tempFeels}°C</Text>
            <Text>Pressure: {pressure} hPa</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>ICON HERE</Text>
          </View>
        </View>

        {/* <Text>Description: {description}</Text> */}

        <View>
          <Text>Sunrise: {sunrise}</Text>
          <Text>Sunset: {sunset}</Text>
          <Text>
            Wind speed: {windSpeed} km/h
            {windSpeed > 0 ? ` from ${windDirection}` : ""}
          </Text>
        </View>
      </>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <LinearGradient colors={["#8e9eab", "#eef2f3"]} style={styles.overlay} />
      <View>
        <TextInput
          style={styles.input}
          onChangeText={setQuery}
          value={query}
          placeholder="Search place"
          autoCorrect={false}
        />
        {!isEmpty(locations) && (
          <View style={styles.dropdown}>
            {locations.map((location) => (
              <TouchableOpacity
                onPress={() =>
                  setCoords({ lat: location.lat, lon: location.lon })
                }
                key={location.lat + location.lon}
              >
                <Text>
                  {location.name}, {location.country}, {location.state}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      {error && <Text>{error}</Text>}
      {weatherData && renderWeather()}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "black",
    backgroundColor: "white",
    padding: 10,
    marginBottom: 16,
  },
  dropdown: {
    backgroundColor: "red",
    position: "absolute",
    zIndex: 1,
    top: 40,
    left: 0,
    right: 0,
  },
  activityIndicator: {
    margin: 32,
  },
});

export default WeatherApp;
