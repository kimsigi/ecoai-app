import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import { ROUTES, StackParamList } from "@/app/app.route";
import IconAiAssistant from "@/shared/ui/assets/icon/ai-assistant.svg";
type YoloDetection = {
  label: string;
  score: number;
};

const previewFallback = require("@/shared/ui/assets/image/BackgoundMap.png");


async function requestYoloDetection(cacheImageUri: string): Promise<YoloDetection[]> {
  // TODO: replace with real API call to YOLO endpoint.
  console.log("[YOLO] request image:", cacheImageUri);
  return [];
}

export default function CameraCaptureScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();

  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [permissionRequesting, setPermissionRequesting] = useState(false);

  const isCameraActive = useMemo(
    () => isFocused && hasPermission && !!device && !previewUri,
    [device, hasPermission, isFocused, previewUri]
  );

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate(ROUTES.HOME);
  }, [navigation]);

  const ensurePermission = useCallback(async () => {
    if (hasPermission) return true;

    try {
      setPermissionRequesting(true);
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert("권한 필요", "카메라 권한을 허용해야 촬영할 수 있습니다.");
      }
      return granted;
    } finally {
      setPermissionRequesting(false);
    }
  }, [hasPermission, requestPermission]);

  const handleCapture = useCallback(async () => {
    if (isCapturing) return;

    try {
      const granted = await ensurePermission();
      if (!granted) return;

      if (!cameraRef.current) {
        Alert.alert("카메라 오류", "카메라가 준비되지 않았습니다.");
        return;
      }

      setIsCapturing(true);
      const photo = await cameraRef.current.takePhoto({
        flash: "off",
      });

      const cacheImageUri = photo.path.startsWith("file://")
        ? photo.path
        : `file://${photo.path}`;

      setPreviewUri(cacheImageUri);
      await requestYoloDetection(cacheImageUri);
    } catch (error) {
      console.error("[CameraCapture] capture/inference failed:", error);
      Alert.alert("오류", "촬영 또는 이미지 분석 중 문제가 발생했습니다.");
    } finally {
      setIsCapturing(false);
    }
  }, [ensurePermission, isCapturing]);

  const handleRetake = useCallback(() => {
    setPreviewUri(null);
  }, []);

  const handlePressAiHelper = useCallback(() => {
    navigation.push(ROUTES.AI_CHAT);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {!hasPermission && (
        <View style={styles.permissionWrap}>
          <Text style={styles.permissionText}>카메라 권한이 필요합니다.</Text>
          <Pressable
            style={styles.permissionButton}
            onPress={ensurePermission}
            disabled={permissionRequesting}
          >
            <Text style={styles.permissionButtonText}>
              {permissionRequesting ? "요청 중..." : "권한 허용하기"}
            </Text>
          </Pressable>
        </View>
      )}

      {hasPermission && device && !previewUri && (
        <Camera
          ref={cameraRef}
          style={styles.cameraPreview}
          device={device}
          isActive={isCameraActive}
          photo
        />
      )}

      {hasPermission && !!previewUri && (
        <Image source={{ uri: previewUri }} resizeMode="cover" style={styles.cameraPreview} />
      )}

      {hasPermission && !device && (
        <Image source={previewFallback} resizeMode="cover" style={styles.cameraPreview} />
      )}

      <View style={[styles.headerWrap, { top: insets.top + 10 }]}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
          <Text style={styles.backIcon}>{"<"}</Text>
        </Pressable>
      </View>

      <View style={styles.focusFrame} pointerEvents="none">
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>

      <View style={[styles.bottomPanel, { paddingBottom: insets.bottom + 12 }]}>
        <Text style={styles.guideText}>
          배출 물품을 가능한 화면 중앙에 위치시키면{"\n"}더 정확한 이미지 인식이 가능합니다.
        </Text>

        <View style={styles.bottomRow}>
          <View style={styles.sideSpacer} />

          <Pressable
            style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
            onPress={previewUri ? handleRetake : handleCapture}
            disabled={isCapturing}
          >
            <View
              style={[
                styles.captureButtonInner,
                previewUri ? styles.captureButtonRetakeInner : null,
              ]}
            />
          </Pressable>
          <Pressable style={styles.aiButton} onPress={handlePressAiHelper}>
            <IconAiAssistant width={66} height={70} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  cameraPreview: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  permissionWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#0f1720",
  },
  permissionText: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  permissionButton: {
    backgroundColor: "#1f6feb",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  permissionButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  headerWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 52,
    paddingHorizontal: 12,
    justifyContent: "center",
    backgroundColor: "rgba(20, 24, 31, 0.24)",
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    color: "#ffffff",
    fontSize: 24,
    lineHeight: 24,
    fontWeight: "700",
  },
  focusFrame: {
    position: "absolute",
    left: 20,
    right: 20,
    top: "19%",
    bottom: "26%",
  },
  corner: {
    position: "absolute",
    width: 84,
    height: 84,
    borderColor: "#FFFFFF",
    opacity: 0.96,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  bottomPanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "rgba(22, 28, 37, 0.34)",
    paddingTop: 14,
    paddingHorizontal: 16,
  },
  guideText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 30,
    marginBottom: 14,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sideSpacer: {
    width: 74,
  },
  captureButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  captureButtonDisabled: {
    opacity: 0.72,
  },
  captureButtonInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#252B35",
  },
  captureButtonRetakeInner: {
    backgroundColor: "#b91c1c",
  },
  aiButton: {
    width: 74,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  aiLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  aiText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});

