import {
    LocationAddressSearchParams,
    LocationPickerParams,
} from '@/features/location';
import { ReactNode } from 'react';

/**
 * Main Routes
 *
 * - 메인 플로우에서 사용하는 화면 이름 상수
 * - navigation / screen / type 에서 공통으로 사용
 */
export const ROUTES = {
    SHOWCASE: 'Showcase',
    PERMISSION: 'Permission',
    LOCATION_PICKER: 'LocationPicker',
    LOCATION_ADDRESS_SEARCH: 'LocationAddressSearch',
    USER_TYPE: 'UserType',
    HOME: 'Home',
    CAMERA_CAPTURE: 'CameraCapture',
    AI_CHAT: 'AiChat',
} as const;

export type StackParamList = {
    [ROUTES.SHOWCASE]: undefined;
    [ROUTES.PERMISSION]: undefined;
    [ROUTES.LOCATION_PICKER]: LocationPickerParams | undefined;
    [ROUTES.LOCATION_ADDRESS_SEARCH]: LocationAddressSearchParams | undefined;
    [ROUTES.USER_TYPE]: undefined;
    [ROUTES.HOME]: undefined;
    [ROUTES.CAMERA_CAPTURE]: undefined;
    [ROUTES.AI_CHAT]: undefined;
};

export type AppNavigationProps = {
    initialRouteName?: keyof StackParamList;
};

export type ScreenLayoutMode = 'fixed' | 'overlay';

export type HeaderConfig =
    | { variant: 'none' }
    | { variant: 'back'; backgroundColor?: string }
    | { variant: 'back-title'; title: string; backgroundColor?: string }
    | {
          variant: 'back-actions';
          title?: string;
          actions: ReactNode | ReactNode[];
          backgroundColor?: string;
      }
    | {
          variant: 'custom';
          // 검색 헤더 같은 완전 커스텀 용도
          render: (ctx: { navigation: unknown; route: unknown }) => ReactNode;
          backgroundColor?: string;
      };

export type ScreenLayoutOptions = {
    mode?: ScreenLayoutMode;
    header?: HeaderConfig;

    backgroundColor?: string;
    statusBarStyle?: 'light-content' | 'dark-content';
    statusBarBackgroundColor?: string;
    protectBottomInset?: boolean;
};
