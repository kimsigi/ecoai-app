import { get } from '@/shared/core/api';
import { DEVICE_ID_KEY } from './app.constant';
import { mmkv } from '@/shared/core/storage/mmkv';
import DeviceInfo from 'react-native-device-info';
import { ApiHealthResponse } from './app.type';

/**
 * 디바이스 ID 초기화 (없으면 생성 후 저장)
 */
export function initDeviceId() {
    const saveId = mmkv.getString(DEVICE_ID_KEY);
    if (saveId) return saveId;

    const newId = `ECOAI-${DeviceInfo.getUniqueIdSync()}`;
    mmkv.set(DEVICE_ID_KEY, newId);

    return newId;
}

/**
 * 디바이스 ID 조회
 */
export function getDeviceId(): string | null {
    return mmkv.getString(DEVICE_ID_KEY) ?? null;
}

/**
 * Backend health endpoint를 호출해 네트워크/서버 연결 상태를 확인한다.
 *
 * 반환 규칙:
 * - `true`: 응답이 존재하고 `status`가 `'UP'`인 경우
 * - `false`: 응답 없음, `status`가 `'UP'`이 아님, 또는 요청 중 예외 발생
 */
export async function checkNetwork(): Promise<boolean> {
    try {
        const response = await get<ApiHealthResponse>('/management/health');
        return response?.status === 'UP';
    } catch (error) {
        console.error('Network check failed:', error);
        return false;
    }
}
