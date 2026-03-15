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
    SHEET_BASIC: 'SheetBasic',
    SHEET_WEBVIEW: 'SheetWebView',
    SHEET_ASYNC: 'SheetAsync',
    SHEET_FIXED: 'SheetFixed',
    SHEET_PLAYGROUND: 'SheetPlayground',
    SHOWCASE_REACT_QUERY: 'ShowcaseReactQuery',
    SAMPLEMAPOVERLAY: 'SampleMapOverlay',
    SUBITEM: 'SubItem',
    PERMISSION: 'Permission',
    LOCATION_PICKER: 'LocationPicker',
    LOCATION_ADDRESS_SEARCH: 'LocationAddressSearch',
    USER_TYPE: 'UserType',
    HOME: 'Home',
    HOMESEARCH: 'HomeSearch',
    CAMERA_CAPTURE: 'CameraCapture',
    SETTING: 'Setting',
    DISPOSALHISTORY: 'DisposalHistory',
    FAQ: 'Faq',
    NOTIFICATION: 'Notification',
    APPINFO: 'Appinfo',
    CATEGORY: 'Category',
    AI_CHAT: 'AiChat',
    PAYMENTCART: 'PaymentCart',
    DISPOSALOWNERVERIFY: 'DisposalOwnerVerify',
    DISPOSALSTATUS: 'DisposalStatus',
    DISPOSALSTATUSLIST: 'DisposalStatusList',
    DISPOSALDETAIL: 'DisposalDetail',
    DISPOSALREQUEST: 'DisposalRequest',
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
    [ROUTES.SHEET_BASIC]: undefined;
    [ROUTES.SHEET_WEBVIEW]: undefined;
    [ROUTES.SHEET_ASYNC]: undefined;
    [ROUTES.SHEET_FIXED]: undefined;
    [ROUTES.SHEET_PLAYGROUND]: undefined;
    [ROUTES.SHOWCASE_REACT_QUERY]: undefined;
    [ROUTES.SAMPLEMAPOVERLAY]: undefined;
    [ROUTES.SUBITEM]: undefined;
    [ROUTES.PERMISSION]: undefined;
    [ROUTES.LOCATION_PICKER]: LocationPickerParams | undefined;
    [ROUTES.LOCATION_ADDRESS_SEARCH]: LocationAddressSearchParams | undefined;
    [ROUTES.USER_TYPE]: undefined;
    [ROUTES.HOME]: undefined;
    [ROUTES.HOMESEARCH]: undefined;
    [ROUTES.CAMERA_CAPTURE]: undefined;
    [ROUTES.SETTING]: undefined;
    [ROUTES.DISPOSALHISTORY]: undefined;
    [ROUTES.FAQ]: undefined;
    [ROUTES.NOTIFICATION]: undefined;
    [ROUTES.APPINFO]: undefined;
    [ROUTES.CATEGORY]: undefined;
    [ROUTES.AI_CHAT]: undefined;

    [ROUTES.PAYMENTCART]: undefined;
    [ROUTES.DISPOSALOWNERVERIFY]: undefined;
    [ROUTES.DISPOSALSTATUS]: undefined;
    [ROUTES.DISPOSALSTATUSLIST]: undefined;
    [ROUTES.DISPOSALDETAIL]: undefined;
    [ROUTES.DISPOSALREQUEST]: undefined;
};

export type AppNavigationProps = {
    initialRouteName?: keyof StackParamList;
};
