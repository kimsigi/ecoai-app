// src/features/camera/CameraCaptureScreen.tsx
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View, useColorScheme } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { PageLayout } from "@/shared/ui/component/layout";
import { COLOR } from "@/shared/ui/token";

const HEADER_HEIGHT = 48;

export default function CameraCaptureScreen() {
  const isFocused = useIsFocused();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const device = useCameraDevice("back");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      const current = await Camera.getCameraPermissionStatus();
      if (current === "granted") {
        if (mounted) setHasPermission(true);
        return;
      }
      const requested = await Camera.requestCameraPermission();
      if (mounted) setHasPermission(requested === "granted");
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  const isActive = isFocused && hasPermission === true && !!device;
  const themeBg = isDark ? "#000000" : "#FFFFFF";

  return (
    <PageLayout
      back
      // 상태바 존재상태
      statusBarLight={true}
      headerStyle={styles.header} // 헤더 투명
      useHeaderOffset={false}

      // 상태바 먹은상태
      //useStatusBarOffset={false}
      //useHeaderOffset={false}
      //headerStyle={{ backgroundColor: "transparent"}}

      //statusBarLight={false}
    >
      <View style={styles.container}>
        <View style={styles.cameraUnderHeader}>
          {hasPermission === null && (
            <View style={[styles.center, { backgroundColor: themeBg }]}>
              <ActivityIndicator size="large" color={isDark ? "#FFFFFF" : "#111111"} />
            </View>
          )}

          {hasPermission === false && (
            <View style={[styles.center, { backgroundColor: themeBg }]}>
              <Text style={[styles.message, { color: isDark ? "#FFFFFF" : "#111111" }]}>
                카메라 권한이 필요합니다.
              </Text>
            </View>
          )}

          {hasPermission === true && !device && (
            <View style={[styles.center, { backgroundColor: themeBg }]}>
              <Text style={[styles.message, { color: isDark ? "#FFFFFF" : "#111111" }]}>
                카메라 장치를 찾을 수 없습니다.
              </Text>
            </View>
          )}

          {hasPermission === true && device && (
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={isActive}
              photo
              androidPreviewViewType="texture-view"
            />
          )}
        </View>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLOR.transparent
  },
  contentTransparent: {
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    overflow: "hidden",
  },
  // content는 header 아래에서 시작하므로, header 높이만큼 위로 올려 헤더 뒤에 카메라가 보이게 처리
  cameraUnderHeader: {
    ...StyleSheet.absoluteFillObject,
    //top: -HEADER_HEIGHT,
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 15,
  },
});
