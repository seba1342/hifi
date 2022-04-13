import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  Easing,
  FadeInDown,
  FadeOut,
  FadeOutUp,
  Layout,
} from "react-native-reanimated";
import { brandOrange, lightGreyText } from "constants/colors";
import { SPACING } from "constants/styles";
import Title from "components/text/Title";
import H1 from "components/text/H1";
import Body from "components/text/Body";
import SquareButton from "components/SquareButton";

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

export default function IntroScreen({
  showIntro,
  hideIntro,
}: {
  showIntro: boolean;
  hideIntro: () => void;
}) {
  return (
    <View style={{ flex: showIntro ? 1 : 0 }}>
      {showIntro ? (
        <AnimatedSafeAreaView
          entering={FadeInDown.delay(100)
            .duration(800)
            .easing(Easing.inOut(Easing.ease))}
          exiting={FadeOutUp.duration(800).easing(Easing.inOut(Easing.ease))}
          style={styles.root}
        >
          <View>
            <Image
              style={styles.image}
              source={require("./assets/logo.png")}
              resizeMode="contain"
            />
            <H1 style={styles.titleText}>Hi–Fi</H1>
            <Title style={styles.whiteText}>
              Money is a bit like music. It can relax you, or raise your
              heartbeat.
            </Title>
            <Body style={styles.bodyText}>
              Plug you headphones, answer a few questions, and find out what’s
              your tune and how money sounds to you.
            </Body>
          </View>
          <SquareButton onPress={hideIntro}>Start</SquareButton>
        </AnimatedSafeAreaView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: SPACING,
    justifyContent: "space-between",
    flex: 1,
  },
  bodyText: {
    color: lightGreyText,
    textAlign: "center",
  },
  whiteText: {
    color: "white",
    textAlign: "center",
  },
  titleText: {
    color: brandOrange,
    textAlign: "center",
  },
  image: {
    alignSelf: "center",
    height: "40%",
  },
});
