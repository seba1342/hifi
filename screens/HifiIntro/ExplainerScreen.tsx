import * as React from "react";
import { FlatList, StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  FadeInDown,
  FadeOut,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { lightGreyText } from "constants/colors";
import { SPACING } from "constants/styles";
import H1 from "components/text/H1";
import { useHeaderHeight } from "@react-navigation/elements";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const DATA = [
  {
    id: "text-1",
    text: "You probably already know how you feel about money, but there are a few ways to measure where you actually stand",
  },
  {
    id: "text-2",
    text: "And knowing where you stand is the first step to be able to make improvements",
  },
  {
    id: "text-3",
    text: "So we’re going to ask you a few questions that are based on the concept of Financial Wellbeing ",
  },
  {
    id: "text-4",
    text: "Those questions are not to judge you, it’s an opportunity to reflect and better understand your situation. It’s not about Up, it’s about you",
  },
  {
    id: "text-5",
    text: "Grab a comfy spot, make sure you have your headphones on if you can, and let’s get started",
  },
  {
    id: "text-6",
    text: "But first, we want to make sure you’re in the right head-space. And nothing puts you in the zone like the right kind of sounds…",
  },
  {
    id: "text-7",
    text: "What’s the right vibe for you today?",
  },
];

const SEPARATOR_HEIGHT = SPACING * 5;

export default function ExplainerScreen({
  showExplainer,
}: {
  showExplainer: boolean;
}) {
  const ref = React.useRef(null);
  const scrollY = useSharedValue(0);
  const userScroll = useSharedValue(false);
  const currentBlock = useSharedValue(0);
  const [delay, setDelay] = React.useState(5000);

  const { height } = useWindowDimensions();
  const headerHeight = useHeaderHeight();

  const itemHeight = height / 2;
  const headerComponentHeight = itemHeight / 2;

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      userScroll.value = true;

      runOnJS(setDelay)(null);
    },
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
    onMomentumEnd: (event) => {
      currentBlock.value = event.contentOffset.y / itemHeight;

      if (currentBlock.value === DATA.length - 1) {
        runOnJS(setDelay)(null);
      }
    },
  });

  useInterval(
    () => {
      console.log("tick, tock");
      ref.current?.scrollToOffset({
        offset: scrollY.value + itemHeight,
        animated: true,
      });
    },
    showExplainer ? delay : null
  );

  const renderItem = ({ item, index }) => (
    <TextBlock
      height={itemHeight}
      text={item.text}
      scrollY={scrollY}
      index={index}
    />
  );

  return (
    <View
      style={{
        flex: showExplainer ? 1 : 0,
        top: -headerHeight,
        height: height,
        position: "absolute",
      }}
    >
      {showExplainer ? (
        <AnimatedFlatList
          entering={FadeInDown.delay(600).duration(1000)}
          exiting={FadeOut.duration(1000)}
          data={DATA}
          renderItem={renderItem}
          contentContainerStyle={styles.root}
          ListHeaderComponent={Spacer({ height: headerComponentHeight })}
          ListFooterComponent={Spacer({ height: headerComponentHeight })}
          style={{ flex: 1 }}
          getItemLayout={(_data, index) => ({
            length: itemHeight,
            offset: itemHeight * index,
            index,
          })}
          snapToInterval={itemHeight}
          decelerationRate="fast"
          snapToAlignment="start"
          ref={ref}
          onScroll={scrollHandler}
          initialNumToRender={4}
        />
      ) : null}
    </View>
  );
}

function TextBlock({ height, text, scrollY, index }) {
  const animStyles = useAnimatedStyle(() => {
    if (index === 0) {
      return {
        opacity: interpolate(
          scrollY.value + height,
          [0, height, height * 2],
          [0.1, 1, 0.1]
        ),
      };
    }

    const offset = Math.ceil(height * (1 / index));

    return {
      opacity: interpolate(
        Math.ceil(scrollY.value / index),
        [height - offset, height, height + offset],
        [0.1, 1, 0.1]
      ),
    };
  }, [scrollY]);

  return (
    <Animated.View style={[{ height, justifyContent: "center" }, animStyles]}>
      <H1 style={styles.textBlock}>{text}</H1>
    </Animated.View>
  );
}

function Spacer({ height = SEPARATOR_HEIGHT }) {
  return <View style={{ height }} />;
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: SPACING,
    justifyContent: "space-between",
  },
  bodyText: {
    color: lightGreyText,
    textAlign: "center",
  },
  textBlock: {
    marginBottom: 0,
  },
});

function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
