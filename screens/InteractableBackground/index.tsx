import * as React from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Vector } from "react-native-redash";
import * as Haptics from "expo-haptics";
import { brandExtraDarkBlue } from "constants/colors";
import Circle from "./components/Circle";

const CIRCLES = new Array(84).fill(null);

export default function InteractableBackground() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const handlePosition = useSharedValue<Vector>({ x: 0, y: 0 });
  const isGestureActive = useSharedValue(0);
  const imageLayout = useSharedValue({ height: 0, width: 0 });

  const { height, width } = useWindowDimensions();

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number; startY: number }) => {
      isGestureActive.value = withTiming(1);
      ctx.startX = x.value;
      ctx.startY = y.value;
      runOnJS(Haptics.selectionAsync)();
    },
    onActive: ({ translationX, translationY, absoluteX, absoluteY }, ctx) => {
      handlePosition.value = { x: absoluteX, y: absoluteY };
      x.value = ctx.startX + translationX;
      y.value = ctx.startY + translationY;
    },
    onEnd: () => {
      isGestureActive.value = withTiming(0);
      runOnJS(Haptics.selectionAsync)();
    },
  });

  const aHandleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: interpolate(isGestureActive.value, [0, 1], [1, 1.5]) },
    ],
  }));

  function onImageLayout(event: LayoutChangeEvent) {
    const { height, width } = event.nativeEvent.layout;

    imageLayout.value = { height, width };
  }

  return (
    <View style={styles.root}>
      <View style={styles.matrix}>
        {CIRCLES.map((_, index) => {
          return (
            <Circle key={`circle-${index}`} handlePosition={handlePosition} />
          );
        })}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.Image
            source={require("./assets/handle.png")}
            style={[aHandleStyle, styles.handle]}
            resizeMode="contain"
          />
        </PanGestureHandler>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "white",
  },
  matrix: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    position: "relative",
  },
  handle: {
    position: "absolute",
    top: "50%",
    width: 50,
    height: 50,
  },
});
