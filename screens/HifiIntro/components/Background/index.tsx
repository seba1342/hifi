import * as React from "react";
import { StyleSheet } from "react-native";
import { Video } from "expo-av";
import { brandExtraDarkBlue } from "constants/colors";
import { LinearGradient } from "expo-linear-gradient";

export default function Background() {
  return (
    <LinearGradient
      colors={["#20242D", "#222832", "#56383B", "#222832", "#20242D"]}
      start={{ x: 0, y: 0.1 }}
      end={{ x: 0.85, y: 1 }}
      locations={[0.2, 0.25, 0.5, 0.8, 0.9]}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: -150,
        bottom: -50,
        backgroundColor: brandExtraDarkBlue,
      }}
    >
      <Video
        resizeMode="cover"
        source={require("./assets/bg.mp4")}
        posterSource={require("./assets/bg.jpg")}
        posterStyle={{ resizeMode: "cover", height: "100%", width: "100%" }}
        usePoster
        shouldPlay
        isLooping
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: 0.25,
          },
        ]}
      />
    </LinearGradient>
  );
}
