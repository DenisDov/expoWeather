import React, { ReactNode } from "react";
import { View, Platform, StyleSheet, ViewStyle } from "react-native";

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  ...restProps
}) => {
  return (
    <View style={[styles.card, style]} {...restProps}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    backgroundColor: "#24262D",
    borderRadius: 8,
    padding: 8,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
