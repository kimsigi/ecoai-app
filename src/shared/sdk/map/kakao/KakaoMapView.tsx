import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { createKakaoMapHtml } from './kakaoMapHtml';

export interface Coordinate {
    lat: string;
    lng: string;
}

interface MapViewProps extends Coordinate {
    onCenterChange?: (coordinate: Coordinate) => void;
}

export interface MapHandle {
    moveTo: (lat: string, lng: string) => void;
}

const KakaoMapView = forwardRef<MapHandle, MapViewProps>(
    ({ lat, lng, onCenterChange }, ref) => {
        const webViewRef = useRef<WebView>(null);
        const isMapReadyRef = useRef(false);

        /**
         * HTML은 절대 재생성되면 안 됨
         */
        const html = useMemo(() => createKakaoMapHtml(), []);

        /**
         * RN -> HTML center 이동
         */
        const moveTo = useCallback((lat: string, lng: string) => {
            if (!isMapReadyRef.current) return;

            const payload = {
                type: 'MAP_CENTER',
                payload: { lat, lng },
            };

            webViewRef.current?.injectJavaScript(`
                window.app2Html('${JSON.stringify(payload)}');
                true;
            `);
        }, []);

        /**
         * 외부에서 ref로 제어 가능하게 노출
         */
        useImperativeHandle(ref, () => ({
            moveTo,
        }));

        /**
         * HTML -> RN 메시지 처리
         */
        const handleMessage = useCallback(
            (event: WebViewMessageEvent) => {
                try {
                    const data = JSON.parse(event.nativeEvent.data);
                    switch (data.type) {
                        case 'MAP_READY':
                            isMapReadyRef.current = true;

                            // 최초 center 세팅
                            moveTo(lat, lng);
                            break;

                        case 'MAP_DRAG_END':
                            onCenterChange?.({
                                lat: data?.latitude?.toString() ?? '',
                                lng: data?.longitude?.toString() ?? '',
                            });
                            break;
                    }
                } catch (e) {
                    console.warn('KakaoMap message parse error:', e);
                }
            },
            [lat, lng, moveTo, onCenterChange],
        );

        return (
            <WebView
                ref={webViewRef}
                originWhitelist={['*']}
                source={{ html }}
                onMessage={handleMessage}
                javaScriptEnabled
                domStorageEnabled
                mixedContentMode="always"
            />
        );
    },
);

export default KakaoMapView;
