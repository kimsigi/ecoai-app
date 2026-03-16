import { StyleProp, ViewStyle } from 'react-native';

export type HeightMode = 'fitContent' | 'fixed' | 'expandable';
export type BottomSheetProps = {
    // 바텀시트를 열지(true) 닫을지(false) 제어하는 외부 상태값
    open: boolean;

    // 바텀시트가 완전히 닫혔을 때 실행할 콜백
    // 부모 컴포넌트에서 open 상태를 false로 되돌릴 때 사용
    onClose: () => void;

    // 기본 헤더를 사용할 때 표시할 제목 텍스트
    // header를 직접 넘기면 이 값은 사실상 사용되지 않음
    title?: string;

    // 기본 헤더 우측의 닫기 버튼 노출 여부
    // header를 커스텀하지 않고 기본 헤더를 쓸 때만 의미 있음
    showCloseButton?: boolean;

    // 상단 드래그 핸들 노출 여부
    // 디자인상 핸들을 숨기고 싶을 때 false 사용
    showHandle?: boolean;

    // 바텀시트 높이 동작 방식
    // fitContent: 콘텐츠 높이에 맞춤
    // fixed: 고정 높이 사용
    // expandable: 기본 높이로 열리되 콘텐츠에 따라 확장 가능
    heightMode?: HeightMode;

    // heightMode가 "fixed"일 때 사용할 고정 높이
    // 미지정 시 화면 높이의 50%를 기본값으로 사용
    fixedHeight?: number;

    // 동적 높이 계산 시 화면 높이 대비 최대 비율
    // 콘텐츠가 길어도 이 비율을 넘지 않도록 제한할 때 사용
    maxHeightRatio?: number;

    // 전체 제스처 사용 여부
    // false면 핸들 드래그, 콘텐츠 드래그, 아래로 내려 닫기 모두 비활성화됨
    enableGesture?: boolean;

    // 아래로 스와이프해서 닫을 수 있게 할지 여부
    // enableGesture가 true일 때만 함께 동작
    enablePanDownToClose?: boolean;

    // 바깥 백드롭 터치 시 닫힘 허용 여부
    // 확인이 필요한 시트처럼 실수로 닫히면 안 되는 경우 false 사용
    enableBackdropDismiss?: boolean;

    // 바텀시트를 화면 하단에 딱 붙이지 않고 띄운 형태로 표시할지 여부
    // 카드처럼 떠 있는 스타일이 필요할 때 사용
    detached?: boolean;

    // 바텀시트 상단 시작 위치 보정값
    // 상단 헤더/탭/안전영역과 겹치지 않게 띄워야 할 때 사용
    topInset?: number;

    // 기본 헤더 대신 완전히 커스텀한 헤더 UI를 넣을 때 사용
    // 전달하면 title, showCloseButton 기반 기본 헤더 대신 이 값이 렌더링됨
    header?: React.ReactNode;

    // 시트 하단에 고정성 있는 액션 영역이나 보조 UI를 붙일 때 사용
    // 예: 확인 버튼, 하단 안내문구
    footer?: React.ReactNode;

    // 실제 콘텐츠 영역(View)에 추가로 적용할 스타일
    // 내부 여백, 최소 높이, 정렬 방식 등을 화면별로 조정할 때 사용
    contentContainerStyle?: StyleProp<ViewStyle>;

    // 시트 드래그와 콘텐츠 스크롤 제스처를 분리
    enableContentScrollGesture?: boolean;

    // 바텀시트 본문에 들어갈 실제 화면 콘텐츠
    children: React.ReactNode;
};

export type BottomSheetHeaderProps = {
    title?: string;
    showCloseButton?: boolean;
    onClose?: () => void;
    rightSlot?: React.ReactNode;
};

export type BottomSheetScrollContentProps = {
    children: React.ReactNode;
    contentContainerStyle?: StyleProp<ViewStyle>;
};
