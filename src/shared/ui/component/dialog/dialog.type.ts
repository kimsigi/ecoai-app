import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export type DialogProps = {
    children: ReactNode;

    // 모달 표시 여부(true면 열림, false면 닫힘)
    visible: boolean;

    // 모달이 닫힐 때 호출되는 콜백(백버튼/배경탭/코드로 닫기 공통)
    onDismiss: () => void;

    // children(실제 컨텐츠)를 감싸는 래퍼 View 스타일 오버라이드
    containerStyle?: StyleProp<ViewStyle>;

    // 배경 dim(반투명 오버레이) 색상값
    dimColor?: string;

    // 배경 탭으로 닫을 수 있는지 여부
    dismissable?: boolean;

    // Android 하드웨어 백버튼으로 닫을 수 있는지 여부
    dismissableBackButton?: boolean;

    // screen: 현재 화면 트리 내부에 렌더(화면 전환 시 새 화면이 위로 올라오며 뒤로 감춰짐)
    // global: 앱 전역 포털 레이어에 렌더(네비게이션 위에 떠서 유지될 수 있음)
    presentation?: 'screen' | 'global';

    // 상단 우측 닫기(X) 표시 여부
    showCloseHeader?: boolean;

    // 헤더 가운데 제목(없으면 공란)
    headerTitle?: string;

    // 컨텐츠를 세로로 끝까지 채울지 여부
    fillContent?: boolean;
};
