import { View, Text, TouchableOpacity } from 'react-native';
import { KakaoMap } from '@/shared/sdk/map/kakao';
import { styles } from '../location.style';
import { useLocationPicker } from '../useLocationPicker';
import SearchNavHeader from '@/shared/ui/component/header/SearchNavHeader';

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
        <View style={styles.container}>
            {/* 지도 */}
            <KakaoMap
                ref={mapRef}
                lat={coordinate.lat}
                lng={coordinate.lng}
                onCenterChange={handleCenterChange}
            />
            
            {/* 상단 검색바 */}
            <View style={styles.topContainer}>
                <SearchNavHeader
                    showBack={false}
                    mode="trigger"
                    value={coordinate.addressName ?? ""}
                    placeholder="검색할 주소를 입력하세요"
                    onBackPress={() => {/* 필요 시 뒤로가기 */}}
                    onPressField={goToAddressSearch}
                />
            </View>

            {/* 하단 버튼 */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={[
                        styles.confirmButton,
                        isResolvingAddress && { opacity: 0.8 },
                    ]}
                    onPress={confirmLocation}
                    disabled={isResolvingAddress}
                >
                    <Text style={styles.confirmText}>
                        {isResolvingAddress ? '주소 확인 중...' : '이 위치로 설정'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}