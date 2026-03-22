// src/features/camera/useCameraCaptureTest.ts

import { useAlert } from "@/shared/ui/component/alert";
import { useIsFocused } from "@react-navigation/native";
import { useCallback, useMemo, useRef, useState } from "react";
import { Camera, useCameraDevice } from "react-native-vision-camera";

export function useCameraCaptureTest() {
    const { alert } = useAlert();

    const isFocused = useIsFocused();
    const device = useCameraDevice("back");

    const cameraRef = useRef<Camera>(null);

    // [변경] 테스트 화면에서도 중복 촬영 방지 상태 유지
    const [isCapturing, setIsCapturing] = useState(false);

    // [변경] 촬영 결과 미리보기용 URI만 관리
    const [previewUri, setPreviewUri] = useState<string | null>(null);

    // [변경] 촬영 전 카메라 활성화, 촬영 후에는 미리보기 고정
    const isCameraActive = useMemo(
        () => isFocused && !!device && !previewUri,
        [isFocused, device, previewUri],
    );

    // [변경] Vision Camera 결과 path를 file URI로 정규화
    const toFileUri = useCallback((path: string) => {
        return path.startsWith("file://") ? path : `file://${path}`;
    }, []);

    // [변경] 테스트 화면은 순수 촬영만 수행
    const onShutterPress = useCallback(async () => {
        if (isCapturing || previewUri) return;

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
            setPreviewUri(fileUri);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "촬영 중 오류가 발생했습니다.";
            alert(message);
        } finally {
            setIsCapturing(false);
        }
    }, [alert, isCapturing, previewUri, toFileUri]);

    // [변경] 테스트 화면은 단순히 미리보기만 초기화해서 재촬영
    const onRetakePress = useCallback(() => {
        setPreviewUri(null);
    }, []);

    return {
        device,
        isFocused,
        cameraRef,
        isCapturing,
        previewUri,
        isCameraActive,
        onRetakePress,
        onShutterPress,
    };
}
