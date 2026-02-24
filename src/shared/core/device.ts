import DeviceInfo from 'react-native-device-info';
import { mmkv } from './storage/mmkv';

/* ---------------------------------
 * 내부 저장 키
 * --------------------------------- */
const DEVICE_ID_KEY = 'DEVICE_ID';

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

/*
 * 디바이스 ID 조회
 */
export function getDeviceId(): string | null {
    return mmkv.getString(DEVICE_ID_KEY) ?? null;
}

/* ---------------------------------
 * 현재 앱 버전 (1.0.3)
 * --------------------------------- */
export const getAppVersion = (): string => {
    return DeviceInfo.getVersion();
};

/* ---------------------------------
 * 앱 빌드 번호
 * - Android: versionCode
 * - iOS: CFBundleVersion
 * --------------------------------- */
export const getBuildNumber = (): string => {
    return DeviceInfo.getBuildNumber();
};

/* ---------------------------------
 * OS 버전 (예: 17.2 / 14)
 * --------------------------------- */
export const getOsVersion = (): string => {
    return DeviceInfo.getSystemVersion();
};

/* ---------------------------------
 * 디바이스 모델 (예: iPhone15,3 / SM-S918N)
 * --------------------------------- */
export const getDeviceModel = (): string => {
    return DeviceInfo.getModel();
};
