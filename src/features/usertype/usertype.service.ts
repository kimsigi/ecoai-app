import { mmkv } from '@/shared/core/storage/mmkv';
import { UserType } from './usertype.type';
import { USER_TYPE_KEY } from './usertype.constant';

/**
 * 사용자 타입 저장
 */
export function setUserType(type: UserType): void {
    mmkv.set(USER_TYPE_KEY, type);
}

/**
 * 사용자 타입 조회
 */
export function getUserType(): UserType | null {
    return mmkv.getString(USER_TYPE_KEY) as UserType | null;
}
