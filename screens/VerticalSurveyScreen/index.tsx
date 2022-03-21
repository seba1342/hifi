import * as React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function VerticalSurveyScreen() {
  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text>Details Screen</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center" },
});
