import { ROUTES, StackParamList } from "@/app/app.route";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { SideMenu, SideSubMenu } from "./home.type";

export function useHome() {
    
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    const [notification, setNotification] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);
    const [activeSubMenuKey, setActiveSubMenuKey] = useState<string | null>(null);

    // 다이얼로그 표시 방식: screen(현재 화면 내부) | global(전역 포털)
    const [presentation] = useState<"screen" | "global">("screen");
    
    // 알림 아이콘 클릭
    const onNotificationPress = () => {
        Alert.alert(notification ? "### 공지있음!" : "### 공지없음!");
        setNotification((prev) => !prev);
    };
    
    // 햄버거 메뉴(☰) 열기
    const onMenuPress = () => setIsMenuOpen(true); 
    // 햄버거 메뉴(☰) 닫기(X/배경탭/외부 dismiss 공통)
    const onCloseMenuPress = () => setIsMenuOpen(false);
    
    // 검색 화면 이동
    const onKeywordSearchPress = () => navigation.push(ROUTES.HOMESEARCH);
    // 카메라 화면 이동
    const onCameraPress = () => navigation.push(ROUTES.CAMERA_CAPTURE);

    // 프레젠테이션 정책에 따라 이동 전 메뉴 닫기 처리
    // - global: 닫고 이동
    // - screen: 닫지 않고 이동(새 화면이 위로 올라옴)
    const closeByPresentation = () => {
        if (presentation === "global") {
            onCloseMenuPress();
        }
    };

    // 사이드 메뉴(상위) 클릭 처리
    // - subitem이 있으면 해당 메뉴 아코디언 토글
    // - 일반 메뉴면 정책에 따라 닫기 후 링크 이동
    const onSideMenuPress = (menu: SideMenu) => {
        const hasSubItems = "subitem" in menu && Array.isArray(menu.subitem);

        if (hasSubItems) {
            setOpenMenuKey((prev) => (prev === menu.key ? null : menu.key));
            return;
        }

        if ("link" in menu && menu.link) {
            closeByPresentation();
            navigation.push(menu.link);
        }
    };

    // 사이드 메뉴(하위) 클릭 처리
    // - active 표시 상태 저장
    // - 정책에 따라 닫기 후 링크 이동
    const onSubMenuPress = (sub: SideSubMenu) => {
        setActiveSubMenuKey(sub.key);
        closeByPresentation();
        navigation.push(sub.link);
    };

    // 초기화
    useEffect(() => {
        if (isMenuOpen) {
            setActiveSubMenuKey(null); 
            // 현재 '배출 품목 분류' 고정
            setOpenMenuKey('category');
        }
    }, [isMenuOpen]);
    
    return {
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
    };
}