import { AUTH_TOKEN_RESPONSE_KEY } from './auth.constant';

// nonce 응답
export interface NonceResponse {
    nonce: string;
}

// Keycloak token endpoint 응답
export interface KeycloakTokenResponse {
    [AUTH_TOKEN_RESPONSE_KEY.ACCESS_TOKEN]: string;
    //[AUTH_TOKEN_RESPONSE_KEY.REFRESH_TOKEN]: string;
    //[AUTH_TOKEN_RESPONSE_KEY.EXPIRES_IN]: number;
    //[AUTH_TOKEN_RESPONSE_KEY.REFRESH_EXPIRES_IN]: number;
    //[AUTH_TOKEN_RESPONSE_KEY.TOKEN_TYPE]: string;
    //[AUTH_TOKEN_RESPONSE_KEY.SCOPE]: string;
}

export interface JwtPayload {
    exp: number;
}

export interface PlayIntegrityNativeModule {
    requestIntegrityToken(
        nonce: string,
        projectNumber: string,
    ): Promise<string>;
}

export interface DeviceAttestNativeModule {
    generateToken(nonce: string): Promise<string>;
}

export interface AuthState {
    accessToken: string | null;
    setToken: (token: string | null) => void;
}
