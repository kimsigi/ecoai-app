import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppNavigationProps, ROUTES, StackParamList } from './app.route';

import LocationPickerScreen from '@/features/location/ui/LocationPickerScreen';
import ShowcaseScreen from '@/features/showcase/ShowcaseScreen';
import AiChatScreen from '@/features/aichat/AiChatScreen';
import PermissionScreen from '@/features/permission/PermissionScreen';
import LocationAddressSearchScreen from '@/features/location/ui/LocationAddressSearchScreen';
import UserTypeScreen from '@/features/usertype/UserTypeScreen';
import { HomeScreen } from '@/features/home/HomeScreen';

/* ---------- Stack ---------- */
const Stack = createNativeStackNavigator<StackParamList>();

export default function AppNavigation({initialRouteName}: AppNavigationProps) {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={initialRouteName}
                screenOptions={{ headerTitleAlign: 'center' }}
            >
                <Stack.Screen
                    name={ROUTES.SHOWCASE}
                    component={ShowcaseScreen}
                    options={{ title: '쇼케이스' }}
                />
                <Stack.Screen
                    name={ROUTES.PERMISSION}
                    component={PermissionScreen}
                    options={{ title: '퍼미션' }}
                />
                <Stack.Screen
                    name={ROUTES.LOCATION_PICKER}
                    component={LocationPickerScreen}
                    options={{ title: '배출 위치 설정' }}
                />
                <Stack.Screen
                    name={ROUTES.LOCATION_ADDRESS_SEARCH}
                    component={LocationAddressSearchScreen}
                    options={{ title: '주소 검색' }}
                />
                <Stack.Screen
                    name={ROUTES.USER_TYPE}
                    component={UserTypeScreen}
                    options={{ title: '배출자 유형 선택' }}
                />
                <Stack.Screen
                    name={ROUTES.HOME}
                    component={HomeScreen}
                    options={{ title: '메인 홈' }}
                />
                <Stack.Screen
                    name={ROUTES.AI_CHAT}
                    component={AiChatScreen}
                    options={{ title: 'AI 도우미' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
