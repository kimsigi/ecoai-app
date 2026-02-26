import { INIT_STATE } from './app.constant';

export type InitState = (typeof INIT_STATE)[keyof typeof INIT_STATE];

/**
 * API 서버의 건강 상태 응답 타입
 */
export interface ApiHealthResponse {
    status: 'UP' | 'DOWN';
    groups: string[]; // ["liveness", "readiness"] 등
}
