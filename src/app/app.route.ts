import {
    LocationAddressSearchParams,
    LocationPickerParams,
} from '@/features/location';

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
    AI_CHAT: 'AiChat',
} as const;

export type StackParamList = {
    [ROUTES.SHOWCASE]: undefined;
    [ROUTES.PERMISSION]: undefined;
    [ROUTES.LOCATION_PICKER]: LocationPickerParams | undefined;
    [ROUTES.LOCATION_ADDRESS_SEARCH]: LocationAddressSearchParams | undefined;
    [ROUTES.USER_TYPE]: undefined;
    [ROUTES.HOME]: undefined;
    [ROUTES.AI_CHAT]: undefined;
};

export type AppNavigationProps = {
    initialRouteName?: keyof StackParamList;
};
