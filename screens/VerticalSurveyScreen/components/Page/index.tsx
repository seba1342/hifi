import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedLinearGradient, {
  presetColors,
} from "react-native-animated-linear-gradient";

export default function Page({
  backgroundColor,
  isFirst,
  isLast,
  index,
  pageHeight,
  scrollToIndex,
}: Readonly<{
  backgroundColor: string;
  isFirst: boolean;
  isLast: boolean;
  index: number;
  pageHeight: number;
  scrollToIndex: (index: number) => void;
}>) {
  return (
    <View style={[{ backgroundColor, height: pageHeight }]}>
      <AnimatedLinearGradient
        customColors={presetColors.instagram}
        speed={4000}
      />

      <SafeAreaView style={styles.root}>
        <Text>{backgroundColor}</Text>
        <Button
          color="black"
          onPress={() => scrollToIndex(isLast ? -1 : index)}
          title={isLast ? "Back to top" : "Next"}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
  },
});
