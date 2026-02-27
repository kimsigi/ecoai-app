import { jwtDecode } from 'jwt-decode';
import {
    DeviceAttestNativeModule,
    JwtPayload,
    PlayIntegrityNativeModule,
} from './auth.type';
import { SAFE_MARGIN_SECONDS } from './auth.constant';
import { NativeModules } from 'react-native';
import { ENV } from '@/shared/core/config';
import { isAndroid } from '@/shared/core/platform';
import { useAuthStore } from './auth.store';
import { requestNonce, requestToken } from './auth.api';

const playIntegrityModule = NativeModules.PlayIntegrityModule as
    | PlayIntegrityNativeModule
    | undefined;

const deviceAttestModule = NativeModules.DeviceAttest as
    | DeviceAttestNativeModule
    | undefined;

/**
 * 토큰 만료여부 판단
 * - 토큰의 exp 필드와 현재 시간 비교
 * - SAFE_MARGIN_SECONDS(60초) 만큼의 여유를 두어, 토큰이 곧 만료될 경우에도 expired로 간주
 */
export function isTokenExpired(token: string): boolean {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp <= now + SAFE_MARGIN_SECONDS;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return true; // 디코딩 실패 시 안전하게 만료된 것으로 간주
    }
}

async function requestAttestedToken(nonce: string): Promise<string> {
    if (isAndroid) {
        const playIntegrityProjectNumber = ENV.PLAY_INTEGRITY_PROJECT_NUMBER;
        if (!playIntegrityProjectNumber) {
            throw new Error('PLAY_INTEGRITY_PROJECT_NUMBER is missing.');
        }

        const token = await playIntegrityModule?.requestIntegrityToken(
            nonce,
            playIntegrityProjectNumber,
        );
        if (!token) {
            throw new Error('Failed to get Android attestation token.');
        }

        return token;
    } else {
        // TODO. iOS DeviceCheck 또는 App Attest 구현 필요 (현재는 Play Integrity 토큰 반환)
        /*
        if (!DeviceAttest?.generateToken) {
            throw new Error(AUTH_ERROR_MESSAGES.DEVICE_ATTEST_UNAVAILABLE);
        }

        const token = await DeviceAttest.generateToken(nonce);
        if (!token) {
            throw new Error(AUTH_ERROR_MESSAGES.IOS_ATTESTATION_FAILED);
        }
            */
        return '';
    }
}

/**
 * 토큰 발급
 */
export async function issueToken(): Promise<string | null> {
    try {
        // 1. Nonce 발급
        const { nonce } = await requestNonce();
        if (!nonce) return null;

        // 2. Attestation Token 발급
        const attestationToken = await requestAttestedToken(nonce);
        if (!attestationToken) return null;

        // 3. Keycloak 토큰 발급
        const { access_token } = await requestToken({
            nonce,
            attestationToken,
        });
        return access_token || null;
    } catch (error) {
        console.error('Failed to issue access token:', error);
        return null;
    }
}

/**
 * 토큰 발급 및 스토어 저장
 */
export async function issueTokenAndCache(): Promise<string | null> {
    const token = await issueToken();
    if (token) {
        useAuthStore.getState().setToken(token);
    }
    return token;
}

/**
 * 초기화용 토큰 확보: 기존 유효 토큰 우선 사용, 없거나 만료된 경우 신규 발급
 */
export async function ensureInitToken(): Promise<string | null> {
    const cached = useAuthStore.getState().accessToken;
    if (cached && !isTokenExpired(cached)) {
        return cached;
    }
    return issueTokenAndCache();
}
