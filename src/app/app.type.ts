import {
    LocationAddressSearchParams,
    LocationPickerParams,
} from '@/features/location';
import { INIT_STATE } from './app.constant';
import { ROUTES } from './app.route';

export type InitState = (typeof INIT_STATE)[keyof typeof INIT_STATE];

export type StackParamList = {
    [ROUTES.SHOWCASE]: undefined;
    [ROUTES.PERMISSION]: undefined;
    [ROUTES.LOCATION_PICKER]: LocationPickerParams | undefined;
    [ROUTES.LOCATION_ADDRESS_SEARCH]: LocationAddressSearchParams;
    [ROUTES.USER_TYPE]: undefined;
    [ROUTES.HOME]: undefined;
    [ROUTES.AI_CHAT]: undefined;
};

export type AppNavigationProps = {
    initialRouteName?: keyof StackParamList;
};

/**
 * API 서버의 건강 상태 응답 타입
 */
export interface ApiHealthResponse {
    status: 'UP' | 'DOWN';
    groups: string[]; // ["liveness", "readiness"] 등
}
