import * as React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { List, ListItem } from "./components/List";
import Title from "components/text/Title";
import { SPACING } from "constants/styles";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.root}>
      <Title style={styles.title}>Hi-Fi exploration</Title>
      <List>
        <ListItem
          emoji="↕️"
          onPress={() => navigation.navigate("VerticalSurvey")}
          title="Vertical Survey"
        />
      </List>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    padding: SPACING,
    paddingBottom: 0,
  },
});
