import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppNavigationProps, ROUTES, StackParamList } from "./app.route";

import ShowcaseScreen from "@/features/showcase/ShowcaseScreen";
import PermissionScreen from "@/features/permission/PermissionScreen";
import LocationPickerScreen from "@/features/location/ui/LocationPickerScreen";
import LocationAddressSearchScreen from "@/features/location/ui/LocationAddressSearchScreen";
import UserTypeScreen from "@/features/usertype/UserTypeScreen";
import { HomeScreen } from "@/features/home/HomeScreen";
import CameraCaptureScreen from "@/features/camera/CameraCaptureScreen";
import AiChatScreen from "@/features/aichat/AiChatScreen";
import SampleScreen1 from "@/features/showcase/SampleScreen1";
import SampleScreen2 from "@/features/showcase/SampleScreen2";
import SampleScreen3 from "@/features/showcase/SampleScreen3";
import SampleScreen4 from "@/features/showcase/SampleScreen4";
import SampleScreen5 from "@/features/showcase/SampleScreen5";
import { MenuLayerOverlay } from "@/features/showcase/MenuLayerOverlay";
import BottomSheet from "@/features/showcase/BottomSheet";
import SampleMapOverlayScreen from "@/features/showcase/SampleMapOverlayScreen";
import SubItemScreen from "@/features/showcase/SubItemScreen";
import NotificationScreen from "@/features/notification/NotificationScreen";
import SettingScreen from "@/features/setting/SettingScreen";
import DisposalHistoryScreen from "@/features/disposal/ui/DisposalHistoryScreen";
import FaqScreen from "@/features/faq/FaqScreen";
import AppinfoScreen from "@/features/appinfo/AppinfoScreen";
import CategoryScreen from "@/features/category/CategoryScreen";
import HomeSearchScreen from "@/features/home/HomeSearchScreen";
import PaymentCartScreen from "@/features/payment/ui/PaymentCartScreen";
import DisposalOwnerVerifyScreen from "@/features/disposal/ui/DisposalOwnerVerifyScreen";
import DisposalStatusScreen from "@/features/disposal/ui/DisposalStatusScreen";
import DisposalStatusListScreen from "@/features/disposal/ui/DisposalStatusListScreen";
import DisposalDetailScreen from "@/features/disposal/ui/DisposalDetailScreen";
import DisposalRequestScreen from "@/features/disposal/ui/DisposalRequestScreen";

const Stack = createNativeStackNavigator<StackParamList>();

export default function AppNavigation({ initialRouteName }: AppNavigationProps) {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={initialRouteName} 
        screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name={ROUTES.SHOWCASE} component={ShowcaseScreen} />

<Stack.Screen name={ROUTES.SAMPLESCR1} component={SampleScreen1} />
<Stack.Screen name={ROUTES.SAMPLESCR2} component={SampleScreen2} />
<Stack.Screen name={ROUTES.SAMPLESCR3} component={SampleScreen3} />
<Stack.Screen name={ROUTES.SAMPLESCR4} component={SampleScreen4} />
<Stack.Screen name={ROUTES.SAMPLESCR5} component={SampleScreen5} />
<Stack.Screen name={ROUTES.MENULAYEROVERLAY} component={MenuLayerOverlay} />
<Stack.Screen name={ROUTES.BOTTOMSHEET} component={BottomSheet} />
<Stack.Screen name={ROUTES.SAMPLEMAPOVERLAY} component={SampleMapOverlayScreen} />
<Stack.Screen name={ROUTES.SUBITEM} component={SubItemScreen} />

        <Stack.Screen name={ROUTES.PERMISSION} component={PermissionScreen} />
        <Stack.Screen name={ROUTES.LOCATION_PICKER} component={LocationPickerScreen} />
        <Stack.Screen name={ROUTES.LOCATION_ADDRESS_SEARCH} component={LocationAddressSearchScreen} />
        <Stack.Screen name={ROUTES.USER_TYPE} component={UserTypeScreen} />
        <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
        <Stack.Screen name={ROUTES.HOMESEARCH} component={HomeSearchScreen} />
        <Stack.Screen name={ROUTES.CAMERA_CAPTURE} component={CameraCaptureScreen} />


        <Stack.Screen name={ROUTES.SETTING} component={SettingScreen} />
        <Stack.Screen name={ROUTES.DISPOSALHISTORY} component={DisposalHistoryScreen} />
        <Stack.Screen name={ROUTES.FAQ} component={FaqScreen} />
        <Stack.Screen name={ROUTES.NOTIFICATION} component={NotificationScreen} />
        <Stack.Screen name={ROUTES.APPINFO} component={AppinfoScreen} />
        <Stack.Screen name={ROUTES.CATEGORY} component={CategoryScreen} />



        <Stack.Screen name={ROUTES.AI_CHAT} component={AiChatScreen} />

        <Stack.Screen name={ROUTES.PAYMENTCART} component={PaymentCartScreen} />
        <Stack.Screen name={ROUTES.DISPOSALOWNERVERIFY} component={DisposalOwnerVerifyScreen} />
        <Stack.Screen name={ROUTES.DISPOSALSTATUS} component={DisposalStatusScreen} />
        <Stack.Screen name={ROUTES.DISPOSALSTATUSLIST} component={DisposalStatusListScreen} />
        <Stack.Screen name={ROUTES.DISPOSALDETAIL} component={DisposalDetailScreen} />
        <Stack.Screen name={ROUTES.DISPOSALREQUEST} component={DisposalRequestScreen} />
    
      </Stack.Navigator>
    </NavigationContainer>
  );
}
