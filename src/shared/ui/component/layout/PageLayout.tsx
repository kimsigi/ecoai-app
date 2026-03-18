import { View, StatusBar, useColorScheme, LayoutChangeEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PageHeader from "./PageHeader";
import { styles } from "./layout.style";
import { PageLayoutProps } from "./layout.type";
import { DEFAULT_HEADER_HEIGHT } from "./layout.constant";
import { COLOR } from "../../token";
import { useState } from "react";

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

    // customHeader의 실제 렌더링 높이를 저장
    const [measuredHeaderHeight, setMeasuredHeaderHeight] = useState(DEFAULT_HEADER_HEIGHT);

    const topInset = inset.top || StatusBar.currentHeight || 0;
    const statusBarInset = useStatusBarOffset ? topInset : 0;
    const barStyle = (statusBarLight ?? isDark) ? "light-content" : "dark-content";

    // customHeader가 있으면 실제 측정 높이를, 없으면 기본 헤더 높이를 사용
    const resolvedHeaderHeight = customHeader
                                ? measuredHeaderHeight
                                : DEFAULT_HEADER_HEIGHT;

    const contentPaddingTop = !header
                            ? statusBarInset
                            : useHeaderOffset
                            ? statusBarInset + resolvedHeaderHeight
                            : statusBarInset;

    // 헤더 오버레이의 실제 높이를 읽어서 content 시작점 계산에 반영
    const handleHeaderLayout = (event: LayoutChangeEvent) => {
        const nextHeight = Math.ceil(event.nativeEvent.layout.height);
        if (nextHeight > 0 && nextHeight !== measuredHeaderHeight) {
            setMeasuredHeaderHeight(nextHeight);
        }
    };

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
                pointerEvents="none"
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
                        backgroundColor: COLOR.white,
                    },
                    contentStyle,
                ]}
            >
                {children}
            </View>

            {/* Header */}
            {header && (
                <View
                    // 오버레이 헤더의 실제 높이를 측정
                    onLayout={handleHeaderLayout}
                    style={[
                        { 
                            top: topInset 
                        },
                        styles.headerOverlayPosition,
                        headerStyle,
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