import { ROUTES, StackParamList } from "@/app/app.route";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useHome() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
    const insets = useSafeAreaInsets();
            
    const [notification, setNotification] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    const onAiSearchPress = () => {
        Alert.alert("AI에게 궁금한 폐기물을 물어보세요.");
        //setActiveSubMenu(itemKey); // [추가] 선택한 서브메뉴 active
        // 필요하면 여기서 페이지 이동 추가
        //navigation.push(ROUTES.SUBITEM);
    };

    const onCameraPress = () => {
        navigation.push(ROUTES.CAMERA_CAPTURE);
    }
    /*
    const [isCategoryOpen, setIsCategoryOpen] = useState(true); 
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null); // [추가]
    const chevron = useMemo(() => (isCategoryOpen ? "⌃" : "⌄"), [isCategoryOpen]);

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
        onNotificationPress,
        onMenuPress,
        onAiSearchPress,
        onCameraPress,
    };
}