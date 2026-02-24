import { useCallback, useEffect, useRef, useState } from 'react';
import BootSplash from 'react-native-bootsplash';
import { InitState } from './app.type';
import { INIT_STATE } from './app.constant';
import { checkNetwork, initDeviceId } from './app.service';
import { getLocation } from '@/features/location';
import { getUserType } from '@/features/usertype';
import { hasRequiredPermissions } from '@/features/permission';

export function useAppInitializer() {
    const [state, setState] = useState<InitState>(INIT_STATE.CHECKING);
    //const nativeSplashHidden = useRef(false);

    /** -------------------------------
     * 초기화 엔트리 포인트
     * ------------------------------- */
    const entryPoint = useCallback(async () => {
        setState(INIT_STATE.CHECKING);
        const result = await initApp();
        setState(result);
    }, []);

    /* -------------------------------
     * 초기화 시작
     * ------------------------------- */
    useEffect(() => {
        // 네이티브 부트 스플래시는 앱 시작 직후 바로 숨김
        BootSplash.hide({ fade: true }).catch(() => {});
        entryPoint();
    }, [entryPoint]);

    /* -------------------------------
     * BootSplash 제어
     * ------------------------------- */
    /*
    useEffect(() => {
        if (!nativeSplashHidden.current) {
            if (state !== INIT_STATE.CHECKING) {
                BootSplash.hide({ fade: true });
                nativeSplashHidden.current = true;
            }
        }
    }, [state]);
    */
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

    /* 1. OTA 업데이트 및 앱 버전 체크 (현재 비활성)
     최신 버전이 아니거나 강제 업데이트가 필요한 경우 진입 차단 */
    /*
  const ota = {forceUpdate: null};//await checkOtaAndVersion();
  if (ota.forceUpdate) return INIT_STATE.FORCE_UPDATE;
  */

    // 2. 네트워크 연결 상태 확인
    // 인터넷 미연결 시 오프라인 안내 화면으로 유도
    const network = await checkNetwork();
    if (!network) return INIT_STATE.NETWORK_ERROR;

    // 3. 필수 권한 체크 + 순차 요청 */
    const hasPermission = await hasRequiredPermissions();
    if (!hasPermission) return INIT_STATE.PERMISSION_REQUIRED;

    // 4. 인증 토큰 유효성 검사 (Keycloak)
    // 기존 로그인 세션이 유효한지 확인하고 인증 에러 발생 시 로그인 화면으로 유도
    const token = true; //await getKeycloakToken();
    if (!token) return INIT_STATE.AUTH_ERROR;

    // 5. 주소 정보 확인
    const location = getLocation();
    if (!location) return INIT_STATE.ADDRESS_REQUIRED;

    // 6. 사용자 유형 체크 (예: 일반/사업자)
    const userType = getUserType();
    if (!userType) return INIT_STATE.USER_TYPE_REQUIRED;

    // 모든 점검 완료: 메인 화면 진입 가능 상태
    return INIT_STATE.READY;
}
