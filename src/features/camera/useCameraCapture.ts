import { ROUTES, StackParamList } from '@/app/app.route';
import { useAlert } from '@/shared/ui/component/alert';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

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

    // 바텀시트 표시 상태
    const [isResultSheetVisible, setIsResultSheetVisible] = useState(false);

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

            setPreviewUri(toFileUri(photo.path));
            setIsResultSheetVisible(true);
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
        setIsResultSheetVisible(false);
        setPreviewUri(null);
    }, []);

    // [추가] 바텀시트 확인 버튼 동작
    const onConfirmResultPress = useCallback(() => {
        setIsResultSheetVisible(false);
        navigation.push(ROUTES.AI_CHAT);
    }, [navigation]);

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

        isResultSheetVisible,
        onConfirmResultPress,
    };
}
