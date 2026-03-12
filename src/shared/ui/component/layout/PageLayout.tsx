import { View, StatusBar, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PageHeader from "./PageHeader";
import { styles } from "./layout.style";
import { PageLayoutProps } from "./layout.type";
import { DEFAULT_HEADER_HEIGHT } from "./layout.constant";

export default function PageLayout({
    children,

    header = true,
    headerBottomLine = false,
    customHeader,
    
    title,
    back = false,
    right = [],

    statusBarLight,

    statusBarStyle,
    headerStyle,
    contentStyle,

    useStatusBarOffset = true,
    useHeaderOffset = true,

}: PageLayoutProps) {

    const inset = useSafeAreaInsets();
    const scheme = useColorScheme();
    const isDark = scheme === "dark";

    const topInset = inset.top || StatusBar.currentHeight || 0;
    const statusBarInset = useStatusBarOffset ? topInset : 0;
    const barStyle = (statusBarLight ?? isDark) ? "light-content" : "dark-content";
    const contentPaddingTop = !header
                            ? statusBarInset
                            : useHeaderOffset
                            ? statusBarInset + DEFAULT_HEADER_HEIGHT
                            : statusBarInset;

    return (
        <View style={{ flex: 1 }}>
        
            {/* StatusBar style */}
            <StatusBar 
                translucent 
                backgroundColor="transparent" 
                barStyle={barStyle} 
            />
        
            {/* StatusBar background */}
            <View
                style={[
                    { 
                        height: topInset 
                    },  
                    styles.statusBarBackgroundPosition, 
                    statusBarStyle
                ]}
            />
        
            {/* Content */}
            <View
                style={[
                    {
                        flex: 1,
                        paddingTop: contentPaddingTop,
                    },
                    contentStyle,
                ]}
            >
                {children}
            </View>

            {/* Header */}
            {header && (
                <View
                    style={[
                        { 
                            top: topInset 
                        },
                        styles.headerOverlayPosition
                    ]}
                >
                    {customHeader ?? (
                        <PageHeader
                            title={title}
                            back={back}
                            right={right}
                            style={headerStyle}
                            bottomLine={headerBottomLine}
                        />
                    )}
                </View>
            )}
        </View>
    );
}