import React from "react";
import { Pressable, Text, View } from "react-native";
import { PageLayout } from "@/shared/ui/component/layout";
import { AppIcon } from "@/shared/ui/component/icon";
import { AppLottie } from "@/shared/ui/component/lottie";
import { styles } from "./home.style";
import { useHome } from "./useHome";

export function HomeScreen() {
    const {
        notification,
        isMenuOpen,
        setIsMenuOpen,
        onNotificationPress,
        onMenuPress,
        onKeywordSearchPress,
        onCameraPress,
    } = useHome();
  return (
    <PageLayout
        statusBarAreaStyle={styles.statusBar}
        headerContainerStyle={styles.header}
        contentContainerStyle={styles.content}
        statusBarStyle={isMenuOpen ? "dark-content" : "light-content"}
        rightItems={[
            {
                key: "notification",
                icon: notification ? (
                    <AppLottie name="notificationActive" size={24} />
                ) : (
                    <AppIcon name="notificationInactive" size={24} />
                ),
                onPress: onNotificationPress,
            },
            {
                key: "menu",
                icon: <AppIcon name="menu" size={24} />,
                onPress: onMenuPress,
            },
        ]}
        protectBottomInset={false}
    >
        {/* 헤더 영역 */}
        <Pressable style={styles.searchArea} onPress={onKeywordSearchPress} hitSlop={8}>
            <AppIcon name="search" size={24} />
            <Text style={styles.searchAreaPlaceholder}>AI에게 궁금한 폐기물을 물어보세요.</Text>
            <AppLottie name="winkingFace" size={24} />
        </Pressable>

        {/* 히어로 텍스트 영역 */}
        <View style={styles.heroArea}>
            <View style={styles.heroTextArea}>
                <Text style={styles.heroTitle}>Eco-I</Text>
                <Text style={styles.heroSubtitle}>AI로 쉬워지는</Text>
                <Text style={styles.heroSubtitle}>폐기물 배출</Text>
            </View>
            <View style={styles.lottieArea}>
                <AppLottie name="ax" style={styles.lottie} />
            </View>
        </View>

        {/* 인포 카드 */}
        <View style={styles.infoCard}>
            <View style={styles.infoTextArea}>
                <Text style={styles.infoText}>가장 똑똑한 자원순환의 시작.</Text>
                <Text style={styles.infoText}>복잡한 분리배출 가이드,</Text>
                <Text style={styles.infoText}>이제 AI 에코이와 함께 스마트하게 실천하세요.</Text>
            </View>

            <View style={styles.ctaArea}>
                <Pressable style={styles.ctaCard} hitSlop={8} onPress={onCameraPress}>
                    <View style={styles.ctaCircle}>
                        <AppLottie name="quitFullScreenCircle" size={60} />
                    </View>
                </Pressable>

                <Text style={styles.ctaLabel}>
                    <Text style={styles.ctaLabel1}>찰칵! </Text>
                    <Text style={styles.ctaLabel2}>AI가 알려드려요.</Text>
                </Text>
            </View>

            {/* 하단 심볼 영역 */}
            <View style={styles.symbolArea}> 
                <AppIcon name="symbolGov" width={88} height={28} />
                <AppIcon name="symbolKeco" width={88} height={28} />
                <AppIcon name="symbolKyolim" width={88} height={28} />
            </View>
        </View>

        {isMenuOpen && (
            <View style={styles.overlayRoot}>
            <Pressable style={styles.backdrop} onPress={() => setIsMenuOpen(false)} />

            <View style={styles.menuPanel}>
                <View style={styles.menuTopBar}>
                <Pressable style={styles.closeBtn} onPress={() => setIsMenuOpen(false)}>
                    <Text style={styles.closeTxt}>×</Text>
                </Pressable>
                </View>

                {TOP_MENUS.map((menu) => (
                <Pressable key={menu.key} style={styles.topRow}>
                    <AppIcon name={menu.icon} style={styles.dot} />
                    <Text style={styles.topRowTxt}>{menu.label}</Text>
                </Pressable>
                ))}

                <Pressable style={styles.categoryRow} onPress={() => setIsCategoryOpen((p) => !p)}>
                <View style={styles.categoryLeft}>
                    <View style={[styles.dot, { backgroundColor: "#8AD39C" }]} />
                    <Text style={styles.categoryTxt}>배출 품목 분류</Text>
                </View>
                <Text style={styles.chevron}>{chevron}</Text>
                </Pressable>

                {isCategoryOpen && (
                <View style={styles.subWrap}>
                    {SUB_MENUS.map((item) => {
                    const active = activeSubMenu === item;
                    return (
                        <Pressable
                        key={item}
                        style={[styles.subRow, active && styles.subRowActive]}
                        onPress={() => onPressSubMenu(item)}
                        >
                        <Text style={[styles.subTxt, active && styles.subTxtActive]}>{item}</Text>
                        <Text style={[styles.subArrow, active && styles.subArrowActive]}>
                            {active ? "✓" : "→"}
                        </Text>
                        </Pressable>
                    );
                    })}
                </View>
                )}
            </View>
            </View>
        )}
    </PageLayout>
  );
}