// src/features/camera/useCameraCaptureTest3.ts

import { useAlert } from "@/shared/ui/component/alert";
import { useIsFocused } from "@react-navigation/native";
import { useCallback, useMemo, useRef, useState } from "react";
import { Image, LayoutChangeEvent } from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { runImageInference } from "../inference";
import { InferenceDetection } from "../inference/inference.type";

type Size = {
    width: number;
    height: number;
};

type Point = {
    x: number;
    y: number;
};

type OverlayBox = {
    key: string;
    left: number;
    top: number;
    width: number;
    height: number;
    caption: string;
    centerX: number;
    centerY: number;
    distanceToViewportCenter: number;
    lineLeft: number;
    lineTop: number;
    lineWidth: number;
    lineAngleDeg: number;
    distanceLabelLeft: number;
    distanceLabelTop: number;
    isNearest: boolean;
};

type NearestDetectionResult = {
    key: string;
    distanceToViewportCenter: number;
};

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

// [변경] bbox 표시 정보 + 중심점 거리/선 정보까지 훅에서 계산
function buildOverlayBoxes(
    detections: InferenceDetection[],
    imageSize: Size | null,
    viewportSize: Size,
): OverlayBox[] {
    if (!imageSize) return [];
    if (viewportSize.width <= 0 || viewportSize.height <= 0) return [];
    if (imageSize.width <= 0 || imageSize.height <= 0) return [];

    const viewportCenterX = viewportSize.width / 2;
    const viewportCenterY = viewportSize.height / 2;

    const scale = Math.max(
        viewportSize.width / imageSize.width,
        viewportSize.height / imageSize.height,
    );

    if (!Number.isFinite(scale) || scale <= 0) return [];

    const renderedWidth = imageSize.width * scale;
    const renderedHeight = imageSize.height * scale;
    const offsetX = (viewportSize.width - renderedWidth) / 2;
    const offsetY = (viewportSize.height - renderedHeight) / 2;

    const boxes = detections
        // [변경] map 반환 타입을 명시해서 isNearest: false 리터럴 타입 문제 방지
        .map<OverlayBox | null>((detection, index) => {
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

            const centerX = left + boxWidth / 2;
            const centerY = top + boxHeight / 2;
            const dx = centerX - viewportCenterX;
            const dy = centerY - viewportCenterY;
            const distanceToViewportCenter = Math.sqrt(dx * dx + dy * dy);

            const lineWidth = distanceToViewportCenter;
            const lineAngleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
            const score = Number.isFinite(detection.best.score)
                ? detection.best.score
                : 0;

            const box: OverlayBox = {
                key: `${index}-${detection.best.class_id}`,
                left,
                top,
                width: boxWidth,
                height: boxHeight,
                caption: `${detection.best.label} ${score.toFixed(2)}`,
                centerX,
                centerY,
                distanceToViewportCenter,
                lineLeft: viewportCenterX,
                lineTop: viewportCenterY,
                lineWidth,
                lineAngleDeg,
                distanceLabelLeft: viewportCenterX + dx / 2 - 24,
                distanceLabelTop: viewportCenterY + dy / 2 - 12,
                isNearest: false,
            };

            return box;
        })
        .filter((item): item is OverlayBox => item !== null);

    let nearestKey: string | null = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const box of boxes) {
        if (box.distanceToViewportCenter < nearestDistance) {
            nearestDistance = box.distanceToViewportCenter;
            nearestKey = box.key;
        }
    }

    return boxes.map((box) => ({
        ...box,
        // [변경] 가장 가까운 bbox 1개 강조 표시용 플래그
        isNearest: box.key === nearestKey,
    }));
}

// [변경] 2건 이상일 때 Alert에 사용할 최근접 bbox 계산
function findNearestDetectionInfo(
    overlayBoxes: OverlayBox[],
): NearestDetectionResult | null {
    if (overlayBoxes.length === 0) return null;

    let nearest = overlayBoxes[0];

    for (const box of overlayBoxes) {
        if (box.distanceToViewportCenter < nearest.distanceToViewportCenter) {
            nearest = box;
        }
    }

    return {
        key: nearest.key,
        distanceToViewportCenter: nearest.distanceToViewportCenter,
    };
}

export function useCameraCaptureTest3() {
    const { alert } = useAlert();

    const isFocused = useIsFocused();
    const device = useCameraDevice("back");
    const cameraRef = useRef<Camera>(null);

    const [isCapturing, setIsCapturing] = useState(false);
    const [isInferencing, setIsInferencing] = useState(false);
    const [previewUri, setPreviewUri] = useState<string | null>(null);
    const [detections, setDetections] = useState<InferenceDetection[]>([]);
    const [previewImageSize, setPreviewImageSize] = useState<Size | null>(null);
    const [previewViewportSize, setPreviewViewportSize] = useState<Size>({
        width: 0,
        height: 0,
    });

    const isCameraActive = useMemo(
        () => isFocused && !!device && !previewUri,
        [isFocused, device, previewUri],
    );

    const viewportCenter = useMemo<Point>(
        () => ({
            x: previewViewportSize.width / 2,
            y: previewViewportSize.height / 2,
        }),
        [previewViewportSize],
    );

    const overlayBoxes = useMemo(
        () => buildOverlayBoxes(detections, previewImageSize, previewViewportSize),
        [detections, previewImageSize, previewViewportSize],
    );

    const toFileUri = useCallback((path: string) => {
        return path.startsWith("file://") ? path : `file://${path}`;
    }, []);

    const onPreviewLayout = useCallback((event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setPreviewViewportSize({ width, height });
    }, []);

    const loadImageSize = useCallback((uri: string): Promise<Size> => {
        return new Promise((resolve, reject) => {
            Image.getSize(
                uri,
                (width, height) => resolve({ width, height }),
                (error) => reject(error),
            );
        });
    }, []);

    const showNearestDetectionAlert = useCallback(
        (nextOverlayBoxes: OverlayBox[], nextDetections: InferenceDetection[]) => {
            // [변경] 2건 이상일 때만 가장 가까운 bbox 정보 Alert 표시
            if (nextDetections.length < 2) return;

            const nearest = findNearestDetectionInfo(nextOverlayBoxes);
            if (!nearest) return;

            const nearestBox = nextOverlayBoxes.find((box) => box.key === nearest.key);
            const nearestIndex = nextOverlayBoxes.findIndex(
                (box) => box.key === nearest.key,
            );
            const nearestDetection =
                nearestIndex >= 0 ? nextDetections[nearestIndex] : null;

            if (!nearestBox || !nearestDetection) return;

            alert(
                [
                    "가장 가까운 물체 정보",
                    `라벨: ${nearestDetection.best.label}`,
                    `score: ${nearestDetection.best.score.toFixed(2)}`,
                    `거리: ${Math.round(nearestBox.distanceToViewportCenter)} px`,
                    `bbox 중심: (${Math.round(nearestBox.centerX)}, ${Math.round(
                        nearestBox.centerY,
                    )})`,
                    `카메라 중심: (${Math.round(viewportCenter.x)}, ${Math.round(
                        viewportCenter.y,
                    )})`,
                ].join("\n"),
            );
        },
        [alert, viewportCenter],
    );

    const inferenceYOLO = useCallback(
        async (imageUri: string) => {
            try {
                setIsInferencing(true);

                const imageSize = await loadImageSize(imageUri);
                setPreviewImageSize(imageSize);

                const inferenceResult = await runImageInference(imageUri);
                setDetections(inferenceResult.detections);

                // [변경] 추론 직후 현재 viewport 기준으로 overlay/거리 정보 계산
                const nextOverlayBoxes = buildOverlayBoxes(
                    inferenceResult.detections,
                    imageSize,
                    previewViewportSize,
                );

                showNearestDetectionAlert(
                    nextOverlayBoxes,
                    inferenceResult.detections,
                );
            } catch (error) {
                setDetections([]);
                setPreviewImageSize(null);

                const message =
                    error instanceof Error
                        ? error.message
                        : "YOLO 추론 중 오류가 발생했습니다.";
                alert(message);
            } finally {
                setIsInferencing(false);
            }
        },
        [alert, loadImageSize, previewViewportSize, showNearestDetectionAlert],
    );

    const onShutterPress = useCallback(async () => {
        if (isCapturing || isInferencing || previewUri) return;

        if (!cameraRef.current) {
            alert("카메라가 아직 준비되지 않았습니다.");
            return;
        }

        try {
            setIsCapturing(true);

            const photo = await cameraRef.current.takePhoto({
                flash: "off",
            });

            const fileUri = toFileUri(photo.path);

            // [변경] 새 촬영 시 이전 결과 초기화
            setPreviewUri(fileUri);
            setDetections([]);
            setPreviewImageSize(null);

            // [변경] 촬영 직후 YOLO 추론 실행
            await inferenceYOLO(fileUri);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "촬영 중 오류가 발생했습니다.";
            alert(message);
        } finally {
            setIsCapturing(false);
        }
    }, [alert, inferenceYOLO, isCapturing, isInferencing, previewUri, toFileUri]);

    const onRetakePress = useCallback(() => {
        // [변경] 재촬영 시 상태 초기화
        setPreviewUri(null);
        setDetections([]);
        setPreviewImageSize(null);
        setIsInferencing(false);
    }, []);

    return {
        device,
        isFocused,
        cameraRef,
        isCapturing,
        isInferencing,
        previewUri,
        isCameraActive,
        detections,
        overlayBoxes,
        viewportCenter,
        onPreviewLayout,
        onRetakePress,
        onShutterPress,
    };
}
