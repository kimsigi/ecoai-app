import { ENV, FALLBACK } from '@/shared/core/config/env';

const jsKey = ENV.KAKAO_JAVASCRIPT_KEY;
const fallbackMapLat = FALLBACK.MAP_LAT;
const fallbackMapLng = FALLBACK.MAP_LNG;

export const createKakaoMapHtml = () => {
    return `
<!DOCTYPE html>
<html lang="ko">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>배출 위치 설정</title>
        
        <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${jsKey}"></script>
        
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body, html {
                width: 100%;
                height: 100%;
                overflow: hidden;
                background-color: #FFFFFF;
            }

            #kakaoMap {
                width: 100%;
                height: 100%;
                opacity: 1;
            }

            .psh-wrapper {
                position: absolute;
                top: -47px;
                left: -20px;
                width: 40px;
                height: 50px;
                display: flex;
                justify-content: center;
                align-items: flex-start;
            }

            .pin2 {
                position: absolute;
                top: 0;
                left: 50%;
                width: 30px;
                height: 30px;
                opacity: 0.7;
                background-color: #256EF4;
                border: 1px solid #000000;
                border-radius: 50% 50% 50% 0;
                transform: translateX(-50%) rotate(-45deg);
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
                //animation: bounce 150ms infinite ease-in-out;
            }

            .pin2::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 10px;
                height: 10px;
                background-color: #fff;
                border-radius: 50%;
            }

            .pin2::after {
                content: none;
            }

            .shadow {
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 10px;
                height: 5px;
                filter: blur(1px);
                background: rgba(0, 0, 0, 0.5);
                border-radius: 50%;
            }

            @keyframes bounce {
                0%, 100% {
                    top: 0;
                }
                50% {
                    top: -10px;
                }
                100% {
                    top: 0;
                }
            }

            /* 정적 마커 (애니메이션 없음) */
            .pin3 {
                position: absolute;
                top: 7px;
                left: 50%;
                width: 30px;
                height: 30px;
                background-color: #256EF4;
                border: 1px solid #000000;
                border-radius: 50% 50% 50% 0;
                transform: translateX(-50%) rotate(-45deg);
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
            }

            .pin3::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 10px;
                height: 10px;
                background-color: #fff;
                border-radius: 50%;
            }

            .shadow-stop {
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 10px;
                height: 5px;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 50%;
                filter: blur(1px);
                animation: shadowPulse 150ms infinite ease-in-out;
            }

            @keyframes shadowPulse {
                0%, 100% {
                    transform: translateX(-50%) scale(1.5);
                    opacity: 0.8;
                }
                50% {
                    transform: translateX(-50%) scale(0.7);
                    opacity: 0.4;
                }
            }

            .pin3::after {
                content: none;
            }

            /* 로딩바가 있는 마커 */
            .pin4 {
                position: absolute;
                top: -10px;
                left: 50%;
                width: 30px;
                height: 30px;
                background-color: #256EF4;
                border: 1px solid #000000;
                border-radius: 50% 50% 50% 0;
                transform: translateX(-50%) rotate(-45deg);
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
            }

            .pin4::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 10px;
                height: 10px;
                background-color: #fff;
                border-radius: 50%;
            }

            .pin4::after {
                content: none;
            }

            /* 로딩바 컨테이너 */
            .loading-bar {
                position: absolute;
                top: 30px;
                left: 50%;
                transform: translateX(-50%);
                width: 26px;
                height: 7px;
                border-radius: 5px;
                background-color: rgba(0, 0, 0, 1);
                overflow: hidden;
            }

            /* 로딩바 채우기 */
            .loading-bar-fill {
                width: 0;
                height: 100%;
                background-color: #00C853;
                animation: fillBar 150ms ease-in-out;
            }

            @keyframes fillBar {
                0% {
                    width: 0;
                }
                100% {
                    width: 100%;
                }
            }
        </style>
    </head>

    <body>
        <div id="kakaoMap"></div>

        <script>
            let loadingBarDelayTimer = null;
            let isMapReadySent = false;
            
            const container = document.getElementById('kakaoMap');
            
            const defaultOptions = {
                center: new kakao.maps.LatLng(${fallbackMapLat}, ${fallbackMapLng}), // fallback
                level: 5,
                minLevel: 1,
                maxLevel: 5,
            };
            
            const map = new kakao.maps.Map(container, defaultOptions);
            
            const overlayMarker1 = '<div class="psh-wrapper"><div class="pin3"></div><div class="shadow"></div></div>';
            const overlayMarker2 = '<div class="psh-wrapper"><div class="pin2"></div><div class="shadow-stop"></div></div>';
            const overlayLoadingMarker = '<div class="psh-wrapper"><div class="pin4"></div><div class="loading-bar"><div class="loading-bar-fill"></div></div><div class="shadow"></div></div>';

            const customMakerOverlay = new kakao.maps.CustomOverlay({
                position: defaultOptions.center,
                content: overlayMarker1,
                zIndex: 4,
                map: map
            });

            function mapDragHandler() {

                kakao.maps.event.addListener(map, 'dragstart', function () {

                    // 이전 타이머 취소
                    if (loadingBarDelayTimer) {
                        clearTimeout(loadingBarDelayTimer);
                        loadingBarDelayTimer = null;
                    };

                    const position = map.getCenter();
                    customMakerOverlay.setContent(overlayMarker2);
                    customMakerOverlay.setPosition(position);
                });

                kakao.maps.event.addListener(map, 'drag', function () {
                    const position = map.getCenter();
                    customMakerOverlay.setPosition(position);
                });

                kakao.maps.event.addListener(map, 'dragend', function () {
                    if (loadingBarDelayTimer) {
                        clearTimeout(loadingBarDelayTimer);
                        loadingBarDelayTimer = null;
                    };

                    const position = map?.getCenter();
                    if (!position) return;

                    const lat = position.getLat();
                    const lng = position.getLng();

                    customMakerOverlay.setPosition(position);
                    customMakerOverlay.setContent(overlayLoadingMarker);

                    loadingBarDelayTimer = setTimeout(function () {
                        html2App({
                            type: "MAP_DRAG_END",
                            latitude: lat,
                            longitude: lng
                        });

                        customMakerOverlay.setContent(overlayMarker1);
                        loadingBarDelayTimer = null;
                    }, 200);
                });
            };

            // HTML => React Native
            function html2App(param) {
                window.ReactNativeWebView.postMessage(JSON.stringify(param));
            };
            
            // React Native => HTML
            window.app2Html = function(param) {
                const parse2Json = JSON.parse(param);
                if ( parse2Json?.type === 'MAP_CENTER' ) {
                    const { lat, lng } = parse2Json.payload;
                    setMapCenter(lat, lng);
                }
            }   

            function setMapCenter(lat, lng) {
                if (map && lat && lng) {
                    const centerLatLng = new kakao.maps.LatLng(lat * 1, lng * 1);
                    map.setCenter(centerLatLng);
                    customMakerOverlay.setPosition(centerLatLng);
                    customMakerOverlay.setContent(overlayMarker1); //  overlayMarker1
                }
            };

            mapDragHandler();

            kakao.maps.event.addListener(map, 'tilesloaded', function () {
                if (isMapReadySent) return;
                isMapReadySent = true;

                html2App({ type: "MAP_READY" });
            });            
        </script>

    </body>
</html>
`;
};
