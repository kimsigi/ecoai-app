/* ---------- 앱 초기화 상태 목록 ---------- */
export const INIT_STATE = {
    CHECKING: 'CHECKING',
    NETWORK_ERROR: 'NETWORK_ERROR',
    PERMISSION_REQUIRED: 'PERMISSION_REQUIRED',
    AUTH_ERROR: 'AUTH_ERROR',
    ADDRESS_REQUIRED: 'ADDRESS_REQUIRED',
    USER_TYPE_REQUIRED: 'USER_TYPE_REQUIRED',
    FORCE_UPDATE: 'FORCE_UPDATE',
    READY: 'READY',
} as const;

/* ---------- storage(mmkv) 키 정의 ---------- */
export const DEVICE_ID_KEY = 'DEVICE_ID';
