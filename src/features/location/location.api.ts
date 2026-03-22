import { get } from '@/shared/core/api';
import {
    RegionByCoordsApiParams,
    LocationsByKeywordApiParams,
    LocationRegionResponse,
    LocationSearchResponse,
} from './location.type';

/**
 * 좌표로 행정구역 조회
 *  - 위도(latitude), 경도(longitude)를 이용하여 행정구역 정보 조회
 */
export async function fetchRegionByCoords(
    params: RegionByCoordsApiParams,
): Promise<LocationRegionResponse> {
    return await get<LocationRegionResponse>(
        `/api/location/region?latitude=${params.lat}&longitude=${params.lng}`,
    );
}

/**
 * 키워드로 주소/장소 검색
 *  - 검색어(query)를 기반으로 주소 및 장소 정보 조회
 *  - 위도(latitude), 경도(longitude)를 함께 전달하면 거리(distance) 기준으로 결과 제공
 */
export async function fetchLocationsByKeyword(
    params: LocationsByKeywordApiParams,
): Promise<LocationSearchResponse[]> {
    return await get<LocationSearchResponse[]>(
        `/api/location/search?query=${params.query}&latitude=${params.lat}&longitude=${params.lng}`,
    );
}