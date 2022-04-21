import * as React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { brandExtraDarkBlue } from "constants/colors";
import withVelocity from "./withVelocity";

const SIZE = Dimensions.get("window").width;
const AnimatedPath = Animated.createAnimatedComponent(Path);

const { useEffect } = React;

export function shake(
  value,
  phase = 0,
  frequency = 1,
  extraMaff = 1,
  damper = 0.5
) {
  "worklet";

  const normalizedId = 10000 % 15;
  const x = value * frequency - phase;
  const offset = 0.5;
  return (
    Math.sin(x) *
      Math.sin(x * 1.3) *
      Math.sin(x * normalizedId) *
      extraMaff *
      damper +
    offset
  );
}

export default function SoundWave() {
  const headerHeight = useHeaderHeight();
  const { height } = useWindowDimensions();

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withVelocity({ velocity: 1.5 });
  }, [progress]);

  const data1 = useDerivedValue(() => {
    const s = shake.bind(null, progress.value);

    return {
      from: { x: -0.1, y: 0.5 },
      c1: { x: 0.1, y: s(8, 1) },
      to1: { x: 0.2, y: 0.5 },
      c2: { x: 0.3, y: s(6, 1) },
      to2: { x: 0.4, y: 0.5 },
      c3: { x: 0.5, y: s(4, 1) },
      to3: { x: 0.6, y: 0.5 },
      c4: { x: 0.7, y: s(2, 1) },
      to4: { x: 0.8, y: 0.5 },
      c5: { x: 0.9, y: s(0, 1) },
      to5: { x: 1.1, y: 0.5 },
    };
  });

  const data2 = useDerivedValue(() => {
    const s = shake.bind(null, progress.value);
    const math = Math.sin(progress.value * 4.5);

    return {
      from: { x: -0.1, y: 0.5 },
      c1: { x: 0.15, y: s(18, 1, math, 0.4) },
      to1: { x: 0.3, y: 0.52 },
      c2: { x: 0.45, y: s(16, 1, math, 0.4) },
      to2: { x: 0.6, y: 0.48 },
      c3: { x: 0.85, y: s(14, 1, math, 0.4) },
      to3: { x: 1.1, y: 0.5 },
    };
  });

  const data3 = useDerivedValue(() => {
    const s = shake.bind(null, progress.value);
    const math = Math.sin(progress.value * 6.4);

    return {
      from: { x: -0.1, y: 0.5 },
      c1: { x: 0.15, y: s(50, 1, math, 0.4) },
      to1: { x: 0.3, y: 0.48 },
      c2: { x: 0.45, y: s(48, 1, math, 0.4) },
      to2: { x: 0.6, y: 0.52 },
      c3: { x: 0.85, y: s(46, 1, math, 0.4) },
      to3: { x: 1.1, y: 0.5 },
    };
  });

  const path1 = useAnimatedProps(() => {
    const { from, c1, to1, c2, to2, c3, to3, c4, to4, c5, to5 } = data1.value;
    return {
      d: `M ${from.x} ${from.y}
          S ${c1.x} ${c1.y} ${to1.x} ${to1.y}
          S ${c2.x} ${c2.y} ${to2.x} ${to2.y}
          S ${c3.x} ${c3.y} ${to3.x} ${to3.y}
          S ${c4.x} ${c4.y} ${to4.x} ${to4.y}
          S ${c5.x} ${c5.y} ${to5.x} ${to5.y}`,
    };
  });

  const path2 = useAnimatedProps(() => {
    const { from, c1, to1, c2, to2, c3, to3 } = data2.value;
    return {
      d: `M ${from.x} ${from.y}
          S ${c1.x} ${c1.y} ${to1.x} ${to1.y}
          S ${c2.x} ${c2.y} ${to2.x} ${to2.y}
          S ${c3.x} ${c3.y} ${to3.x} ${to3.y}`,
    };
  });

  const path3 = useAnimatedProps(() => {
    const { from, c1, to1, c2, to2, c3, to3 } = data3.value;
    return {
      d: `M ${from.x} ${from.y}
          S ${c1.x} ${c1.y} ${to1.x} ${to1.y}
          S ${c2.x} ${c2.y} ${to2.x} ${to2.y}
          S ${c3.x} ${c3.y} ${to3.x} ${to3.y}`,
    };
  });

  return (
    <View style={[styles.root]}>
      <Svg width={SIZE} height={SIZE} viewBox="0 0 1 1">
        <AnimatedPath
          stroke={brandExtraDarkBlue}
          strokeWidth={0.015}
          strokeOpacity={0.2}
          animatedProps={path2}
        />
        <AnimatedPath
          stroke={brandExtraDarkBlue}
          strokeWidth={0.015}
          strokeOpacity={0.2}
          animatedProps={path3}
        />
        <AnimatedPath
          stroke={brandExtraDarkBlue}
          strokeWidth={0.02}
          animatedProps={path1}
        />
      </Svg>
      <Image
        style={{
          position: "absolute",
          top: -headerHeight,
          height: height + headerHeight,
          zIndex: -1,
        }}
        resizeMode="cover"
        source={require("./assets/bg.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
