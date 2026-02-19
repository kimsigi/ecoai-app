import { Image, View } from "react-native";
import { styles } from "./splash.style";

export default function SplashView() {
    return (
      <View style={styles.container}>
        {/* 상단 영역 */}
        <View style={styles.top}>
          <Image
            resizeMode="contain"
            style={styles.imageLarge}
            source={require("@/shared/foundation/assets/image/PhoneTouchText.png")}
          />
        </View>

        {/* 중앙 영역 */}
        <View style={styles.center}>
          <Image
            resizeMode="contain"
            style={styles.imageXL}
            source={require("@/shared/foundation/assets/image/PhoneTouch.png")}
          />
        </View>

        {/* 하단 로고 영역 */}
        <View style={styles.bottom}>
          <Image
            resizeMode="contain"
            style={styles.imageLogo}
            source={require("@/shared/foundation/assets/image/KyolimsoftLogo.png")}
          />
        </View>
      </View>
    );
}
