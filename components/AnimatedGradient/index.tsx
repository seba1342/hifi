import React, { Component } from "react";
import { StyleSheet, Animated, Easing, StyleProp } from "react-native";
import { LinearGradient, LinearGradientPoint } from "expo-linear-gradient";

type Props = Readonly<{
  color0: string;
  color1: string;
  children: React.ReactNode;
  points: { start: LinearGradientPoint; end: LinearGradientPoint };
  style: StyleProp<typeof Animated.View>;
}>;

class CLinearGradient extends Component<Props> {
  render() {
    const { color0, color1, children, points } = this.props;
    const gStart = points.start;
    const gEnd = points.end;

    return (
      <LinearGradient
        colors={[color0, color1].map((c) => c)}
        start={gStart}
        end={gEnd}
        style={[styles.linearGradient]}
      >
        {children}
      </LinearGradient>
    );
  }
}

const AnimatedLinearGradient =
  Animated.createAnimatedComponent(CLinearGradient);

export const presetColors = {
  instagram: [
    "rgb(106, 57, 171)",
    "rgb(151, 52, 160)",
    "rgb(197, 57, 92)",
    "rgb(231, 166, 73)",
    "rgb(181, 70, 92)",
  ],
  firefox: [
    "rgb(236, 190, 55)",
    "rgb(215, 110, 51)",
    "rgb(181, 63, 49)",
    "rgb(192, 71, 45)",
  ],
  sunrise: [
    "rgb(92, 160, 186)",
    "rgb(106, 166, 186)",
    "rgb(142, 191, 186)",
    "rgb(172, 211, 186)",
    "rgb(239, 235, 186)",
    "rgb(212, 222, 206)",
    "rgb(187, 216, 200)",
    "rgb(152, 197, 190)",
    "rgb(100, 173, 186)",
  ],
};

type AnimatedGradientProps = Readonly<{
  customColors: string[];
  points?: { start: LinearGradientPoint; end: LinearGradientPoint };
  speed: number;
}>;

class AnimatedGradient extends Component<AnimatedGradientProps> {
  static defaultProps = {
    customColors: presetColors.instagram,
    speed: 4000,
    points: {
      start: { x: 0.6, y: 0.4 },
      end: { x: 0.4, y: 0.6 },
    },
  };

  state = {
    color0: new Animated.Value(0),
    color1: new Animated.Value(0),
  };

  componentDidMount = () => {
    this.startAnimation();
  };

  startAnimation = () => {
    const { color0, color1 } = this.state;
    const { customColors, speed } = this.props;

    [color0, color1].forEach((color) => color.setValue(0));

    Animated.loop(
      Animated.parallel(
        [color0, color1].map((animatedColor) => {
          return Animated.timing(animatedColor, {
            toValue: customColors.length,
            duration: customColors.length * speed,
            easing: Easing.linear,
            useNativeDriver: false,
          });
        })
      )
    ).start();
  };

  render() {
    const { color0, color1 } = this.state;
    const { customColors, children, points } = this.props;
    const preferColors = customColors.map((color, index) =>
      customColors.slice(index + 1).concat(customColors.slice(0, index + 2))
    );

    const interpolatedColors = [color0, color1].map((animatedColor, index) =>
      animatedColor.interpolate({
        inputRange: Array.from(
          { length: customColors.length + 1 },
          (v, k) => k
        ),
        outputRange: preferColors[index],
      })
    );

    return (
      <AnimatedLinearGradient
        // @ts-expect-error
        style={styles.linearGradient}
        points={points}
        color0={interpolatedColors[0]}
        color1={interpolatedColors[1]}
      >
        {children}
      </AnimatedLinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    position: "absolute",
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
    left: 0,
    right: 0,
    top: -100,
    bottom: 0,
    zIndex: -10,
  },
});

export default AnimatedGradient;
