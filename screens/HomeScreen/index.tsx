import * as React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { List, ListItem } from "./components/List";
import Title from "components/text/Title";
import { SPACING } from "constants/styles";

const SCREENS = [
  { emoji: "âï¸", routeName: "VerticalSurvey", title: "Vertical Survey" },
  { emoji: "ð¨", routeName: "MoodMatrix", title: "Mood Matrix - No gradient" },
  {
    emoji: "ð¼ï¸",
    routeName: "MoodMatrixGradient",
    title: "Mood Matrix - Gradient",
  },
  {
    emoji: "ð ",
    routeName: "InteractableBackground",
    title: "Mood Matrix - Background Interaction",
  },
  {
    emoji: "ð",
    routeName: "Trails",
    title: "Trails",
  },
  {
    emoji: "ð§",
    routeName: "HifiIntro",
    title: "HiâFi Intro",
  },
  {
    emoji: "ð",
    routeName: "SoundWave",
    title: "Sound wave",
  },
];

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.root}>
      <Title style={styles.title}>Hi-Fi exploration</Title>
      <List>
        {SCREENS.map((screen) => (
          <ListItem
            emoji={screen.emoji}
            key={screen.routeName}
            onPress={() => navigation.navigate(screen.routeName)}
            title={screen.title}
          />
        ))}
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
