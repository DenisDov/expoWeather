import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import WeatherApp from "./src/weatherApp";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <WeatherApp />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
