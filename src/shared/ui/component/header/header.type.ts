import { MODE } from './header.constant';

export type Mode = (typeof MODE)[keyof typeof MODE];

export interface HeaderInputDefaultProps {
    mode: Mode;
    value?: string;
    placeholder?: string;
    back?: boolean; // 백버튼 표시 여부
    onBackPress?: () => void;
    // trigger 모드: 필드 탭 시 검색 화면 이동
    onPressField?: () => void;

    // input 모드: 실제 입력/검색
    onChangeText?: (v: string) => void;
    onSubmit?: () => void;
    onClear?: () => void;
    autoFocus?: boolean;
    multiline?: boolean;
}
