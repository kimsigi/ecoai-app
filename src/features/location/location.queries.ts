import { useQuery } from "@tanstack/react-query";
import { LocationRegionResponse, LocationsByKeywordParams, LocationSearchResponse, RegionFromCoordsParams } from "./location.type";
import { getLocationsByKeyword, getRegionFromCoords } from "./location.service";

/**
 * Location Query Key 정의
 *
 * - location 도메인 캐시 키 그룹
 * - region: 좌표 기반 행정구역 조회
 * - search: 검색어 + 좌표 기반 주소/장소 조회
 */
export const locationQueryKeys = {
    base: ["location"] as const,

    // 좌표 기반 행정구역 조회 키
    region: (lat: string, lng: string) =>
        [...locationQueryKeys.base, "region", lat, lng] as const,

    // 검색어 + 좌표 기반 주소검색 키
    search: (query: string, lat?: string, lng?: string) =>
        [...locationQueryKeys.base, "search", query, lat ?? null, lng ?? null] as const,
};

/**
 * 좌표 기반 행정구역 조회 Hook
 *
 * - 좌표(lat, lng) 기준 행정구역 정보 조회
 * - 결과 없음 → null 반환
 * - 네트워크/서버 오류 → React Query error 상태로 처리
 */
export function useRegionQuery(params: RegionFromCoordsParams) {
    const trimmedLat = params.lat.trim();
    const trimmedLng = params.lng.trim();

    return useQuery<LocationRegionResponse | null>({
        queryKey: locationQueryKeys.region(trimmedLat, trimmedLng),

        queryFn: () =>
            getRegionFromCoords({
                lat: trimmedLat,
                lng: trimmedLng,
            }),

        // 좌표 존재 시에만 요청
        enabled: Boolean(trimmedLat && trimmedLng),

        // 좌표에 대한 정보가 바뀔 일이 앱 사용시간 동안 없지 싶어서 무한으로..
        staleTime: Infinity,
    });
}

/**
 * 검색어 기반 주소/장소 조회 Hook
 *
 * - keyword 기준 주소/장소 목록 조회
 * - lat, lng 포함 시 거리(distance) 기준 정렬/계산
 * - 결과 없음 → 빈 배열([])
 * - 네트워크/서버 오류 → React Query error 상태로 처리
 */
export function useLocationSearchQuery(params: LocationsByKeywordParams) {
    const trimmedKeyword = params.keyword.trim();
    const trimmedLat = params.lat?.trim();
    const trimmedLng = params.lng?.trim();

    return useQuery<LocationSearchResponse[]>({
        queryKey: locationQueryKeys.search(
            trimmedKeyword,
            trimmedLat,
            trimmedLng,
        ),

        queryFn: () =>
            getLocationsByKeyword({
                keyword: trimmedKeyword,
                lat: trimmedLat,
                lng: trimmedLng,
            }),

        // 검색어 존재 시에만 요청 (좌표는 선택)
        enabled: Boolean(trimmedKeyword),

        // 1시간
        staleTime: 1000 * 60 * 60
    });
}