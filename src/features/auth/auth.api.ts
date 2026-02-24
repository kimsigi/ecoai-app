import { KeycloakTokenResponse, NonceResponse } from './auth.type';
import { AUTH_CLIENT, AUTH_ENDPOINTS } from './auth.constant';
import { authPost } from '@/shared/core/api';
import { getDeviceId } from '@/shared/core/device';
import { getOS } from '@/shared/core/platform';

/**
 * Nonce 발급 API
 */
export async function requestNonce(): Promise<NonceResponse> {
    return await authPost<NonceResponse>(AUTH_ENDPOINTS.NONCE, {
        client_id: AUTH_CLIENT.CLIENT_ID,
    });
}

// 토큰 발급
export async function requestToken(params: {
    nonce: string;
    attestationToken: string;
}): Promise<KeycloakTokenResponse> {
    const deviceId = getDeviceId() || ''; // 디바이스 ID가 없는 경우 빈 문자열 전달 (서버에서 처리)
    const osType = getOS();

    const body = new URLSearchParams();
    body.append('grant_type', AUTH_CLIENT.GRANT_TYPE);
    body.append('client_id', AUTH_CLIENT.CLIENT_ID);
    body.append('scope', AUTH_CLIENT.SCOPE);
    body.append('device_id', deviceId);
    body.append('platform', osType);
    body.append('nonce', params.nonce);
    // TODO. 개발용 더미 , IF문 개발 완료 후 제거 필요
    if (true) {
        body.append('client_secret', 'test-1111'); // 개발용 고정 시크릿
        console.log('### 빠디: ', body.toString());
        return await authPost<KeycloakTokenResponse>(
            AUTH_ENDPOINTS.TOKEN,
            body.toString(),
        );
    }

    body.append('attestation_token', params.attestationToken);
    return await authPost<KeycloakTokenResponse>(
        AUTH_ENDPOINTS.TOKEN,
        body.toString(),
    );
}
