import * as React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  SharedValue,
} from "react-native-reanimated";
import Body from "components/text/Body";
import { SPACING } from "constants/styles";
import * as COLORS from "constants/colors";

export type OptionLayoutType = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
  isActive: boolean;
}>;

export default function Option({
  activeDropZoneIndex,
  index,
  option,
}: Readonly<{
  activeDropZoneIndex: SharedValue<number | null>;
  index: number;
  option: string;
}>) {
  const optionStyles = useAnimatedStyle(
    () => ({
      backgroundColor:
        activeDropZoneIndex.value === index
          ? COLORS.brandGreen
          : COLORS.lightGrey,
    }),
    [index]
  );

  return (
    <Animated.View style={[styles.option, optionStyles]}>
      <Body style={styles.optionText}>{option}</Body>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  option: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightGrey,
    borderStyle: "dashed",
    borderWidth: 3,
    borderColor: COLORS.brandOrange,
    borderRadius: 8,
    paddingHorizontal: SPACING,
    height: 64,
  },
  optionText: {
    fontWeight: "bold",
    marginBottom: 0,
  },
});
