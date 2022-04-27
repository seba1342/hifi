import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// screens
import HomeScreen from "screens/HomeScreen";
import MoodMatrix from "screens/MoodMatrix";
import MoodMatrixGradient from "screens/MoodMatrixGradient";
import VerticalSurveyScreen from "screens/VerticalSurveyScreen";
import HifiIntro from "screens/HifiIntro";
import InteractableBackground from "screens/InteractableBackground";
// components
import BackButton from "components/BackButton";
import SoundWave from "screens/SoundWave";
import { brandExtraDarkBlue } from "constants/colors";
import Trails from "screens/Trails";

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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            name="InteractableBackground"
            component={InteractableBackground}
            options={{
              headerTitle: "",
              headerShadowVisible: false,
              headerBackTitle: "Close",
              headerTintColor: brandExtraDarkBlue,
              headerStyle: {
                backgroundColor: "transparent",
              },
            }}
          />
          <Stack.Screen
            name="Trails"
            component={Trails}
            options={{
              headerTitle: "",
              headerShadowVisible: false,
              headerBackTitle: "Close",
              headerTintColor: brandExtraDarkBlue,
              headerStyle: {
                backgroundColor: "transparent",
              },
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
          <Stack.Screen
            name="SoundWave"
            component={SoundWave}
            options={{
              headerTitle: "",
              headerShadowVisible: false,
              headerBackTitle: "Close",
              headerTintColor: brandExtraDarkBlue,
              headerStyle: {
                backgroundColor: "transparent",
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
