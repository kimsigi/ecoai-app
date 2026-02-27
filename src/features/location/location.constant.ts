/* ---------- storage(mmkv) 키 정의 ---------- */
export const LAT_KEY = 'LAT';
export const LNG_KEY = 'LNG';
export const ADDRESS_NAME_KEY = 'ADDRESS_NAME';
export const REGION_1DEPTH_NAME_KEY = 'REGION_1DEPTH_NAME';
export const REGION_2DEPTH_NAME_KEY = 'REGION_2DEPTH_NAME';
export const REGION_3DEPTH_NAME_KEY = 'REGION_3DEPTH_NAME';
export const REGION_CODE_KEY = 'REGION_CODE';
export const ADDRESS_TYPE_KEY = 'ADDRESS_TYPE';
export const PLACE_NAME_KEY = 'PLACE_NAME';
export const ROAD_ADDRESS_NAME_KEY = 'ROAD_ADDRESS_NAME';
export const DISTANCE_KEY = 'DISTANCE';
export const CATEGORY_NAME_KEY = 'CATEGORY_NAME';

/* ---------- 키워드 장소/주소 검색 API 사용(주소 또는 장소 검색을 구분하는 구분자) ---------- */
export const LOCATION_SEARCH_TYPE = {
    PLACE: 'PLACE',
    ADDRESS: 'ADDRESS',
} as const;
