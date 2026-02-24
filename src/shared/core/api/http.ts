import axios from 'axios';
import { API, KAKAO } from '@/shared/core/config';

export const http = axios.create({
    baseURL: API.BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// auth 전용 axios 인스턴스
export const authHttp = axios.create({
    baseURL: API.AUTH_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
});

// kakao 전용 axios 인스턴스
export const kakaoHttp = axios.create({
    baseURL: KAKAO.API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `KakaoAK ${KAKAO.REST_API_KEY}`,
    },
});
