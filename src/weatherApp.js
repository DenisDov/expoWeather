import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import dayjs from "dayjs";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { degreesToDirection } from "./utils/degreesToDirection";
import { getLocations, getWeatherByCoords } from "./api/weather";
import { isEmpty } from "./utils/isEmpty";
import useDebounce from "./hooks/useDebounce";
import { Dropdown } from "./components/Dropdown";

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
      setError(error.message);
    }
  }

  async function fetchWeatherByCoords() {
    setLoading(true);
    try {
      const response = await getWeatherByCoords(coords);
      setWeatherData(response.data);
      // Save the coordinates to AsyncStorage
      await AsyncStorage.setItem("lastSearchedCoords", JSON.stringify(coords));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setLocations(null);
      setQuery("");
    }
  }

  // Retrieve the last searched coordinates from AsyncStorage
  async function fetchLastSearchedCoords() {
    try {
      const lastSearchedCoords = await AsyncStorage.getItem(
        "lastSearchedCoords"
      );
      if (lastSearchedCoords) {
        setCoords(JSON.parse(lastSearchedCoords));
      }
    } catch (error) {
      console.error("Error retrieving last searched coordinates:", error);
    }
  }

  useEffect(() => {
    fetchLastSearchedCoords();
  }, []);

  useEffect(() => {
    if (!query || query.trim() === "") return;
    fetchLocations();
  }, [debouncedValue]);

  useEffect(() => {
    if (isEmpty(coords)) return;
    fetchWeatherByCoords();
  }, [coords]);

  function handleLocationPressed(location) {
    setCoords({ lat: location.lat, lon: location.lon });
    Keyboard.dismiss();
  }

  function renderWeather() {
    const currentLocation = `${weatherData.name}, ${weatherData.sys.country}`;
    const formattedDate = dayjs.unix(weatherData.dt).format("DD MMMM, HH:MM");
    const temperature = Math.round(weatherData.main.temp);
    const tempFeels = Math.round(weatherData.main.feels_like);
    const description = weatherData.weather[0].description;
    const pressure = weatherData.main.pressure;
    const sunrise = dayjs.unix(weatherData.sys.sunrise).format("HH:MM");
    const sunset = dayjs.unix(weatherData.sys.sunset).format("HH:MM");
    const windSpeed = Math.round(weatherData.wind.speed);
    const windDirection = degreesToDirection(weatherData.wind.deg);

    const weatherIconURL = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`;

    if (loading) {
      return (
        <ActivityIndicator size="large" style={styles.activityIndicator} />
      );
    }

    return (
      <>
        <Text>{currentLocation}</Text>
        <Text>{formattedDate}</Text>
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 64 }}>{temperature}°C</Text>
            <Text>Feels like: {tempFeels}°C</Text>
            <Text>Pressure: {pressure} hPa</Text>
          </View>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Image
              style={styles.image}
              source={weatherIconURL}
              contentFit="cover"
            />
            <Text style={{ textAlign: "center" }}>{description}</Text>
          </View>
        </View>

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
      <View style={{ zIndex: 1 }}>
        <TextInput
          style={styles.input}
          onChangeText={setQuery}
          value={query}
          placeholder="Search place"
          autoCorrect={false}
        />
        {!isEmpty(locations) && (
          <Dropdown
            locations={locations}
            onLocationPress={handleLocationPressed}
          />
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
    borderColor: "#48484A",
    backgroundColor: "white",
    padding: 10,
    marginBottom: 16,
  },

  activityIndicator: {
    margin: 32,
  },
  image: {
    flex: 1,
    width: "100%",
  },
});

export default WeatherApp;
