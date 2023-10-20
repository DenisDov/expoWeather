import { View, StyleSheet, TouchableOpacity } from "react-native";

import { Text } from "./Text";

interface Location {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

interface DropdownProps {
  locations: Location[];
  onLocationPress: (location: Location) => void;
}

export function Dropdown({ locations, onLocationPress }: DropdownProps) {
  return (
    <View style={styles.dropdown}>
      {locations.map((location) => {
        const { name, country, state, lat, lon } = location;
        const locationInfo = `${name}, ${country}${state ? `, ${state}` : ""}`;
        return (
          <TouchableOpacity
            onPress={() => onLocationPress(location)}
            key={lat + lon}
            style={styles.location}
          >
            <Text>{locationInfo}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: "#24262D",
    position: "absolute",
    zIndex: 1,
    top: 40,
    left: 0,
    right: 0,
    borderRadius: 8,
  },
  location: {
    padding: 8,
  },
});
