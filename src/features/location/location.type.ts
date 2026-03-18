import { LOCATION_SEARCH_TYPE } from './location.constant';

export interface Coordinate {
    lat: string;
    lng: string;
}

export interface LocationCoordinate extends Coordinate {
    addressName?: string;
}

export interface LocationPickerParams extends Partial<LocationCoordinate> {}

export interface LocationAddressSearchParams extends LocationPickerParams {
    initialQuery?: string; // 추가
    callback: (locationCoordinate: LocationCoordinate) => void;
}

// API 호출 파라메터
export interface LocationApiParams extends Coordinate {
    query?: string;
}

export type LocationSearchType =
    (typeof LOCATION_SEARCH_TYPE)[keyof typeof LOCATION_SEARCH_TYPE];

// 키워드 장소/주소 검색 API 응답 타입
export interface LocationSearchResponse {
    type: LocationSearchType; // 주소 또는 장소 검색을 구분하는 구분자
    placeName: string; // 장소명
    addressName: string; // 지번 주소
    roadAddressName: string; // 도로명 주소
    x: string; // X 좌표 (경도, longitude) - lng
    y: string; // Y 좌표 (위도, latitude) - lat
    distance: number; // 중심 좌표까지의 거리 (단위: 미터)
    categoryName: string; // 카테고리 이름
}

// 좌표로 행정구역 조회 API 응답 타입
export interface LocationRegionResponse {
    addressName: string; // 전체 주소
    region1DepthName: string; // 시/도
    region2DepthName: string; // 시/군/구
    region3DepthName: string; // 읍/면/동
    code: string; // 행정구역 코드
}

export interface LocationData
    extends Partial<LocationSearchResponse & LocationRegionResponse> {}

export type ResultSection = {
    key: LocationSearchType;
    data: LocationSearchResponse[];
};

export interface LocationAddressSearchDisplayText {
    mainTitle: string;
    smallLabel: string;
    subText: string;
}
