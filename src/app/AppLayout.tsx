import { ReactNode } from "react";
import { StatusBar, useColorScheme, View } from "react-native";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
import useAppStore from "./app.store";
import { whenPlatform } from "@/shared/core/platform";

export default function AppLayout({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const {
    rootBackground,
    contentBackground,
    statusBarStyle,
    statusBarBackground,
    statusBarTranslucent,
  } = useAppStore();

  // 시스템 기본값
  const systemRoot = isDark ? "#000000" : "#FFFFFF";
  const systemStatus = isDark ? "light-content" : "dark-content";

  const finalRoot = rootBackground ?? systemRoot;
  const finalStatusStyle = statusBarStyle ?? systemStatus;
  const finalTranslucent = statusBarTranslucent ?? true;

  return (
    <View style={{ flex: 1, backgroundColor: finalRoot }}>
      <StatusBar
        barStyle={finalStatusStyle}
        translucent={finalTranslucent}
        backgroundColor={whenPlatform({
          android: statusBarBackground ?? "transparent",
          ios: "transparent",
        })}
      />

      {/* 루트는 하단만 보호 */}
      <SafeAreaView
        style={{ flex: 1, backgroundColor: contentBackground ?? "transparent" }}
        edges={["bottom"]}
      >
        {children}
      </SafeAreaView>
    </View>
  );
}