import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getApiAuthProvider } from './provider';
import { http } from './http';

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };
type InterceptorState = { requestId: number; responseId: number };

declare global {
    // [추가] HMR에서도 유지되는 전역 등록 상태
    var __ECOAI_HTTP_INTERCEPTOR_STATE__: InterceptorState | undefined;
}

let issueTokenInFlight: Promise<string | null> | null = null;

/**
 * single-flight로 토큰 재발급 1회 보장
 * */
async function issueTokenSingleFlight(
    forceClear: boolean,
): Promise<string | null> {
    const provider = getApiAuthProvider();
    if (!provider) return null;

    if (issueTokenInFlight) {
        return issueTokenInFlight;
    }

    issueTokenInFlight = (async () => {
        if (forceClear && provider.clearAccessToken) {
            await provider.clearAccessToken();
        }
        return provider.issueAccessToken();
    })().finally(() => {
        issueTokenInFlight = null;
    });

    return issueTokenInFlight;
}

/**
 * 유효한 액세스 토큰 확보
 * */
async function getValidAccessToken(
    forceReissue: boolean,
): Promise<string | null> {
    const provider = getApiAuthProvider();
    if (!provider) return null;

    if (!forceReissue) {
        const currentToken = await provider.getAccessToken();
        if (currentToken && !provider.isTokenExpired(currentToken)) {
            return currentToken;
        }
    }

    // 만료/미보유/401 모두 single-flight 발급 경로로 통일
    return issueTokenSingleFlight(forceReissue);
}

/**
 * API 인터셉터 등록 보장.
 * - 중복 등록 방지
 */
export function ensureApiInterceptorsRegistered(): void {
    // 이미 등록되어 있으면 중복 등록하지 않음
    if (globalThis.__ECOAI_HTTP_INTERCEPTOR_STATE__) {
        return;
    }

    const requestId = http.interceptors.request.use(async config => {
        if (config.headers?.Authorization) return config;

        const token = await getValidAccessToken(false);
        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    const responseId = http.interceptors.response.use(
        response => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as
                | RetryableRequestConfig
                | undefined;

            if (
                error.response?.status === 401 &&
                originalRequest &&
                !originalRequest._retry
            ) {
                originalRequest._retry = true;

                const newToken = await getValidAccessToken(true);
                if (!newToken) return Promise.reject(error);

                originalRequest.headers = originalRequest.headers ?? {};
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return http(originalRequest);
            }

            return Promise.reject(error);
        },
    );

    globalThis.__ECOAI_HTTP_INTERCEPTOR_STATE__ = { requestId, responseId };
}
