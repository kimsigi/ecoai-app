import { Permission } from "react-native-permissions";
import { PERMISSION_STATE, PERMISSION_TYPE } from "./permission.constant";

/* ---------- OS권한 타입  ---------- */
export type PermissionItem = {
  type: PERMISSION_TYPE
  title: string;
  description: string;
  permission: Permission;
  status: PERMISSION_STATE
  icon: string;
  androidCoarsePermission? : string
}

/* ---------- Screen & Hook parameters  ---------- */
export type UsePermissionProps = {
  onGranted?: () => void;
}