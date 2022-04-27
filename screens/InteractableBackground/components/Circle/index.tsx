import * as React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  SharedValue,
  interpolate,
} from "react-native-reanimated";
import { brandOrange } from "constants/colors";
import { Vector } from "react-native-redash";

type Props = Readonly<{
  handlePosition: SharedValue<Vector>;
}>;

const { height } = Dimensions.get("window");

export default function Circle({ handlePosition }: Props) {
  const ref = React.useRef<React.ElementRef<typeof View> | null>(null);
  const circle = useSharedValue({
    x: 0,
    y: 0,
    pageX: 0,
    pageY: 0,
    width: 0,
    height: 0,
  });

  function onLayout() {
    ref.current?.measure((x, y, width, height, pageX, pageY) => {
      circle.value = { x, y, pageX, pageY, width, height };
    });
  }

  const aStyle = useAnimatedStyle(() => {
    const minMax = (num1: number, num2: number) => [
      Math.min(num1, num2),
      Math.max(num1, num2),
    ];

    const [xMin, xMax] = minMax(
      circle.value.x || 0,
      handlePosition.value.x || 0
    );
    const [yMin, yMax] = minMax(
      circle.value.y || 0,
      handlePosition.value.y || 0
    );
    const distance = Math.sqrt(
      Math.pow(xMax - xMin, 2) + Math.pow(yMax - yMin, 2)
    );

    const scale = interpolate(distance, [0, height], [0.1, 0.9]);

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View
      onLayout={onLayout}
      ref={ref}
      style={[styles.root, aStyle]}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 50,
    width: 45,
    height: 45,
    backgroundColor: brandOrange,
    margin: 1,
  },
});
