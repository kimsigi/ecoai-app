import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AppInitializer from "@/app/AppInitializer";
import AppLayout from "./app/AppLayout";
import { AlertProvider } from "@/shared/ui/component/alert";
import { QueryProvider } from "@/shared/core/api/query";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider>
          <QueryProvider>
            <BottomSheetModalProvider>
              <AlertProvider>
                <AppLayout>
                  <AppInitializer />
                </AppLayout>
              </AlertProvider>
            </BottomSheetModalProvider>
          </QueryProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
