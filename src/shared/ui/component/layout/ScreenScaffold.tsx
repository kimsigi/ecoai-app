import React, { ReactNode } from "react";
import {
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppHeader, { HeaderProps } from "./ScreenHeader";

export type HeaderMode = "fixed" | "overlay" | "none";

interface Props {
  children: ReactNode;
  headerMode?: HeaderMode;
  headerProps?: HeaderProps;
  headerContent?: ReactNode;

  backgroundColor?: string;
  headerBackgroundColor?: string;

  statusBarStyle?: "light-content" | "dark-content";
  statusBarBackgroundColor?: string;
  statusBarTranslucent?: boolean;

  protectBottomInset?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

/**
 * Screen 공통 골격
 * - fixed/overlay/none 헤더 모드
 * - 하단 safe-area 보호 옵션
 * - headerContent로 완전 커스텀 헤더 주입 가능
 */
export default function ScreenScaffold({
  children,
  headerMode = "fixed",
  headerProps,
  headerContent,
  backgroundColor = "#FFFFFF",
  headerBackgroundColor,
  statusBarStyle = "dark-content",
  statusBarBackgroundColor = "transparent",
  statusBarTranslucent = true,
  protectBottomInset = true,
  contentStyle,
}: Props) {
  const insets = useSafeAreaInsets();
  const resolvedHeaderBg = headerBackgroundColor ?? backgroundColor;

  const renderHeader = () => {
    if (headerContent) return headerContent;
    return <AppHeader {...headerProps} backgroundColor={resolvedHeaderBg} />;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar
        translucent={statusBarTranslucent}
        backgroundColor={statusBarBackgroundColor}
        barStyle={statusBarStyle}
      />

      {headerMode === "fixed" && (
        <View style={{ paddingTop: insets.top, backgroundColor: resolvedHeaderBg }}>
          {renderHeader()}
        </View>
      )}

      <View
        style={[
          styles.content,
          protectBottomInset && { paddingBottom: insets.bottom },
          contentStyle,
        ]}
      >
        {children}
      </View>

      {headerMode === "overlay" && (
        <View pointerEvents="box-none" style={[styles.overlay, { paddingTop: insets.top }]}>
          {renderHeader()}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});
