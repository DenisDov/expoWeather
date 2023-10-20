import React, { ReactNode } from "react";
import { Text as RNText, StyleSheet, StyleProp, ViewStyle } from "react-native";

interface TextProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>; // Allow custom styles to be passed from the parent
}

export const Text: React.FC<TextProps> = ({ children, style }) => {
  return <RNText style={[styles.text, style]}>{children}</RNText>;
};

const styles = StyleSheet.create({
  text: {
    color: "white",
  },
});
