import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

import { MAIN_ROUTES } from "./app.route";
import { MainStackParamList } from "./app.type";
import LocationPickerScreen from "@/features/location/LocationPickerScreen";
import AppLayout from "./AppLayout";


/* ---------- Stack ---------- */

const MainStack = createNativeStackNavigator<MainStackParamList>();

function MainFlowStack() {
  return (
    <MainStack.Navigator
      initialRouteName={MAIN_ROUTES.LOCATION_PICKER}
      screenOptions={{ headerTitleAlign: "center" }}
    >
      <MainStack.Screen
        name={MAIN_ROUTES.LOCATION_PICKER}
        component={LocationPickerScreen}
        options={{ title: "폐기물 위치 설정" }}
      />
    </MainStack.Navigator>
  );
}

/* ---------- Root ---------- */

export default function AppNavigation() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AppLayout>
        <NavigationContainer>
          <MainFlowStack />
        </NavigationContainer>
      </AppLayout>
    </SafeAreaProvider>
  );
}
