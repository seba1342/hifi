import Body from "components/text/Body";
import { brandOrange } from "constants/colors";
import * as React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

type Props = Readonly<{
  children: string;
  onPress: (args0?: any) => void;
  style?: StyleProp<ViewStyle>;
}>;

export default function SquareButton({ children, onPress, style }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.root, style]}>
      <Body style={styles.text}>{children}</Body>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: brandOrange,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
  text: {
    fontFamily: "CircularStdMedium",
    marginBottom: 0,
    textAlignVertical: "center",
  },
});
