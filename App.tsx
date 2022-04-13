import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
// screens
import HomeScreen from "screens/HomeScreen";
import MoodMatrix from "screens/MoodMatrix";
import MoodMatrixGradient from "screens/MoodMatrixGradient";
import VerticalSurveyScreen from "screens/VerticalSurveyScreen";
import HifiIntro from "screens/HifiIntro";
// components
import BackButton from "components/BackButton";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    CircularStdBlack: require("./assets/fonts/CircularStd-Black.otf"),
    CircularStdBold: require("./assets/fonts/CircularStd-Bold.otf"),
    CircularStdBook: require("./assets/fonts/CircularStd-Book.otf"),
    CircularStdMedium: require("./assets/fonts/CircularStd-Medium.otf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerticalSurvey"
          component={VerticalSurveyScreen}
          options={{
            headerLeft: BackButton,
            headerTitle: "",
            headerStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen
          name="MoodMatrix"
          component={MoodMatrix}
          options={{
            headerLeft: BackButton,
            headerTitle: "",
            headerStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen
          name="MoodMatrixGradient"
          component={MoodMatrixGradient}
          options={{
            headerLeft: BackButton,
            headerTitle: "",
            headerStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen
          name="HifiIntro"
          component={HifiIntro}
          options={{
            headerLeft: BackButton,
            headerTitle: "",
            headerShadowVisible: false,
            headerBackTitle: "",
            headerStyle: {
              backgroundColor: "transparent",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
