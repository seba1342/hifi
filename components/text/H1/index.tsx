import * as React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { textBaseStyle } from "../text";
import { SPACING } from "constants/styles";

export default function H1({
  children,
  style,
}: Readonly<{ children: string; style?: StyleProp<TextStyle> }>) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    ...textBaseStyle,
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "CircularStdBold",
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: SPACING,
  },
});
