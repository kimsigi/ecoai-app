import { get } from '@/shared/core/api';
import { ApiHealthResponse } from './app.type';

/**
 * Backend health endpoint를 호출해 네트워크/서버 연결 상태를 확인한다.
 */
export async function checkServerStatus(): Promise<ApiHealthResponse | null> {
    return await get<ApiHealthResponse>('/management/health');
}
