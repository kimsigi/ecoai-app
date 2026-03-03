// src/shared/ui/component/layout/PageLayout.tsx

import React, { ReactNode } from "react";
import { Pressable, StatusBar, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArrowLeft from "@/shared/ui/assets/icon/arrow-left.svg";

type HeaderState = "hidden" | "empty" | "content";

type RightItem = {
  key?: string | number;
  isActive?: boolean;
  activeIcon?: ReactNode;
  inactiveIcon?: ReactNode;
  icon?: ReactNode;
  onPress?: () => void;
};

interface PageLayoutProps {
    children: ReactNode;
    headerState?: HeaderState;
    headerHeight?: number;

    statusBarAreaStyle?: StyleProp<ViewStyle>;
    headerContainerStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;

    showBack?: boolean;
    onBackPress?: () => void;
    headerLeft?: ReactNode;
    headerCenter?: ReactNode;

    headerRight?: ReactNode;
    rightItems?: RightItem[];

    customHeader?: ReactNode;

    statusBarHidden?: boolean;
    statusBarStyle?: "light-content" | "dark-content";
    statusBarTranslucent?: boolean;
    statusBarBackgroundColor?: string;
    protectBottomInset?: boolean;
}

export default function PageLayout({
    children,
    headerState = "content",
    headerHeight = 48,
    statusBarAreaStyle,
    headerContainerStyle,
    contentContainerStyle,
    showBack = false,
    onBackPress,
    headerLeft,
    headerCenter,
    headerRight,
    rightItems,
    customHeader,
    statusBarHidden = false,
    statusBarStyle = "dark-content",
    statusBarTranslucent = true,
    statusBarBackgroundColor = "transparent",
    protectBottomInset = true,
}: PageLayoutProps) {

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    // 뒤로가기
    const handleBack = () => {
        if (onBackPress) return onBackPress();
        if (navigation.canGoBack()) navigation.goBack();
    };

    // 좌측영역(백버튼) 렌더링
    const renderLeft = () => {
        if (headerLeft) return headerLeft;
        if (!showBack) return <View style={styles.sideSpacer} />;
        return (
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
            <ArrowLeft width={24} height={24} />
        </Pressable>
        );
    };

    const renderRightIcon = (item: RightItem) => {
        if (item.icon) return item.icon;
        if (item.isActive) return item.activeIcon ?? item.inactiveIcon ?? null;
        return item.inactiveIcon ?? item.activeIcon ?? null;
    };
    
    const renderRight = () => {
        if (headerRight) return headerRight;

        if (!rightItems || rightItems.length === 0) {
            return <View style={styles.sideSpacer} />;
        }

        return (
            <View style={styles.rightIconRow}>
                {rightItems.map((item, index) => (
                    <Pressable
                        key={item.key ?? index}
                        style={styles.rightIconButton}
                        onPress={item.onPress}
                        hitSlop={8}
                    >
                        {renderRightIcon(item)}
                    </Pressable>
                ))}
            </View>
        );
    };

    // 
    const renderHeaderBody = () => {
        if (headerState === "empty") {
            return <View style={[styles.headerBody, { height: headerHeight }, headerContainerStyle]} />;
        }

        if (customHeader) {
            return (
                <View style={[styles.headerBody, { height: headerHeight }, headerContainerStyle]}>
                    {customHeader}
                </View>
            );
        }

        return (
            <View style={[styles.defaultHeaderRow, { height: headerHeight }, headerContainerStyle]}>
                <View style={styles.side}>{renderLeft()}</View>
                <View style={styles.center}>{headerCenter ?? null}</View>
                <View style={[styles.side, styles.right]}>{renderRight()}</View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar
                hidden={statusBarHidden}
                barStyle={statusBarStyle}
                translucent={statusBarTranslucent}
                backgroundColor={statusBarBackgroundColor}
            />

            <View style={[{ height: insets.top }, statusBarAreaStyle]} />

            {headerState !== "hidden" && renderHeaderBody()}

            <View
                style={[
                    styles.content,
                    { paddingBottom: protectBottomInset ? insets.bottom : 0 },
                    contentContainerStyle,
                ]}
            >
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    headerBody: {
        width: "100%",
    },

    defaultHeaderRow: {
        width: "100%",
        flexDirection: "row", // [수정]
        alignItems: "center", // [수정]
    },

    side: {
        width: 56,
        justifyContent: "center",
    },

    sideSpacer: {
        width: 36,
        height: 36,
    },

    right: {
        alignItems: "flex-end",
    },

    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    backButton: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
    },

    rightIconRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingRight: 20,
    },

    rightIconButton: {
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
    },

    content: {
        flex: 1,
    },
});
