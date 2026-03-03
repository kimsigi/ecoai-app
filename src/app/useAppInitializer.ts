import { useCallback, useEffect, useRef, useState } from 'react';
import BootSplash from 'react-native-bootsplash';
import { InitState } from './app.type';
import { INIT_STATE } from './app.constant';
import { checkNetwork } from './app.service';
import { getLocation } from '@/features/location';
import { getUserType } from '@/features/usertype';
import { hasRequiredPermissions } from '@/features/permission';
import { initDeviceId } from '@/shared/core/device';
import { ensureInitToken, registerAuthProvider } from '@/features/auth';
import { ensureApiInterceptorsRegistered } from '@/shared/core/api';

export function useAppInitializer() {
    const [state, setState] = useState<InitState>(INIT_STATE.CHECKING);

    // single-flight 보장
    const initInFlightRef = useRef<Promise<InitState> | null>(null);

    /** initApp을 single-flight로 실행 */
    const runInitSingleFlight = useCallback(async (): Promise<InitState> => {
        if (!initInFlightRef.current) {
            initInFlightRef.current = (async () => {
                try {
                    return await initApp();
                } finally {
                    initInFlightRef.current = null;
                }
            })();
        }
        return initInFlightRef.current;
    }, []);

    /** -------------------------------
     * 초기화 엔트리 포인트
     * ------------------------------- */
    const entryPoint = useCallback(async () => {
        setState(INIT_STATE.CHECKING);
        const result = await runInitSingleFlight();
        setState(result);
    }, [runInitSingleFlight]);

    /* -------------------------------
     * 초기화 시작
     * ------------------------------- */
    useEffect(() => {
        // 네이티브 부트 스플래시는 앱 시작 직후 바로 숨김
        BootSplash.hide({ fade: true }).catch(() => {});
        entryPoint();
    }, [entryPoint]);

    return {
        state,
        entryPoint,
    };
}

/**
 * [앱 초기화 프로세스]
 * 서비스 진입 전 필수 환경(버전, 네트워크, 권한, 인증)을 점검하고 앱의 준비 상태(InitState)를 결정
 */
async function initApp(): Promise<InitState> {
    // 디바이스 ID 초기화 (없으면 생성 후 저장)
    initDeviceId();
    return INIT_STATE.READY;
    // 인증 Provider 등록 (core/api에서 토큰 발급/만료 체크 시 auth feature의 로직 사용)
    ensureApiInterceptorsRegistered(); // 인터셉터 등록 보장
    registerAuthProvider();

    // 네트워크 연결 상태 확인
    const network = await checkNetwork();
    if (!network) return INIT_STATE.NETWORK_ERROR;

    // 필수 권한 체크 + 순차 요청 */
    const hasPermission = await hasRequiredPermissions();
    if (!hasPermission) return INIT_STATE.PERMISSION_REQUIRED;

    // 토큰 발급 및 스토어 저장
    const token = await ensureInitToken();
    if (!token) return INIT_STATE.AUTH_ERROR;

    // 주소 정보 확인
    const location = getLocation();
    if (!location) return INIT_STATE.ADDRESS_REQUIRED;

    // 사용자 유형 체크 (예: 일반/사업자)
    const userType = getUserType();
    if (!userType) return INIT_STATE.USER_TYPE_REQUIRED;

    // 모든 점검 완료: 메인 화면 진입 가능 상태
    return INIT_STATE.READY;
}
