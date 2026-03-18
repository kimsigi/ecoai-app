import { useCallback, useEffect, useMemo, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    LocationAddressSearchDisplayText,
    LocationAddressSearchParams,
    LocationSearchResponse,
    ResultSection,
} from '../location.type';
import { LOCATION_SEARCH_TYPE } from '../location.constant';
import { getLocation } from '../location.service';
import { locationSearch } from '../location.api';
import { StackParamList } from '@/app/app.route';
import { FALLBACK } from '@/shared/core/config';

export function useLocationAddressSearch() {
    const navigation =
        useNavigation<NativeStackNavigationProp<StackParamList>>();
    const route = useRoute();
    const params = route.params as LocationAddressSearchParams | undefined;

    // initialQuery 우선 사용
    const initialQuery = params?.initialQuery ?? params?.addressName ?? '';

    const [query, setQuery] = useState(initialQuery);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<LocationSearchResponse[]>([]);

    // 기준 좌표 계산
    const baseCoord = useMemo(() => {
        const saved = getLocation();
        return {
            lat: saved?.y ?? FALLBACK.MAP_LAT,
            lng: saved?.x ?? FALLBACK.MAP_LNG,
        };
    }, []);

    // 검색 실행
    const runSearch = useCallback(
        async (keyword: string) => {
            const trimmed = keyword.trim();
            if (!trimmed) {
                setItems([]);
                return;
            }

            try {
                setLoading(true);
                const result = await locationSearch({
                    query: trimmed,
                    lat: baseCoord.lat,
                    lng: baseCoord.lng,
                });
                setItems(result ?? []);
            } catch (error) {
                console.warn('주소 검색 실패:', error);
                setItems([]);
            } finally {
                setLoading(false);
            }
        },
        [baseCoord.lat, baseCoord.lng],
    );

    // debounce 검색
    useEffect(() => {
        const timer = setTimeout(() => {
            runSearch(query);
        }, 250);
        return () => clearTimeout(timer);
    }, [query, runSearch]);

    // 섹션 가공
    const sections = useMemo<ResultSection[]>(() => {
        const addressItems = items.filter(
            item => item.type === LOCATION_SEARCH_TYPE.ADDRESS,
        );
        const placeItems = items.filter(
            item => item.type === LOCATION_SEARCH_TYPE.PLACE,
        );

        const next: ResultSection[] = [];
        if (addressItems.length > 0)
            next.push({ key: 'ADDRESS', data: addressItems });
        if (placeItems.length > 0)
            next.push({ key: 'PLACE', data: placeItems });
        return next;
    }, [items]);

    // 빈 상태 문구 계산
    const emptyText = useMemo(() => {
        return query.trim() ? '검색 결과가 없습니다.' : '주소를 입력해 주세요.';
    }, [query]);

    // 섹션 divider 노출 여부 계산
    const hasPlaceSection = useMemo(() => {
        return sections.some(
            section => section.key === LOCATION_SEARCH_TYPE.PLACE,
        );
    }, [sections]);

    const formatDistance = useCallback((distance?: number | null): string => {
        if (!distance || distance <= 0) return '';
        if (distance < 1000) return `${Math.round(distance)}m`;

        return `${(distance / 1000).toFixed(1)}km`;
    }, []);

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

    const getSmallLabel = useCallback(
        (item: LocationSearchResponse): string => {
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
                addressName:
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
        runSearch(query);
    }, [query, runSearch]);

    const onClear = useCallback(() => {
        setQuery('');
    }, []);

    return {
        query,
        setQuery,
        loading,
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
