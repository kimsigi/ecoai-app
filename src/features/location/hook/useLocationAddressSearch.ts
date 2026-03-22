import { useCallback, useEffect, useMemo, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    LocationAddressSearchDisplayText,
    LocationAddressSearchParam,
    LocationSearchResponse,
    ResultSection,
} from '../location.type';
import { LOCATION_SEARCH_TYPE } from '../location.constant';
import { getLocation } from '../location.service';
import { StackParamList } from '@/app/app.route';
import { FALLBACK } from '@/shared/core/config';
import { useLocationSearchQuery } from '../location.queries';

export function useLocationAddressSearch() {
    const navigation =
        useNavigation<NativeStackNavigationProp<StackParamList>>();
    const route = useRoute();
    const params = route.params as LocationAddressSearchParam | undefined;

    const initialQuery = params?.initialQuery ?? params?.locationName ?? '';
    
    const [query, setQuery] = useState(initialQuery);

    // React Query 호출용 debounced keyword 분리
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

    // 기준 좌표 계산
    const baseCoordinate = useMemo(() => {
        const savedLocation = getLocation();
        return {
            lat: savedLocation?.y ?? FALLBACK.MAP_LAT,
            lng: savedLocation?.x ?? FALLBACK.MAP_LNG,
        };
    }, []);

    // debounce 후에만 실제 검색 query 실행
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query.trim());
        }, 250);

        return () => clearTimeout(timer);
    }, [query]);

    // 변경사항: 직접 API 호출 대신 React Query 사용
    const {data: items = [], isFetching} = useLocationSearchQuery({
        keyword: debouncedQuery,
        lat: baseCoordinate.lat,
        lng: baseCoordinate.lng,
    });

    // 섹션 가공
    const sections = useMemo<ResultSection[]>(() => {
        const addressItems = items.filter(
            item => item.type === LOCATION_SEARCH_TYPE.ADDRESS,
        );
        const placeItems = items.filter(
            item => item.type === LOCATION_SEARCH_TYPE.PLACE,
        );

        const next: ResultSection[] = [];

        if (addressItems.length > 0) {
            next.push({
                key: LOCATION_SEARCH_TYPE.ADDRESS,
                data: addressItems,
            });
        }

        if (placeItems.length > 0) {
            next.push({
                key: LOCATION_SEARCH_TYPE.PLACE,
                data: placeItems,
            });
        }

        return next;
    }, [items]);

    // 빈 상태 문구 계산
    const emptyText = useMemo(() => {
        return query.trim()
            ? '검색 결과가 없습니다.'
            : '주소를 입력해 주세요.';
    }, [query]);

    // 섹션 divider 노출 여부 계산
    const hasPlaceSection = useMemo(() => {
        return sections.some(
            section => section.key === LOCATION_SEARCH_TYPE.PLACE,
        );
    }, [sections]);

    // 거리 표시
    const formatDistance = useCallback((distance?: number | null): string => {
        if (!distance || distance <= 0) return '';
        if (distance < 1000) return `${Math.round(distance)}m`;

        return `${(distance / 1000).toFixed(1)}km`;
    }, []);

    // 마지막 카테고리 추출
    const getLastCategoryDepth = useCallback(
        (categoryName?: string | null): string => {
            if (!categoryName) return '';

            const parts = categoryName
                .split('>')
                .map(value => value.trim())
                .filter(Boolean);

            return parts[parts.length - 1] ?? '';
        },
        [],
    );

    const getMainTitle = useCallback((item: LocationSearchResponse): string => {
        if (item.type === LOCATION_SEARCH_TYPE.ADDRESS) {
            return item.roadAddressName || item.addressName || '';
        }

        return item.placeName || item.roadAddressName || item.addressName || '';
    }, []);

    const getSmallLabel = useCallback((item: LocationSearchResponse): string => {
        if (item.type === LOCATION_SEARCH_TYPE.ADDRESS) return '도로명';
            return getLastCategoryDepth(item.categoryName);
        },
        [getLastCategoryDepth],
    );

    const getDisplayText = useCallback(
        (item: LocationSearchResponse): LocationAddressSearchDisplayText => {
            const mainTitle = getMainTitle(item);
            const smallLabel = getSmallLabel(item);

            const subText =
                item.type === LOCATION_SEARCH_TYPE.PLACE
                    ? [
                          formatDistance(item.distance),
                          item.roadAddressName || item.addressName,
                      ]
                          .filter(Boolean)
                          .join(' · ')
                    : item.addressName;

            return {
                mainTitle,
                smallLabel,
                subText,
            };
        },
        [formatDistance, getMainTitle, getSmallLabel],
    );

    const onSelect = useCallback(
        (item: LocationSearchResponse) => {
            params?.callback?.({
                lat: item.y,
                lng: item.x,
                locationName:
                    item.type === LOCATION_SEARCH_TYPE.ADDRESS
                        ? item.roadAddressName || item.addressName
                        : item.placeName ||
                          item.roadAddressName ||
                          item.addressName,
            });
            
            navigation.goBack();
        },
        [navigation, params],
    );

    const onBackPress = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const onSubmit = useCallback(() => {
        // submit 시 debounce 대기 없이 즉시 검색 반영
        setDebouncedQuery(query.trim());
    }, [query]);

    const onClear = useCallback(() => {
        setQuery('');
        setDebouncedQuery('');
    }, []);

    return {
        query,
        setQuery,
        isFetching,
        sections,
        emptyText,
        hasPlaceSection,
        onBackPress,
        onSubmit,
        onClear,
        onSelect,
        getDisplayText,
    };
}
