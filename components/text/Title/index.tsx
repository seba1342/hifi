import * as React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { textBaseStyle } from "../text";
import { SPACING } from "constants/styles";

export default function Title({
  children,
  style,
}: Readonly<{ children: string; style?: StyleProp<TextStyle> }>) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    ...textBaseStyle,
    fontSize: 22,
    lineHeight: 28,
    marginBottom: SPACING,
    fontFamily: "CircularStdMedium",
  },
});
