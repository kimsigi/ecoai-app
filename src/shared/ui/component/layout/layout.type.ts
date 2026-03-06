import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export type HeaderState = 'hidden' | 'empty' | 'content';

export type RightItem = {
    key?: string | number;
    isActive?: boolean;
    activeIcon?: ReactNode;
    inactiveIcon?: ReactNode;
    icon?: ReactNode;
    onPress?: () => void;
};

export type PageLayoutProps = {
    children: ReactNode;
    headerState?: HeaderState;
    headerHeight?: number;

    statusBarAreaStyle?: StyleProp<ViewStyle>;
    headerContainerStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;

    showBack?: boolean;
    onBackPress?: () => void;
    headerLeft?: ReactNode;
    headerCenter?: ReactNode;

    headerRight?: ReactNode;
    rightItems?: RightItem[];

    customHeader?: ReactNode;

    statusBarHidden?: boolean;
    statusBarStyle?: 'light-content' | 'dark-content';
    statusBarTranslucent?: boolean;
    statusBarBackgroundColor?: string;
    protectBottomInset?: boolean;
};

export type PageHeaderLayout = {
    showBack: boolean;
    headerLeft?: PageLayoutProps['headerLeft'];
    headerRight?: PageLayoutProps['headerRight'];
    rightItems: RightItem[];
    onBackPress: () => void;
    getRightIcon: (item: RightItem) => RightItem['icon'] | null;
};

export type PageLayoutState = {
    topInset: number;
    bottomInset: number;
    header: PageHeaderLayout;
};

export type PageHeaderConfig = {
    state: NonNullable<PageLayoutProps['headerState']>;
    height: NonNullable<PageLayoutProps['headerHeight']>;
    containerStyle: PageLayoutProps['headerContainerStyle'];
    center: PageLayoutProps['headerCenter'];
    custom: PageLayoutProps['customHeader'];
};

export type PageHeaderProps = {
    config: PageHeaderConfig;
    layout: PageHeaderLayout;
};
