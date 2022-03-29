import * as React from "react";
import {
  Image,
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
import { clamp } from "react-native-redash";
import Title from "components/text/Title";
import { SPACING } from "constants/styles";
import { COLOR_MATRIX } from "./colorMatrix";
import * as Haptics from "expo-haptics";

const ROWS = COLOR_MATRIX[0].length;
const COLUMNS = COLOR_MATRIX.length;

export default function MoodMatrix() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const isGestureActive = useSharedValue(0);
  const imageLayout = useSharedValue({ height: 0, width: 0 });

  const backgroundColor = useSharedValue(COLOR_MATRIX[3][3]);

  const { height, width } = useWindowDimensions();

  const colorWidth = width / ROWS;
  const colorHeight = height / COLUMNS;

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number; startY: number }) => {
      isGestureActive.value = withTiming(1);
      ctx.startX = x.value;
      ctx.startY = y.value;
      runOnJS(Haptics.selectionAsync)();
    },
    onActive: ({ translationX, translationY, absoluteX, absoluteY }, ctx) => {
      x.value = clamp(
        ctx.startX + translationX,
        -width / 2 + 60,
        width / 2 - 60
      );
      y.value = clamp(
        ctx.startY + translationY,
        -imageLayout.value.height / 2 + 60,
        imageLayout.value.height / 2 - 60
      );

      const colorX = Math.floor(absoluteX / colorWidth);
      const colorY = Math.floor(absoluteY / colorHeight);
      const color = COLOR_MATRIX?.[colorY]?.[colorX];
      backgroundColor.value = color ?? COLOR_MATRIX[3][3];
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

  // const aTrailStyle = (index: number) =>
  //   useAnimatedStyle(() => ({
  //     opacity: 1 / (index + 1),
  //     transform: [
  //       {
  //         translateX: withTiming(x.value, { duration: index * 20 }),
  //       },
  //       {
  //         translateY: withTiming(y.value, { duration: index * 20 }),
  //       },
  //     ],
  //   }));

  const aBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  function onImageLayout(event: LayoutChangeEvent) {
    const { height, width } = event.nativeEvent.layout;

    imageLayout.value = { height, width };
  }

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.background, aBackgroundStyle]} />
      <Title style={styles.text}>How do you feel about money?</Title>
      <View style={styles.matrix}>
        <Image
          onLayout={onImageLayout}
          resizeMode="contain"
          source={require("./assets/matrix.png")}
          style={styles.matrixImage}
        />
        {/* {new Array(8).fill(null).map((_, index) => (
          <Animated.Image
            key={index + "trail"}
            source={require("./assets/handle.png")}
            style={[styles.trail, aTrailStyle(index)]}
          />
        ))} */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.Image
            source={require("./assets/handle.png")}
            style={aHandleStyle}
          />
        </PanGestureHandler>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: SPACING,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    top: -100,
  },
  matrix: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  matrixImage: {
    position: "absolute",
    width: "100%",
  },
  text: {
    color: "white",
    textAlign: "center",
  },
  trail: {
    position: "absolute",
  },
});
