import * as React from "react";
import {
  Image,
  LayoutChangeEvent,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Video } from "expo-av";
import { BlurView } from "expo-blur";
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  useDerivedValue,
  withSpring,
  SharedValue,
  WithSpringConfig,
} from "react-native-reanimated";
import { clamp, Vector } from "react-native-redash";
import { SPACING } from "constants/styles";
import * as Haptics from "expo-haptics";
import { brandDarkBlue, brandExtraDarkBlue } from "constants/colors";

const AnimatedVideo = Animated.createAnimatedComponent(Video);

export default function Trails() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const isGestureActive = useSharedValue(0);
  const backgroundLayout = useSharedValue({ height: 0, width: 0 });
  const imageLayout = useSharedValue({ height: 0, width: 0 });

  const { height, width } = useWindowDimensions();
  const headerHeight = useHeaderHeight();

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number; startY: number; frame: number }) => {
      ctx.frame = 0;
      isGestureActive.value = withTiming(1);
      ctx.startX = x.value;
      ctx.startY = y.value;
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Heavy);
    },
    onActive: ({ translationX, translationY }, ctx) => {
      ctx.frame++;

      x.value = withSpring(
        clamp(ctx.startX + translationX, -width / 2 + 75, width / 2 - 75),
        { overshootClamping: false, mass: 2, damping: 1000 }
      );
      y.value = withSpring(
        clamp(
          ctx.startY + translationY,
          -imageLayout.value.height / 2 + 75,
          imageLayout.value.height / 2 - 75
        ),
        { overshootClamping: false, mass: 2, damping: 1000 }
      );
      if (ctx.frame % 10 === 0) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    onEnd: () => {
      isGestureActive.value = withTiming(0);
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Heavy);
    },
  });

  const aHandleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: interpolate(isGestureActive.value, [0, 1], [1.2, 1.5]) },
    ],
  }));

  const trail1 = useFollowAnimatedPosition({ x: x, y: y });
  const trail2 = useFollowAnimatedPosition({
    x: trail1.followX,
    y: trail1.followY,
  });
  const trail3 = useFollowAnimatedPosition({
    x: trail2.followX,
    y: trail2.followY,
  });
  const trail4 = useFollowAnimatedPosition({
    x: trail3.followX,
    y: trail3.followY,
  });
  const trail5 = useFollowAnimatedPosition({
    x: trail4.followX,
    y: trail4.followY,
  });
  const trail6 = useFollowAnimatedPosition({
    x: trail5.followX,
    y: trail5.followY,
  });

  const aGradientStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(
          interpolate(
            x.value,
            [-width / 2 + 60, width / 2 - 60],
            [0, -backgroundLayout.value.width + width]
          ),
          { overshootClamping: true }
        ),
      },
      {
        translateY: withSpring(
          interpolate(
            y.value,
            [
              -imageLayout.value.height / 2 + 60,
              imageLayout.value.height / 2 - 60,
            ],
            [0, -backgroundLayout.value.height + height + 60]
          ),
          { overshootClamping: true }
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
      <AnimatedVideo
        isLooping
        onLayout={onBackgroundLayout}
        resizeMode="cover"
        shouldPlay
        source={require("./assets/gradient.mp4")}
        style={[
          styles.video,
          {
            top: -headerHeight - 25,
            transform: [
              { translateX: backgroundLayout.value.width / 2 },
              { translateY: backgroundLayout.value.height / 2 },
            ],
          },
          aGradientStyle,
        ]}
      />
      <View style={styles.matrix}>
        <Animated.View style={[styles.handle, trail1.rStyle, { opacity: 1 }]} />
        <Animated.View
          style={[styles.handle, trail2.rStyle, { opacity: 0.9 }]}
        />
        <Animated.View
          style={[styles.handle, trail3.rStyle, { opacity: 0.8 }]}
        />
        <Animated.View
          style={[styles.handle, trail4.rStyle, { opacity: 0.7 }]}
        />
        <Animated.View
          style={[styles.handle, trail5.rStyle, { opacity: 0.6 }]}
        />
        <Animated.View
          style={[styles.handle, trail6.rStyle, { opacity: 0.5 }]}
        />
        <BlurView
          intensity={80}
          style={{
            width: width,
            height: height,
            position: "absolute",
            top: -headerHeight - SPACING,
          }}
        />

        <Image
          onLayout={onImageLayout}
          resizeMode="contain"
          source={require("./assets/matrix.png")}
          style={styles.matrixImage}
        />
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              styles.handle,
              aHandleStyle,
              {
                backgroundColor: brandExtraDarkBlue,
              },
            ]}
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
    position: "relative",
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    width: 3840,
    height: 2160,
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
    textAlign: "center",
  },
  handle: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: brandDarkBlue,
  },
});

const SPRING_CONFIG: WithSpringConfig = {
  // mass: 3,
  stiffness: 500,
  overshootClamping: true,
  // restSpeedThreshold: -100,
  // restDisplacementThreshold: -2,
  // velocity: -50,
};

const useFollowAnimatedPosition = ({ x, y }: Vector<SharedValue<number>>) => {
  const followX = useDerivedValue(() => {
    return withSpring(x.value, SPRING_CONFIG);
  });

  const followY = useDerivedValue(() => {
    return withSpring(y.value, SPRING_CONFIG);
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: followX.value }, { translateY: followY.value }],
    };
  });

  return { followX, followY, rStyle };
};
