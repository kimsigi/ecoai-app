import { ReactNode } from "react";
import { StatusBar, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout({ children }: {children: ReactNode}) {
    const scheme = useColorScheme();
    const isDark = scheme === "dark";

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? "#000000" : "#FFFFFF" }}>
            <StatusBar
                barStyle={isDark ? "light-content" : "dark-content"}
                translucent
                backgroundColor="transparent"
            />
            <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
                {children}
            </SafeAreaView>
        </View>
  );
}