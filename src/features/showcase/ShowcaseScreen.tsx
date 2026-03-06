import { ROUTES, StackParamList } from '@/app/app.route';
import { useAlert } from '@/shared/ui/component/alert';
import DefaultButton from '@/shared/ui/component/button/AppButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ShowcaseScreen() {
    const navigation =
        useNavigation<NativeStackNavigationProp<StackParamList>>();

    const { alert, confirm } = useAlert();

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={() => navigation.push(ROUTES.HOME)}
                >
                    <Text>홈</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={() => navigation.push(ROUTES.BOTTOMSHEET)}
                >
                    <Text>바텀시트</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={() => navigation.push(ROUTES.MENULAYEROVERLAY)}
                >
                    <Text>메뉴레이어(햄버거)</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={() => navigation.push(ROUTES.SAMPLEMAPOVERLAY)}
                >
                    <Text>맵오버레이</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={() => navigation.push(ROUTES.SUBITEM)}
                >
                    <Text>배출품목분류</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={() => navigation.push(ROUTES.SAMPLESCR1)}
                >
                    <Text>샘플1</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={() => navigation.push(ROUTES.SAMPLESCR2)}
                >
                    <Text>샘플2</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={() => navigation.push(ROUTES.SAMPLESCR3)}
                >
                    <Text>샘플3</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={() => navigation.push(ROUTES.SAMPLESCR4)}
                >
                    <Text>샘플4</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={() => navigation.push(ROUTES.SAMPLESCR5)}
                >
                    <Text>샘플5</Text>
                </TouchableOpacity>
            </View>



            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={() => navigation.push(ROUTES.LOCATION_PICKER)}
                >
                    <Text>위치선택</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={() => navigation.push(ROUTES.AI_CHAT)}
                >
                    <Text>AI 도우미</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={() => navigation.push(ROUTES.PERMISSION)}
                >
                    <Text>퍼미션</Text>
                </TouchableOpacity>
            </View>
            
            {/* 카메라 캡쳐 */}
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={() => navigation.push(ROUTES.CAMERA_CAPTURE)}
                >
                    <Text>카메라 캡쳐</Text>
                </TouchableOpacity>
            </View>

            {/* 👇 구분선 추가 */}
            <View style={styles.separator} />
            <View>
                <Text>######## 아래부터는 컴포넌트 테스트 영역 ########</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.buttonWrapper}>
                <DefaultButton
                    onPress={() => Alert.alert('테스트', '테스트22')}
                >
                    Alert.alert
                </DefaultButton>
            </View>
            <View style={styles.buttonWrapper}>
                <DefaultButton
                    onPress={() => {
                        alert('저장되었습니다', () => {
                            console.log('확인');
                        });
                        console.log('##얼럿아래');
                        return;
                        console.log('##얼럿아래2');
                    }}
                >
                    Paper Alert
                </DefaultButton>
            </View>
            <View style={styles.buttonWrapper}>
                <DefaultButton
                    onPress={() => {
                        confirm({
                            title: '삭제',
                            message: '정말 삭제하시겠습니까?',
                            onConfirm: () => {
                                console.log('삭제');
                            },
                            onCancel: () => {
                                console.log('취소');
                            },
                        });
                        console.log('##컨펌아래');
                        return;
                        console.log('##컨펌아래2');
                    }}
                >
                    Paper Confirm
                </DefaultButton>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40, // 상하 여유 공간
    },
    buttonWrapper: {
        marginBottom: 16,
        width: '90%', // 너비를 조금 더 넓게 (현대적 트렌드)
        maxWidth: 400, // 너무 커지지 않게 제한
    },
    button: {
        backgroundColor: '#4A90E2', // 신뢰감을 주는 블루
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12, // 부드러운 라운드값
        alignItems: 'center',
        justifyContent: 'center',
        // iOS 그림자
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        // Android 그림자
        elevation: 3,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: -0.5, // 자간을 살짝 좁혀서 가독성 향상
    },
    separator: {
        width: '90%', // 버튼 너비와 맞춤
        maxWidth: 400,
        height: 1, // 선 두께
        backgroundColor: '#E1E1E1', // 선 색상 (연한 회색)
        marginVertical: 24, // 선 위아래 간격 (버튼 사이 거리를 벌려줌)
    },
});
