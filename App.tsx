import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import VerticalSurveyScreen from "./screens/VerticalSurveyScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="VerticalSurvey">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="VerticalSurvey" component={VerticalSurveyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
