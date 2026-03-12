import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Camera } from "react-native-vision-camera";
import { PageLayout } from "@/shared/ui/component/layout";
import { AppLottie } from "@/shared/ui/component/lottie";
import { styles } from "./camera.style";
import { useCameraCapture } from "./useCameraCapture";
import CameraCaptureResultSheet from "./CameraCaptureResultSheet";

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

        isResultSheetVisible,
        onConfirmResultPress,
    } = useCameraCapture();

    return (
        <PageLayout
            back
            useStatusBarOffset={false}
            useHeaderOffset={false}
            headerStyle={styles.header}
        >
            <View style={styles.container}>
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

                {/* 촬영 후 바텀시트 오픈 */}
                <CameraCaptureResultSheet
                    visible={isResultSheetVisible}
                    onRetakePress={onRetakePress}
                    onConfirmPress={onConfirmResultPress}
                />
            </View>
        </PageLayout>
    );
}