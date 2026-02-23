import { View, Text, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { KakaoMap } from '@/shared/sdk/map/kakao';
import { LocationCoordinate } from '../location.type';
import { styles } from '../location.style';
import { useLocationPicker } from '../useLocationPicker';

export default function LocationPickerScreen() {
    const route = useRoute();
    const params = route.params as Partial<LocationCoordinate>;

    const {
        mapRef,
        coordinate,
        goToAddressSearch,
        handleCenterChange,
        confirmLocation,
    } = useLocationPicker({
        lat: params?.lat,
        lng: params?.lng,
    });

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
                <TouchableOpacity
                    style={styles.searchBar}
                    onPress={goToAddressSearch}
                >
                    <Text style={styles.searchText}>주소를 검색하세요</Text>
                </TouchableOpacity>
            </View>

            {/* 하단 버튼 */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={confirmLocation}
                >
                    <Text style={styles.confirmText}>이 위치로 설정</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
