import { View, TouchableOpacity } from 'react-native';
import { locationPickerStyles as styles} from '../location.style';
import { useLocationPicker } from '../hook/useLocationPicker';
import { PageLayout } from '@/shared/ui/component/layout';
import { KakaoMap } from '@/shared/sdk/map/kakao';
import { AppText } from '@/shared/ui/component/text';
import { HeaderInputDefault } from '@/shared/ui/component/header';

export default function LocationPickerScreen() {
    
    const {
        mapRef,
        queryFetching,
        locationCoordinate,
        locationName,
        goToAddressSearch,
        handleCenterChange,
        confirmLocation,
    } = useLocationPicker();

    return (
        <PageLayout
            useHeaderOffset={false}
            useStatusBarOffset={false}
            customHeader= {
                <View style={styles.customHeader}>
                    <HeaderInputDefault
                        mode="trigger"
                        value={locationName ?? ""}
                        placeholder="검색할 주소를 입력하세요."
                        onPressField={goToAddressSearch}
                    />
                </View>
            }
        >
            <View style={styles.contentContainer}>

                {/* 지도 */}
                <KakaoMap
                    ref={mapRef}
                    lat={locationCoordinate.lat}
                    lng={locationCoordinate.lng}
                    onCenterChange={handleCenterChange}
                />
               
                {/* 하단 버튼 */}
                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={[
                            styles.bottomConfirmButton,
                            (confirmLocation.disabled || queryFetching || !locationName) && {
                                opacity: 0.8,
                            },
                        ]}
                        onPress={confirmLocation.onPress}
                        disabled={confirmLocation.disabled || queryFetching || !locationName}
                    >
                        <AppText style={styles.bottomConfirmText}>
                            {
                                confirmLocation.pending || queryFetching 
                                ?
                                '주소 확인 중...' 
                                : 
                                '이 위치로 설정'    
                            }
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </PageLayout>
    );
}