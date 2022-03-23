import * as React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { textBaseStyle } from "../text";
import { SPACING } from "constants/styles";

export default function OverlineTitle({
  children,
  style,
}: Readonly<{ children: string; style?: StyleProp<TextStyle> }>) {
  return <Text style={[styles.overlineTitle, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  overlineTitle: {
    ...textBaseStyle,
    fontWeight: "500",
    fontSize: 10,
    letterSpacing: 1,
    lineHeight: 12,
    marginBottom: SPACING / 2,
  },
});
