import { kakaoGet } from '@/shared/core/api';
import { Coordinate, KakaoRegionCodeResponse } from './location.type';

/**
 * 좌표로 행정구역정보 변환
 *  - x, y 좌표값을 받아 해당 좌표에 부합하는 행정동, 법정동을 얻는 API
 *  - https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-district
 */
export async function coord2regioncode(
    coord: Coordinate,
): Promise<KakaoRegionCodeResponse> {
    return await kakaoGet<KakaoRegionCodeResponse>(
        `/geo/coord2regioncode.json?x=${coord.lng}&y=${coord.lat}&input_coord=WGS84`,
    );
}
