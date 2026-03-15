import AppInitializer from "@/app/AppInitializer";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AlertProvider } from "./shared/ui/component/alert";
import AppLayout from "./app/AppLayout";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider>
          <BottomSheetModalProvider>
            <AlertProvider>
              <AppLayout>
                <AppInitializer />
              </AppLayout>
            </AlertProvider>
          </BottomSheetModalProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
