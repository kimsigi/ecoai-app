import { LOCATION_SEARCH_TYPE } from './location.constant';

// 좌표 원천 데이터 타입
export interface Coordinate {
    lat: string;
    lng: string;
}

// 위치정보(x,y좌표+위치명) 데이터 타입
export interface LocationCoordinate extends Coordinate {
    locationName?: string;
}

// LocationPickerScreen 전용 파라메터 타입
export interface LocationPickerParam extends Partial<LocationCoordinate> {}
    
// LocationAddressSearchScreen 전용 파라메터 타입
export interface LocationAddressSearchParam extends Partial<LocationCoordinate> {
    initialQuery?: string; // 추가
    callback: (locationCoordinate: LocationCoordinate) => void;
}

// 좌표로 행정구역 조회하는 파라메터 전달용 타입 
export interface RegionFromCoordsParams extends Coordinate {}
// 검색어로 주소 조회하는 파라메터 전달용 타입
export interface LocationsByKeywordParams extends Partial<Coordinate> {
    keyword: string;
}

// API 호출 파라메터 - 좌표로 행정구역 조회
export interface RegionByCoordsApiParams extends Coordinate {}
// API 호출 파라메터 - 키워드로 주소/장소 검색
export interface LocationsByKeywordApiParams extends Partial<Coordinate> {
    query?: string;
}

/**
 * 키워드 검색 결과 유형 타입
 *
 * - LOCATION_SEARCH_TYPE 상수로부터 추출된 리터럴 유니온 타입
 * - API 응답의 type 필드에서 사용
 *
 * @example
 * type: "PLACE" | "ADDRESS"
 */
export type LocationSearchType = (typeof LOCATION_SEARCH_TYPE)[keyof typeof LOCATION_SEARCH_TYPE];

// 좌표로 행정구역 조회 API 응답 타입
export interface LocationRegionResponse {
    addressName: string; // 전체 주소
    region1DepthName: string; // 시/도
    region2DepthName: string; // 시/군/구
    region3DepthName: string; // 읍/면/동
    code: string; // 행정구역 코드
}

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

/**
 * 통합 위치 데이터 타입
 *
 * - locationName: 사용자에게 보여줄 대표 위치명
 * - addressName: 좌표 기준 실제 주소
 * - placeName: 장소 검색 결과의 상호명
 * - roadAddressName: 도로명 주소
 */
export interface LocationData extends Partial<LocationSearchResponse & LocationRegionResponse> {
    locationName?: string;
}

/**
 * 주소 검색 화면의 SectionList 섹션 데이터 타입
 */
export type ResultSection = {
    key: LocationSearchType;
    data: LocationSearchResponse[];
};

/**
 * 주소 검색 결과 1건의 화면 표시용 텍스트 타입
 */
export interface LocationAddressSearchDisplayText {
    mainTitle: string;
    smallLabel: string;
    subText: string;
}
