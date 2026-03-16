import React, { useMemo, useState } from "react";
import { Image, LayoutChangeEvent, Pressable, Text, View } from "react-native";
import { Camera } from "react-native-vision-camera";
import { PageLayout } from "@/shared/ui/component/layout";
import { AppLottie } from "@/shared/ui/component/lottie";
import { styles } from "./camera.style";
import { useCameraCapture } from "./useCameraCapture";
import { InferenceDetection } from "../inference/inference.type";
import { BottomSheet } from "@/shared/ui/component/bottomsheet";

type Size = {
    width: number;
    height: number;
};

type OverlayBox = {
    key: string;
    left: number;
    top: number;
    width: number;
    height: number;
    caption: string;
    detection: InferenceDetection; // [추가]
};

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

function buildOverlayBoxes(
    detections: InferenceDetection[],
    imageSize: Size | null,
    viewportSize: Size,
): OverlayBox[] {
    if (!imageSize) return [];
    if (viewportSize.width <= 0 || viewportSize.height <= 0) return [];
    if (imageSize.width <= 0 || imageSize.height <= 0) return [];

    const scale = Math.max(
        viewportSize.width / imageSize.width,
        viewportSize.height / imageSize.height,
    );

    if (!Number.isFinite(scale) || scale <= 0) return [];

    const renderedWidth = imageSize.width * scale;
    const renderedHeight = imageSize.height * scale;
    const offsetX = (viewportSize.width - renderedWidth) / 2;
    const offsetY = (viewportSize.height - renderedHeight) / 2;

    return detections
        .map((detection, index) => {
            const [cx, cy, w, h] = detection.bbox_raw;

            const srcLeft = cx - w / 2;
            const srcTop = cy - h / 2;

            const rawLeft = srcLeft * scale + offsetX;
            const rawTop = srcTop * scale + offsetY;
            const rawRight = (srcLeft + w) * scale + offsetX;
            const rawBottom = (srcTop + h) * scale + offsetY;

            const left = clamp(rawLeft, 0, viewportSize.width);
            const top = clamp(rawTop, 0, viewportSize.height);
            const right = clamp(rawRight, 0, viewportSize.width);
            const bottom = clamp(rawBottom, 0, viewportSize.height);

            const boxWidth = right - left;
            const boxHeight = bottom - top;

            if (boxWidth < 1 || boxHeight < 1) return null;

            const score = Number.isFinite(detection.best.score)
                ? detection.best.score
                : 0;

            return {
                key: `${index}-${detection.best.class_id}`,
                left,
                top,
                width: boxWidth,
                height: boxHeight,
                caption: `${detection.best.label} ${score.toFixed(2)}`,
                 detection, // [추가]
            } satisfies OverlayBox;
        })
        .filter((item): item is OverlayBox => item !== null);
}

export default function CameraCaptureScreen() {

    const {
        device,
        isFocused,
        cameraRef,
        isCapturing,
        previewUri,
        isCameraActive,
        onRetakePress,
        onShutterPress,
        onAiAssistantPress,

        // [추가]
        detections,
        previewImageSize,
    } = useCameraCapture();

    const [previewViewportSize, setPreviewViewportSize] = useState<Size>({
        width: 0,
        height: 0,
    });

    // [추가] 터치된 detection 표시용
    const [selectedDetectionJson, setSelectedDetectionJson] = useState<string>("");

    const overlayBoxes = useMemo(
        () => buildOverlayBoxes(detections, previewImageSize, previewViewportSize),
        [detections, previewImageSize, previewViewportSize],
    );

    const onPreviewLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setPreviewViewportSize({ width, height });
    };


    return (
        <PageLayout
            back
            useStatusBarOffset={false}
            useHeaderOffset={false}
            headerStyle={styles.header}
        >
            <View style={styles.container} onLayout={onPreviewLayout}>
                {
                    device ? (
                        <Camera
                            ref={cameraRef}
                            style={styles.cameraContainer}
                            device={device}
                            isActive={isCameraActive}
                            photo
                            androidPreviewViewType="texture-view"
                            enableZoomGesture
                            //format={format} // 카메라 해상도 / 픽셀 포맷 설정(1920X1080, 1280X720, 640X480 ...)
                        />
                    ) : null
                }

                {/* 촬영본 고정 표시 */}
                {
                    previewUri ? (
                        <Image
                            source={{ uri: previewUri }}
                            style={styles.cameraContainer}
                            resizeMode="cover"
                        />
                    ) : null
                }

                {/* [추가] 추론 박스 오버레이 */}
                {
                    previewUri ? (
                        // [수정] 터치 통과 + 박스 자체는 클릭 가능
                        <View pointerEvents="box-none" style={styles.detectionOverlay}>
                        {/*<View pointerEvents="none" style={styles.detectionOverlay}> */}
                            {
                                overlayBoxes.map(box => (
                                    // [수정] View -> Pressable
                                    <Pressable
                                        key={box.key}
                                        accessibilityLabel={`탐지영역 ${box.caption}`}
                                        onPress={() => {
                                            const payload = {
                                                bbox_raw: box.detection.bbox_raw,
                                                best: box.detection.best,
                                            };
                                            const json = JSON.stringify(payload, null, 2);
                                            setSelectedDetectionJson(json);
                                            console.log("[Detection Pressed]", payload);
                                        }}
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
                                    </Pressable>
                                ))
                            }
                        </View>
                    ) : null
                }
                
                {/* [추가] 선택 detection 데이터 출력 */}
                {
                    previewUri && selectedDetectionJson ? (
                        <View style={styles.detectionDebugPanel} pointerEvents="none">
                            <Text style={styles.detectionDebugTitle}>Selected Detection</Text>
                            <Text style={styles.detectionDebugText}>{selectedDetectionJson}</Text>
                        </View>
                    ) : null
                }
                
                {/* 헤더~하단컨테이너 전체 오버레이 레이어 */}
                <View pointerEvents="box-none" style={styles.overlayContainer}>
                    {/* 카메라 가이드라인 영역 */}
                    <View pointerEvents="none" style={styles.guideFrameArea}>
                        <View style={[styles.guideCorner, styles.guideCornerTopLeft]} />
                        <View style={[styles.guideCorner, styles.guideCornerTopRight]} />
                        <View style={[styles.guideCorner, styles.guideCornerBottomLeft]} />
                        <View style={[styles.guideCorner, styles.guideCornerBottomRight]} />
                    </View>
                
                    {/* 바텀 컨테이너 */}
                    <View style={styles.bottomContainer}>
                        {/* 하단 컨트롤 위 안내 문구 */}
                        <View style={styles.guideMessageContainer}>
                            <Text style={styles.guideMessageText}>
                                배출 물품을 가능한 화면 중심에 위치시키면{"\n"}
                                더 정확한 이미지 인식이 가능합니다.
                            </Text>
                        </View>
                        
                        {/* 바텀 그룹 */}
                        <View style={styles.bottomGroup}>
                            {/* 카메라 촬영 버튼 */}
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
                            {/* AI 도우미 버튼 영역 */}
                            <Pressable
                                accessibilityLabel="AI 도우미"
                                onPress={onAiAssistantPress}
                                style={styles.aiAssistantButton}
                            >
                                    <View style={styles.aiCircle}>
                                        <AppLottie name="winkingFace" size={59} />
                                    </View>
                                    <View style={styles.aiBadge}>
                                        <Text style={styles.aiBadgeText}>AI 도우미</Text>
                                    </View>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </PageLayout>

        
    );
}