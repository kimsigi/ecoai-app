import { MAIN_ROUTES } from "@/app/app.route";
import { MainStackParamList } from "@/app/app.type";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ShowcaseScreen() {
    
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity 
                  style={styles.button} 
                  activeOpacity={0.7}
                  onPress={() => navigation.push(MAIN_ROUTES.LOCATION_PICKER)}>
                    <Text>위치선택</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity 
                  style={styles.button} 
                  activeOpacity={0.7}
                  onPress={() => navigation.push(MAIN_ROUTES.AI_CHAT)}>
                    <Text>AI 도우미</Text>
                </TouchableOpacity>
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
});