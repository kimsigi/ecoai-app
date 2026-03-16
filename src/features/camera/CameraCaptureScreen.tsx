import React, { useEffect, useMemo, useState } from "react";
import { Image, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";
import { Camera } from "react-native-vision-camera";
import { PageLayout } from "@/shared/ui/component/layout";
import { AppLottie } from "@/shared/ui/component/lottie";
import { styles } from "./camera.style";
import { useCameraCapture } from "./useCameraCapture";
import { InferenceDetection } from "../inference/inference.type";
import { BottomSheet, BottomSheetScrollContent } from "@/shared/ui/component/bottomsheet";
import { COLOR, FONT_FACE, FONT_SIZE, RADIUS, SPACING } from "@/shared/ui/token";
import { SCREEN_HEIGHT } from "@/shared/ui/component/bottomsheet/useBottomSheet";

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
        //isFocused,
        cameraRef,
        isCapturing,
        previewUri,
        isCameraActive,
        onRetakePress,
        onShutterPress,
        onAiAssistantPress,
        onAiAssistantPress2,
        // [추가]
        detections,
        previewImageSize,


        inferenceTiming, // [변경] 바텀시트에 추론 상태/시간 표시용

        isResultSheetOpen, 
        setIsResultSheetOpen,
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

    // [변경] 촬영본이 생기면 바텀시트를 열고, 재촬영 상태로 돌아가면 닫기
    useEffect(() => {
        if (previewUri) {
            setIsResultSheetOpen(true);
            onAiAssistantPress2();
            return;
        }

        setIsResultSheetOpen(false);
        setSelectedDetectionJson("");
    }, [previewUri]);

    // [변경] 바텀시트 내부 재촬영 액션
    const onRetakeFromSheetPress = () => {
        setIsResultSheetOpen(false);
        onRetakePress();
    };

    const isInferenceLoading =
        !!previewUri && inferenceTiming.totalMs === null;


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

            {/* [변경] 공통 BottomSheet 사용: 촬영 직후 자동 오픈 + 내용 길이에 따라 동적 높이 */}
            <BottomSheet
                open={isResultSheetOpen}
                onClose={onRetakeFromSheetPress}
                title="촬영 결과"
                //showCloseButton
                fixedHeight={SCREEN_HEIGHT * 0.85}
                showHandle={false}
                enableGesture={false}
                enableBackdropDismiss={false}
                heightMode="fixed"
            >
                <BottomSheetScrollContent
                    contentContainerStyle={resultSheetStyles.scrollContent}
                >
                    <View style={resultSheetStyles.summaryCard}>
                        <Text style={resultSheetStyles.summaryTitle}>
                            촬영이 완료되었습니다.
                        </Text>
                        <Text style={resultSheetStyles.summaryBody}>
                            {isInferenceLoading
                                ? "AI 추론 결과를 불러오는 중입니다."
                                : `탐지된 항목 수: ${detections.length}건`}
                        </Text>
                        {inferenceTiming.totalMs !== null ? (
                            <Text style={resultSheetStyles.summaryMeta}>
                                전체 처리 시간: {inferenceTiming.totalMs}ms
                            </Text>
                        ) : null}
                        {inferenceTiming.modelMs !== null ? (
                            <Text style={resultSheetStyles.summaryMeta}>
                                모델 추론 시간: {inferenceTiming.modelMs}ms
                            </Text>
                        ) : null}
                    </View>

                    {!isInferenceLoading && detections.length > 0 ? (
                        <View style={resultSheetStyles.section}>
                            <Text style={resultSheetStyles.sectionTitle}>
                                탐지 결과
                            </Text>

                            {detections.map((detection, index) => (
                                <View
                                    key={`${index}-${detection.best.class_id}`}
                                    style={resultSheetStyles.resultCard}
                                >
                                    <Text style={resultSheetStyles.resultLabel}>
                                        {detection.best.label}
                                    </Text>
                                    <Text style={resultSheetStyles.resultValue}>
                                        score {detection.best.score.toFixed(2)}
                                    </Text>
                                    <Text style={resultSheetStyles.resultMeta}>
                                        bbox_raw: [{detection.bbox_raw.join(", ")}]
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : null}

                    {!isInferenceLoading && detections.length === 0 ? (
                        <View style={resultSheetStyles.section}>
                            <Text style={resultSheetStyles.sectionTitle}>
                                탐지 결과
                            </Text>
                            <View style={resultSheetStyles.resultCard}>
                                <Text style={resultSheetStyles.resultValue}>
                                    탐지된 항목이 없습니다.
                                </Text>
                            </View>
                        </View>
                    ) : null}

                    {selectedDetectionJson ? (
                        <View style={resultSheetStyles.section}>
                            <Text style={resultSheetStyles.sectionTitle}>
                                선택한 탐지 영역
                            </Text>
                            <View style={resultSheetStyles.codeCard}>
                                <Text style={resultSheetStyles.codeText}>
                                    {selectedDetectionJson}
                                </Text>
                            </View>
                        </View>
                    ) : null}
{/*
                    <View style={resultSheetStyles.actionRow}>
                        <Pressable
                            style={resultSheetStyles.secondaryButton}
                            onPress={onRetakeFromSheetPress}
                        >
                            <Text style={resultSheetStyles.secondaryButtonText}>
                                재촬영
                            </Text>
                        </Pressable>

                        <Pressable
                            style={resultSheetStyles.primaryButton}
                            onPress={() => {
                                onAiAssistantPress2();
                                //setIsResultSheetOpen(false);
                            }}
                        >
                            <Text style={resultSheetStyles.primaryButtonText}>
                                AI 도우미
                            </Text>
                        </Pressable>
                    </View>
*/}
                </BottomSheetScrollContent>
            </BottomSheet>
        </PageLayout>

        
    );
}


// [변경] CameraCaptureScreen 전용 바텀시트 콘텐츠 스타일
const resultSheetStyles = StyleSheet.create({
    scrollContent: {
        paddingTop: 16,
        paddingBottom: 28,
        gap: 16,
    },
    summaryCard: {
        borderRadius: RADIUS.xl,
        backgroundColor: COLOR.gray50,
        padding: SPACING.lg,
        gap: 6,
    },
    summaryTitle: {
        fontFamily: FONT_FACE.pretendard.bold,
        fontSize: FONT_SIZE.lg,
        color: COLOR.gray950,
    },
    summaryBody: {
        fontFamily: FONT_FACE.pretendard.regular,
        fontSize: FONT_SIZE.sm,
        color: COLOR.gray700,
    },
    summaryMeta: {
        fontFamily: FONT_FACE.pretendard.regular,
        fontSize: FONT_SIZE.xs,
        color: COLOR.gray500,
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontFamily: FONT_FACE.pretendard.bold,
        fontSize: FONT_SIZE.xl,
        color: COLOR.gray950,
    },
    resultCard: {
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: COLOR.gray100,
        backgroundColor: COLOR.white,
        padding: SPACING.md,
        gap: 4,
    },
    resultLabel: {
        fontFamily: FONT_FACE.pretendard.bold,
        fontSize: FONT_SIZE.sm,
        color: COLOR.gray950,
    },
    resultValue: {
        fontFamily: FONT_FACE.pretendard.semibold,
        fontSize: FONT_SIZE.sm,
        color: COLOR.gray700,
    },
    resultMeta: {
        fontFamily: FONT_FACE.pretendard.regular,
        fontSize: FONT_SIZE.xs,
        color: COLOR.gray500,
    },
    codeCard: {
        borderRadius: RADIUS.lg,
        backgroundColor: COLOR.gray950,
        padding: SPACING.md,
    },
    codeText: {
        fontFamily: FONT_FACE.pretendard.regular,
        fontSize: FONT_SIZE.xs,
        color: COLOR.white,
    },
    actionRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 4,
    },
    secondaryButton: {
        flex: 1,
        height: 52,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: COLOR.gray200,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLOR.white,
    },
    secondaryButtonText: {
        fontFamily: FONT_FACE.pretendard.bold,
        fontSize: FONT_SIZE.sm,
        color: COLOR.gray800,
    },
    primaryButton: {
        flex: 1,
        height: 52,
        borderRadius: RADIUS.lg,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLOR.blue500,
    },
    primaryButtonText: {
        fontFamily: FONT_FACE.pretendard.bold,
        fontSize: FONT_SIZE.sm,
        color: COLOR.white,
    },
});