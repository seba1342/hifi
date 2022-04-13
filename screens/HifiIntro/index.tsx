import * as React from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { StatusBar } from "react-native";
import Background from "./components/Background";
import IntroScreen from "./IntroScreen";
import ExplainerScreen from "./ExplainerScreen";

const { useState } = React;

export default function HifiIntro() {
  const headerHeight = useHeaderHeight();
  const [showIntro, setShowIntro] = useState(true);

  function hideIntro() {
    setShowIntro(false);
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Background />
      <IntroScreen showIntro={showIntro} hideIntro={hideIntro} />
      <ExplainerScreen showExplainer={!showIntro} />
    </>
  );
}
