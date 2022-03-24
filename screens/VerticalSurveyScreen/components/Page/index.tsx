import * as React from "react";
import { Button, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import Body from "components/text/Body";
import Title from "components/text/Title";
import OverlineTitle from "components/text/OverlineTitle";
import { SPACING } from "constants/styles";
import * as COLORS from "constants/colors";
import Option from "../Option";
import * as Haptics from "expo-haptics";

const { useRef } = React;

type Props = Readonly<{
  isFirst: boolean;
  isLast: boolean;
  index: number;
  pageHeight: number;
  question: { question: string; options: string[] };
  scrollToIndex: (index: number, callback: () => void) => void;
}>;

export type Handle = Readonly<{
  onLayout: () => void;
}>;

export default React.forwardRef<Handle, Props>(function Page(
  { isFirst, isLast, index, pageHeight, question, scrollToIndex }: Props,
  ref
) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const isGestureActive = useSharedValue(false);
  const activeDropZoneIndex = useSharedValue(null);
  const optionLayout = useSharedValue(question.options.map(() => null));

  const optionRef = useRef<Array<React.ElementRef<typeof View> | null>>(
    question.options.map(() => null)
  );

  function onLayout() {
    const layout = optionRef.current.map((_option) => null);

    optionRef.current.forEach((option, index) => {
      option?.measure((_x, _y, width, height, pageX, pageY) => {
        layout[index] = { pageX, pageY, width, height };

        if (layout.every((item) => item != null)) {
          optionLayout.value = layout;
        }
      });
    });
  }

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx: { startX: number; startY: number }) => {
      ctx.startX = x.value;
      ctx.startY = y.value;
      isGestureActive.value = true;
    },
    onActive: ({ translationX, translationY, absoluteX, absoluteY }, ctx) => {
      x.value = ctx.startX + translationX;
      y.value = ctx.startY + translationY;

      let foundDropZone = false;

      optionLayout.value.forEach((option, index) => {
        if (option == null) return;

        if (
          absoluteX > option.pageX &&
          absoluteX < option.pageX + option.width &&
          absoluteY > option.pageY &&
          absoluteY < option.pageY + option.height
        ) {
          activeDropZoneIndex.value = index;
          foundDropZone = true;
        }
      });

      if (!foundDropZone) {
        activeDropZoneIndex.value = null;
      }
    },
    onEnd: () => {
      if (activeDropZoneIndex.value === null) {
        x.value = withSpring(0);
        y.value = withSpring(0);
      }

      isGestureActive.value = false;
    },
  });

  useAnimatedReaction(
    () => {
      return activeDropZoneIndex;
    },
    (activeDropZoneIndex) => {
      if (activeDropZoneIndex.value !== null) runOnJS(Haptics.selectionAsync)();
    }
  );

  React.useImperativeHandle(ref, () => ({
    onLayout,
  }));

  const animStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }, { translateY: y.value }],
    };
  });

  const buttonStyles = useAnimatedStyle(() => ({
    opacity: withTiming(
      isGestureActive.value || activeDropZoneIndex.value !== null ? 0 : 1
    ),
  }));

  const nextButtonStyles = useAnimatedStyle(() => ({
    opacity: withTiming(activeDropZoneIndex.value !== null ? 1 : 0),
  }));

  return (
    <View style={[{ height: pageHeight }]}>
      <SafeAreaView style={styles.root}>
        <View>
          <OverlineTitle style={styles.overlineText}>{`QUESTION ${
            index + 1
          }`}</OverlineTitle>
          <Title style={styles.whiteText}>{question.question}</Title>
        </View>
        <View onLayout={onLayout} style={styles.optionContainer}>
          {question.options.map((option, index) => (
            <View
              key={option + index + question}
              ref={(ref) => (optionRef.current[index] = ref)}
              style={{
                margin: SPACING,
              }}
            >
              <Option
                index={index}
                option={option}
                activeDropZoneIndex={activeDropZoneIndex}
              />
            </View>
          ))}
        </View>
        <View style={styles.coinContainer}>
          <PanGestureHandler onGestureEvent={eventHandler}>
            <Animated.Image
              source={require("./assets/Coin.png")}
              style={animStyles}
            />
          </PanGestureHandler>
          <View>
            <Animated.View style={buttonStyles}>
              <Body style={[styles.overlineText, styles.coinDragHint]}>
                Drag the coin on top of your answer
              </Body>
            </Animated.View>
          </View>
          <Animated.View style={nextButtonStyles}>
            <Button
              color="white"
              onPress={() => scrollToIndex(isLast ? -1 : index, onLayout)}
              title={isLast ? "Back to top" : "Next question"}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    padding: SPACING,
  },
  coinContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  coinDragHint: {
    fontSize: 12,
    marginTop: SPACING / 2,
  },
  optionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  option: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightGrey,
    borderStyle: "dashed",
    borderWidth: 3,
    borderColor: COLORS.brandOrange,
    borderRadius: 8,
    paddingHorizontal: SPACING,
    margin: SPACING,
    height: 64,
  },
  optionText: {
    fontWeight: "bold",
    marginBottom: 0,
  },
  overlineText: {
    color: COLORS.lightGreyText,
  },
  whiteText: {
    color: "white",
  },
});
