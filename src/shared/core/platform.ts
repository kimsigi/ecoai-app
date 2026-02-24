import { Platform } from 'react-native';

/* ---------------------------------
 * OS 여부
 * --------------------------------- */
export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';

/* ---------------------------------
 * OS 타입
 * --------------------------------- */
export const getOS = (): 'ANDROID' | 'IOS' => (isAndroid ? 'ANDROID' : 'IOS');

/* ---------------------------------
 * 플랫폼에 따라 값 선택
 * --------------------------------- */
export const whenPlatform = <T>(options: { android: T; ios: T }): T => {
    return Platform.OS === 'android' ? options.android : options.ios;
};
