import Config from 'react-native-config';

/* ---------------------------------
 * 환경변수
 * --------------------------------- */
export const ENV = {
    PLAY_INTEGRITY_PROJECT_NUMBER: Config.PLAY_INTEGRITY_PROJECT_NUMBER,
};
/* ---------------------------------
 * API
 * --------------------------------- */
export const API = {
    BASE_URL: Config.API_BASE_URL,
    AUTH_BASE_URL: Config.API_AUTH_BASE_URL,
};

/* ---------------------------------
 * 카카오 관련
 * --------------------------------- */
export const KAKAO = {
    API_BASE_URL: Config.KAKAO_API_BASE_URL,
    REST_API_KEY: Config.KAKAO_REST_API_KEY,
    JAVASCRIPT_KEY: Config.KAKAO_JAVASCRIPT_KEY,
};

/* ---------------------------------
 * FALLBACK 값
 * --------------------------------- */
export const FALLBACK = {
    //MAP_LAT: '37.486083617117',
    //MAP_LNG: '126.894651701587',
    MAP_LAT: '37.5662952',
    MAP_LNG: '126.9779451',
};
