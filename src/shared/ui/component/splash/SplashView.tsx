import { Image, Text, View } from "react-native";
import { styles } from "./splash.style";
import { AppIcon } from "../icon";

export default function SplashView() {
    return (
      <View style={styles.container}>
        {/* 상단 영역 */}
        <View style={styles.top}>
            <Text style={styles.titleSmall}>내 손안의 AI</Text>
            <Text style={styles.titleSmall}>폐기물</Text>
            <Text style={styles.titleLarge}>처리 도우미</Text>
        </View>
        
        {/* 중앙 영역 */}
        <View style={styles.center}>
            <AppIcon name="logo" width={320} height={366} />
        </View>

        {/* 하단 로고 영역 */}
        <View style={styles.bottom}>
            <AppIcon name="kyolimsoftCI" size={63}/>
        </View>
      </View>
    );
}
