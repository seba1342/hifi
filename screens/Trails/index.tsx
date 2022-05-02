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
import Svg, { Path } from "react-native-svg";
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
  useAnimatedProps,
} from "react-native-reanimated";
import { clamp, Vector } from "react-native-redash";
import { SPACING } from "constants/styles";
import * as Haptics from "expo-haptics";
import { brandOrange } from "constants/colors";

const VELOCITY_FACTOR = 1 / 3000;

const AnimatedVideo = Animated.createAnimatedComponent(Video);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function Trails() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const isGestureActive = useSharedValue(0);
  const backgroundLayout = useSharedValue({ height: 0, width: 0 });
  const imageLayout = useSharedValue({ height: 0, width: 0 });
  const velocityX = useSharedValue(0);
  const velocityY = useSharedValue(0);

  const { height, width } = useWindowDimensions();
  const headerHeight = useHeaderHeight();

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number; startY: number; frame: number }) => {
      isGestureActive.value = withTiming(1);
      ctx.startX = x.value;
      ctx.startY = y.value;
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Heavy);
    },
    onActive: (
      { translationX, translationY, velocityX: vX, velocityY: vY },
      ctx
    ) => {
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

      velocityX.value = vX * VELOCITY_FACTOR;
      velocityY.value = vY * VELOCITY_FACTOR;
    },
    onEnd: ({ velocityX: vX, velocityY: vY }) => {
      isGestureActive.value = withTiming(0);

      velocityX.value = withSpring(0);
      velocityY.value = withSpring(0);

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

  const trail1 = useFollowAnimatedPosition({ x: x, y: y }, 0);
  const trail2 = useFollowAnimatedPosition(
    {
      x: trail1.followX,
      y: trail1.followY,
    },
    1
  );
  const trail3 = useFollowAnimatedPosition(
    {
      x: trail2.followX,
      y: trail2.followY,
    },
    2
  );
  const trail4 = useFollowAnimatedPosition(
    {
      x: trail3.followX,
      y: trail3.followY,
    },
    3
  );
  const trail5 = useFollowAnimatedPosition(
    {
      x: trail4.followX,
      y: trail4.followY,
    },
    4
  );

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

  const data = useDerivedValue(() => {
    const x = velocityX.value;
    const y = velocityY.value;

    const v = x * y;

    return {
      from: { x: 0.5, y: 0 },
      c1: { x: 0, y: 0 },
      c2: {
        x: 0,
        y: x < 0 ? interpolate(y, [-1, 0], [0, 0.5]) : 0.5,
      },
      to1: { x: 0, y: 0.5 },
      c3: {
        x: 0,
        y: x < 0 ? interpolate(y, [0, 1], [0.5, 1]) : 0.5,
      },
      c4: { x: 0, y: 1 },
      to2: { x: 0.5, y: 1 },
      c5: { x: 1, y: 1 },
      c6: {
        x: 1,
        y: x > 0 ? interpolate(y, [0, 1], [0.5, 1]) : 0.5,
      },
      to3: { x: 1, y: 0.5 },
      c7: {
        x: 1,
        y: x > 0 ? interpolate(y, [-1, 0], [0, 0.5]) : 0.5,
      },
      c8: { x: 1, y: 0 },
      to4: { x: 0.5, y: 0 },
    };
  });

  const path = useAnimatedProps(() => {
    const { from, c1, c2, to1, c3, c4, to2, c5, c6, to3, c7, c8, to4 } =
      data.value;
    return {
      d: `M ${from.x} ${from.y}
          C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${to1.x} ${to1.y}
          C ${c3.x} ${c3.y} ${c4.x} ${c4.y} ${to2.x} ${to2.y}
          C ${c5.x} ${c5.y} ${c6.x} ${c6.y} ${to3.x} ${to3.y}
          C ${c7.x} ${c7.y} ${c8.x} ${c8.y} ${to4.x} ${to4.y}
          Z`,
    };
  });

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
        <Animated.View style={[styles.handle, trail5.rStyle]}>
          <Svg width={50} height={50} viewBox="0 0 1 1">
            <AnimatedPath
              fillOpacity={0.5}
              fill="#EACFCB"
              animatedProps={path}
            />
          </Svg>
        </Animated.View>
        <Animated.View style={[styles.handle, trail4.rStyle]}>
          <Svg width={50} height={50} viewBox="0 0 1 1">
            <AnimatedPath
              fillOpacity={0.6}
              fill={"#EDC6BF"}
              animatedProps={path}
            />
          </Svg>
        </Animated.View>
        <Animated.View style={[styles.handle, trail3.rStyle]}>
          <Svg width={50} height={50} viewBox="0 0 1 1">
            <AnimatedPath
              fillOpacity={0.7}
              fill={"#EFBAB1"}
              animatedProps={path}
            />
          </Svg>
        </Animated.View>
        <Animated.View style={[styles.handle, trail2.rStyle]}>
          <Svg width={50} height={50} viewBox="0 0 1 1">
            <AnimatedPath
              fillOpacity={0.8}
              fill={"#F5A498"}
              animatedProps={path}
            />
          </Svg>
        </Animated.View>
        <Animated.View style={[styles.handle, trail1.rStyle]}>
          <Svg width={50} height={50} viewBox="0 0 1 1">
            <AnimatedPath
              fillOpacity={0.9}
              fill={"#FA907E"}
              animatedProps={path}
            />
          </Svg>
        </Animated.View>
        <Image
          onLayout={onImageLayout}
          resizeMode="contain"
          source={require("./assets/matrix.png")}
          style={styles.matrixImage}
        />
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              aHandleStyle,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <Svg width={50} height={50} viewBox="0 0 1 1">
              <AnimatedPath fill={brandOrange} animatedProps={path} />
            </Svg>
            <Image
              source={require("./assets/pic.png")}
              style={{ position: "absolute", width: 36, height: 36 }}
            />
          </Animated.View>
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
  },
});

const SPRING_CONFIG: WithSpringConfig = {
  // mass: 3,
  stiffness: 2000,
  overshootClamping: true,
  // restSpeedThreshold: -100,
  // restDisplacementThreshold: -2,
  // velocity: -50,
};

const useFollowAnimatedPosition = (
  { x, y }: Vector<SharedValue<number>>,
  index: number
) => {
  const followX = useDerivedValue(() => {
    return withSpring(x.value, SPRING_CONFIG);
  });

  const followY = useDerivedValue(() => {
    return withSpring(y.value, SPRING_CONFIG);
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: followX.value },
        { translateY: followY.value },
        { scale: 1.2 - index * 0.3 },
      ],
    };
  });

  return { followX, followY, rStyle };
};

const i = (value: number, outputRange: number[]) =>
  interpolate(value, [-1, 0, -1], outputRange);
