import * as React from "react";
import {
  ScrollView,
  StatusBar,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import * as COLORS from "constants/colors";
import AnimatedGradient from "components/AnimatedGradient";
import Page from "./components/Page";

const colors = [
  COLORS.brandOrange,
  COLORS.brandBlue,
  COLORS.brandYellow,
  COLORS.brandPink,
  COLORS.brandGreen,
];

const questions = [
  {
    question: "How do you feel about how you manage your day to day finances?",
    options: [
      "Killing it",
      "Pretty good",
      "It's okay",
      "Pretty bad",
      "Terrible",
    ],
  },
  {
    question: "How often do you have money left over before payday?",
    options: ["All the time", "Mostly", "Sometimes", "Not often", "Never"],
  },
  {
    question: "How easy is it for you to cover your basic living costs?",
    options: [
      "Piss easy",
      "Pretty easy",
      "It's okay",
      "Pretty hard",
      "Impossible",
    ],
  },
];

const gradientColors = ["#6F2D7B", "#7A264D", "#642340", "#3B1E2E", "#1A1A22"];

const { useRef } = React;

export default function VerticalSurveyScreen() {
  const scrollView = useRef<React.ElementRef<typeof ScrollView> | null>(null);
  const pageRefs = useRef<Array<React.ElementRef<typeof Page> | null>>(
    questions.map(() => null)
  );

  const { height } = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const pageHeight = height - headerHeight;

  function scrollTo(index: number) {
    scrollView.current?.scrollTo({
      animated: true,
      y: pageHeight * (index + 1),
    });
  }

  function onMomentumScrollEnd(currentPageIndex: number) {
    pageRefs.current?.[currentPageIndex].onLayout();
  }

  function handleMomentumScrollEnd({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) {
    const rawOffset = nativeEvent.contentOffset.y;
    const currentOffset = rawOffset;
    const pageSize = pageHeight;

    const currentPageIndex = Math.floor((currentOffset + 10) / pageSize);

    onMomentumScrollEnd(currentPageIndex);
  }

  return (
    <>
      <AnimatedGradient customColors={gradientColors} speed={4000} />
      <StatusBar hidden />
      <ScrollView
        decelerationRate="fast"
        ref={scrollView}
        scrollEnabled={false}
        snapToInterval={pageHeight}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      >
        {questions.map((question, index) => (
          <Page
            index={index}
            isFirst={index === 0}
            isLast={index === questions.length - 1}
            key={question.question + index}
            pageHeight={pageHeight}
            question={question}
            scrollToIndex={scrollTo}
            ref={(ref) => (pageRefs.current[index] = ref)}
          />
        ))}
      </ScrollView>
    </>
  );
}
