import Config from 'react-native-config';

export const ENV = {
    API_BASE_URL: Config.API_BASE_URL,
    KAKAO_API_BASE_URL: Config.KAKAO_API_BASE_URL,
    KAKAO_REST_API_KEY: Config.KAKAO_REST_API_KEY,
    KAKAO_JAVASCRIPT_KEY: Config.KAKAO_JAVASCRIPT_KEY,
};

export const FALLBACK = {
    MAP_LAT: 37.486083617117,
    MAP_LNG: 126.894651701587,
};
