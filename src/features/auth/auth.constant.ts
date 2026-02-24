// ENDPOINT
export const AUTH_ENDPOINTS = {
    NONCE: '/realms/ecoai/device/nonce',
    TOKEN: '/realms/ecoai/protocol/openid-connect/token',
} as const;

// 토큰 응답 필드
export const AUTH_TOKEN_RESPONSE_KEY = {
    ACCESS_TOKEN: 'access_token',
    //REFRESH_TOKEN: 'refresh_token',
    //EXPIRES_IN: 'expires_in',
    //REFRESH_EXPIRES_IN: 'refresh_expires_in',
    //TOKEN_TYPE: 'token_type',
    //SCOPE: 'scope',
} as const;

export const AUTH_CLIENT = {
    GRANT_TYPE: 'client_credentials',
    CLIENT_ID: 'ecoai-device-client',
    SCOPE: 'openid email profile',
} as const;

export const SAFE_MARGIN_SECONDS = 60; // 1분
