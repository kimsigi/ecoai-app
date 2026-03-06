import { ROUTES, StackParamList } from "@/app/app.route";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useHome() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
    const insets = useSafeAreaInsets();
            
    const [notification, setNotification] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(true); 
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
    const chevron = useMemo(() => (isCategoryOpen ? "chevronUp" : "chevronUp"), [isCategoryOpen]);    

    const onNotificationPress = () => {
        if (notification) {
            Alert.alert("### 공지있음!");
        } else {
            Alert.alert("### 공지없음!");
        }
        setNotification((prev) => !prev);
    };

    const onMenuPress = () => {
        setIsMenuOpen(true); 
    };

    const onKeywordSearchPress = () => {
        navigation.push(ROUTES.HOMESEARCH);
    };

    const onCameraPress = () => {
        navigation.push(ROUTES.CAMERA_CAPTURE);
    }
    /*
    

    const onPressSubMenu = (itemKey: string) => {
        setActiveSubMenu(itemKey); // [추가] 선택한 서브메뉴 active
        // 필요하면 여기서 페이지 이동 추가
        navigation.push(ROUTES.SUBITEM);
        };

    

    

    const takePhoto = () => {
        navigation.push(ROUTES.CAMERA_CAPTURE);
    }
        */

    return {
        notification,
        isMenuOpen,
        setIsMenuOpen,
        onNotificationPress,
        onMenuPress,
        onKeywordSearchPress,
        onCameraPress,
    };
}