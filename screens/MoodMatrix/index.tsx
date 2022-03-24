import * as React from "react";
import { StyleSheet, View } from "react-native";
import Title from "components/text/Title";

export default function MoodMatrix() {
  return (
    <View style={styles.root}>
      <Title>Mood Matrix</Title>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
