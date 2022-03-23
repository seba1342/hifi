import * as React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { textBaseStyle } from "../text";
import { SPACING } from "constants/styles";

export default function Body({
  children,
  style,
}: Readonly<{ children: string; style?: StyleProp<TextStyle> }>) {
  return <Text style={[styles.overlineTitle, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  overlineTitle: {
    ...textBaseStyle,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: SPACING / 2,
  },
});
