import { Platform } from "react-native";
import { PERMISSION_STATE, PERMISSION_TYPE} from "./permission.constant";
import { PERMISSIONS } from "react-native-permissions";
import { PermissionItem } from "./permission.type";

/* ---------- OS권한 목록 ---------- */
export const PERMISSION_ITEMS: PermissionItem[] = [
  {
    type: PERMISSION_TYPE.CAMERA,
    title: "카메라",
    description: "배출품목의 사진을 촬영하기 위해 권한이 필요합니다.",
    permission: Platform.select({
      ios: PERMISSIONS.IOS.CAMERA,
      android: PERMISSIONS.ANDROID.CAMERA,
    })!,
    status: PERMISSION_STATE.PENDING,
    icon: "📷",
  },
  {
    type: PERMISSION_TYPE.LOCATION,
    title: "위치",
    description: "배출위치 확인을 위해 권한이 필요 합니다.",
    permission: Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    })!,
    status: PERMISSION_STATE.PENDING,
    icon: "📍",
    androidCoarsePermission : PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  },
];