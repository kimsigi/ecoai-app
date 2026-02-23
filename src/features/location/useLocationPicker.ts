import { useCallback, useEffect, useRef, useState } from 'react';
import { MapHandle } from '@/shared/sdk/map/kakao';
import { Coordinate, LocationCoordinate } from './location.type';
import {
    getCurrentPosition,
    getLocation,
    resolveRegion,
    saveLocation,
} from './location.service';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '@/app/app.type';
import { ROUTES } from '@/app/app.route';
import { FALLBACK } from '@/shared/core/config/env';

export function useLocationPicker(params: Partial<LocationCoordinate>) {
    const navigation =
        useNavigation<NativeStackNavigationProp<StackParamList>>();
    const mapRef = useRef<MapHandle>(null);
    const mountedRef = useRef(true);

    const [coordinate, setCoordinate] = useState<LocationCoordinate>(() => {
        // 1️. route param
        if (params?.lat && params?.lng) {
            return {
                lat: params.lat,
                lng: params.lng,
            };
        }

        // 2️. mmkv
        const saved = getLocation();
        if (saved?.lat && saved?.lng) {
            return {
                lat: saved.lat,
                lng: saved.lng,
                address: saved.address,
            };
        }

        // 3️. fallback
        return {
            lat: FALLBACK.MAP_LAT,
            lng: FALLBACK.MAP_LNG,
        };
    });

    useEffect(() => {
        // 1️. route param
        if (params?.lat && params?.lng) return;

        // 2️. mmkv
        const saved = getLocation();
        if (saved?.lat && saved?.lng) return;

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
                    address: response?.address_name,
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
    }, [params?.lat, params?.lng]);

    /* ---------------------------------
     * 주소 검색 이동
     * --------------------------------- */
    const goToAddressSearch = useCallback(() => {
        navigation.push(ROUTES.LOCATION_ADDRESS_SEARCH, {
            callback: (coord: LocationCoordinate) => {
                if (coord?.lat && coord?.lng) {
                    setCoordinate(coord);
                    mapRef.current?.moveTo(coord.lat, coord.lng);
                }
            },
        });
    }, [navigation]);

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

    /* ---------------------------------
     * 위치 확정
     * --------------------------------- */
    const confirmLocation = useCallback(async () => {
        try {
            const response = await resolveRegion({
                lat: coordinate.lat,
                lng: coordinate.lng,
            });

            const finalCoordinate: LocationCoordinate = {
                lat: coordinate.lat,
                lng: coordinate.lng,
                address: response?.address_name,
            };

            saveLocation(finalCoordinate);

            navigation.push(ROUTES.USER_TYPE);
        } catch (error) {
            console.warn('위치 확정 실패:', error);
        }
    }, [coordinate, navigation]);

    return {
        mapRef,
        coordinate,
        goToAddressSearch,
        handleCenterChange,
        confirmLocation,
    };
}
