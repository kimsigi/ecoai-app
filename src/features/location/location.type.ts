export interface Coordinate {
    lat: number;
    lng: number;
}

export interface LocationCoordinate extends Coordinate {
    address?: string;
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
    region_type: 'H' | 'B'; // H(행정동) 또는 B(법정동)
    address_name: string; // 전체 지역 명칭
    region_1depth_name: string; // 지역 1Depth, 시도 단위 (바다 영역 없음)
    region_2depth_name: string; // 지역 2Depth, 구 단위 (바다 영역 없음)
    region_3depth_name: string; // 지역 3Depth, 동 단위 (바다 영역 없음)
    region_4depth_name: string; // 지역 4Depth (B타입 리 영역인 경우만 존재)
    code: string; // region 코드 (행정동 또는 법정동 코드)
    x: number; // X 좌표값, 경위도인 경우 경도(longitude)
    y: number; // Y 좌표값, 경위도인 경우 위도(latitude)
}
