import * as React from "react";
import { Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function BackButton() {
  const { goBack } = useNavigation();

  return (
    <TouchableOpacity onPress={goBack}>
      <Image source={require("./assets/chevron-left.png")} />
    </TouchableOpacity>
  );
}
