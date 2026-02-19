import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MAIN_ROUTES } from "./app.route";
import { StackParamList } from "./app.type";
import LocationPickerScreen from "@/features/location/LocationPickerScreen";
import ShowcaseScreen from "@/features/showcase/ShowcaseScreen";
import AiChatScreen from "@/features/aichat/AiChatScreen";
import PermissionScreen from "@/features/permission/PermissionScreen";

/* ---------- Stack ---------- */
const Stack = createNativeStackNavigator<StackParamList>();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={MAIN_ROUTES.SHOWCASE}
        screenOptions={{ headerTitleAlign: "center" }}
      >
        <Stack.Screen
          name={MAIN_ROUTES.SHOWCASE}
          component={ShowcaseScreen}
          options={{ title: "쇼케이스" }}
        />
        <Stack.Screen
          name={MAIN_ROUTES.PERMISSION}
          component={PermissionScreen}
          options={{ title: "퍼미션" }}
        />
        <Stack.Screen
          name={MAIN_ROUTES.LOCATION_PICKER}
          component={LocationPickerScreen}
          options={{ title: "폐기물 위치 설정" }}
        />
        <Stack.Screen
          name={MAIN_ROUTES.AI_CHAT}
          component={AiChatScreen}
          options={{ title: "AI 도우미" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
