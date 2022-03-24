import * as React from "react";
import {
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Body from "components/text/Body";
import { SPACING } from "constants/styles";

type Props = Readonly<{ children: React.ReactNode }>;

export function List({ children }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.root}>
      <View style={listStyles.divider} />
      {children}
    </ScrollView>
  );
}

type ListItemProps = Readonly<{
  emoji: string;
  onPress: () => void;
  title: string;
}>;

export function ListItem({ emoji, onPress, title }: ListItemProps) {
  return (
    <>
      <TouchableOpacity onPress={onPress} style={listStyles.root}>
        <View style={listStyles.row}>
          <Body style={[listStyles.icon, listStyles.text]}>{emoji}</Body>
          <Body style={listStyles.text}>{title}</Body>
        </View>
        <Image source={require("./assets/right-chevron.png")} />
      </TouchableOpacity>
      <View style={listStyles.divider} />
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
  },
});

const listStyles = StyleSheet.create({
  root: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: SPACING,
    width: "100%",
  },
  icon: {
    marginRight: SPACING / 2,
  },
  text: {
    marginBottom: 0,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.33)",
  },
  row: {
    flexDirection: "row",
  },
});
