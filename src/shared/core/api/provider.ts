export interface ApiAuthProvider {
    /** 현재 캐시된 액세스 토큰 조회 */
    getAccessToken: () => Promise<string | null> | string | null;

    /** 토큰 만료 여부 판단 */
    isTokenExpired: (token: string) => boolean;

    /** 액세스 토큰 신규 발급 + 내부 캐시 반영 */
    issueAccessToken: () => Promise<string | null>;

    /** 인증 실패(401) 시 기존 토큰 무효화 */
    clearAccessToken?: () => Promise<void> | void;
}

let authProvider: ApiAuthProvider | null = null;

/** API 인증 Provider 등록 */
export function setApiAuthProvider(provider: ApiAuthProvider): void {
    authProvider = provider;
}

/** 등록된 API 인증 Provider 조회 */
export function getApiAuthProvider(): ApiAuthProvider | null {
    return authProvider;
}
