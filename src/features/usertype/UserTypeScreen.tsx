import {
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { styles } from './usertype.style';
import { useUserType } from './useUserType';

export default function UserTypeScreen() {
    const { selectedType, handleSelect } = useUserType();
    const { width } = useWindowDimensions();

    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <View style={styles.container}>
                {/* 안내 문구 */}
                <Text style={styles.description}>
                    배출자 유형을 선택해주세요.
                </Text>

                {/* 버튼 영역 */}
                <View style={[styles.buttonWrapper, { width: width * 0.85 }]}>
                    {/* 개인 */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleSelect('PERSONAL')}
                        style={[
                            styles.button,
                            selectedType === 'PERSONAL'
                                ? styles.buttonActive
                                : styles.buttonInactive,
                        ]}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                selectedType === 'PERSONAL'
                                    ? styles.buttonTextActive
                                    : styles.buttonTextInactive,
                            ]}
                        >
                            개인
                        </Text>
                    </TouchableOpacity>

                    {/* 사업자 */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleSelect('BUSINESS')}
                        style={[
                            styles.button,
                            selectedType === 'BUSINESS'
                                ? styles.buttonActive
                                : styles.buttonInactive,
                        ]}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                selectedType === 'BUSINESS'
                                    ? styles.buttonTextActive
                                    : styles.buttonTextInactive,
                            ]}
                        >
                            사업자
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
