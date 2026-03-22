// src/features/camera/useCameraCaptureTest2.ts

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

type OverlayBox = {
    key: string;
    left: number;
    top: number;
    width: number;
    height: number;
    caption: string;
};

type NearestDetectionResult = {
    detection: InferenceDetection;
    distanceSq: number;
};

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

// [변경] bbox 좌표 계산 로직을 훅 내부 유틸로 유지
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
            } satisfies OverlayBox;
        })
        .filter((item): item is OverlayBox => item !== null);
}

// [변경] 원본 이미지 중심점 기준으로 가장 가까운 detection 1개 선택
function findNearestDetectionFromImageCenter(
    detections: InferenceDetection[],
    imageSize: Size,
): NearestDetectionResult | null {
    if (detections.length === 0) return null;
    if (imageSize.width <= 0 || imageSize.height <= 0) return null;

    const imageCenterX = imageSize.width / 2;
    const imageCenterY = imageSize.height / 2;

    let nearest: NearestDetectionResult | null = null;

    for (const detection of detections) {
        const [bboxCenterX, bboxCenterY] = detection.bbox_raw;
        const dx = bboxCenterX - imageCenterX;
        const dy = bboxCenterY - imageCenterY;
        const distanceSq = dx * dx + dy * dy;

        if (nearest === null || distanceSq < nearest.distanceSq) {
            nearest = {
                detection,
                distanceSq,
            };
        }
    }

    return nearest;
}

export function useCameraCaptureTest2() {
    const { alert } = useAlert();

    const isFocused = useIsFocused();
    const device = useCameraDevice("back");
    const cameraRef = useRef<Camera>(null);

    // [변경] 촬영 상태
    const [isCapturing, setIsCapturing] = useState(false);

    // [변경] YOLO 추론 상태
    const [isInferencing, setIsInferencing] = useState(false);

    // [변경] 촬영 이미지 URI
    const [previewUri, setPreviewUri] = useState<string | null>(null);

    // [변경] YOLO 결과와 이미지/뷰포트 크기를 훅에서 관리
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

    const overlayBoxes = useMemo(
        () => buildOverlayBoxes(detections, previewImageSize, previewViewportSize),
        [detections, previewImageSize, previewViewportSize],
    );

    const toFileUri = useCallback((path: string) => {
        return path.startsWith("file://") ? path : `file://${path}`;
    }, []);

    // [변경] 화면 layout 정보도 훅에서 받아 bbox 계산에 사용
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

    // [변경] 2건 이상 탐지되면 이미지 중심 기준 가장 가까운 객체 정보 Alert 표시
    const showNearestDetectionAlert = useCallback(
        (nextDetections: InferenceDetection[], imageSize: Size) => {
            if (nextDetections.length < 2) return;

            const nearest = findNearestDetectionFromImageCenter(
                nextDetections,
                imageSize,
            );

            if (!nearest) return;

            const { detection } = nearest;
            const [cx, cy, w, h] = detection.bbox_raw;

            alert(
                [
                    "가장 가까운 물체를 선택했습니다.",
                    `라벨: ${detection.best.label}`,
                    `score: ${detection.best.score.toFixed(2)}`,
                    `classId: ${detection.best.class_id}`,
                    `bbox_raw: [${cx}, ${cy}, ${w}, ${h}]`,
                ].join("\n"),
            );
        },
        [alert],
    );

    // [변경] YOLO 추론과 후처리 로직을 훅에서 처리
    const inferenceYOLO = useCallback(
        async (imageUri: string) => {
            try {
                setIsInferencing(true);

                const imageSize = await loadImageSize(imageUri);
                setPreviewImageSize(imageSize);

                const inferenceResult = await runImageInference(imageUri);
                setDetections(inferenceResult.detections);

                // [변경] 2건 이상일 때만 중심 기준 가장 가까운 객체 정보 노출
                showNearestDetectionAlert(inferenceResult.detections, imageSize);
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
        [alert, loadImageSize, showNearestDetectionAlert],
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
        // [변경] 재촬영 시 이미지/추론/bbox 관련 상태 초기화
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
        onPreviewLayout,
        onRetakePress,
        onShutterPress,
    };
}
