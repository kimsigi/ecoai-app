// src/features/camera/CameraCaptureTest2Screen.tsx

import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Camera } from "react-native-vision-camera";
import { PageLayout } from "@/shared/ui/component/layout";
import { styles } from "./camera.style";
import { useCameraCaptureTest2 } from "./useCameraCaptureTest2";

export default function CameraCaptureTest2Screen() {
    // [변경] 화면은 렌더링만 담당하고, 촬영/YOLO/bbox/가장 가까운 객체 판단은 훅에서 처리
    const {
        device,
        cameraRef,
        isCapturing,
        isInferencing,
        previewUri,
        isCameraActive,
        overlayBoxes,
        detections,
        onPreviewLayout,
        onRetakePress,
        onShutterPress,
    } = useCameraCaptureTest2();

    return (
        <PageLayout
            back
            useStatusBarOffset={false}
            useHeaderOffset={false}
            headerStyle={styles.header}
        >
            <View style={styles.container} onLayout={onPreviewLayout}>
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

                {/* [변경] 촬영 후 결과 이미지 표시 */}
                {previewUri ? (
                    <Image
                        source={{ uri: previewUri }}
                        style={styles.cameraContainer}
                        resizeMode="cover"
                    />
                ) : null}

                {/* [변경] 훅에서 계산한 bbox만 화면에 렌더링 */}
                {previewUri ? (
                    <View pointerEvents="none" style={styles.detectionOverlay}>
                        {overlayBoxes.map((box) => (
                            <View
                                key={box.key}
                                style={[
                                    styles.detectionBox,
                                    {
                                        left: box.left,
                                        top: box.top,
                                        width: box.width,
                                        height: box.height,
                                    },
                                ]}
                            >
                                <View style={styles.detectionBadge}>
                                    <Text numberOfLines={1} style={styles.detectionBadgeText}>
                                        {box.caption}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
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
                            {/* [변경] YOLO 테스트 상태 문구 표시 */}
                            <Text style={styles.guideMessageText}>
                                {!previewUri
                                    ? "테스트용 카메라 화면"
                                    : isInferencing
                                      ? "YOLO 추론 중..."
                                      : `탐지 결과 ${detections.length}건`}
                            </Text>
                        </View>

                        <View style={styles.bottomGroup}>
                            {/* [변경] 촬영/재촬영만 유지 */}
                            <Pressable
                                accessibilityLabel={previewUri ? "재촬영" : "촬영"}
                                onPress={previewUri ? onRetakePress : onShutterPress}
                                disabled={isCapturing || isInferencing}
                                style={[
                                    styles.shutterOuter,
                                    (isCapturing || isInferencing) &&
                                        styles.shutterOuterDisabled,
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
