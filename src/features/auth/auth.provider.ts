import { setApiAuthProvider } from '@/shared/core/api';
import { issueTokenAndCache, isTokenExpired } from './auth.service';
import { useAuthStore } from './auth.store';

/**
 * feature/auth가 core/api에 인증 Provider를 주입하는 어댑터.
 **/

// Provider 중복 등록 방지 플래그
let isAuthProviderRegistered = false;

/**
 * auth feature 기반 Provider를 core/api에 등록
 **/
export function registerAuthProvider(): void {
    if (isAuthProviderRegistered) return;

    setApiAuthProvider({
        getAccessToken: () => useAuthStore.getState().accessToken,
        isTokenExpired,
        issueAccessToken: issueTokenAndCache,
        clearAccessToken: () => {
            useAuthStore.getState().setToken(null);
        },
    });

    // 최초 등록 완료 표시
    isAuthProviderRegistered = true;
}
