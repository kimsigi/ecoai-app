import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Coordinate, LocationCoordinate, LocationPickerParam } from '../location.type';
import {
    getCurrentPosition,
    getLocation,
    setLocation,
} from '../location.service';
import { useRegionQuery } from '../location.queries';
import { ROUTES, StackParamList } from '@/app/app.route';
import { MapHandle } from '@/shared/sdk/map/kakao';
import { FALLBACK } from '@/shared/core/config';
import { useActionGuard } from '@/shared/core/action/useActionGuard';

// 현재 화면 좌표와 query 좌표가 같은지 비교
function isSameCoordinate(a: Coordinate, b: Coordinate) {
    return a.lat === b.lat && a.lng === b.lng;
}

export function useLocationPicker() {
    const route = useRoute();
    const routeParams = route.params as Partial<LocationPickerParam>;
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    const actionGuard = useActionGuard();

    const mapRef = useRef<MapHandle>(null);
    const mountedRef = useRef(true);

    // 검색 화면에서 좌표를 선택해 돌아온 직후에는
    // query 결과로 locationName을 다시 덮지 않도록 1회 skip
    const skipNextResolveRef = useRef(false);

    // 초기 좌표 결정
    // route param -> 저장값 -> fallback 순서
    const [locationCoordinate, setLocationCoordinate] = useState<LocationCoordinate>(() => {
        // 1️. route param
        if (routeParams?.lat != null && routeParams?.lng != null) {
            return {
                lat: routeParams.lat,
                lng: routeParams.lng,
                locationName: routeParams.locationName,
            };
        }

        // 2️. mmkv
        const savedLocation = getLocation();
        if (savedLocation?.x && savedLocation?.y) {
            return {
                lat: savedLocation.y,
                lng: savedLocation.x,
                locationName: savedLocation.locationName ?? savedLocation.addressName ?? '',
            };
        }
        // 3️. fallback
        return {
            lat: FALLBACK.MAP_LAT,
            lng: FALLBACK.MAP_LNG,
        };
    });

    // React Query 요청용 좌표
    // 지도는 자주 움직이므로, 별도 상태로 분리해서 디바운스 적용
    const [queryCoordinate, setQueryCoordinate] = useState(() => ({
        lat: locationCoordinate.lat,
        lng: locationCoordinate.lng,
    }));

    // 지도 중심이 계속 바뀌더라도 잠깐 멈췄을 때만 주소 조회
    useEffect(() => {
        if (!locationCoordinate.lat || !locationCoordinate.lng) return;

        const timer = setTimeout(() => {
            setQueryCoordinate({
                lat: locationCoordinate.lat,
                lng: locationCoordinate.lng,
            });
        }, 250);

        return () => clearTimeout(timer);
    }, [locationCoordinate.lat, locationCoordinate.lng]);


    // 좌표 -> 주소명 해석은 React Query가 전담
    const { data: queryResult, isFetching: queryFetching } = useRegionQuery({
        lat: queryCoordinate.lat,
        lng: queryCoordinate.lng,
    });

    // debounce 대기 중인지까지 포함해서 "현재 좌표 기준 조회 중" 상태 계산
    const isCurrentCoordinateResolved = isSameCoordinate(
        locationCoordinate,
        queryCoordinate,
    );

    // debounce 대기 시간도 fetching 상태로 간주해서 버튼 오작동 방지
    const isFetching = !isCurrentCoordinateResolved || queryFetching;
    
    // 최초 진입 시 route param도 없고 저장값도 없으면 GPS로 초기 위치 설정
    useEffect(() => {
        // 1️. route param
        if (routeParams?.lat != null && routeParams?.lng != null) return;

        // 2️. mmkv
        const savedLocation = getLocation();
        if (savedLocation?.x && savedLocation?.y) return;

        mountedRef.current = true;

        const run = async () => {
            try {

                const gps = await getCurrentPosition();
                if (!mountedRef.current) return;

                setLocationCoordinate({
                    lat: gps.lat,
                    lng: gps.lng,
                    locationName: '',
                });

                mapRef.current?.moveTo(gps.lat, gps.lng);
            } catch (error) {
                console.warn('GPS 초기화 실패:', error);
            }
        };

        run();

        return () => {
            mountedRef.current = false;
        };
    }, [routeParams?.lat, routeParams?.lng]);

    // 현재 화면 좌표에 대한 query 결과일 때만 주소명 반영
    useEffect(() => {
        if (!queryResult) return;
        if (!isCurrentCoordinateResolved) return;

        if (skipNextResolveRef.current) {
            skipNextResolveRef.current = false;
            return;
        }

        setLocationCoordinate(prev => ({
            ...prev,
            // 이미 대표 locationName 이 있으면 유지하고, 없을 때만 addressName 사용
            locationName: prev.locationName || queryResult.addressName || '',
        }));
    }, [queryResult, isCurrentCoordinateResolved]);

    // 주소 검색 화면 이동
    const goToAddressSearch = useCallback(() => {
        navigation.push(ROUTES.LOCATION_ADDRESS_SEARCH, {
            locationName: locationCoordinate.locationName ?? '',
            callback: (param: LocationPickerParam) => {
                if (param?.lat && param?.lng) {
                    
                     // 검색 결과로 직접 선택한 주소는 우선 반영
                    skipNextResolveRef.current = true;

                    setLocationCoordinate({
                        lat: param.lat,
                        lng: param.lng,
                        // 검색 결과에서 고른 이름 유지
                        locationName: param.locationName ?? '',
                    });

                    // 검색 결과로 직접 선택한 경우에는 debounce 없이 즉시 query 좌표도 반영
                    setQueryCoordinate({
                        lat: param.lat,
                        lng: param.lng,
                    });

                    mapRef.current?.moveTo(param.lat, param.lng);
                }
            },
        });
    }, [navigation, locationCoordinate.locationName]);

    // 지도 중심 변경 시 좌표만 갱신
    // 주소명은 React Query 결과로 다시 채워지게 둠
    const handleCenterChange = useCallback(({ lat, lng }: Coordinate) => {
        setLocationCoordinate({
            lat: lat,
            lng: lng,
            locationName: '',
        });
    }, []);

    // 위치 확정
    // 이미 조회된 region 데이터를 이용해 행정동 코드까지 함께 저장
    const confirmLocation = actionGuard.action(
        () => {
            // 현재 좌표 기준 query가 아직 완료되지 않았으면 저장하지 않음
            if (!isCurrentCoordinateResolved || !queryResult?.code) {
                console.warn('현재 좌표에 대한 주소 정보가 아직 준비되지 않았습니다.');
                return;
            }

            setLocation({
                y: locationCoordinate.lat,
                x: locationCoordinate.lng,
                locationName: locationCoordinate.locationName ?? queryResult.addressName ?? '',
                addressName: queryResult.addressName ?? '',
                region1DepthName: queryResult.region1DepthName ?? '',
                region2DepthName: queryResult.region2DepthName ?? '',
                region3DepthName: queryResult.region3DepthName ?? '',
                code: queryResult.code,
            });

            navigation.push(ROUTES.HOME);
        },
        {
            key: 'confirm-location',
            withState: true,
        },
    );

    return {
        mapRef,
        queryFetching,
        locationCoordinate,
        locationName: locationCoordinate.locationName ?? (isCurrentCoordinateResolved ? queryResult?.addressName ?? '' : ''),
        goToAddressSearch,
        handleCenterChange,
        confirmLocation,
    };
}
