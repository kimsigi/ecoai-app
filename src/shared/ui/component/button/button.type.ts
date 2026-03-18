import { ViewStyle } from 'react-native';

/* ---------- Type  ---------- */
export type AppButtonType = 'default' | 'primary' | 'selected';

export type AppButtonProps = {
    type?: AppButtonType;
    disabled?: boolean;
    buttonStyle?: ViewStyle;
    textStyle?: ViewStyle;
    onPress?: () => void;
    children: React.ReactNode;
};
