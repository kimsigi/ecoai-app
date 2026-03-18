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
        coordinate,
        goToAddressSearch,
        handleCenterChange,
        confirmLocation,
        isResolvingAddress,
    } = useLocationPicker();

    return (
        <PageLayout
            useHeaderOffset={false}
            useStatusBarOffset={false}
            customHeader= {
                <View style={styles.customHeader}>
                    <HeaderInputDefault
                        mode="trigger"
                        value={coordinate.addressName ?? ""}
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
                    lat={coordinate.lat}
                    lng={coordinate.lng}
                    onCenterChange={handleCenterChange}
                />
               
                {/* 하단 버튼 */}
                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={[
                            styles.bottomConfirmButton,
                            isResolvingAddress && { opacity: 0.8 },
                        ]}
                        onPress={confirmLocation}
                        disabled={isResolvingAddress}
                    >
                        <AppText style={styles.bottomConfirmText}>
                            {isResolvingAddress ? '주소 확인 중...' : '이 위치로 설정'}
                        </AppText>
                    </TouchableOpacity>
                </View>
                
                {/* 상단 검색 영역 */}
                
            </View>
        </PageLayout>
    );
}