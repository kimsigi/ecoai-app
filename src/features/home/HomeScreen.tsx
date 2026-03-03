import React, { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ROUTES, StackParamList } from "@/app/app.route";
import { PageLayout } from "@/shared/ui/component/layout";
import ICON_NotificationDefault from "@/shared/ui/assets/icon/notification-default.svg";
import ICON_NotificationActive from "@/shared/ui/assets/icon/notification-active.svg";
import ICON_Search from "@/shared/ui/assets/icon/search.svg";
import ICON_WINKING_FACE from "@/shared/ui/assets/icon/winking-face.svg";

import MenuIcon from "@/shared/ui/assets/icon/menu.svg";
import CameraEntryIcon from "@/shared/ui/assets/icon/camera-entry.svg";
import GovSymbol from "@/shared/ui/assets/icon/gov-symbol.svg";
import KecoSymbol from "@/shared/ui/assets/icon/keco-symbol.svg";
import KyolimSymbol from "@/shared/ui/assets/icon/kyolim-symbol.svg";

import { Color } from "@/shared/ui/assets/style/color";

export function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
    const [notification, setNotification] = useState(true);

    const handleNotificationPress = () => {
        if (notification) {
            Alert.alert("### 공지있음!");
        } else {
            Alert.alert("### 공지없음!");
        }
        setNotification((prev) => !prev);
    };

    const handleMenuPress = () => {
        Alert.alert("햄버거클릭!");
    };

    const takePhoto = () => {
        navigation.push(ROUTES.CAMERA_CAPTURE);
    }

  return (
    <PageLayout
        statusBarAreaStyle={styles.statusBarArea}
        headerContainerStyle={styles.headerContainer}
        contentContainerStyle={styles.contentContainer}
        statusBarStyle="light-content"
        rightItems={[
            {
                key: "notification",
                icon: notification ? (
                    <ICON_NotificationActive width={24} height={24} />
                ) : (
                    <ICON_NotificationDefault width={24} height={24} />
                ),
                onPress: handleNotificationPress,
            },
            {
                key: "menu",
                icon: <MenuIcon width={24} height={24} />,
                onPress: handleMenuPress,
            },
        ]}
    >
        <View style={styles.screen}>
            <Pressable style={styles.searchButton}>
                <View>
                    <ICON_Search width={24} height={24} />
                </View>
                
                <Text style={styles.searchPlaceholder}>AI에게 궁금한 폐기물을 물어보세요.</Text>
                
                <View style={styles.winkingIconFix}>
                    <ICON_WINKING_FACE width={24} height={24} />
                </View>
            </Pressable>

            <View style={styles.heroTitleBox}>
                <Text style={styles.heroTitleLine1}>Eco-I</Text>
                <Text style={styles.heroTitleLine2}>AI로 쉬워지는</Text>
                <Text style={styles.heroTitleLine3}>폐기물 배출</Text>
            </View>

            <View style={styles.area1Wrap}>
                <Image
                    source={require("@/shared/ui/assets/image/home-ax.png")}
                    style={styles.area1Image}
                    resizeMode="cover"
                />
            </View>
            
            <View style={styles.infoCard}>
                <Text style={styles.mainCopy}>
                    가장 똑똑한 자원순환의 시작.{"\n"}
                    복잡한 분리배출 가이드,{"\n"}
                    이제 AI 에코이와 함께 스마트하게 실천하세요.
                </Text>

                <Pressable style={styles.ctaCircle} onPress={takePhoto}>
                    <CameraEntryIcon width={60} height={60} />
                </Pressable>

                <Text style={styles.ctaLabel}>
                찰칵! <Text style={styles.ctaLabelSub}>AI가 알려드려요.</Text>
                </Text>

                <View style={styles.partnerRow}>
                    <GovSymbol style={styles.partnerLogo} />
                    <KecoSymbol style={styles.partnerLogo} />
                    <KyolimSymbol style={styles.partnerLogo} />
                </View>

            </View>
        </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
    statusBarArea: {
        backgroundColor: Color.Home.background,
    },
    headerContainer: {
        backgroundColor: Color.Home.background,
    },
    contentContainer: {
        backgroundColor: Color.Home.background,
    },

    screen: {
        flex: 1, // [수정]
    },

    searchButton: {
        flexDirection: "row",
        marginTop: 20,
        marginHorizontal: 20,
        height: 48,
        borderRadius: 20,
        backgroundColor: Color.Home.Search.background,
        borderWidth: 1,
        borderColor: Color.Home.Search.border,
        alignItems: "center",
        paddingHorizontal: 20,
        gap: 8,
    },

    winkingIconFix: { // [추가]
        transform: [{ translateY: -4 }],
    },
  
    searchPlaceholder: {
        flex: 1,
        fontSize: 14,
        color: "#4B5563",
    },

    heroTitleBox: {
        marginTop: 47,
        width: 200,
        minHeight: 106, // [추가]
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
    },

    heroTitleLine1: {
        fontFamily: "Pretendard-SemiBold",
        fontSize: 32,
        lineHeight: 38,
        color: "#FFFFFF",
        textAlign: "center",
        includeFontPadding: false,
    },

    heroTitleLine2: {
        fontFamily: "Pretendard-SemiBold",
        fontSize: 32,
        lineHeight: 38,
        color: "#FFFFFF",
        textAlign: "center",
        includeFontPadding: false,
    },

    heroTitleLine3: {
        fontFamily: "Pretendard-SemiBold",
        fontSize: 32,
        lineHeight: 38,
        color: "#FFFFFF",
        textAlign: "center",
        includeFontPadding: false,
    },

    area1Wrap: {
        marginTop: 20,
        width: "100%",
        aspectRatio: 361 / 203, // 비율 고정
        overflow: "hidden",
    },
    area1Image: {
        width: "100%",
        height: "100%",
    },

    infoCard: {
        marginTop: 0,
        width: "100%",
        minHeight: 294,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: Color.Home.Search.background,
        borderWidth: 1,
        borderColor: "#E4E4E4",
        padding: 20,
        alignItems: "center",
    },

    mainCopy: {
        //width: 320,
        minHeight: 66,
        textAlign: "center",
        color: "#3B3B3B",
        fontFamily: "Pretendard-Regular",
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 22.4,
        letterSpacing: 0,
        marginBottom: 20,
    },

    ctaCircle: {
        width: 80,
        height: 80,
        borderRadius: 100,
        backgroundColor: Color.Home.background,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },

    ctaLabel: {
        width: 320,
        height: 20,
        textAlign: "center",
        color: "#2C2C2C",
        fontFamily: "Pretendard-Bold",
        fontSize: 20,
        lineHeight: 20, // 100%
        letterSpacing: 0,
    },

    ctaLabelSub: {
        color: "#2C2C2C",
        fontFamily: "Pretendard-SemiBold",
        fontSize: 16,
        lineHeight: 16, // 100%
        letterSpacing: 0,
    },

    partnerRow: {
        marginTop: 20,
        marginHorizontal: 20, // 양옆 20
        flexDirection: "row",
        alignItems: "center",
        gap: 30,
    },

    partnerLogo: {
        width: 90, 
        height: 30
    }
    
});