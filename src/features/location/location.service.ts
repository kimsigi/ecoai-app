import { mmkv } from '@/shared/core/storage/mmkv';
import {
    Coordinate,
    LocationApiParams,
    LocationData,
    LocationRegionResponse,
} from './location.type';
import Geolocation from 'react-native-geolocation-service';
import { locationRegion } from './location.api';
import {
    ADDRESS_NAME_KEY,
    ADDRESS_TYPE_KEY,
    CATEGORY_NAME_KEY,
    DISTANCE_KEY,
    LAT_KEY,
    LNG_KEY,
    PLACE_NAME_KEY,
    REGION_1DEPTH_NAME_KEY,
    REGION_2DEPTH_NAME_KEY,
    REGION_3DEPTH_NAME_KEY,
    REGION_CODE_KEY,
    ROAD_ADDRESS_NAME_KEY,
} from './location.constant';

/**
 * 현재 GPS 위치 조회
 */
export function getCurrentPosition(): Promise<Coordinate> {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            position => {
                resolve({
                    lat: position.coords.latitude?.toString() ?? '',
                    lng: position.coords.longitude?.toString() ?? '',
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
 * 좌표로 행정구역 조회
 *  - 위도(lat), 경도(lng)를 이용하여 행정구역 정보를 조회합니다.
 */
export async function resolveRegion(
    params: LocationApiParams,
): Promise<LocationRegionResponse | null> {
    try {
        const response = await locationRegion(params);
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
export function setLocation(locationData: LocationData): void {
    const {
        // 좌표 별칭 지정 (x -> lng, y -> lat)
        y: lat = '',
        x: lng = '',

        // 기본 필드 및 기본값 설정
        addressName = '',
        region1DepthName = '',
        region2DepthName = '',
        region3DepthName = '',
        code = '',
        type = '', // LocationSearchType
        placeName = '',
        roadAddressName = '',
        distance = 0,
        categoryName = '',
    } = locationData || {};

    // 기존 위치정보 초기화
    clearLocation();

    /* ---------- MMKV Storage 저장 ---------- */

    // 1. 좌표 및 주요 주소 정보
    mmkv.set(LAT_KEY, lat);
    mmkv.set(LNG_KEY, lng);
    mmkv.set(ADDRESS_NAME_KEY, addressName);

    // 2. 행정구역 상세 정보
    mmkv.set(REGION_1DEPTH_NAME_KEY, region1DepthName);
    mmkv.set(REGION_2DEPTH_NAME_KEY, region2DepthName);
    mmkv.set(REGION_3DEPTH_NAME_KEY, region3DepthName);
    mmkv.set(REGION_CODE_KEY, code);

    // 3. 장소 및 카테고리 정보
    mmkv.set(ADDRESS_TYPE_KEY, type);
    mmkv.set(PLACE_NAME_KEY, placeName);
    mmkv.set(ROAD_ADDRESS_NAME_KEY, roadAddressName);
    mmkv.set(DISTANCE_KEY, distance);
    mmkv.set(CATEGORY_NAME_KEY, categoryName);
}

/**
 * 위치정보 초기화
 */
function clearLocation(): void {
    // 1. 좌표 및 주요 주소 정보 삭제
    mmkv.remove(LAT_KEY);
    mmkv.remove(LNG_KEY);
    mmkv.remove(ADDRESS_NAME_KEY);

    // 2. 행정구역 상세 정보 삭제
    mmkv.remove(REGION_1DEPTH_NAME_KEY);
    mmkv.remove(REGION_2DEPTH_NAME_KEY);
    mmkv.remove(REGION_3DEPTH_NAME_KEY);
    mmkv.remove(REGION_CODE_KEY);

    // 3. 장소 및 카테고리 정보 삭제
    mmkv.remove(ADDRESS_TYPE_KEY);
    mmkv.remove(PLACE_NAME_KEY);
    mmkv.remove(ROAD_ADDRESS_NAME_KEY);
    mmkv.remove(DISTANCE_KEY);
    mmkv.remove(CATEGORY_NAME_KEY);
}

/**
 * 위치정보 조회
 */
export function getLocation(): LocationData | null {
    const y = mmkv.getString(LAT_KEY) ?? '';
    const x = mmkv.getString(LNG_KEY) ?? '';
    if (!y || !x) return null;

    return {
        y,
        x,
        addressName: mmkv.getString(ADDRESS_NAME_KEY) ?? '',
        region1DepthName: mmkv.getString(REGION_1DEPTH_NAME_KEY) ?? '',
        region2DepthName: mmkv.getString(REGION_2DEPTH_NAME_KEY) ?? '',
        region3DepthName: mmkv.getString(REGION_3DEPTH_NAME_KEY) ?? '',
        code: mmkv.getString(REGION_CODE_KEY) ?? '',
        type: mmkv.getString(ADDRESS_TYPE_KEY) as any, // enum 타입인 경우 캐스팅
        placeName: mmkv.getString(PLACE_NAME_KEY) ?? '',
        roadAddressName: mmkv.getString(ROAD_ADDRESS_NAME_KEY) ?? '',
        distance: mmkv.getNumber(DISTANCE_KEY) ?? 0,
        categoryName: mmkv.getString(CATEGORY_NAME_KEY) ?? '',
    };
}
