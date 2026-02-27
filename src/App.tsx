import AppInitializer from "@/app/AppInitializer";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AlertProvider } from "./shared/ui/component/alert";
import AppLayout from "./app/AppLayout";

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AlertProvider>
          <AppLayout>
            <AppInitializer />
          </AppLayout>
        </AlertProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
