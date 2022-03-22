import * as React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import * as COLORS from "constants/colors";
import Page from "./components/Page";

const colors = [
  COLORS.brandOrange,
  COLORS.brandBlue,
  COLORS.brandYellow,
  COLORS.brandPink,
  COLORS.brandGreen,
];

const { useRef } = React;

export default function VerticalSurveyScreen() {
  const scrollView = useRef<React.ElementRef<typeof ScrollView> | null>(null);
  const { height } = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const pageHeight = height - headerHeight;

  function scrollTo(index: number) {
    scrollView.current?.scrollTo({
      animated: true,
      y: pageHeight * (index + 1),
    });
    console.log("pressed", index);
  }

  return (
    <>
      <StatusBar hidden />
      <ScrollView
        decelerationRate="fast"
        ref={scrollView}
        scrollEnabled={false}
        snapToInterval={pageHeight}
      >
        {colors.map((color, index) => (
          <Page
            backgroundColor={color}
            index={index}
            isFirst={index === 0}
            isLast={index === colors.length - 1}
            key={color + index}
            pageHeight={pageHeight}
            scrollToIndex={scrollTo}
          />
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  // root: { flex: 1 },
});
