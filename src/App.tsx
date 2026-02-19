import AppInitializer from "@/app/AppInitializer";
import AppNavigation from "@/app/AppNavigation";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AlertProvider } from "./shared/ui/component/alert";
import { StatusBar } from "react-native";
import AppLayout from "./app/AppLayout";

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AlertProvider>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <AppLayout>
            <AppInitializer>
              <AppNavigation />
            </AppInitializer>
          </AppLayout>
        </AlertProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
