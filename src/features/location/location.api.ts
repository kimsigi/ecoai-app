import { get, kakaoGet, post } from '@/shared/core/api';
import { Coordinate, LocationRegionResponse } from './location.type';

/**
 * 좌표로 행정구역정보 변환
 *  - x, y 좌표값을 받아 해당 좌표에 부합하는 행정동을 얻는 API
 */
export async function locationRegionH(
    coord: Coordinate,
): Promise<LocationRegionResponse> {
    return await get<LocationRegionResponse>(
        `/api/location/region?latitude=${coord.lat}&longitude=${coord.lng}`,
        //{ latitude: coord.lat, longitude: coord.lng },
        //`/geo/coord2regioncode.json?x=${coord.lng}&y=${coord.lat}&input_coord=WGS84`,
    );
}
