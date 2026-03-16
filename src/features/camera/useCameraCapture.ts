import { ROUTES, StackParamList } from '@/app/app.route';
import { useAlert } from '@/shared/ui/component/alert';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Image } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { runImageInference } from '../inference';
import { InferenceDetection } from '../inference/inference.type';

type PreviewSize = {
    width: number;
    height: number;
};
type InferenceTiming = {
    totalMs: number | null;
    modelMs: number | null;
};

export function useCameraCapture() {
    const navigation =
        useNavigation<NativeStackNavigationProp<StackParamList>>();

    const { alert, confirm } = useAlert();

    const isFocused = useIsFocused();
    const device = useCameraDevice('back');

    const cameraRef = useRef<Camera>(null);

    // 촬영 중복 방지
    const [isCapturing, setIsCapturing] = useState(false);

    // 촬영 후 정지 화면 표시용
    const [previewUri, setPreviewUri] = useState<string | null>(null);

    // [추가] 추론 결과 및 원본 이미지 크기 상태
    const [detections, setDetections] = useState<InferenceDetection[]>([]);
    const [previewImageSize, setPreviewImageSize] =
        useState<PreviewSize | null>(null);
    const [inferenceTiming, setInferenceTiming] = useState<InferenceTiming>({
        totalMs: null,
        modelMs: null,
    });

    // 카메라 활성 조건 (촬영 후 false)
    const isCameraActive = useMemo(
        () => isFocused && !!device && !previewUri,
        [isFocused, device, previewUri],
    );

    // path -> file:// 정규화
    const toFileUri = useCallback((path: string) => {
        return path.startsWith('file://') ? path : `file://${path}`;
    }, []);

    // 셔터
    const onShutterPress = useCallback(async () => {
        if (isCapturing || previewUri) return;

        if (!cameraRef.current) {
            alert('카메라가 아직 준비되지 않았습니다.');
            return;
        }

        try {
            setIsCapturing(true);

            const photo = await cameraRef.current.takePhoto({
                flash: 'off',
            });

            const fileUri = toFileUri(photo.path);
            // 프리뷰
            setPreviewUri(fileUri);

            // [추가] 직전 결과 초기화
            setDetections([]);
            setPreviewImageSize(null);
            setInferenceTiming({ totalMs: null, modelMs: null });

            // 욜로 추론
            inferenceYOLO(fileUri);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : '촬영 중 오류가 발생했습니다.';
            alert(message);
        } finally {
            setIsCapturing(false);
        }
    }, [isCapturing, previewUri, toFileUri]);

    // 재촬영
    const onRetakePress = useCallback(() => {
        setPreviewUri(null);

        // [추가] 재촬영 시 오버레이 데이터 초기화
        setDetections([]);
        setPreviewImageSize(null);
        setInferenceTiming({ totalMs: null, modelMs: null });
    }, []);

    // AI 도우미
    const onAiAssistantPress = () => {
        confirm({
            variant: 'decision',
            message: '이미지 인식 없이 바로 AI 채팅으로 갈까요?',
            cancelText: '취소',
            confirmText: '확인',
            onConfirm: () => {
                navigation.push(ROUTES.AI_CHAT);
            },
        });
    };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    function loadImageSize(uri: string): Promise<PreviewSize> {
        return new Promise((resolve, reject) => {
            Image.getSize(
                uri,
                (width, height) => resolve({ width, height }),
                (error: Error) => reject(error),
            );
        });
    }

    // [수정] 추론 결과를 상태에 저장
    const inferenceYOLO = useCallback(
        async (imageUri: string) => {
            try {
                const loadedImageSize = await loadImageSize(imageUri);
                setPreviewImageSize(loadedImageSize);

                const inferenceResult = await runImageInference(imageUri);
                setDetections(inferenceResult.detections);
                setInferenceTiming({
                    totalMs: inferenceResult.totalMs,
                    modelMs: inferenceResult.modelMs,
                });

                console.log('### loadedImageSize: ', loadedImageSize);
                console.log('#### inferenceResult: ', inferenceResult);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'AI 추론 처리 중 오류가 발생했습니다.';
                alert(message);
            }
        },
        [alert, loadImageSize],
    );

    return {
        device,
        isFocused,
        cameraRef,
        isCapturing,
        previewUri,
        isCameraActive,
        onRetakePress,
        onShutterPress,
        onAiAssistantPress,

        // [추가] 화면 오버레이 렌더링용 데이터
        detections,
        previewImageSize,
        inferenceTiming,
    };
}
