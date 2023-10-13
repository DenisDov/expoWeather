import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import axios from "axios";

function timestampToTime(timestamp) {
  const date = new Date(timestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds
  const hours = date.getHours().toString().padStart(2, "0"); // Get hours and format with leading zero
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Get minutes and format with leading zero
  return `${hours}:${minutes}`;
}

function degreesToDirection(degrees) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);

  const API_KEY = "094864a9f1f75981052798e99622bba7";
  const CITY = "Kyiv";
  const UNITS = "metric";
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=${UNITS}`;

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching weather data: ", error);
      });
  }, []);

  if (!weatherData) {
    return <Text>Loading...</Text>;
  }

  const temperature = Math.round(weatherData.main.temp);
  const tempFeels = Math.round(weatherData.main.feels_like);
  const description = weatherData.weather[0].description;
  const pressure = weatherData.main.pressure;
  const sunrise = timestampToTime(weatherData.sys.sunrise);
  const sunset = timestampToTime(weatherData.sys.sunset);
  const windSpeed = Math.round(weatherData.wind.speed);
  const windDirection = degreesToDirection(weatherData.wind.deg);

  return (
    <View>
      <Text>Temperature: {temperature}°C</Text>
      <Text>Feels like: {tempFeels}°C</Text>
      <Text>Description: {description}</Text>
      <Text>Pressure: {pressure} hPa</Text>
      <Text>Sunrise: {sunrise}</Text>
      <Text>Sunset: {sunset}</Text>
      <Text>
        Wind: speed {windSpeed} km/h | direction {windDirection}
      </Text>
    </View>
  );
};

export default WeatherApp;
