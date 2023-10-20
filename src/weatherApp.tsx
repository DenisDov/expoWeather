import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { Image } from "expo-image";
import { useState, useEffect } from "react";
import {
  View,
  // Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";

import { getLocations, getWeatherByCoords } from "./api/weather";
import { Card } from "./components/Card";
import { Dropdown } from "./components/Dropdown";
import { Text } from "./components/Text";
import useDebounce from "./hooks/useDebounce";
import { degreesToDirection } from "./utils/degreesToDirection";
import { isEmpty } from "./utils/isEmpty";

export const WeatherApp = () => {
  const [query, setQuery] = useState("");
  const debouncedValue = useDebounce(query, 500);

  const [locations, setLocations] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [coords, setCoords] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
      const lastSearchedCoords =
        await AsyncStorage.getItem("lastSearchedCoords");
      if (lastSearchedCoords) {
        setCoords(JSON.parse(lastSearchedCoords));
      }
    } catch (error) {
      console.error("Error retrieving last searched coordinates:", error);
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      await fetchLastSearchedCoords();
    } finally {
      setIsRefreshing(false);
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

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleReset = () => {
    setLocations([]);
    setIsFocused(false);
  };

  function renderWeather() {
    const currentLocation = `${weatherData.name}, ${weatherData.sys.country}`;
    const formattedDate = dayjs.unix(weatherData.dt).format("DD MMMM, HH:MM");
    const temperature = Math.round(weatherData.main.temp);
    const tempFeels = Math.round(weatherData.main.feels_like);
    const tempMin = Math.round(weatherData.main.temp_min);
    const tempMax = Math.round(weatherData.main.temp_max);
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
        <Card>
          <Text>{currentLocation}</Text>
          <Text>{formattedDate}</Text>
        </Card>
        <View style={{ flexDirection: "row", gap: 16, marginVertical: 16 }}>
          <Card style={{ flex: 1 }}>
            <Text style={{ fontSize: 64 }}>{temperature}°</Text>
            <Text>
              Day {tempMax}°↑ • Night {tempMin}°↓
            </Text>
            <Text>Feels like: {tempFeels}°</Text>
            <Text>Pressure: {pressure} hPa</Text>
          </Card>
          <Card style={{ flex: 1, justifyContent: "center" }}>
            <Image
              style={styles.image}
              source={weatherIconURL}
              contentFit="cover"
            />
            <Text style={{ textAlign: "center" }}>{description}</Text>
          </Card>
        </View>

        <Card>
          <Text>Sunrise: {sunrise}</Text>
          <Text>Sunset: {sunset}</Text>
          <Text>
            Wind speed: {windSpeed} km/h
            {windSpeed > 0 ? ` from ${windDirection}` : ""}
          </Text>
        </Card>
      </>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#0D0F14" }}>
      <View style={{ zIndex: 1 }}>
        <TextInput
          style={[styles.input, isFocused && styles.focusedInput]}
          onChangeText={setQuery}
          value={query}
          placeholder="Search place"
          autoCorrect={false}
          placeholderTextColor="#9CA3AF"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {!isEmpty(locations) && (
          <Dropdown
            locations={locations}
            onLocationPress={handleLocationPressed}
          />
        )}
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["white"]}
            tintColor="white"
          />
        }
        contentContainerStyle={{ flex: 1, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={handleReset} style={{ flex: 1 }}>
          {error && <Text>{error}</Text>}
          {weatherData && renderWeather()}
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  input: {
    color: "white",
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#353841",
    backgroundColor: "#24262D",
    padding: 10,
  },
  focusedInput: {
    borderColor: "#F2F6FA",
  },
  activityIndicator: {
    margin: 32,
  },
  image: {
    flex: 1,
    width: "100%",
  },
});
