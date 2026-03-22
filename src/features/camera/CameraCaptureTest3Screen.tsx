import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Camera } from "react-native-vision-camera";
import { PageLayout } from "@/shared/ui/component/layout";
import { styles } from "./camera.style";
import { useCameraCaptureTest3 } from "./useCameraCaptureTest3";

export default function CameraCaptureTest3Screen() {
    // [변경] 화면은 렌더링만 담당하고, bbox 중심/카메라 중심 거리 계산은 훅에서 처리
    const {
        device,
        cameraRef,
        isCapturing,
        isInferencing,
        previewUri,
        isCameraActive,
        overlayBoxes,
        detections,
        viewportCenter,
        onPreviewLayout,
        onRetakePress,
        onShutterPress,
    } = useCameraCaptureTest3();

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

                {/* [변경] 카메라 정중앙 표시 */}
                {previewUri ? (
                    <View
                        pointerEvents="none"
                        style={[
                            localStyles.cameraCenterPoint,
                            {
                                left: viewportCenter.x - 6,
                                top: viewportCenter.y - 6,
                            },
                        ]}
                    />
                ) : null}

                {/* [변경] 각 bbox 중심과 카메라 중심 사이의 선 + 거리 + bbox 렌더링 */}
                {previewUri ? (
                    <View pointerEvents="none" style={styles.detectionOverlay}>
                        {overlayBoxes.map((box) => (
                            <React.Fragment key={box.key}>
                                <View
                                    style={[
                                        localStyles.distanceLine,
                                        {
                                            left: box.lineLeft,
                                            top: box.lineTop,
                                            width: box.lineWidth,
                                            transform: [{ rotate: `${box.lineAngleDeg}deg` }],
                                        },
                                    ]}
                                />
                                <View
                                    style={[
                                        localStyles.distanceBadge,
                                        {
                                            left: box.distanceLabelLeft,
                                            top: box.distanceLabelTop,
                                        },
                                    ]}
                                >
                                    <Text style={localStyles.distanceBadgeText}>
                                        {/* [변경] 카메라 중심과 bbox 중심 사이 거리 표시 */}
                                        {Math.round(box.distanceToViewportCenter)} px
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        styles.detectionBox,
                                        box.isNearest && localStyles.nearestDetectionBox,
                                        {
                                            left: box.left,
                                            top: box.top,
                                            width: box.width,
                                            height: box.height,
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.detectionBadge,
                                            box.isNearest && localStyles.nearestDetectionBadge,
                                        ]}
                                    >
                                        <Text
                                            numberOfLines={1}
                                            style={styles.detectionBadgeText}
                                        >
                                            {box.caption}
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    style={[
                                        localStyles.bboxCenterPoint,
                                        {
                                            left: box.centerX - 4,
                                            top: box.centerY - 4,
                                        },
                                    ]}
                                />
                            </React.Fragment>
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
                            <Text style={styles.guideMessageText}>
                                {!previewUri
                                    ? "테스트용 카메라 화면"
                                    : isInferencing
                                      ? "YOLO 추론 중..."
                                      : `탐지 결과 ${detections.length}건`}
                            </Text>
                        </View>

                        <View style={styles.bottomGroup}>
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

// [변경] 거리선/중심점 표시용 로컬 스타일 추가
const localStyles = StyleSheet.create({
    cameraCenterPoint: {
        position: "absolute",
        width: 12,
        height: 12,
        borderRadius: 999,
        backgroundColor: "#00E5FF",
        borderWidth: 2,
        borderColor: "#FFFFFF",
        zIndex: 4,
    },
    bboxCenterPoint: {
        position: "absolute",
        width: 8,
        height: 8,
        borderRadius: 999,
        backgroundColor: "#FFD400",
        borderWidth: 1,
        borderColor: "#111111",
        zIndex: 4,
    },
    distanceLine: {
        position: "absolute",
        height: 2,
        backgroundColor: "#00E5FF",
        transformOrigin: "left center",
        zIndex: 3,
    },
    distanceBadge: {
        position: "absolute",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: "#00E5FF",
        zIndex: 4,
    },
    distanceBadgeText: {
        color: "#111111",
        fontSize: 11,
        fontWeight: "700",
    },
    nearestDetectionBox: {
        borderColor: "#00E5FF",
        borderWidth: 3,
    },
    nearestDetectionBadge: {
        backgroundColor: "#00E5FF",
    },
});
