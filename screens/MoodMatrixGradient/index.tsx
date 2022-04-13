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
  Easing,
} from "react-native-reanimated";
import { clamp } from "react-native-redash";
import Title from "components/text/Title";
import { SPACING } from "constants/styles";
import * as Haptics from "expo-haptics";

export default function MoodMatrixGradient() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const isGestureActive = useSharedValue(0);
  const backgroundLayout = useSharedValue({ height: 0, width: 0 });
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

  const aGradientStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(
          interpolate(
            x.value,
            [-width / 2 + 60, width / 2 - 60],
            [0, -backgroundLayout.value.width + width]
          ),
          { easing: Easing.ease }
        ),
      },
      {
        translateY: withTiming(
          interpolate(
            y.value,
            [
              -imageLayout.value.height / 2 + 60,
              imageLayout.value.height / 2 - 60,
            ],
            [0, -backgroundLayout.value.height + height + 60]
          ),
          { easing: Easing.ease }
        ),
      },
    ],
  }));

  function onBackgroundLayout(event: LayoutChangeEvent) {
    const { height, width } = event.nativeEvent.layout;

    backgroundLayout.value = { height, width };
  }

  function onImageLayout(event: LayoutChangeEvent) {
    const { height, width } = event.nativeEvent.layout;

    imageLayout.value = { height, width };
  }

  return (
    <View style={styles.root}>
      <Animated.Image
        onLayout={onBackgroundLayout}
        source={require("./assets/Rectangle.png")}
        style={[styles.background, aGradientStyle]}
      />
      <Title style={styles.text}>How do you feel about money?</Title>
      <View style={styles.matrix}>
        <Image
          onLayout={onImageLayout}
          resizeMode="contain"
          source={require("./assets/matrix.png")}
          style={styles.matrixImage}
        />
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
