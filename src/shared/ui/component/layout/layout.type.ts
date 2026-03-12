import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

// 헤더 우측 아이콘 사용시 타입
export type HeaderAction = {
    icon: ReactNode;
    onPress?: () => void;
};

// 페이지 레이아웃 타입
export type PageLayoutProps = {
    children: ReactNode;

    // 헤더 사용 여부
    header?: boolean;
    // 헤더 바텀라인 설정
    headerBottomLine?: boolean;
    // 커스텀 헤더 사용시 설정
    customHeader?: ReactNode;

    // 헤더 좌측 뒤로가기(back)
    back?: boolean;
    // 헤더 가운데 타이틀
    title?: string;
    // 헤더 우측 아이콘영역
    right?: HeaderAction[];

    // 상태바 설정(라이트/다크)
    statusBarLight?: boolean;

    // 상태바 스타일
    statusBarStyle?: StyleProp<ViewStyle>;
    // 헤더 스타일
    headerStyle?: StyleProp<ViewStyle>;
    // 콘텐츠 스타일
    contentStyle?: StyleProp<ViewStyle>;

    // true: 상태바 높이만큼 콘텐츠 시작점 내려줌
    // false: 콘텐츠가 상태바 영역부터 시작
    useStatusBarOffset?: boolean;
    // true: header 높이만큼 콘텐츠를 아래로 밀어줌
    // false: 콘텐츠는 상태바 아래부터 시작(헤더와 겹칠 수 있음)
    useHeaderOffset?: boolean;
};

// 페이지 헤더 타입
export type PageHeaderProps = {
    title?: string;
    back?: boolean;
    right?: HeaderAction[];
    bottomLine?: boolean;
    style?: StyleProp<ViewStyle>;
};
