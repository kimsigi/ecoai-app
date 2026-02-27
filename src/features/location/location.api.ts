import { get } from '@/shared/core/api';
import {
    LocationApiParams,
    LocationRegionResponse,
    LocationSearchResponse,
} from './location.type';

/**
 * 좌표로 행정구역 조회
 *  - 위도(latitude), 경도(longitude)를 이용하여 행정구역 정보를 조회합니다.
 */
export async function locationRegion(
    params: LocationApiParams,
): Promise<LocationRegionResponse> {
    return await get<LocationRegionResponse>(
        `/api/location/region?latitude=${params.lat}&longitude=${params.lng}`,
    );
}

export async function locationSearch(
    params: LocationApiParams,
): Promise<LocationSearchResponse[]> {
    return await get<LocationSearchResponse[]>(
        `/api/location/search?query=${params.query}&latitude=${params.lat}&longitude=${params.lng}`,
    );
}
