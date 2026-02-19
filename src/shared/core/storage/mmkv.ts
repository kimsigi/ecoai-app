import DeviceInfo from "react-native-device-info";
import { createMMKV } from "react-native-mmkv";

/* --------------------------------------------------
 * 내부 인스턴스 (외부 공개 안 함)
 * -------------------------------------------------- */
const storage = createMMKV();

/* --------------------------------------------------
 * 내부 키 정의 (외부 공개 안 함)
 * -------------------------------------------------- */

const DEVICE_ID_KEY = "DEVICE_ID";
const LAT_KEY = "LAT";
const LNG_KEY = "LNG";
const ADDRESS_KEY = "ADDRESS";
const USER_TYPE_KEY = "USER_TYPE";

/* --------------------------------------------------
 * 내부 사용 타입 정의
 * -------------------------------------------------- */
/** LOCATION */
type Location = { lat: number; lng: number; address: string };
/** USER TYPE */
type UserType = "PERSONAL" | "BUSINESS";

/* ==================================================
 * DEVICE
 * ================================================== */
/**
 * 디바이스 ID 초기화 (없으면 생성 후 저장)
 */
export function initDeviceId(): string {
  const saveId = storage.getString(DEVICE_ID_KEY);
  if ( saveId ) return saveId;

  const newId = `ECOAI-${DeviceInfo.getUniqueIdSync()}`;
  storage.set(DEVICE_ID_KEY, newId);

  return newId;
}
/**
 * 디바이스 ID 조회
 */
export function getDeviceId(): string | null {
  return storage.getString(DEVICE_ID_KEY) ?? null;
}

/* ==================================================
 * LOCATION
 * ================================================== */
/**
 * 위치정보 저장
 */
export function saveLocation({lat, lng, address}: Location): void {
  storage.set(LAT_KEY, lat);
  storage.set(LNG_KEY, lng);
  storage.set(ADDRESS_KEY, address);
}

/**
 * 위치정보 조회
 */
export function getLocation(): Location | null {
  const lat = storage.getNumber(LAT_KEY);
  const lng = storage.getNumber(LNG_KEY);
  const address = storage.getString(ADDRESS_KEY);

  if (lat == null || lng == null || !address) {
    return null;
  }

  return { lat, lng, address };
}

/* ==================================================
 * USER TYPE
 * ================================================== */
/**
 * 사용자 타입 저장
 */
export function setUserType(type: UserType): void {
  storage.set(USER_TYPE_KEY, type);
}

/**
 * 사용자 타입 조회
 */
export function getUserType(): UserType | null {
  return storage.getString(USER_TYPE_KEY) as UserType | null;
}