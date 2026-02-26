export interface Coordinate {
    lat: number;
    lng: number;
}

export interface LocationCoordinate extends Coordinate {
    addressName?: string;
    region1DepthName?: string;
    region2DepthName?: string;
    region3DepthName?: string;
    code?: string;
}

export type LocationPickerParams = Partial<LocationCoordinate>;

export interface LocationAddressSearchParams extends LocationPickerParams {
    callback: (locationCoordinate: LocationCoordinate) => void;
}
/**
 * 좌표로 행정구역 정보 얻기 응답 결과 인터페이스
 */
export interface KakaoRegionCodeResponse {
    documents: KakaoRegionCodeDocument[];
}

/**
 * 행정구역 상세 정보 문서
 */
export interface KakaoRegionCodeDocument {
    addressName: string; // 전체 지역 명칭
    region1DepthName: string; // 지역 1Depth, 시도 단위 (바다 영역 없음)
    region2DepthName: string; // 지역 2Depth, 구 단위 (바다 영역 없음)
    region3DepthName: string; // 지역 3Depth, 동 단위 (바다 영역 없음)
    code: string; // region 코드 (행정동 또는 법정동 코드)
}

export interface LocationRegionResponse {
    addressName: string; // 전체 지역 명칭
    region1DepthName: string; // 지역 1Depth, 시도 단위 (바다 영역 없음)
    region2DepthName: string; // 지역 2Depth, 구 단위 (바다 영역 없음)
    region3DepthName: string; // 지역 3Depth, 동 단위 (바다 영역 없음)
    code: string; // region 코드 (행정동 또는 법정동 코드)
}
