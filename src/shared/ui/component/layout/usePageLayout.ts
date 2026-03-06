import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PageLayoutProps, PageLayoutState, RightItem } from './layout.type';

export default function usePageLayout(props: PageLayoutProps): PageLayoutState {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const handleBack = useCallback(() => {
        if (props.onBackPress) {
            props.onBackPress();
            return;
        }
        if (navigation.canGoBack()) navigation.goBack();
    }, [navigation, props.onBackPress]);

    const getRightIcon = useCallback((item: RightItem) => {
        if (item.icon) return item.icon;
        if (item.isActive) return item.activeIcon ?? item.inactiveIcon ?? null;
        return item.inactiveIcon ?? item.activeIcon ?? null;
    }, []);

    return {
        topInset: insets.top,
        bottomInset: props.protectBottomInset === false ? 0 : insets.bottom,
        header: {
            showBack: Boolean(props.showBack),
            headerLeft: props.headerLeft,
            headerRight: props.headerRight,
            rightItems: props.rightItems ?? [],
            onBackPress: handleBack,
            getRightIcon,
        },
    };
}
