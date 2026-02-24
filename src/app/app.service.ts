import { checkServerStatus } from './app.api';

/**
 * 네트워크 상태를 확인
 *
 * 반환 규칙:
 * - `true`: 응답이 존재하고 `status`가 `'UP'`인 경우
 * - `false`: 응답 없음, `status`가 `'UP'`이 아님, 또는 요청 중 예외 발생
 */
export async function checkNetwork(): Promise<boolean> {
    try {
        const response = await checkServerStatus();
        return response?.status === 'UP';
    } catch (error) {
        console.error('Network check failed:', error);
        return false;
    }
}
