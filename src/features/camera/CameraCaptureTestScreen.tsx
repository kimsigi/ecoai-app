// src/features/camera/CameraCaptureTestScreen.tsx

import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Camera } from "react-native-vision-camera";
import { PageLayout } from "@/shared/ui/component/layout";
import { styles } from "./camera.style";
import { useCameraCaptureTest } from "./useCameraCaptureTest";

export default function CameraCaptureTestScreen() {
    // [변경] 촬영/미리보기/재촬영까지만 사용하는 테스트용 훅
    const {
        device,
        cameraRef,
        isCapturing,
        previewUri,
        isCameraActive,
        onRetakePress,
        onShutterPress,
    } = useCameraCaptureTest();

    return (
        <PageLayout
            back
            useStatusBarOffset={false}
            useHeaderOffset={false}
            headerStyle={styles.header}
        >
            <View style={styles.container}>
                {device ? (
                    <Camera
                        ref={cameraRef}
                        style={styles.cameraContainer}
                        device={device}
                        isActive={isCameraActive}
                        photo
                        androidPreviewViewType="texture-view"
                        enableZoomGesture
                    />
                ) : null}

                {/* [변경] 촬영 후에는 추론/오버레이 없이 촬영 이미지만 표시 */}
                {previewUri ? (
                    <Image
                        source={{ uri: previewUri }}
                        style={styles.cameraContainer}
                        resizeMode="cover"
                    />
                ) : null}

                <View pointerEvents="box-none" style={styles.overlayContainer}>
                    <View pointerEvents="none" style={styles.guideFrameArea}>
                        <View style={[styles.guideCorner, styles.guideCornerTopLeft]} />
                        <View style={[styles.guideCorner, styles.guideCornerTopRight]} />
                        <View style={[styles.guideCorner, styles.guideCornerBottomLeft]} />
                        <View style={[styles.guideCorner, styles.guideCornerBottomRight]} />
                    </View>

                    <View style={styles.bottomContainer}>
                        <View style={styles.guideMessageContainer}>
                            {/* [변경] 테스트 화면용 안내 문구 */}
                            <Text style={styles.guideMessageText}>
                                테스트용 카메라 화면
                            </Text>
                        </View>

                        <View style={styles.bottomGroup}>
                            {/* [변경] 촬영 후에는 동일 버튼으로 재촬영 */}
                            <Pressable
                                accessibilityLabel={previewUri ? "재촬영" : "촬영"}
                                onPress={previewUri ? onRetakePress : onShutterPress}
                                disabled={isCapturing}
                                style={[
                                    styles.shutterOuter,
                                    isCapturing && styles.shutterOuterDisabled,
                                ]}
                            >
                                <View style={styles.shutterInner} />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </PageLayout>
    );
}
