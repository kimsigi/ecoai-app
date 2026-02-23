import EncryptedStorage from 'react-native-encrypted-storage';

/**
 * 보안 스토리지 인프라 어댑터
 * - 도메인 키를 절대 알지 않는다.
 * - 단순 저장/조회/삭제만 담당한다.
 */
export const secureStorage = {
    async set(key: string, value: string): Promise<void> {
        await EncryptedStorage.setItem(key, value);
    },

    async get(key: string): Promise<string | null> {
        return await EncryptedStorage.getItem(key);
    },

    async remove(key: string): Promise<void> {
        await EncryptedStorage.removeItem(key);
    },

    async clearAll(): Promise<void> {
        await EncryptedStorage.clear();
    },
};
