import { http } from './http';
import EncryptedStorage from 'react-native-encrypted-storage';

/* ===============================
   토큰 관리
================================= */

const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';

async function getToken(): Promise<string | null> {
    return EncryptedStorage.getItem(ACCESS_TOKEN_KEY);
}

async function setToken(token: string): Promise<void> {
    await EncryptedStorage.setItem(ACCESS_TOKEN_KEY, token);
}

async function clearToken(): Promise<void> {
    await EncryptedStorage.removeItem(ACCESS_TOKEN_KEY);
}

/* ===============================
   재 Attestation 로그인
================================= */

async function reAuthenticate(): Promise<string> {
    // TODO: 네이티브 Attestation 토큰 생성 연결
    const attestationToken = 'ATT_TOKEN_SAMPLE';

    const { data } = await http.post('/auth/attestation', {
        attestationToken,
    });

    const newToken: string = data.accessToken;

    await setToken(newToken);

    return newToken;
}

/* ===============================
   401 큐 처리
================================= */

let isRefreshing = false;
let subscribers: Array<(token: string) => void> = [];

function subscribe(callback: (token: string) => void) {
    subscribers.push(callback);
}

function notifySubscribers(token: string) {
    subscribers.forEach(cb => cb(token));
    subscribers = [];
}

/* ===============================
   요청 인터셉터
================================= */

http.interceptors.request.use(async config => {
    const token = await getToken();

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

/* ===============================
   응답 인터셉터
================================= */

http.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401) {
            await clearToken();

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const newToken = await reAuthenticate();
                    isRefreshing = false;
                    notifySubscribers(newToken);
                } catch (err) {
                    isRefreshing = false;
                    return Promise.reject(err);
                }
            }

            return new Promise(resolve => {
                subscribe((token: string) => {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    resolve(http(originalRequest));
                });
            });
        }

        return Promise.reject(error);
    },
);
