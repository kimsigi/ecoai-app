import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  AppNavigationProps,
  HeaderConfig,
  ROUTES,
  ScreenLayoutOptions,
  StackParamList,
} from "./app.route";

import LocationPickerScreen from "@/features/location/ui/LocationPickerScreen";
import ShowcaseScreen from "@/features/showcase/ShowcaseScreen";
import AiChatScreen from "@/features/aichat/AiChatScreen";
import PermissionScreen from "@/features/permission/PermissionScreen";
import LocationAddressSearchScreen from "@/features/location/ui/LocationAddressSearchScreen";
import UserTypeScreen from "@/features/usertype/UserTypeScreen";
import { HomeScreen } from "@/features/home/HomeScreen";
import { HeaderProps, ScreenScaffold } from "@/shared/ui/component/layout";
import CameraCaptureScreen from "@/features/camera/CameraCaptureScreen";

const Stack = createNativeStackNavigator<StackParamList>();

type RouteConfig = {
  name: keyof StackParamList;
  component: React.ComponentType<any>;
  layout?: ScreenLayoutOptions;
};

function buildHeader(
  header: HeaderConfig | undefined,
  ctx: { navigation: unknown; route: unknown }
): {
  mode: "fixed" | "overlay" | "none";
  headerProps?: HeaderProps;
  headerContent?: React.ReactNode;
  headerBackgroundColor?: string;
} {
  if (!header || header.variant === "none") {
    return { mode: "none" };
  }

  if (header.variant === "back") {
    return {
      mode: "fixed",
      headerProps: { showBack: true, backgroundColor: header.backgroundColor },
      headerBackgroundColor: header.backgroundColor,
    };
  }

  if (header.variant === "back-title") {
    return {
      mode: "fixed",
      headerProps: {
        showBack: true,
        center: <Text style={styles.title}>{header.title}</Text>,
        backgroundColor: header.backgroundColor,
      },
      headerBackgroundColor: header.backgroundColor,
    };
  }

  if (header.variant === "back-actions") {
    const actions = Array.isArray(header.actions) ? header.actions : [header.actions];
    return {
      mode: "fixed",
      headerProps: {
        showBack: true,
        center: header.title ? <Text style={styles.title}>{header.title}</Text> : undefined,
        right: <View style={styles.actionRow}>{actions.map((a, i) => <View key={i}>{a}</View>)}</View>,
        backgroundColor: header.backgroundColor,
      },
      headerBackgroundColor: header.backgroundColor,
    };
  }

  // custom
  return {
    mode: "fixed",
    headerContent: header.render(ctx),
    headerBackgroundColor: header.backgroundColor,
  };
}

function createWrappedScreen(
  ScreenComponent: React.ComponentType<any>,
  layout?: ScreenLayoutOptions
) {
  const Wrapped = (props: any) => {
    const {
      mode = "fixed",
      header,
      backgroundColor = "#FFFFFF",
      statusBarStyle = "dark-content",
      statusBarBackgroundColor = "transparent",
      protectBottomInset = true,
    } = layout ?? {};

    const built = buildHeader(header, {
      navigation: props.navigation,
      route: props.route,
    });

    // header에서 mode를 지정하지 않으면 layout.mode 사용
    const headerMode = built.mode === "none" ? "none" : mode;

    return (
      <ScreenScaffold
        headerMode={headerMode}
        headerProps={built.headerProps}
        headerContent={built.headerContent}
        backgroundColor={backgroundColor}
        headerBackgroundColor={built.headerBackgroundColor}
        statusBarStyle={statusBarStyle}
        statusBarBackgroundColor={statusBarBackgroundColor}
        protectBottomInset={protectBottomInset}
      >
        <ScreenComponent {...props} />
      </ScreenScaffold>
    );
  };

  Wrapped.displayName = `WithScaffold(${ScreenComponent.displayName || ScreenComponent.name || "Screen"})`;
  return Wrapped;
}

const ROUTES_CONFIG: RouteConfig[] = [
  {
    name: ROUTES.SHOWCASE,
    component: ShowcaseScreen,
    layout: {
      mode: "fixed",
      header: { variant: "back-title", title: "쇼케이스" },
    },
  },
  {
    name: ROUTES.PERMISSION,
    component: PermissionScreen,
    layout: {
      header: { variant: "none" },
    },
  },
  {
    name: ROUTES.LOCATION_PICKER,
    component: LocationPickerScreen,
    layout: {
      header: { variant: "none" },
    },
  },
  {
    name: ROUTES.LOCATION_ADDRESS_SEARCH,
    component: LocationAddressSearchScreen,
    layout: {
      header: { variant: "none"},
    },
  },
  {
    name: ROUTES.USER_TYPE,
    component: UserTypeScreen,
    layout: {
      mode: "fixed",
      header: { variant: "back-title", title: "배출자 유형 선택" },
    },
  },
  {
    name: ROUTES.HOME,
    component: HomeScreen,
    layout: {
      mode: "fixed",
      header: { variant: "none" },
      backgroundColor: "#2186e8",
      statusBarStyle: "light-content",
    },
  },
  {
    name: ROUTES.CAMERA_CAPTURE,
    component: CameraCaptureScreen,
    layout: {
      mode: "overlay",
      header: { variant: "none" },
      backgroundColor: "#000000", // [수정]
      statusBarStyle: "light-content", // [수정]
      statusBarBackgroundColor: "transparent", // [수정]
      protectBottomInset: false, // [수정]
    },
  },
  {
    name: ROUTES.AI_CHAT,
    component: AiChatScreen,
    layout: {
      // 컨텐츠를 상태바 뒤까지 보이게 하려면 overlay
      mode: "overlay",
      header: { variant: "back-title", title: "AI 도우미", backgroundColor: "transparent" },
      backgroundColor: "#FFFFFF",
      statusBarStyle: "dark-content",
      statusBarBackgroundColor: "transparent",
    },
  },
];

const WRAPPED = ROUTES_CONFIG.map((r) => ({
  ...r,
  wrappedComponent: createWrappedScreen(r.component, r.layout),
}));

export default function AppNavigation({ initialRouteName }: AppNavigationProps) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
        {WRAPPED.map((route) => (
          <Stack.Screen
            key={route.name}
            name={route.name}
            component={route.wrappedComponent}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
