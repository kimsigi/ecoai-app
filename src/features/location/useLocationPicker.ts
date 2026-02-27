import { useCallback, useEffect, useRef, useState } from 'react';
import { MapHandle } from '@/shared/sdk/map/kakao';
import { Coordinate, LocationCoordinate } from './location.type';
import {
    getCurrentPosition,
    getLocation,
    resolveRegion,
    setLocation,
} from './location.service';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ROUTES, StackParamList } from '@/app/app.route';
import { FALLBACK } from '@/shared/core/config';

export function useLocationPicker() {
    const route = useRoute();
    const routeParams = route.params as Partial<LocationCoordinate>;
    const navigation =
        useNavigation<NativeStackNavigationProp<StackParamList>>();
    const mapRef = useRef<MapHandle>(null);
    const mountedRef = useRef(true);

    const [coordinate, setCoordinate] = useState<LocationCoordinate>(() => {
        // 1️. route param
        if (routeParams?.lat && routeParams?.lng) {
            return {
                lat: routeParams.lat,
                lng: routeParams.lng,
            };
        }

        // 2️. mmkv
        const saved = getLocation();
        if (saved?.x && saved?.y) {
            return {
                lat: saved.y,
                lng: saved.x,
                addressName: saved.addressName,
            };
        }

        // 3️. fallback
        return {
            lat: FALLBACK.MAP_LAT,
            lng: FALLBACK.MAP_LNG,
        };
    });

    const [isResolvingAddress, setIsResolvingAddress] = useState(false);
    const skipNextResolveRef = useRef(false);

    useEffect(() => {
        // 1️. route param
        if (routeParams?.lat && routeParams?.lng) return;

        // 2️. mmkv
        const saved = getLocation();
        if (saved?.x && saved?.y) return;

        mountedRef.current = true;

        const run = async () => {
            try {
                const gps = await getCurrentPosition();
                if (!mountedRef.current) return;

                const response = await resolveRegion({
                    lat: gps.lat,
                    lng: gps.lng,
                });

                if (!mountedRef.current) return;

                setCoordinate({
                    lat: gps.lat,
                    lng: gps.lng,
                    addressName: response?.addressName,
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

    /* ---------------------------------
     * 주소 검색 이동
     * --------------------------------- */
    const goToAddressSearch = useCallback(() => {
        navigation.push(ROUTES.LOCATION_ADDRESS_SEARCH, {
            addressName: coordinate.addressName ?? '',
            callback: (coord: LocationCoordinate) => {
                if (coord?.lat && coord?.lng) {
                    skipNextResolveRef.current = true; // 검색 선택값 우선
                    setCoordinate(coord);
                    mapRef.current?.moveTo(coord.lat, coord.lng);
                }
            },
        });
    }, [navigation, coordinate.addressName]);

    /* ---------------------------------
     * 지도 중심 변경
     * --------------------------------- */
    const handleCenterChange = useCallback(({ lat, lng }: Coordinate) => {
        setCoordinate(prev => ({
            ...prev,
            lat,
            lng,
        }));
    }, []);

    useEffect(() => {
        if (!coordinate.lat || !coordinate.lng) return;

        if (skipNextResolveRef.current) {
            skipNextResolveRef.current = false;
            return; // 이번 1회는 resolveRegion 생략
        }

        let cancelled = false;
        setIsResolvingAddress(true);

        const timer = setTimeout(async () => {
            try {
                const response = await resolveRegion({
                    lat: coordinate.lat,
                    lng: coordinate.lng,
                });

                if (cancelled) return;

                setCoordinate(prev => ({
                    ...prev,
                    addressName: response?.addressName ?? '',
                }));
            } catch (e) {
                if (!cancelled) {
                    console.warn('resolveRegion 실패:', e);
                }
            } finally {
                if (!cancelled) {
                    setIsResolvingAddress(false);
                }
            }
        }, 200);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [coordinate.lat, coordinate.lng]);

    /* ---------------------------------
     * 위치 확정
     * --------------------------------- */
    const confirmLocation = useCallback(async () => {
        try {
            setIsResolvingAddress(true);
            const response = await resolveRegion({
                lat: coordinate.lat,
                lng: coordinate.lng,
            });
            setLocation({
                y: coordinate.lat,
                x: coordinate.lng,
                addressName: coordinate.addressName,
            });

            navigation.push(ROUTES.USER_TYPE);
        } catch (error) {
            console.warn('위치 확정 실패:', error);
        } finally {
            setIsResolvingAddress(false);
        }
    }, [coordinate, navigation]);

    return {
        mapRef,
        coordinate,
        goToAddressSearch,
        handleCenterChange,
        confirmLocation,
        isResolvingAddress,
    };
}
