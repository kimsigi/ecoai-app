import { mmkv } from '@/shared/core/storage/mmkv';
import { locationRegionH } from './location.api';
import {
    Coordinate,
    KakaoRegionCodeDocument,
    LocationCoordinate,
    LocationRegionResponse,
} from './location.type';
import Geolocation from 'react-native-geolocation-service';
import { ADDRESS_KEY, LAT_KEY, LNG_KEY } from './location.constant';

/**
 * 현재 GPS 위치 조회
 */
export function getCurrentPosition(): Promise<LocationCoordinate> {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            position => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            error => reject(error),
            {
                // GPS를 사용하여 높은 정확도의 위치를 요청 (배터리 소모량이 많을 수 있음)
                enableHighAccuracy: true,
                // 위치 정보를 가져올 때까지 기다릴 최대 시간 (5000ms = 5초)
                // 5초 안에 위치를 못 찾으면 에러 콜백이 호출
                timeout: 5000,
                // 캐시된 위치 정보를 허용할 최대 시간 (10000ms = 10초)
                // 마지막으로 측정된 위치가 10초 이내라면 새로 측정하지 않고 그 값을 재사용
                maximumAge: 10000,
            },
        );
    });
}

/**
 * 좌표로 행정구역정보 변환
 *  - x, y 좌표값을 받아 해당 좌표에 부합하는 행정동, 법정동 정보 조회
 */
export async function resolveRegion(
    coord: Coordinate,
    regionType: 'H' | 'B' = 'H',
): Promise<LocationRegionResponse | null> {
    try {
        const response = await locationRegionH(coord);
        return response || null;
    } catch (error) {
        console.error('Error resolving address:', error);
        return null;
    }
}

/* ==================================================
 * LOCATION
 * ================================================== */
/**
 * 위치정보 저장
 */
export function setLocation({
    lat,
    lng,
    addressName,
    region1DepthName,
    region2DepthName,
    region3DepthName,
}: LocationCoordinate): void {
    mmkv.set(LAT_KEY, lat);
    mmkv.set(LNG_KEY, lng);
    mmkv.set(ADDRESS_KEY, address ?? '');
}

/**
 * 위치정보 조회
 */
export function getLocation(): LocationCoordinate | null {
    const lat = mmkv.getNumber(LAT_KEY);
    const lng = mmkv.getNumber(LNG_KEY);
    const address = mmkv.getString(ADDRESS_KEY);

    if (!lat || !lng) return null;

    return { lat, lng, address };
}
