import { COLOR } from "@/shared/ui/token";
import { ReactNode } from "react";
import { useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppLayout({ children }: {children: ReactNode}) {
    const scheme = useColorScheme();
    const isDark = scheme === "dark";
    const inset = useSafeAreaInsets();

    return (
        <View style={{ 
            flex: 1, 
            backgroundColor: isDark ? COLOR.black : COLOR.white,
            paddingBottom: inset.bottom,
        }}>
            {/* App Content */}
            {children}

        </View>
  );
}