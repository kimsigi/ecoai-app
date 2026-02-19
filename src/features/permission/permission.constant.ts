import { Platform } from "react-native";
import { Permission, PERMISSIONS } from "react-native-permissions";

/* ---------- OS권한  ---------- */
export enum PERMISSION_TYPE {
  CAMERA = "camera",
  LOCATION = "location",
}

/* ---------- OS권한 상태  ---------- */
export enum PERMISSION_STATE {
  CHECKING = "checking",
  GRANTED = "granted",
  DENIED = "denied",
  PENDING = "pending",
  BLOCKED = "blocked",
}

/* ---------- OS권한 목록 ---------- */
export const REQUIRED_PERMISSIONS: Permission[] = Platform.select({
  android: [
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  ],
  ios: [
    PERMISSIONS.IOS.CAMERA,
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  ],
}) ?? [] as Permission[];