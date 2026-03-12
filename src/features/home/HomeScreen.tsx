import React from "react";
import { Pressable, Text, View } from "react-native";
import { PageLayout } from "@/shared/ui/component/layout";
import { AppIcon } from "@/shared/ui/component/icon";
import { AppLottie } from "@/shared/ui/component/lottie";
import { styles } from "./home.style";
import { useHome } from "./useHome";
import { AppDialog } from "@/shared/ui/component/dialog";
import { SIDE_MENUS } from "./home.model";
import { COLOR } from "@/shared/ui/token";

export function HomeScreen() {
    const {
        notification,
        isMenuOpen,
        openMenuKey,
        activeSubMenuKey,
        presentation,
        onCloseMenuPress,
        onNotificationPress,
        onMenuPress,
        onKeywordSearchPress,
        onCameraPress,
        onSideMenuPress,
        onSubMenuPress,
    } = useHome();

  return (
    <>
    <PageLayout
        statusBarLight={!isMenuOpen}
        statusBarStyle={[
            styles.statusBar,
            isMenuOpen && { backgroundColor: COLOR.white },
        ]}
        headerStyle={styles.header}
        contentStyle={styles.content}
        right={[
            {
                icon: notification ? (
                    <AppLottie name="notificationActive" size={24} scale={1.2} />
                ) : (
                    <AppIcon name="notificationInactive" size={24} />
                ),
                onPress: onNotificationPress,
            },
            {
                icon: <AppIcon name="menu" size={24} />,
            onPress: onMenuPress,
            },
        ]}
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
    </PageLayout>
    
    <AppDialog 
        visible={isMenuOpen} 
        onDismiss={onCloseMenuPress} 
        containerStyle={styles.menuPanel}
        presentation={presentation} 
        fillContent
    >
        {
            SIDE_MENUS.map((menu) => {
                const hasSubItems = "subitem" in menu && Array.isArray(menu.subitem);
                const isOpen = openMenuKey === menu.key;
                const chevron = isOpen 
                                ? <AppIcon name="chevronUp" size={24} /> 
                                : <AppIcon name="chevronDown" size={24} />;

                return (
                    <View key={menu.key}>
                        <Pressable style={styles.menuItem} onPress={() => onSideMenuPress(menu)}>
                            <AppIcon name={menu.icon} size={32} />
                            <Text style={styles.menuItemText} numberOfLines={1} ellipsizeMode="tail">
                                {menu.label}
                            </Text>

                            {
                                hasSubItems ? chevron : null
                            }

                        </Pressable>
                        
                        {
                            hasSubItems && isOpen ? (
                                <View style={styles.subitemContainer}>
                                    {
                                        menu.subitem.map((sub) => (
                                            <Pressable
                                                key={sub.key}
                                                style={[
                                                    styles.subitem,
                                                    activeSubMenuKey === sub.key && styles.subitemActive,
                                                ]}
                                                onPress={() => onSubMenuPress(sub)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.subitemText,
                                                        activeSubMenuKey === sub.key && styles.subitemTextActive,
                                                    ]}
                                                    numberOfLines={1}
                                                    ellipsizeMode="tail"
                                                >
                                                    {sub.label}
                                                </Text>
                                                <AppIcon name="arrowRight" size={24} />
                                            </Pressable>
                                        ))
                                    }
                                </View>
                            ) : null
                        }
                    </View>
                );
        })}
      </AppDialog>
    </>
  );
}