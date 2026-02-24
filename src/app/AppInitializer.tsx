import { INIT_STATE } from './app.constant';
import { SplashView } from '@/shared/ui/component/splash';
import { ErrorView } from '@/shared/ui/component/error';
import PermissionScreen from '@/features/permission/PermissionScreen';
import { useAppInitializer } from './useAppInitializer';
import AppNavigation from './AppNavigation';
import { ROUTES } from './app.route';

export default function AppInitializer() {
    const { state, entryPoint } = useAppInitializer();

    /* -------------------------------
     * Render
     * ------------------------------- */
    // 1. 커스텀 스플래시
    if (state === INIT_STATE.CHECKING) return <SplashView />;

    // 2️. 네트워크 오류
    if (state === INIT_STATE.NETWORK_ERROR) {
        return (
            <ErrorView
                title="네트워크 오류"
                description="인터넷 연결을 확인한 후 다시 시도해주세요."
                onRetry={entryPoint}
            />
        );
    }

    // 3. 권한 필요
    if (state === INIT_STATE.PERMISSION_REQUIRED) {
        return <PermissionScreen onGranted={entryPoint} />;
    }

    // 4. 인증 오류
    if (state === INIT_STATE.AUTH_ERROR) {
        return (
            <ErrorView
                title="인증 실패"
                description="인증 정보를 가져올 수 없습니다."
                onRetry={entryPoint}
            />
        );
    }

    // 5. 주소 정보 체크
    if ( state === INIT_STATE.ADDRESS_REQUIRED ) {
        return <AppNavigation initialRouteName={ROUTES.LOCATION_PICKER} />;
    }

    // 6. 사용자 유형 체크
    if ( state === INIT_STATE.USER_TYPE_REQUIRED ) {
        return <AppNavigation initialRouteName={ROUTES.USER_TYPE} />;
    }
    /*
  // 5. 강제 업데이트
  if (state === INIT_STATE.FORCE_UPDATE) {
    return (
      <ErrorView
        title="업데이트 필요"
        description="최신 버전으로 업데이트해주세요."
      />
    );
  }
*/
    // 초기화 완료
    return <AppNavigation initialRouteName={ROUTES.HOME} />;
}
