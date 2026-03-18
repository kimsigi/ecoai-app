import { check, RESULTS } from 'react-native-permissions';
import { PERMISSION_STATE, REQUIRED_PERMISSIONS } from './permission.constant';
import { PermissionItem } from './permission.type';
import { PERMISSION_ITEMS } from './permission.config';

/**
 * 필수 권한이 모두 허용되었는지 확인
 */
export async function hasRequiredPermissions(): Promise<boolean> {
    const results = await Promise.all(REQUIRED_PERMISSIONS.map(check));
    return results.every(res => res === RESULTS.GRANTED);
}

/**
 * 필수 권한 전체를 체크
 */
export async function checkAllPermissions(): Promise<PermissionItem[]> {
    return Promise.all(
        PERMISSION_ITEMS.map(async item => {
            const result = await check(item.permission);
            return {
                ...item,
                status: mapPermissionResult(result),
            };
        }),
    );
}

/**
 * OS권한 허용 결과값을 반환한다.
 */
export const mapPermissionResult = (result: string): PERMISSION_STATE => {
    switch (result) {
        case RESULTS.GRANTED:
            return PERMISSION_STATE.GRANTED;
        case RESULTS.DENIED:
            return PERMISSION_STATE.DENIED;
        case RESULTS.BLOCKED:
            return PERMISSION_STATE.BLOCKED;
        default:
            return PERMISSION_STATE.PENDING;
    }
};
