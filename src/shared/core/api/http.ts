import axios from 'axios';
import { ENV } from '../config/env';

export const http = axios.create({
    baseURL: ENV.API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const kakaoHttp = axios.create({
    baseURL: ENV.KAKAO_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `KakaoAK ${ENV.KAKAO_REST_API_KEY}`,
    },
});
