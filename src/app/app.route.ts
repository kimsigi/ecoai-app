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
    SAMPLESCR1: 'SampleScreen1',
    SAMPLESCR2: 'SampleScreen2',
    SAMPLESCR3: 'SampleScreen3',
    SAMPLESCR4: 'SampleScreen4',
    SAMPLESCR5: 'SampleScreen5',
    MENULAYEROVERLAY: 'MenuLayerOverlay',
    BOTTOMSHEET: 'BottomSheet',
    SAMPLEMAPOVERLAY: 'SampleMapOverlay',
    SUBITEM: 'SubItem',
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

    [ROUTES.SAMPLESCR1]: undefined;
    [ROUTES.SAMPLESCR2]: undefined;
    [ROUTES.SAMPLESCR3]: undefined;
    [ROUTES.SAMPLESCR4]: undefined;
    [ROUTES.SAMPLESCR5]: undefined;
    [ROUTES.MENULAYEROVERLAY]: undefined;
    [ROUTES.BOTTOMSHEET]: undefined;
    [ROUTES.SAMPLEMAPOVERLAY]: undefined;
    [ROUTES.SUBITEM]: undefined;
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
