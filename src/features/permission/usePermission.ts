import { useCallback, useEffect, useRef, useState } from 'react';
import { PermissionItem, UsePermissionProps } from './permission.type';
import { checkAllPermissions, mapPermissionResult } from './permission.service';
import { PERMISSION_STATE } from './permission.constant';
import { AppState, AppStateStatus, Linking } from 'react-native';
import { PERMISSION_ITEMS } from './permission.config';
import { useAlert } from '@/shared/ui/component/alert';
import { request } from 'react-native-permissions';

export function usePermission({ onGranted }: UsePermissionProps) {
    const { alert, confirm } = useAlert();
    const [permissions, setPermissions] =
        useState<PermissionItem[]>(PERMISSION_ITEMS);
    const [isChecking, setIsChecking] = useState(true);
    const [isAllGranted, setIsAllGranted] = useState(false);
    const appStateRef = useRef(AppState.currentState);
    const checkingRef = useRef(false);
    const grantedCalledRef = useRef(false);

    useEffect(() => {
        const checkAllGranted = permissions.every(
            p => p.status === PERMISSION_STATE.GRANTED,
        );
        setIsAllGranted(checkAllGranted);

        if (checkAllGranted) {
            // 중복 호출 방지
            if (!grantedCalledRef.current) {
                grantedCalledRef.current = true;
                onGranted?.();
            }
            return;
        }
        // 다시 미승인 상태가 되면 다음 호출 허용
        grantedCalledRef.current = false;
    }, [permissions, onGranted]);

    /**
     * 권한 재확인 (유일한 진입점)
     */
    const refreshPermissions = useCallback(async () => {
        if (checkingRef.current) return;

        try {
            checkingRef.current = true;
            setIsChecking(true);

            const updatedPermissions = await checkAllPermissions();
            setPermissions(updatedPermissions);
        } finally {
            setIsChecking(false);
            checkingRef.current = false;
        }
    }, []);

    /**
     * 최초 권한 체크
     */
    useEffect(() => {
        refreshPermissions();
    }, [refreshPermissions]);

    /**
     * 앱 상태 변경 감지 (설정에서 돌아왔을 때 재확인)
     */
    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (nextAppState: AppStateStatus) => {
                if (appStateRef.current.match(/inactive|background/)) {
                    if (nextAppState === 'active') {
                        refreshPermissions().catch(console.error);
                    }
                }
                appStateRef.current = nextAppState;
            },
        );

        return () => {
            subscription.remove();
        };
    }, [refreshPermissions]);

    /**
     * 정의된 OS권한 전체를 요청
     */
    const requestAllPermission = async () => {
        for (const permission of permissions) {
            if (permission.status !== PERMISSION_STATE.GRANTED) {
                await requestPermission(permission);
                // 각 권한 요청 사이에 약간의 딜레이
                await new Promise((resolve: any) => setTimeout(resolve, 300));
            }
        }
        // 권한 재확인
        await refreshPermissions();
    };

    const requestPermission = async (item: PermissionItem) => {
        // 이미 승인된 권한은 건너뛰기
        if (item.status === PERMISSION_STATE.GRANTED) return;

        try {
            const result = await request(item.permission);
            const newStatus = mapPermissionResult(result);

            // BLOCKED 상태의 경우 설정으로 이동 안내
            if (newStatus === PERMISSION_STATE.BLOCKED) {
                confirm({
                    title: '권한 설정 필요',
                    message: `${item.title} 권한이 차단되어 있습니다. 설정에서 권한을 활성화해주세요.`,
                    confirmText: '설정으로 이동',
                    cancelText: '취소',
                    onConfirm: () => {
                        Linking.openSettings();
                    },
                });
            }

            // 권한 상태 업데이트
            setPermissions(prev =>
                prev.map(p =>
                    p.type === item.type ? { ...p, status: newStatus } : p,
                ),
            );
        } catch (error: unknown) {
            console.error('Permission request error:', error);
            alert({ message: '권한 요청 중 오류가 발생했습니다.' });
            return;
        }
    };

    /**
     * OS권한 상태에 따른 컬러 설정
     */
    const getStatusColor = (status: string) => {
        switch (status) {
            case PERMISSION_STATE.GRANTED:
                return '#4CAF50';
            case PERMISSION_STATE.DENIED:
            case PERMISSION_STATE.BLOCKED:
                return '#F44336';
            default:
                return '#9E9E9E';
        }
    };

    /**
     * OS권한 상태에 따른 텍스트 설정
     */
    const getStatusText = (status: string) => {
        switch (status) {
            case PERMISSION_STATE.GRANTED:
                return '승인됨';
            case PERMISSION_STATE.DENIED:
                return '거부됨';
            case PERMISSION_STATE.BLOCKED:
                return '차단됨';
            default:
                return '대기중';
        }
    };

    return {
        permissions,
        isChecking,
        isAllGranted,
        getStatusColor,
        getStatusText,
        requestAllPermission,
        requestPermission,
    };
}
