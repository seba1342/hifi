import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// screens
import HomeScreen from "screens/HomeScreen";
import MoodMatrix from "screens/MoodMatrix";
import MoodMatrixGradient from "screens/MoodMatrixGradient";
import VerticalSurveyScreen from "screens/VerticalSurveyScreen";
// components
import BackButton from "components/BackButton";

const Stack = createNativeStackNavigator();

export default function App() {
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
